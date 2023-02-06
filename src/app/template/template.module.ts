import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PublicationService } from '../publication/publication.service';
import { TemplateController } from './template.controller';
import { TemplateService } from './template.service';

@Module({
	controllers: [TemplateController],
	providers: [TemplateService, PrismaService, PublicationService],
})
export class TemplateModule {}
