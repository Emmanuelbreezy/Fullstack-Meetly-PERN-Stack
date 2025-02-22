import { Type, Transform, plainToInstance } from "class-transformer";
import {
  IsString,
  IsBoolean,
  IsNumber,
  IsObject,
  ValidateNested,
} from "class-validator";
import { DayOfWeekEnum } from "../entities/day-availability.entity";
import { BadRequestException } from "../../utils/app-error";
//import { IsEarlierThan } from "../../decorator/availability.decorator";

export class DayAvailabilityDto {
  @IsString()
  endTime: string;

  @IsString()
  // @IsEarlierThan("endTime", {
  //   message: "startTime must be earlier than endTime",
  // })
  startTime: string;

  @IsBoolean()
  isAvailable: boolean;
}

// UpdateAvailability DTO (Validates the whole object)
export class UpdateAvailabilityDto {
  @IsNumber()
  timeGap: number;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => DayAvailabilityDto)
  @Transform(({ value }) => {
    if (typeof value !== "object" || value === null) {
      throw new BadRequestException(
        "days must be an object with valid weekday keys."
      );
    }

    return Object.entries(value).reduce((acc, [key, val]) => {
      if (!(key in DayOfWeekEnum)) {
        throw new BadRequestException(
          `Invalid day: ${key}. Must be one of ${Object.values(
            DayOfWeekEnum
          ).join(", ")}`
        );
      }
      acc[key as DayOfWeekEnum] = plainToInstance(DayAvailabilityDto, val);
      return acc;
    }, {} as Record<DayOfWeekEnum, DayAvailabilityDto>);
  })
  days: Record<DayOfWeekEnum, DayAvailabilityDto>;
}
