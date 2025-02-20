import { Router } from "express";
import { createEventController } from "../controllers/event.controller";

const eventRoutes = Router();

eventRoutes.post("/create", createEventController);

export default eventRoutes;
