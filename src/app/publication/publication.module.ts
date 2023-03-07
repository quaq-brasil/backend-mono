import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { AbilityFactory } from '../ability/ability.factory'
import { BlockService } from '../block/block.service'
import { VariablesService } from '../variables/variables.service'
import { PublicationController } from './publication.controller'
import { PublicationService } from './publication.service'

@Module({
	controllers: [PublicationController],
	providers: [
		PublicationService,
		PrismaService,
		BlockService,
		VariablesService,
		AbilityFactory
	]
})
export class PublicationModule {}
