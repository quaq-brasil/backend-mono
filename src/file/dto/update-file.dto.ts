import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { CreateFileDto } from './create-file.dto';

export class UpdateFileDto extends PartialType(CreateFileDto) {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  url: string;

  @IsOptional()
  @IsString()
  type: string;

  @IsOptional()
  @IsInt()
  size: number;

  @IsOptional()
  @IsString()
  mime_type: string;

  @IsOptional()
  metadata: any;
}
