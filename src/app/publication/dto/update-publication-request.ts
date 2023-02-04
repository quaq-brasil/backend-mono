import { PartialType } from '@nestjs/mapped-types';
import { IsDateString, IsOptional } from 'class-validator';
import { CreatePublicationRequest } from './create-publication-request';

export class UpdatePublicationRequest extends PartialType(
	CreatePublicationRequest,
) {
	@IsDateString()
	@IsOptional()
	published_at: Date;
}
