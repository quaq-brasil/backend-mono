import { IsEmail, IsOptional, IsString } from "class-validator"

export class CreateRaffleDto {
  @IsEmail()
  email: string

  @IsString()
  @IsOptional()
  name: string

  team: string

  user_consent: boolean
}
