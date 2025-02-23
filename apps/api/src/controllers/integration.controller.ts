import { google } from "googleapis";
import { Request, Response } from "express";
import { BadRequestException } from "../utils/app-error";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { config } from "../config/app.config";
import axios from "axios";
import { decodeState, encodeState } from "../utils/helper";
import {
  IntegrationAppTypeEnum,
  IntegrationCategoryEnum,
  IntegrationProviderEnum,
} from "../database/entities/integration.entity";
import {
  checkUserIntegrationService,
  createIntegrationService,
  getUserIntegrationsService,
} from "../services/integration.service";
import { HTTPSTATUS } from "../config/http.config";
import { withValidation } from "../middlewares/withValidation.middleware";
import { AppTypeDTO } from "../database/dto/integration.dto";

const oauth2Client = new google.auth.OAuth2(
  config.GOOGLE_CLIENT_ID,
  config.GOOGLE_CLIENT_SECRET,
  config.GOOGLE_REDIRECT_URI
);

const CLIENT_APP_URL = `${config.FRONTEND_ORIGIN}/integrations`;

export const getUserIntegrationsController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id as string;

    const integrations = await getUserIntegrationsService(userId);
    res.status(HTTPSTATUS.OK).json({
      message: "Fetched user integration successfully",
      data: integrations,
    });
  }
);

export const checkUserIntegrationController = asyncHandler(
  withValidation(
    AppTypeDTO,
    "params"
  )(async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    // Check if the user has connected the specified integration
    const isConnected = await checkUserIntegrationService(
      userId,
      req.dto.appType
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Integration check successful",
      isConnected,
    });
  })
);

// Step 1: Redirect to Google OAuth consent screen
export const connectGoogleController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id as string;

    if (!userId) {
      throw new BadRequestException("User ID is required");
    }
    const state = encodeState({ userId });
    // Generate the URL for Google's OAuth consent screen
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline", // Request a refresh token
      scope: [
        "https://www.googleapis.com/auth/calendar.events", // Calendar scope
        "https://www.googleapis.com/auth/meetings.space.readonly", // Google Meet scope
      ],
      prompt: "consent", // Force the user to consent
      state: state, // Pass the user ID in the state parameter
    });
    // Redirect the user to Google's OAuth consent screen
    return res.redirect(authUrl);
  }
);

// Step 2: Handle Google OAuth redirect
export const googleOAuthCallbackController = asyncHandler(
  async (req: Request, res: Response) => {
    const { code, state } = req.query;
    const CLIENT_URL = `${CLIENT_APP_URL}?app_type=google`;

    if (!code || typeof code !== "string") {
      return res.redirect(`${CLIENT_URL}&error=Invalid authorization code`);
    }

    if (!state || typeof state !== "string") {
      return res.redirect(`${CLIENT_URL}&error=Invalid state parameter`);
    }

    // Decode the state parameter to get the user ID
    const { userId } = decodeState(state);
    if (!userId) {
      return res.redirect(`${CLIENT_URL}&error=User ID is required`);
    }

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    const people = google.people({ version: "v1", auth: oauth2Client });

    const profile = await people.people.get({
      resourceName: "people/me",
      personFields: "emailAddresses",
    });

    const email = profile.data.emailAddresses?.[0]?.value || "";

    if (!tokens.access_token) {
      return res.redirect(`${CLIENT_URL}&error=Access Token not passed`);
    }
    // Save the tokens in the database
    await createIntegrationService({
      userId: userId,
      provider: IntegrationProviderEnum.GOOGLE,
      category: IntegrationCategoryEnum.VIDEO_CONFERENCING,
      app_type: IntegrationAppTypeEnum.GOOGLE_MEET,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token || undefined,
      metadata: {
        email: email,
        scope: tokens.scope, // Granted scopes
      },
    });

    await createIntegrationService({
      userId: userId,
      provider: IntegrationProviderEnum.GOOGLE,
      category: IntegrationCategoryEnum.CALENDAR,
      app_type: IntegrationAppTypeEnum.GOOGLE_CALENDAR,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token || undefined,
      metadata: {
        email: email,
        scope: tokens.scope,
      },
    });
    return res.redirect(`${CLIENT_URL}&success=true`);
  }
);

//*************** */ Skip this once *************************
//*************** */ Skip this once *************************
//*************** */ Skip this once *************************
//*************** */ Skip this once *************************
//*************** */ Skip this once *************************
//*************** */ Skip this once *************************
//*************** */ Skip this once *************************
//*************** */ Skip this once *************************
//*************** */ Skip this once *************************
export const connectZoomController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    if (!userId) {
      throw new BadRequestException("User ID is required");
    }
    // Encode the user ID in the state parameter
    const state = encodeState({ userId });
    const zoomAuthUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${config.ZOOM_CLIENT_ID}&redirect_uri=${config.ZOOM_REDIRECT_URI}&state=${state}`;

    // Redirect the user to Zoom's OAuth consent screen
    return res.redirect(zoomAuthUrl);
  }
);

// Step 2: Handle Zoom OAuth redirect
export const zoomOAuthCallbackController = asyncHandler(
  async (req: Request, res: Response) => {
    const { code, state } = req.query;
    const CLIENT_URL = `${CLIENT_APP_URL}?app_type=zoom`;

    if (!code || typeof code !== "string") {
      return res.redirect(`${CLIENT_URL}&error=Invalid authorization code`);
    }

    if (!state || typeof state !== "string") {
      return res.redirect(`${CLIENT_URL}&error=Invalid state parameter`);
    }

    // Decode the state parameter to get the user ID
    const { userId } = decodeState(state);

    if (!userId) {
      return res.redirect(`${CLIENT_URL}&error=User ID is required`);
    }
    // Exchange the authorization code for tokens
    const tokenResponse = await axios.post(
      "https://zoom.us/oauth/token",
      null,
      {
        params: {
          grant_type: "authorization_code",
          code,
          redirect_uri: config.ZOOM_REDIRECT_URI,
        },
        auth: {
          username: config.ZOOM_CLIENT_ID!,
          password: config.ZOOM_CLIENT_SECRET!,
        },
      }
    );
    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    // Fetch the user's Zoom profile
    const profileResponse = await axios.get("https://api.zoom.us/v2/users/me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const email = profileResponse.data.email;
    const timeZone = profileResponse.data.timezone;

    // Save the tokens and metadata in the database
    await createIntegrationService({
      userId: userId,
      provider: IntegrationProviderEnum.ZOOM,
      category: IntegrationCategoryEnum.VIDEO_CONFERENCING,
      app_type: IntegrationAppTypeEnum.ZOOM_MEETING,
      access_token: access_token,
      refresh_token: refresh_token,
      metadata: {
        email: email, // User's email
        timeZone: timeZone, // User's time zone
        refreshTokenExpiry: new Date(Date.now() + expires_in * 1000),
      },
    });
    return res.redirect(`${CLIENT_URL}&success=true`);
  }
);
