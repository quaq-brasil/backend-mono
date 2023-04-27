import { Module } from "@nestjs/common"
import { PrismaService } from "src/prisma.service"
import { RaffleController } from "./raffle.controller"
import { RaffleService } from "./raffle.service"

@Module({
  controllers: [RaffleController],
  providers: [RaffleService, PrismaService],
})
export class RaffleModule {}
