import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Req,
	UseGuards,
} from '@nestjs/common'
import { PermissionsService } from '../permissions/permissions.service'
import { JwtGuard } from './../auth/jwt.guard'
import { WorkspaceGuard } from './../guards/workspace.guard'
import { CreateWorkspaceDto } from './dto/create-workspace.dto'
import { UpdateWorkspaceDto } from './dto/update-workspace.dto'
import { WorkspaceService } from './workspace.service'

@UseGuards(JwtGuard, WorkspaceGuard)
@Controller('api/v1/workspaces')
export class WorkspaceController {
	constructor(
		private readonly workspaceService: WorkspaceService,
		private permissionsService: PermissionsService,
	) {}

	@Post()
	create(@Req() req, @Body() createWorkspaceDto: CreateWorkspaceDto) {
		return this.workspaceService.create(createWorkspaceDto, req.user.sub)
	}

	@Get(':id')
	async findOne(@Req() req, @Param('id') id: string) {
		await this.permissionsService.workspaceValidate(req.user, id)
		return this.workspaceService.findOne(id)
	}

	@Get('/user/:id')
	async findManyByUserId(@Req() req, @Param('id') id: string) {
		await this.permissionsService.workspaceValidate(req.user, id)
		return this.workspaceService.findAllByUserId(id)
	}

	@Post('/members/add/:id')
	async addMember(
		@Req() req,
		@Param('id') id: string,
		@Body() data: { email: string; id?: string },
	) {
		await this.permissionsService.workspaceValidate(req.user, id)
		return this.workspaceService.addWorkspaceMember(id, data.email)
	}

	@Post('/members/remove/:id')
	async removeMember(
		@Req() req,
		@Param('id') id: string,
		@Body() data: { email: string; user_id?: string },
	) {
		await this.permissionsService.workspaceValidate(req.user, id)
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
	async findOneBySlug(@Req() req, @Param('slug') slug: string) {
		await this.permissionsService.workspaceValidateBySlug(req.user, slug)
		return this.workspaceService.findOneBySlug(slug)
	}

	@Get('/page/slug/:slug')
	async findOneByPageSlug(@Req() req, @Param('slug') slug: string) {
		await this.permissionsService.workspaceValidateByPageSlug(req.user, slug)
		return this.workspaceService.findOneByPageSlug(slug)
	}

	@Put(':id')
	async update(
		@Req() req,
		@Param('id') id: string,
		@Body() updateWorkspaceDto: UpdateWorkspaceDto,
	) {
		await this.permissionsService.workspaceValidate(req.user, id)
		return this.workspaceService.update(id, updateWorkspaceDto)
	}

	@Delete(':id')
	async remove(@Req() req, @Param('id') id: string) {
		await this.permissionsService.workspaceValidate(req.user, id)
		return this.workspaceService.remove(id)
	}
}
