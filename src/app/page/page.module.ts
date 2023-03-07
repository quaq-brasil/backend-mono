import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { AbilityFactory } from '../ability/ability.factory'
import { PageController } from './page.controller'
import { PageService } from './page.service'

@Module({
	controllers: [PageController],
	providers: [PageService, PrismaService, AbilityFactory]
})
export class PageModule {}
