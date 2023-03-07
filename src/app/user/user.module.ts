import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { AbilityFactory } from '../ability/ability.factory'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
	controllers: [UserController],
	providers: [UserService, PrismaService, AbilityFactory]
})
export class UserModule {}
