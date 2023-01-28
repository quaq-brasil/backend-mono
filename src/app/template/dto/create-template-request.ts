import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateTemplateRequest {
  @IsString()
  name: string;

  @IsString()
  url: string;

  @IsString()
  shortcut_image: string;

  @IsString()
  @IsOptional()
  shortcut_size: string;

  @IsString()
  @IsOptional()
  current_publication_id: string;

  @IsArray()
  @IsOptional()
  trackers: any[];

  @IsString()
  page_id: string;
}
