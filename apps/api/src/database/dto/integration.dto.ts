import { IsNotEmpty, IsEnum } from "class-validator";
import { IntegrationAppTypeEnum } from "../entities/integration.entity";

export class AppTypeDTO {
  @IsEnum(IntegrationAppTypeEnum)
  @IsNotEmpty()
  appType: IntegrationAppTypeEnum;
}
