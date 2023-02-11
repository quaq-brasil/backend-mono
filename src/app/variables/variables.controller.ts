import { Controller } from '@nestjs/common';
import { VariablesService } from './variables.service';

@Controller('api/v1/variables')
export class VariablesController {
	constructor(private readonly blockService: VariablesService) {}
}
