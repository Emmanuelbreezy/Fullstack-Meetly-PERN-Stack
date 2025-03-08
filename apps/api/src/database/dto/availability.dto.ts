import { Type } from "class-transformer";
import {
  IsString,
  IsBoolean,
  IsNumber,
  IsArray,
  ValidateNested,
  IsEnum,
} from "class-validator";
import { DayOfWeekEnum } from "../entities/day-availability.entity";
//import { IsEarlierThan } from "../../decorator/availability.decorator";

export class DayAvailabilityDto {
  @IsEnum(DayOfWeekEnum)
  day: DayOfWeekEnum;

  @IsString()
  // @IsEarlierThan("endTime", {
  //   message: "startTime must be earlier than endTime",
  // })
  startTime: string;

  @IsString()
  endTime: string;

  @IsBoolean()
  isAvailable: boolean;
}

// UpdateAvailability DTO (Validates the whole object)
export class UpdateAvailabilityDto {
  @IsNumber()
  timeGap: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DayAvailabilityDto)
  days: DayAvailabilityDto[];
}

//  @Transform(({ value }) => {
//     if (typeof value !== "object" || value === null) {
//       throw new BadRequestException(
//         "days must be an object with valid weekday keys."
//       );
//     }

//     return Object.entries(value).reduce((acc, [key, val]) => {
//       if (!(key in DayOfWeekEnum)) {
//         throw new BadRequestException(
//           `Invalid day: ${key}. Must be one of ${Object.values(
//             DayOfWeekEnum
//           ).join(", ")}`
//         );
//       }
//       acc[key as DayOfWeekEnum] = plainToInstance(DayAvailabilityDto, val);
//       return acc;
//     }, {} as Record<DayOfWeekEnum, DayAvailabilityDto>);
//   })
