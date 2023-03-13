import { IsArray, IsDateString, IsOptional, IsString } from "class-validator"

export class CreateInteractionEntrypointDto {
  @IsString()
  secret: string

  @IsString()
  @IsOptional()
  user_id: string

  @IsArray()
  data: any[]

  @IsDateString()
  date_of_consensus: string
}
