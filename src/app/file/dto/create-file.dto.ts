import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateFileDto {
  @IsString()
  name: string;

  @IsString()
  url: string;

  @IsString()
  type: string;

  @IsInt()
  size: number;

  @IsString()
  mime_type: string;

  @IsOptional()
  metadata: any;
}
