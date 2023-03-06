import {
	Body,
	Controller,
	Delete,
	Get,
	Headers,
	Param,
	Post,
	Put,
	UseGuards,
} from '@nestjs/common'
import { JwtGuard } from '../auth/jwt.guard'
import { CreateTemplateRequest } from './dto/create-template-request'
import { UpdateTemplateRequest } from './dto/update-template-request'
import { TemplateService } from './template.service'

@UseGuards(JwtGuard)
@Controller('api/v1/templates')
export class TemplateController {
	constructor(private readonly templateService: TemplateService) {}

	@Post()
	create(@Body() createTemplateDto: CreateTemplateRequest) {
		return this.templateService.createOne(createTemplateDto)
	}

	@Get(':id')
	findOne(@Param('id') id: string, @Headers() headers: any) {
		return this.templateService.findOne(id, headers)
	}

	@Get('page/:page_id')
	findManyByPageId(@Param('page_id') page_id: string) {
		return this.templateService.findManyByPageId(page_id)
	}

	@Get(':page_slug/:slug')
	findOneByPageAndTemplateSlug(
		@Param('page_slug') page_slug: string,
		@Param('slug') slug: string,
	) {
		return this.templateService.findOneByPageAndTemplateSlug(slug, page_slug)
	}

	@Put(':id')
	update(
		@Param('id') id: string,
		@Body() updateTemplateDto: UpdateTemplateRequest,
	) {
		return this.templateService.updateOne(id, updateTemplateDto)
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.templateService.removeOne(id)
	}

	@Post('generate_unique_slug')
	generateUniqueSlugByPageName(
		@Body() data: { title: string; page_id: string; id?: string },
	) {
		return this.templateService.generateUniqueSlugByTemplateTitle(
			data.title,
			data.page_id,
			data.id,
		)
	}
}
