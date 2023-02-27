import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PrismaService } from 'src/prisma.service'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategyService } from './jwt-strategy/jwt.strategy.service'

@Module({
	imports: [
		ConfigModule,
		JwtModule.register({
			secret: process.env.SECRET,
			signOptions: {
				expiresIn: process.env.EXPIRES_IN,
			},
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, PrismaService, JwtStrategyService],
})
export class AuthModule {}
