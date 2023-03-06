import { Module } from '@nestjs/common'
import { PrismaService } from './../../prisma.service'
import { PermissionsService } from './permissions.service'

@Module({
	controllers: [],
	providers: [PrismaService, PermissionsService],
})
export class PermissionsModule {}
