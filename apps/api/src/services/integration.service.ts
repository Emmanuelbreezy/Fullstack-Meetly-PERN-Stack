import { AppDataSource } from "../config/database.config";
import {
  Integration,
  IntegrationAppTypeEnum,
  IntegrationCategoryEnum,
  IntegrationProviderEnum,
} from "../database/entities/integration.entity";
import {
  BadRequestException,
  InternalServerException,
} from "../utils/app-error";
import { oauth2Client } from "../utils/google-oauth";

const appTypeToProviderMap: Record<
  IntegrationAppTypeEnum,
  IntegrationProviderEnum
> = {
  [IntegrationAppTypeEnum.GOOGLE_MEET_AND_CALENDAR]:
    IntegrationProviderEnum.GOOGLE,
  [IntegrationAppTypeEnum.ZOOM_MEETING]: IntegrationProviderEnum.ZOOM,
  [IntegrationAppTypeEnum.OUTLOOK_CALENDAR]: IntegrationProviderEnum.MICROSOFT,
};

const appTypeToCategoryMap: Record<
  IntegrationAppTypeEnum,
  IntegrationCategoryEnum
> = {
  [IntegrationAppTypeEnum.GOOGLE_MEET_AND_CALENDAR]:
    IntegrationCategoryEnum.CALENDAR_AND_VIDEO_CONFERENCING,
  [IntegrationAppTypeEnum.ZOOM_MEETING]:
    IntegrationCategoryEnum.VIDEO_CONFERENCING,
  [IntegrationAppTypeEnum.OUTLOOK_CALENDAR]: IntegrationCategoryEnum.CALENDAR,
};

const appTypeToTitleMap: Record<IntegrationAppTypeEnum, string> = {
  [IntegrationAppTypeEnum.GOOGLE_MEET_AND_CALENDAR]: "Google Meet & Calendar",
  [IntegrationAppTypeEnum.ZOOM_MEETING]: "Zoom",
  [IntegrationAppTypeEnum.OUTLOOK_CALENDAR]: "Outlook Calendar",
};

export const getUserIntegrationsService = async (userId: string) => {
  try {
    const integrationRepository = AppDataSource.getRepository(Integration);
    const userIntegrations = await integrationRepository.find({
      where: { user: { id: userId } },
    });
    // Create a map of connected services
    const connectedMap = new Map(
      userIntegrations.map((integration) => [integration.app_type, true])
    );

    // Generate all possible integrations
    return Object.values(IntegrationAppTypeEnum).flatMap((appType) => {
      return {
        provider: appTypeToProviderMap[appType],
        title: appTypeToTitleMap[appType],
        app_type: appType,
        category: appTypeToCategoryMap[appType],
        isConnected: connectedMap.has(appType) || false,
      };
    });
  } catch (error) {
    throw new InternalServerException("Failed to fetch user integrations");
  }
};

export const checkUserIntegrationService = async (
  userId: string,
  appType: IntegrationAppTypeEnum
): Promise<boolean> => {
  try {
    const integrationRepository = AppDataSource.getRepository(Integration);
    // Check if the user has connected the specified integration
    const integration = await integrationRepository.findOne({
      where: { user: { id: userId }, app_type: appType },
    });

    if (!integration) {
      return false;
    }

    return true;
  } catch (error) {
    throw new InternalServerException("Failed to check integration");
  }
};

export const createIntegrationService = async (data: {
  userId: string;
  provider: IntegrationProviderEnum;
  category: IntegrationCategoryEnum;
  app_type: IntegrationAppTypeEnum;
  access_token: string;
  refresh_token?: string;
  expiry_date: number | null;
  metadata: any;
}) => {
  try {
    const integrationRepository = AppDataSource.getRepository(Integration);

    const existingIntegration = await integrationRepository.findOne({
      where: {
        userId: data.userId,
        app_type: data.app_type,
      },
    });

    if (existingIntegration) {
      throw new BadRequestException(`${data.app_type} already connected`);
    }

    const integration = integrationRepository.create({
      provider: data.provider,
      category: data.category,
      app_type: data.app_type,
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expiry_date: data.expiry_date,
      metadata: data.metadata,
      userId: data.userId,
      isConnected: true,
    });
    // Save the integration
    await integrationRepository.save(integration);
    return integration;
  } catch (error) {
    throw new InternalServerException();
  }
};

// Validate the Google access token and refresh it if expired
export const validateGoogleToken = async (
  accessToken: string,
  refreshToken: string,
  expiryDate: number | null
) => {
  // If expiryDate is null, assume the token is expired
  if (expiryDate === null || Date.now() >= expiryDate) {
    oauth2Client.setCredentials({ refresh_token: refreshToken });
    const { credentials } = await oauth2Client.refreshAccessToken();
    return credentials.access_token;
  }
  return accessToken;
};
