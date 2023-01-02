import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTemplateRequest {
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

  @IsString()
  current_publication_id: string;

  @IsNumber()
  @IsOptional()
  number_of_new_interactions: number;

  @IsString()
  @IsOptional()
  facebook_pixel_id: string;
}
