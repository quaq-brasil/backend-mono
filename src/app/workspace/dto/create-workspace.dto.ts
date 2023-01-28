import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateWorkspaceDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  avatar_url: string;

  @IsOptional()
  @IsArray()
  services: any[];

  @IsString()
  user_id: string;
}
