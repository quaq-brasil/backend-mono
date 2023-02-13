import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { BlockService } from '../block/block.service';
import { PublicationController } from './publication.controller';
import { PublicationService } from './publication.service';

@Module({
	controllers: [PublicationController],
	providers: [PublicationService, PrismaService, BlockService],
})
export class PublicationModule {}
