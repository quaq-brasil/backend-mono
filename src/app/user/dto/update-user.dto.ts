import {
  IsBoolean,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { MessageHelper } from 'src/helpers/messages.helper';
import { regexHelper } from 'src/helpers/regex.helper';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @Matches(regexHelper.password, { message: MessageHelper.PASSWORD_VALID })
  password: string;

  @IsOptional()
  @IsString()
  type: string;

  @IsOptional()
  @IsBoolean()
  email_verified: boolean;

  @IsOptional()
  @IsNumber()
  password_reset_token_attempts: number;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  avatar_url: string;

  @IsOptional()
  @IsString()
  stripe_customer_id: string;

  @IsOptional()
  last_login: Date;
}
