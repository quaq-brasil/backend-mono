import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { AbilityFactory } from '../ability/ability.factory'
import { WorkspaceController } from './workspace.controller'
import { WorkspaceService } from './workspace.service'

@Module({
	controllers: [WorkspaceController],
	providers: [WorkspaceService, PrismaService, AbilityFactory]
})
export class WorkspaceModule {}
