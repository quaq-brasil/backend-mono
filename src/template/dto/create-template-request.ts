import { IsOptional, IsString } from 'class-validator';

export class CreateTemplateRequest {
  @IsString()
  name: string;

  @IsString()
  url: string;

  @IsString()
  shortcut_image: string;

  @IsString()
  shortcut_size: string;

  @IsString()
  current_publication_id: string;

  @IsString()
  @IsOptional()
  facebook_pixel_id: string;

  @IsString()
  page_id: string;
}
