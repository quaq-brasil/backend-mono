import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreatePublicationRequest {
	@IsString()
	title: string;

	@IsArray()
	blocks: any[];

	@IsString()
	@IsOptional()
	template_id: string;

	@IsString()
	page_id: string;

	@IsOptional()
	variables: any;
}
