import { IsNumber, IsObject, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class DayAvailabilityDto {
  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsNumber()
  isAvailable: boolean;
}

export class UpdateAvailabilityDto {
  @IsNumber()
  timeGap: number;

  @IsObject()
  @ValidateNested()
  @Type(() => DayAvailabilityDto)
  days: {
    [day: string]: DayAvailabilityDto;
  };
}
