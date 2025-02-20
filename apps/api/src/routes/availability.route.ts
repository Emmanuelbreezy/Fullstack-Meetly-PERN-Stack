import { Router } from "express";
import {
  getUserAvailabilityController,
  updateAvailabilityController,
} from "../controllers/availability.controller";

const availabilityRoutes = Router();

availabilityRoutes.get("/user", getUserAvailabilityController);
availabilityRoutes.put("/update", updateAvailabilityController);

export default availabilityRoutes;
