import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { UpdateInteractionDto } from './dto/update-interaction.dto';
import { InteractionService } from './interaction.service';

@Controller('api/v1/interactions')
export class InteractionController {
	constructor(private readonly interactionService: InteractionService) {}

	@Post()
	create(@Body() createInteractionDto: CreateInteractionDto) {
		return this.interactionService.create(createInteractionDto);
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.interactionService.findOne(id);
	}

	@Get('user/:user_id')
	findAllByUserId(@Param('user_id') user_id: string) {
		return this.interactionService.findAllByUserId(user_id);
	}

	@Get('page/:page_id')
	findAllByPageId(@Param('page_id') page_id: string) {
		return this.interactionService.findAllByPageId(page_id);
	}

	@Get('publication/:publication_id')
	findAllByPublicationId(@Param('publication_id') publication_id: string) {
		return this.interactionService.findAllByPublicationId(publication_id);
	}

	@Get('template/:template_id')
	findAllByTemplateId(@Param('template_id') template_id: string) {
		return this.interactionService.findAllByPublicationId(template_id);
	}

	@Put(':id')
	update(
		@Param('id') id: string,
		@Body() updateInteractionDto: UpdateInteractionDto,
	) {
		return this.interactionService.update(id, updateInteractionDto);
	}
}
