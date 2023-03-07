import { IsObject, IsOptional, IsString } from 'class-validator'

export class CreateTemplateRequest {
	@IsString()
	title: string

	@IsString()
	slug: string

	@IsString()
	shortcut_image: string

	@IsString()
	@IsOptional()
	shortcut_size: string

	@IsString()
	@IsOptional()
	current_publication_id: string

	@IsObject()
	@IsOptional()
	trackers: any

	@IsObject()
	@IsOptional()
	access_config: any

	@IsString()
	page_id: string
}
