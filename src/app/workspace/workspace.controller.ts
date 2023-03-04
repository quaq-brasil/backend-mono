import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { CreateWorkspaceDto } from './dto/create-workspace.dto'
import { UpdateWorkspaceDto } from './dto/update-workspace.dto'
import { WorkspaceService } from './workspace.service'

@Controller('api/v1/workspaces')
export class WorkspaceController {
	constructor(private readonly workspaceService: WorkspaceService) {}

	@Post()
	create(@Body() createWorkspaceDto: CreateWorkspaceDto) {
		return this.workspaceService.create(
			createWorkspaceDto,
			createWorkspaceDto.user_id,
		)
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.workspaceService.findOne(id)
	}

	@Get('/user/:id')
	findManyByUserId(@Param('id') id: string) {
		return this.workspaceService.findAllByUserId(id)
	}

	@Post('/members/add/:id')
	addMember(
		@Param('id') id: string,
		@Body() data: { email: string; id?: string },
	) {
		return this.workspaceService.addWorkspaceMember(id, data.email)
	}

	@Post('/members/remove/:id')
	removeMember(
		@Param('id') id: string,
		@Body() data: { email: string; user_id?: string },
	) {
		return this.workspaceService.removeWorkspaceMember(id, data.user_id)
	}

	@Post('/generate_unique_slug')
	generateUniqueSlug(@Body() data: { name: string; id?: string }) {
		return this.workspaceService.generateUniqueSlugByWorkspaceName(
			data.name,
			data.id,
		)
	}

	@Get('/slug/:slug')
	findManyBySlug(@Param('slug') slug: string) {
		return this.workspaceService.findOneBySlug(slug)
	}

	@Get('/page/slug/:slug')
	findOneByPageSlug(@Param('slug') slug: string) {
		return this.workspaceService.findOneByPageSlug(slug)
	}

	@Put(':id')
	update(
		@Param('id') id: string,
		@Body() updateWorkspaceDto: UpdateWorkspaceDto,
	) {
		return this.workspaceService.update(id, updateWorkspaceDto)
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.workspaceService.remove(id)
	}
}
