import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { PermissionsService } from './../permissions/permissions.service'
import { WorkspaceController } from './workspace.controller'
import { WorkspaceService } from './workspace.service'

@Module({
	controllers: [WorkspaceController],
	providers: [WorkspaceService, PrismaService, PermissionsService],
})
export class WorkspaceModule {}
