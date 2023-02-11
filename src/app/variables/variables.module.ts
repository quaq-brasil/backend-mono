import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { VariablesController } from './variables.controller';
import { VariablesService } from './variables.service';

@Module({
	controllers: [VariablesController],
	providers: [VariablesService, PrismaService],
})
export class VariablesModule {}
