import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { CreateTemplateRequest } from './create-template-request';

export class UpdateTemplateRequest extends PartialType(CreateTemplateRequest) {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  url: string;

  @IsString()
  @IsOptional()
  shortcut_image: string;

  @IsString()
  @IsOptional()
  shortcut_size: string;

  @IsOptional()
  @IsString()
  current_publication_id: string;

  @IsNumber()
  @IsOptional()
  number_of_new_interactions: number;

  @IsObject()
  @IsOptional()
  trackers: any;
}
