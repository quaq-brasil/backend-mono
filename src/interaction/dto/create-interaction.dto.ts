import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateInteractionDto {
  @IsArray()
  blocks: any[];

  @IsArray()
  data: any[];

  @IsArray()
  events: any[];

  @IsOptional()
  metadata: any;

  @IsOptional()
  last_block_id: string;

  @IsInt()
  depth: number;

  @IsArray()
  locations: any[];

  @IsString()
  template_id: string;

  @IsString()
  publication_id: string;

  @IsString()
  page_id: string;

  @IsString()
  user_id: string;
}
