import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';
import { CreatePageDto } from './create-page.dto';

export class UpdatePageDto extends PartialType(CreatePageDto) {
  @IsBoolean()
  @IsOptional()
  is_stripe_active: boolean;

  @IsArray()
  @IsOptional()
  trackers: any[];

  @IsString()
  @IsOptional()
  stripe_id: string;
}
