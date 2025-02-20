import express from "express";
import {
  connectGoogleController,
  connectZoomController,
  googleOAuthCallbackController,
  zoomOAuthCallbackController,
} from "../controllers/integration.controller";
import { passportAuthenticateJWT } from "../config/passport.config";

const integrationRoutes = express.Router();

// Initiate Google OAuth
integrationRoutes.get(
  "/google/connect",
  passportAuthenticateJWT,
  connectGoogleController
);

// Handle Google OAuth redirect
integrationRoutes.get("/google/callback", googleOAuthCallbackController);

integrationRoutes.get(
  "/zoom/connect",
  passportAuthenticateJWT,
  connectZoomController
);

// Handle Zoom OAuth redirect
integrationRoutes.get("/zoom/callback", zoomOAuthCallbackController);

export default integrationRoutes;
