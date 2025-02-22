import { AppDataSource } from "../config/database.config";
import {
  Integration,
  IntegrationAppTypeEnum,
  IntegrationCategoryEnum,
  IntegrationProviderEnum,
} from "../database/entities/integration.entity";
import { InternalServerException } from "../utils/app-error";

const appTypeToProviderMap: Record<
  IntegrationAppTypeEnum,
  IntegrationProviderEnum
> = {
  [IntegrationAppTypeEnum.GOOGLE_CALENDAR]: IntegrationProviderEnum.GOOGLE,
  [IntegrationAppTypeEnum.GOOGLE_MEET]: IntegrationProviderEnum.GOOGLE,
  [IntegrationAppTypeEnum.ZOOM_MEETING]: IntegrationProviderEnum.ZOOM,
};

const appTypeToCategoryMap: Record<
  IntegrationAppTypeEnum,
  IntegrationCategoryEnum
> = {
  [IntegrationAppTypeEnum.GOOGLE_CALENDAR]: IntegrationCategoryEnum.CALENDAR,
  [IntegrationAppTypeEnum.GOOGLE_MEET]:
    IntegrationCategoryEnum.VIDEO_CONFERENCING,
  [IntegrationAppTypeEnum.ZOOM_MEETING]:
    IntegrationCategoryEnum.VIDEO_CONFERENCING,
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
    return Object.values(IntegrationAppTypeEnum).map((appType) => ({
      provider: appTypeToProviderMap[appType],
      app_type: appType,
      category: appTypeToCategoryMap[appType],
      isConnected: connectedMap.has(appType) || false,
    }));
  } catch (error) {
    throw new InternalServerException("Failed to fetch user integrations");
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
