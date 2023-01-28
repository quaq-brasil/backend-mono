import { IsOptional, IsString } from 'class-validator';

export class CreatePageDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  url: string;

  @IsString()
  @IsOptional()
  avatar_url: string;

  @IsString()
  @IsOptional()
  background_url: string;

  @IsString()
  workspace_id: string;
}
