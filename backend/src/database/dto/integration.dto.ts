import { IsEnum, IsNotEmpty, IsArray, IsString, ArrayNotEmpty } from "class-validator";
import { IntegrationAppTypeEnum } from "../entities/integration.entity";

export class AppTypeDTO {
  @IsEnum(IntegrationAppTypeEnum)
  @IsNotEmpty()
  appType: IntegrationAppTypeEnum;
}

export class SelectedCalendarsDTO {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  ids: string[];
}
