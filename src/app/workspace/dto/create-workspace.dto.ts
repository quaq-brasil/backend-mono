import { IsObject, IsOptional, IsString } from 'class-validator';

export class CreateWorkspaceDto {
  @IsString()
  name: string;

  @IsString()
  avatar_url: string;

  @IsOptional()
  @IsObject()
  services: any[];
}
