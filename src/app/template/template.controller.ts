import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
} from '@nestjs/common';
import { CreateTemplateRequest } from './dto/create-template-request';
import { UpdateTemplateRequest } from './dto/update-template-request';
import { TemplateService } from './template.service';

@Controller('api/v1/templates')
export class TemplateController {
	constructor(private readonly templateService: TemplateService) {}

	@Post()
	create(@Body() createTemplateDto: CreateTemplateRequest) {
		return this.templateService.createOne(createTemplateDto);
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.templateService.findOne(id);
	}

	@Get('url/:url')
	findOneByUrl(@Param('url') url: string) {
		return this.templateService.findOneByUrl(url);
	}

	@Get('page/:page_id')
	findManyByPageId(@Param('page_id') page_id: string) {
		return this.templateService.findManyByPageId(page_id);
	}

	@Get(':page_url/:url')
	findOneByPageAndTemplateUrl(
		@Param('page_url') page_url: string,
		@Param('url') url: string,
	) {
		return this.templateService.findOneByPageAndTemplateUrl(url, page_url);
	}

	@Get(':page_url/:url/:consumer_id')
	findOneByPageAndTemplateUrlWithConsumerId(
		@Param('page_url') page_url: string,
		@Param('url') url: string,
		@Param('consumer_id') consumer_id: string,
	) {
		return this.templateService.findOneByPageAndTemplateUrl(
			url,
			page_url,
			consumer_id,
		);
	}

	@Put(':id')
	update(
		@Param('id') id: string,
		@Body() updateTemplateDto: UpdateTemplateRequest,
	) {
		return this.templateService.updateOne(id, updateTemplateDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.templateService.removeOne(id);
	}

	@Post('generate_unique_url')
	generateUniqueUrlByPageName(
		@Body() data: { title: string; page_id: string; id?: string },
	) {
		return this.templateService.generateUniqueSlugByTemplateTitle(
			data.title,
			data.page_id,
			data.id,
		);
	}
}
