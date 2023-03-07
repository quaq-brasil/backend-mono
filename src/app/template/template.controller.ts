import {
	Body,
	Controller,
	Delete,
	Get,
	Headers,
	Param,
	Post,
	Put,
	UseGuards
} from '@nestjs/common'
import { CheckAbilities } from '../ability/abilities.decorator'
import { AbilitiesGuard } from '../ability/abilities.guard'
import { WorkspaceAction } from '../ability/ability.enums'
import { JwtGuard } from '../auth/jwt.guard'
import { CreateTemplateRequest } from './dto/create-template-request'
import { UpdateTemplateRequest } from './dto/update-template-request'
import { TemplateService } from './template.service'

@Controller('api/v1/templates')
export class TemplateController {
	constructor(private readonly templateService: TemplateService) {}

	@UseGuards(JwtGuard)
	@Post()
	create(@Body() createTemplateDto: CreateTemplateRequest) {
		return this.templateService.createOne(createTemplateDto)
	}

	@Get(':template_id')
	findOne(@Param('template_id') template_id: string, @Headers() headers: any) {
		return this.templateService.findOne(template_id, headers)
	}

	@UseGuards(JwtGuard, AbilitiesGuard)
	@CheckAbilities({ action: WorkspaceAction.Manage, subject: 'Page' })
	@Get('page/:page_id')
	findManyByPageId(@Param('page_id') page_id: string) {
		return this.templateService.findManyByPageId(page_id)
	}

	@Get(':page_slug/:template_slug')
	findOneByPageAndTemplateSlug(
		@Param('page_slug') page_slug: string,
		@Param('template_slug') template_slug: string
	) {
		return this.templateService.findOneByPageAndTemplateSlug(
			template_slug,
			page_slug
		)
	}

	@UseGuards(JwtGuard, AbilitiesGuard)
	@CheckAbilities({ action: WorkspaceAction.Manage, subject: 'Template' })
	@Put(':template_id')
	update(
		@Param('template_id') template_id: string,
		@Body() updateTemplateDto: UpdateTemplateRequest
	) {
		return this.templateService.updateOne(template_id, updateTemplateDto)
	}

	@UseGuards(JwtGuard, AbilitiesGuard)
	@CheckAbilities({ action: WorkspaceAction.Manage, subject: 'Template' })
	@Delete(':template_id')
	remove(@Param('template_id') template_id: string) {
		return this.templateService.removeOne(template_id)
	}

	@UseGuards(JwtGuard, AbilitiesGuard)
	@Post('generate_unique_slug')
	generateUniqueSlugByPageName(
		@Body() data: { title: string; page_id: string; id?: string }
	) {
		return this.templateService.generateUniqueSlugByTemplateTitle(
			data.title,
			data.page_id,
			data.id
		)
	}
}
