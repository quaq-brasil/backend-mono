import { Module } from "@nestjs/common"
import { PrismaService } from "src/prisma.service"
import { AbilityFactory } from "../ability/ability.factory"
import { AutomationService } from "../block/automation.service"
import { BlockService } from "../block/block.service"
import { TemplateService } from "../template/template.service"
import { VariablesService } from "../variables/variables.service"
import { InteractionController } from "./interaction.controller"
import { InteractionService } from "./interaction.service"

@Module({
  controllers: [InteractionController],
  providers: [
    InteractionService,
    PrismaService,
    BlockService,
    TemplateService,
    VariablesService,
    AbilityFactory,
    AutomationService,
  ],
})
export class InteractionModule {}
