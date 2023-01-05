import {
  IsBoolean,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsStrongPassword()
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
  @IsString()
  email_activation_token: string;

  @IsOptional()
  @IsString()
  email_activation_token_expires: Date;

  @IsOptional()
  @IsString()
  password_reset_token: string;

  @IsOptional()
  @IsString()
  password_reset_token_expires: Date;

  @IsOptional()
  last_login: Date;
}
