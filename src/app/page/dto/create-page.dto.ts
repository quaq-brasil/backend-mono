import { IsObject, IsOptional, IsString } from 'class-validator'

export class CreatePageDto {
	@IsString()
	title: string

	@IsString()
	@IsOptional()
	description: string

	@IsString()
	slug: string

	@IsString()
	@IsOptional()
	avatar_url: string

	@IsString()
	@IsOptional()
	background_url: string

	@IsObject()
	@IsOptional()
	services: any[]

	@IsString()
	workspace_id: string

	@IsString()
	@IsOptional()
	visibility: string
}
