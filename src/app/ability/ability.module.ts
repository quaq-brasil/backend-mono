import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { AbilityFactory } from './ability.factory'

@Module({
	providers: [PrismaService, AbilityFactory]
})
export class AbilityModule {}
