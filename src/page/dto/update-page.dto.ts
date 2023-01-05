import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { CreatePageDto } from './create-page.dto';

export class UpdatePageDto extends PartialType(CreatePageDto) {
  @IsBoolean()
  @IsOptional()
  is_stripe_active: boolean;

  @IsString()
  @IsOptional()
  facebook_pixel_id: string;

  @IsString()
  @IsOptional()
  google_analytics_id: string;
}
