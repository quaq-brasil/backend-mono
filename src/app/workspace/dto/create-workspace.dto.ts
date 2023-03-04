import { IsArray, IsOptional, IsString } from 'class-validator'

export class CreateWorkspaceDto {
	@IsString()
	user_id: string

	@IsString()
	title: string

	@IsString()
	slug: string

	@IsOptional()
	@IsString()
	avatar_url: string

	@IsOptional()
	@IsArray()
	services: any[]

	@IsOptional()
	members: any
}
