import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Put,
	UseGuards
} from '@nestjs/common'
import { CheckAbilities } from '../ability/abilities.decorator'
import { WorkspaceAction } from '../ability/ability.enums'
import { JwtGuard } from '../auth/jwt.guard'
import { AbilitiesGuard } from './../ability/abilities.guard'
import { CreatePublicationRequest } from './dto/create-publication-request'
import { UpdatePublicationRequest } from './dto/update-publication-request'
import { PublicationService } from './publication.service'

@Controller('api/v1/publications')
export class PublicationController {
	constructor(private readonly publicationService: PublicationService) {}
	@UseGuards(JwtGuard)
	@Post()
	create(@Body() createPublicationDto: CreatePublicationRequest) {
		return this.publicationService.createOne(createPublicationDto)
	}

	@Get(':publication_id')
	findOne(@Param('publication_id') publication_id: string) {
		return this.publicationService.findOne(publication_id)
	}

	@UseGuards(JwtGuard, AbilitiesGuard)
	@CheckAbilities({ action: WorkspaceAction.Manage, subject: 'Publication' })
	@Put(':publication_id')
	update(
		@Param('publication_id') publication_id: string,
		@Body() updatePublicationDto: UpdatePublicationRequest
	) {
		return this.publicationService.updateOne(
			publication_id,
			updatePublicationDto
		)
	}

	@UseGuards(JwtGuard, AbilitiesGuard)
	@CheckAbilities({ action: WorkspaceAction.Manage, subject: 'Template' })
	@Get('template/:template_id')
	findManyByTemplateId(@Param('template_id') template_id: string) {
		return this.publicationService.findManyByTemplateId(template_id)
	}

	@UseGuards(JwtGuard, AbilitiesGuard)
	@CheckAbilities({ action: WorkspaceAction.Manage, subject: 'Page' })
	@Get('page/:page_id')
	findManyByPageId(@Param('page_id') page_id: string) {
		return this.publicationService.findManyByPageId(page_id)
	}
}
