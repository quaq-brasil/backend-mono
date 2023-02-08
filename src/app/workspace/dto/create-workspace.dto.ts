import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateWorkspaceDto {
	@IsString()
	name: string;

	@IsString()
	slug: string;

	@IsOptional()
	@IsString()
	avatar_url: string;

	@IsOptional()
	@IsArray()
	services: any[];

	@IsOptional()
	members: any;
}
