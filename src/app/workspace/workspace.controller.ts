import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Req,
	UseGuards
} from '@nestjs/common'
import { CheckAbilities } from '../ability/abilities.decorator'
import { WorkspaceAction } from '../ability/ability.enums'
import { AbilitiesGuard } from './../ability/abilities.guard'
import { JwtGuard } from './../auth/jwt.guard'
import { CreateWorkspaceDto } from './dto/create-workspace.dto'
import { UpdateWorkspaceDto } from './dto/update-workspace.dto'
import { WorkspaceService } from './workspace.service'

@UseGuards(JwtGuard, AbilitiesGuard)
@Controller('api/v1/workspaces')
export class WorkspaceController {
	constructor(private readonly workspaceService: WorkspaceService) {}

	@Post()
	create(@Req() req, @Body() createWorkspaceDto: CreateWorkspaceDto) {
		return this.workspaceService.create(createWorkspaceDto, req.user.sub)
	}

	@CheckAbilities({ action: WorkspaceAction.Manage, subject: 'Workspace' })
	@Get(':workspace_id')
	async findOne(@Param('workspace_id') workspace_id: string) {
		return this.workspaceService.findOne(workspace_id)
	}

	@Get('/user/:user_id')
	async findManyByUserId(@Req() req, @Param('user_id') _user_id: string) {
		return this.workspaceService.findAllByUserId(req.user.sub)
	}

	@CheckAbilities({ action: WorkspaceAction.Manage, subject: 'Workspace' })
	@Post('/members/add/:workspace_id')
	async addMember(
		@Param('workspace_id') workspace_id: string,
		@Body() data: { email: string; id?: string }
	) {
		return this.workspaceService.addWorkspaceMember(workspace_id, data.email)
	}

	@CheckAbilities({ action: WorkspaceAction.Manage, subject: 'Workspace' })
	@Post('/members/remove/:workspace_id')
	async removeMember(
		@Param('workspace_id') workspace_id: string,
		@Body() data: { email: string; user_id?: string }
	) {
		return this.workspaceService.removeWorkspaceMember(
			workspace_id,
			data.user_id
		)
	}

	@Post('/generate_unique_slug')
	generateUniqueSlug(@Body() data: { name: string; id?: string }) {
		return this.workspaceService.generateUniqueSlugByWorkspaceName(
			data.name,
			data.id
		)
	}

	@CheckAbilities({ action: WorkspaceAction.Manage, subject: 'Workspace' })
	@Get('/slug/:workspace_slug')
	async findOneBySlug(@Param('workspace_slug') workspace_slug: string) {
		return this.workspaceService.findOneBySlug(workspace_slug)
	}

	@CheckAbilities({ action: WorkspaceAction.Manage, subject: 'Page' })
	@Get('/page/slug/:page_slug')
	async findOneByPageSlug(@Param('page_slug') page_slug: string) {
		return this.workspaceService.findOneByPageSlug(page_slug)
	}

	@CheckAbilities({ action: WorkspaceAction.Manage, subject: 'Workspace' })
	@Put(':workspace_id')
	async update(
		@Param('workspace_id') workspace_id: string,
		@Body() updateWorkspaceDto: UpdateWorkspaceDto
	) {
		return this.workspaceService.update(workspace_id, updateWorkspaceDto)
	}

	@CheckAbilities({ action: WorkspaceAction.Manage, subject: 'Workspace' })
	@Delete(':workspace_id')
	async remove(@Param('workspace_id') workspace_id: string) {
		return this.workspaceService.remove(workspace_id)
	}
}
