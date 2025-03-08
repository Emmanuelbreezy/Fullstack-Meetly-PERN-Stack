import { Router } from "express";
import {
  getAvailabilityForPublicEventController,
  getUserAvailabilityController,
  updateAvailabilityController,
} from "../controllers/availability.controller";
import { passportAuthenticateJWT } from "../config/passport.config";

const availabilityRoutes = Router();

availabilityRoutes.get(
  "/me",
  passportAuthenticateJWT,
  getUserAvailabilityController
);
//For guest people
availabilityRoutes.get(
  "/public/:eventId",
  getAvailabilityForPublicEventController
);

availabilityRoutes.put(
  "/update",
  passportAuthenticateJWT,
  updateAvailabilityController
);

export default availabilityRoutes;
