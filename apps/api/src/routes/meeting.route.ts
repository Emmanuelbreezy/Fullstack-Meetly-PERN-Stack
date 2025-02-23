import { Router } from "express";
import {
  getUserMeetingsController,
  createMeetBookingForGuestController,
  cancelMeetingController,
} from "../controllers/meeting.controller";
import { passportAuthenticateJWT } from "../config/passport.config";

const meetingRoutes = Router();

meetingRoutes.get(
  "/user/all",
  passportAuthenticateJWT,
  getUserMeetingsController
);

meetingRoutes.post("/public/create", createMeetBookingForGuestController);

meetingRoutes.delete(
  "/cancel/:meetingId",
  passportAuthenticateJWT,
  cancelMeetingController
);

export default meetingRoutes;
