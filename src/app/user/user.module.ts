import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { JwtModule } from "@nestjs/jwt"
import { PrismaService } from "src/prisma.service"
import { AbilityFactory } from "../ability/ability.factory"
import { JwtStrategyService } from "../auth/jwt-strategy/jwt.strategy.service"
import { UserController } from "./user.controller"
import { UserService } from "./user.service"

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
  controllers: [UserController],
  providers: [UserService, PrismaService, AbilityFactory, JwtStrategyService],
})
export class UserModule {}
