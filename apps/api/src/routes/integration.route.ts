import express from "express";
import {
  checkUserIntegrationController,
  connectGoogleController,
  connectZoomController,
  getUserIntegrationsController,
  googleOAuthCallbackController,
  zoomOAuthCallbackController,
} from "../controllers/integration.controller";
import { passportAuthenticateJWT } from "../config/passport.config";

const integrationRoutes = express.Router();

integrationRoutes.get(
  "/all",
  passportAuthenticateJWT,
  getUserIntegrationsController
);

integrationRoutes.get(
  "/user/:appType",
  passportAuthenticateJWT,
  checkUserIntegrationController
);

// Initiate Google OAuth
integrationRoutes.get(
  "/google/connect",
  passportAuthenticateJWT,
  connectGoogleController
);

// Handle Google OAuth redirect
integrationRoutes.get("/google/callback", googleOAuthCallbackController);

//******* */ Skip this ones ***********************
integrationRoutes.post(
  "/zoom/connect",
  passportAuthenticateJWT,
  connectZoomController
);

// Handle Zoom OAuth redirect
integrationRoutes.get("/zoom/callback", zoomOAuthCallbackController);

export default integrationRoutes;
