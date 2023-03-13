import { Module } from "@nestjs/common"
import { PrismaService } from "./../../prisma.service"
import { EntrypointController } from "./entrypoint.controller"
import { EntrypointService } from "./entrypoint.service"

@Module({
  controllers: [EntrypointController],
  providers: [EntrypointService, PrismaService],
})
export class EntrypointModule {}
