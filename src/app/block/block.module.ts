import { Module } from "@nestjs/common"
import { PrismaService } from "src/prisma.service"
import { AutomationService } from "./automation.service"
import { BlockController } from "./block.controller"
import { BlockService } from "./block.service"

@Module({
  controllers: [BlockController],
  providers: [BlockService, PrismaService, AutomationService],
})
export class BlockModule {}
