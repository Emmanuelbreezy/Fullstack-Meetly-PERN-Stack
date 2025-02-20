import { Request, Response } from "express";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import { CreateEventDTO } from "../database/dto/event.dto";
import { createEventService } from "../services/event.service";
import { formatValidationError } from "../middlewares/errorHandler.middleware";

export const createEventController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(HTTPSTATUS.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    }
    const createEventDTO = plainToInstance(CreateEventDTO, req.body);
    const errors = await validate(createEventDTO);
    if (errors?.length > 0) {
      formatValidationError(res, errors);
    }
    const event = await createEventService(userId, createEventDTO);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Event created successfully",
      event,
    });
  }
);
