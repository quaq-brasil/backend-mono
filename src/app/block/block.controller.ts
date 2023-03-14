import { Body, Controller, Post } from "@nestjs/common"
import { AutomationService } from "./automation.service"

@Controller("api/v1/blocks")
export class BlockController {
  constructor(private readonly automationService: AutomationService) {}

  @Post()
  create(@Body() data: any) {
    return this.automationService.automationBlockExecution(data)
  }
}
