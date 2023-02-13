import { Controller } from '@nestjs/common';
import { BlockService } from './block.service';

@Controller('api/v1/blocks')
export class BlockController {
	constructor(private readonly blockService: BlockService) {}
}
