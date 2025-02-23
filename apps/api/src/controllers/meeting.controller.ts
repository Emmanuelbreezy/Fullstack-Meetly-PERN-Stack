import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import {
  MeetingFilterEnum,
  MeetingFilterEnumType,
} from "../enums/meeting.enum";
import { HTTPSTATUS } from "../config/http.config";
import {
  cancelMeetingService,
  createMeetBookingForGuestService,
  getUserMeetingsService,
} from "../services/meeting.service";
import { withValidation } from "../middlewares/withValidation.middleware";
import { CreateMeetingDTO, MeetingIdDTO } from "../database/dto/meeting.dto";

export const getUserMeetingsController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id as string;

    const filter =
      (req.query.filter as MeetingFilterEnumType) || MeetingFilterEnum.ALL;

    // Fetch the meetings
    const meetings = await getUserMeetingsService(userId, filter);

    return res.status(HTTPSTATUS.OK).json({
      message: "Meetings fetched successfully",
      meetings,
    });
  }
);

// For Guest
export const createMeetBookingForGuestController = asyncHandler(
  withValidation(
    CreateMeetingDTO,
    "body"
  )(async (req: Request, res: Response) => {
    const createMeetingDTO = req.dto;

    // Create the meeting
    const meeting = await createMeetBookingForGuestService(createMeetingDTO);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Meeting created successfully",
      meeting,
    });
  })
);

export const cancelMeetingController = asyncHandler(
  withValidation(
    MeetingIdDTO,
    "params"
  )(async (req: Request, res: Response) => {
    const { meetingId } = req.dto;
    // Cancel the meeting
    await cancelMeetingService(meetingId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Meeting canceled successfully",
    });
  })
);
