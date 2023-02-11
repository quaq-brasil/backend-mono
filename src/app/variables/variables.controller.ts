import { Body, Controller, Post } from '@nestjs/common';
import { VariablesService } from './variables.service';

@Controller('api/v1/variables')
export class VariablesController {
	constructor(private readonly variablesService: VariablesService) {}

	@Post()
	create(
		@Body()
		data: {
			creator_id: string;
			blocks?: any[];
			template_id?: string;
			connected_templates?: string[];
		},
	) {
		return this.variablesService.findPanelVariables(
			data.creator_id,
			data.blocks,
			data.template_id,
			data.connected_templates,
		);
	}
}
