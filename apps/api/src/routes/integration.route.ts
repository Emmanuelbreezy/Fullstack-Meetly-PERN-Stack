import express from "express";
import {
  connectGoogleController,
  connectZoomController,
  getUserIntegrationsController,
  googleOAuthCallbackController,
  zoomOAuthCallbackController,
} from "../controllers/integration.controller";
import { passportAuthenticateJWT } from "../config/passport.config";

const integrationRoutes = express.Router();

integrationRoutes.get(
  "/user",
  passportAuthenticateJWT,
  getUserIntegrationsController
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
integrationRoutes.get(
  "/zoom/connect",
  passportAuthenticateJWT,
  connectZoomController
);

// Handle Zoom OAuth redirect
integrationRoutes.get("/zoom/callback", zoomOAuthCallbackController);

export default integrationRoutes;
