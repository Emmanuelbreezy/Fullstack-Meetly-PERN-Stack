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

enum UserFacingIntegrationAppTypeEnum {
  GOOGLE_CALENDAR = "GOOGLE_CALENDAR",
  GOOGLE_MEET = "GOOGLE_MEET",
  ZOOM_MEETING = IntegrationAppTypeEnum.ZOOM_MEETING,
  OUTLOOK_CALENDAR = IntegrationAppTypeEnum.OUTLOOK_CALENDAR,
  MICROSOFT_TEAMS = IntegrationAppTypeEnum.MICROSOFT_TEAMS,
}

const appTypeToProviderMap: Record<
  UserFacingIntegrationAppTypeEnum,
  IntegrationProviderEnum
> = {
  [UserFacingIntegrationAppTypeEnum.GOOGLE_CALENDAR]:
    IntegrationProviderEnum.GOOGLE,
  [UserFacingIntegrationAppTypeEnum.GOOGLE_MEET]:
    IntegrationProviderEnum.GOOGLE,
  [UserFacingIntegrationAppTypeEnum.ZOOM_MEETING]: IntegrationProviderEnum.ZOOM,
  [UserFacingIntegrationAppTypeEnum.OUTLOOK_CALENDAR]:
    IntegrationProviderEnum.MICROSOFT,
  [UserFacingIntegrationAppTypeEnum.MICROSOFT_TEAMS]:
    IntegrationProviderEnum.MICROSOFT,
};

const appTypeToCategoryMap: Record<
  UserFacingIntegrationAppTypeEnum,
  IntegrationCategoryEnum
> = {
  [UserFacingIntegrationAppTypeEnum.GOOGLE_CALENDAR]:
    IntegrationCategoryEnum.CALENDAR,
  [UserFacingIntegrationAppTypeEnum.GOOGLE_MEET]:
    IntegrationCategoryEnum.VIDEO_CONFERENCING,
  [UserFacingIntegrationAppTypeEnum.ZOOM_MEETING]:
    IntegrationCategoryEnum.VIDEO_CONFERENCING,
  [UserFacingIntegrationAppTypeEnum.OUTLOOK_CALENDAR]:
    IntegrationCategoryEnum.CALENDAR,
  [UserFacingIntegrationAppTypeEnum.MICROSOFT_TEAMS]:
    IntegrationCategoryEnum.VIDEO_CONFERENCING,
};

const appTypeToTitleMap: Record<UserFacingIntegrationAppTypeEnum, string> = {
  [UserFacingIntegrationAppTypeEnum.GOOGLE_CALENDAR]: "Google Calendar",
  [UserFacingIntegrationAppTypeEnum.GOOGLE_MEET]: "Google Meet",
  [UserFacingIntegrationAppTypeEnum.ZOOM_MEETING]: "Zoom",
  [UserFacingIntegrationAppTypeEnum.OUTLOOK_CALENDAR]: "Outlook Calendar",
  [UserFacingIntegrationAppTypeEnum.MICROSOFT_TEAMS]: "Microsoft Teams",
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
    // Mapping for splitting GOOGLE_MEET_AND_CALENDAR
    const splitAppTypes: Record<string, UserFacingIntegrationAppTypeEnum[]> = {
      [IntegrationAppTypeEnum.GOOGLE_MEET_AND_CALENDAR]: [
        UserFacingIntegrationAppTypeEnum.GOOGLE_MEET,
        UserFacingIntegrationAppTypeEnum.GOOGLE_CALENDAR,
      ],
    };
    // Generate all possible integrations
    return Object.values(IntegrationAppTypeEnum).flatMap((appType) => {
      const appTypes = splitAppTypes[appType] || [appType]; // Use split mapping or default to the appType
      return appTypes.map((type) => ({
        provider: appTypeToProviderMap[type],
        title: appTypeToTitleMap[type],
        app_type: type,
        category: appTypeToCategoryMap[type],
        isConnected: connectedMap.has(appType) || false,
      }));
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
      return false; // Integration not found
    }

    return true; // Integration found
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
