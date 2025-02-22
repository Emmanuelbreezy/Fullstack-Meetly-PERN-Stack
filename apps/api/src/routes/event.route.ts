import { Router } from "express";
import {
  createEventController,
  deleteEventController,
  getPublicEventByUsernameAndSlugController,
  getPublicEventsByUsernameController,
  getUserEventsController,
  toggleEventPrivacyController,
} from "../controllers/event.controller";
import { passportAuthenticateJWT } from "../config/passport.config";

const eventRoutes = Router();

eventRoutes.post("/create", passportAuthenticateJWT, createEventController);
eventRoutes.get("/all", passportAuthenticateJWT, getUserEventsController);

//for guest
eventRoutes.get("/public/:username", getPublicEventsByUsernameController);
eventRoutes.get(
  "/public/:username/:slug",
  getPublicEventByUsernameAndSlugController
);

eventRoutes.put(
  "/toggle-privacy",
  passportAuthenticateJWT,
  toggleEventPrivacyController
);
eventRoutes.delete("/:eventId", passportAuthenticateJWT, deleteEventController);

export default eventRoutes;
