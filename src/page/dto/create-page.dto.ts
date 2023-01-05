import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePageDto {
  @IsString()
  name: string;

  @IsString()
  url: string;

  @IsUUID()
  workspace_id: string;

  @IsString()
  @IsOptional()
  avatar_url: string;

  @IsString()
  @IsOptional()
  background_url: string;
}
