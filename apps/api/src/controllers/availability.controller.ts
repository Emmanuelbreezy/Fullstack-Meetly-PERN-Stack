import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import {
  getUserAvailabilityService,
  updateAvailabilityService,
} from "../services/availability.service";
import { plainToInstance } from "class-transformer";
import { UpdateAvailabilityDto } from "../database/dto/availability.dto";
import { validate } from "class-validator";
import { formatValidationError } from "../middlewares/errorHandler.middleware";

export const getUserAvailabilityController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id as string;

    const availability = await getUserAvailabilityService(userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Fetched availability successfully",
      data: {
        availability,
      },
    });
  }
);

export const updateAvailabilityController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id as string;

    const updateAvailabilityDto = plainToInstance(
      UpdateAvailabilityDto,
      req.body
    );

    const errors = await validate(updateAvailabilityDto);
    if (errors?.length > 0) {
      formatValidationError(res, errors);
    }

    await updateAvailabilityService(userId, updateAvailabilityDto);

    return res.status(HTTPSTATUS.OK).json({
      message: "Availability updated successfully",
    });
  }
);
