import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { BlockService } from '../block/block.service';
import { InteractionController } from './interaction.controller';
import { InteractionService } from './interaction.service';

@Module({
	controllers: [InteractionController],
	providers: [InteractionService, PrismaService, BlockService],
})
export class InteractionModule {}
