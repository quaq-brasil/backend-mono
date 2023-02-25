import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PrismaService } from 'src/prisma.service'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
	imports: [
		JwtModule.register({
			secret: '123456',
			signOptions: {
				expiresIn: '60s',
			},
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, PrismaService],
})
export class AuthModule {}
