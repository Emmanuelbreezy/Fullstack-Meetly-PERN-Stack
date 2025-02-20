import { AppDataSource } from "../config/database.config";
import {
  Integration,
  IntegrationAppTypeEnum,
} from "../database/entities/integration.entity";
import { InternalServerException } from "../utils/app-error";

export const createGoogleIntegrationService = async (data: {
  userId: string;
  access_token: string;
  refresh_token?: string;
  metadata: any;
}) => {
  try {
    const integrationRepository = AppDataSource.getRepository(Integration);
    const integration = integrationRepository.create({
      app_type: IntegrationAppTypeEnum.GOOGLE_MEET,
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

export const createZoomIntegration = async (data: {
  userId: string;
  accessToken: string;
  refreshToken?: string;
  metadata: any;
}) => {
  try {
    const integrationRepository = AppDataSource.getRepository(Integration);

    // Create the integration
    const integration = integrationRepository.create({
      app_type: IntegrationAppTypeEnum.ZOOM,
      access_token: data.accessToken,
      refresh_token: data.refreshToken,
      metadata: data.metadata,
      userId: data.userId,
      isConnected: true,
    });

    await integrationRepository.save(integration);
    return integration;
  } catch (error) {
    throw new InternalServerException();
  }
};
