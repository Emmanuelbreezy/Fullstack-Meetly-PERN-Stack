import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import {
  CreateEventDTO,
  EventIdDTO,
  UserNameAndSlugDTO,
  UserNameDTO,
} from "../database/dto/event.dto";
import {
  createEventService,
  deleteEventService,
  getPublicEventByUsernameAndSlugService,
  getPublicEventsByUsernameService,
  getUserEventsService,
  toggleEventPrivacyService,
} from "../services/event.service";
import { withValidation } from "../middlewares/withValidation.middleware";

export const createEventController = asyncHandler(
  withValidation(
    CreateEventDTO,
    "body"
  )(async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    // const createEventDTO = plainToInstance(CreateEventDTO, req.body);
    // const errors = await validate(createEventDTO);
    // if (errors?.length > 0) formatValidationError(res, errors);
    const createEventDTO = req.dto as CreateEventDTO; // Access the validated DTO
    const event = await createEventService(userId, createEventDTO);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Event created successfully",
      event,
    });
  })
);

export const getUserEventsController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const { events, username } = await getUserEventsService(userId);
    return res.status(HTTPSTATUS.OK).json({
      message: `User event fetched successfully`,
      data: {
        events,
        username,
      },
    });
  }
);

// For guest
export const getPublicEventsByUsernameController = asyncHandler(
  withValidation(
    UserNameDTO,
    "params"
  )(async (req: Request, res: Response) => {
    // Username is now validated and available in `req.dto`
    const { user, events } = await getPublicEventsByUsernameService(
      req.dto.username
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Public event fetched successfully",
      user,
      events,
    });
  })
);

// For guest
export const getPublicEventByUsernameAndSlugController = asyncHandler(
  withValidation(
    UserNameAndSlugDTO,
    "params"
  )(async (req: Request, res: Response) => {
    const userNameAndSlugDTO = req.dto;

    const event = await getPublicEventByUsernameAndSlugService(
      userNameAndSlugDTO
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Event details fetched successfully",
      event,
    });
  })
);

export const toggleEventPrivacyController = asyncHandler(
  withValidation(
    EventIdDTO,
    "body"
  )(async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const eventIdDTO = req.dto;
    const event = await toggleEventPrivacyService(userId, eventIdDTO.eventId);

    return res.status(HTTPSTATUS.OK).json({
      message: `Event set to ${
        event.isPrivate ? "private" : "public"
      } successfully`,
      event,
    });
  })
);

export const deleteEventController = asyncHandler(
  withValidation(
    EventIdDTO,
    "params"
  )(async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    // Delete the event
    await deleteEventService(userId, req.dto.eventId);
    // Return success response
    return res.status(HTTPSTATUS.OK).json({
      message: "Event deleted successfully",
    });
  })
);
