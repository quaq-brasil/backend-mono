import { IsDateString, IsOptional } from 'class-validator';

export class UpdatePublicationRequest {
  @IsDateString()
  @IsOptional()
  published_at: Date;
}
