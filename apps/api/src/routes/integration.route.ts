import express from "express";
import {
  checkUserIntegrationController,
  connectAppController,
  getUserIntegrationsController,
  googleOAuthCallbackController,
} from "../controllers/integration.controller";
import { passportAuthenticateJWT } from "../config/passport.config";

const integrationRoutes = express.Router();

integrationRoutes.get(
  "/all",
  passportAuthenticateJWT,
  getUserIntegrationsController
);

integrationRoutes.get(
  "/check/:appType",
  passportAuthenticateJWT,
  checkUserIntegrationController
);

integrationRoutes.get(
  "/connect/:appType",
  passportAuthenticateJWT,
  connectAppController
);

// Handle Google OAuth redirect
integrationRoutes.get("/google/callback", googleOAuthCallbackController);

export default integrationRoutes;
