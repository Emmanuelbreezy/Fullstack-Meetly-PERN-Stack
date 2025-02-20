import { Router } from "express";
import { getUserAvailabilityController } from "../controllers/availability.controller";

const availabilityRoutes = Router();

availabilityRoutes.get("/user", getUserAvailabilityController);

export default availabilityRoutes;
