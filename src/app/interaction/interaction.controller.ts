import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from "@nestjs/common"
import { CheckAbilities } from "../ability/abilities.decorator"
import { AbilitiesGuard } from "../ability/abilities.guard"
import { WorkspaceAction } from "../ability/ability.enums"
import { JwtGuard } from "../auth/jwt.guard"
import { CreateInteractionDto } from "./dto/create-interaction.dto"
import { UpdateInteractionDto } from "./dto/update-interaction.dto"
import { InteractionService } from "./interaction.service"

@Controller("api/v1/interactions")
export class InteractionController {
  constructor(private readonly interactionService: InteractionService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Req() req, @Body() createInteractionDto: CreateInteractionDto) {
    const token = req?.headers?.authorization

    createInteractionDto.user_id = req.user.sub

    return this.interactionService.create(createInteractionDto, token)
  }

  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities({ action: WorkspaceAction.Manage, subject: "Interaction" })
  @Get(":interaction_id")
  findOne(@Param("interaction_id") interaction_id: string) {
    return this.interactionService.findOne(interaction_id)
  }

  @UseGuards(JwtGuard)
  @Get("user/:user_id")
  findAllByUserId(@Req() req) {
    return this.interactionService.findAllByUserId(req.user.sub)
  }

  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities({ action: WorkspaceAction.Manage, subject: "Page" })
  @Get("page/:page_id")
  findAllByPageId(@Param("page_id") page_id: string) {
    return this.interactionService.findAllByPageId(page_id)
  }

  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities({ action: WorkspaceAction.Manage, subject: "Publications" })
  @Get("publication/:publication_id")
  findAllByPublicationId(@Param("publication_id") publication_id: string) {
    return this.interactionService.findAllByPublicationId(publication_id)
  }

  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities({ action: WorkspaceAction.Manage, subject: "Template" })
  @Get("template/:template_id")
  findAllByTemplateId(@Param("template_id") template_id: string) {
    return this.interactionService.findAllByPublicationId(template_id)
  }

  @Put(":interaction_id")
  update(
    @Req() req,
    @Param("interaction_id") id: string,
    @Body() updateInteractionDto: UpdateInteractionDto
  ) {
    const token = req?.headers?.authorization

    return this.interactionService.update(id, updateInteractionDto, token)
  }
}
