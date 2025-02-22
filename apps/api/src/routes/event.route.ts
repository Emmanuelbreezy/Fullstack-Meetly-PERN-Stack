import { Router } from "express";
import {
  createEventController,
  getUserEventsController,
  toggleEventPrivacyController,
} from "../controllers/event.controller";

const eventRoutes = Router();

eventRoutes.post("/create", createEventController);
eventRoutes.get("/all", getUserEventsController);
eventRoutes.put("/toggle-privacy", toggleEventPrivacyController);

export default eventRoutes;
