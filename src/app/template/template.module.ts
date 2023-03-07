import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { AbilityFactory } from '../ability/ability.factory'
import { BlockService } from '../block/block.service'
import { VariablesService } from '../variables/variables.service'
import { TemplateController } from './template.controller'
import { TemplateService } from './template.service'

@Module({
	controllers: [TemplateController],
	providers: [
		TemplateService,
		VariablesService,
		PrismaService,
		BlockService,
		AbilityFactory
	]
})
export class TemplateModule {}
