import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePublicationRequest {
  @IsOptional()
  blocks: any[];

  @IsOptional()
  data: any[];

  @IsOptional()
  events: any[];

  @IsOptional()
  metadata: any;

  @IsOptional()
  @IsString()
  last_block_id: string;

  @IsOptional()
  @IsNumber()
  depth: number;

  @IsOptional()
  locations: any[];

  @IsString()
  publication_id: string;
}
