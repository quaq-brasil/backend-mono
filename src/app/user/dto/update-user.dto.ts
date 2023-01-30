import {
  IsBoolean,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
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
