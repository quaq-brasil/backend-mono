import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
} from '@nestjs/common';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { PageService } from './page.service';

@Controller('api/v1/pages')
export class PageController {
	constructor(private readonly pageService: PageService) {}

	@Post()
	create(@Body() createPageDto: CreatePageDto) {
		return this.pageService.create(createPageDto);
	}

	@Get()
	findAll() {
		return this.pageService.findAll();
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		return await this.pageService.findOne(id);
	}

	@Get('slug/:slug')
	findOneBySlug(@Param('slug') slug: string) {
		return this.pageService.findOneBySlug(slug);
	}

	@Get('workspace/:workspace_id')
	findAllByWorkspaceId(@Param('workspace_id') workspace_id: string) {
		return this.pageService.findAllByWorkspaceId(workspace_id);
	}

	@Put(':id')
	update(@Param('id') id: string, @Body() updatePageDto: UpdatePageDto) {
		return this.pageService.update(id, updatePageDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.pageService.delete(id);
	}

	@Post('generate_unique_slug')
	generateUniqueSlugByPageName(@Body() data: { name: string; id?: string }) {
		return this.pageService.generateUniqueSlugByPageName(data.name, data.id);
	}
}
