import { Body, Controller, Delete, Param, Post, Put } from "@nestjs/common"
import { CreateInteractionEntrypointDto } from "./dto/create-entrypoint-interaction.dto"
import { CreateEntrypointDto } from "./dto/create-entrypoint.dto"
import { UpdateInteractionEntrypointDto } from "./dto/update-entrypoint-interaction.dto"
import { UpdateEntrypointDto } from "./dto/update-entrypoint.dto"
import { EntrypointService } from "./entrypoint.service"

@Controller("api/v1/entrypoint")
export class EntrypointController {
  constructor(private readonly entrypointService: EntrypointService) {}

  @Post()
  create(@Body() createEntrypointDto: CreateEntrypointDto) {
    return this.entrypointService.create(createEntrypointDto)
  }

  @Put(":id")
  update(
    @Param("id") id: string,
    @Body() updateEntrypointDto: UpdateEntrypointDto
  ) {
    return this.entrypointService.update(id, updateEntrypointDto)
  }

  @Delete(":id/:slug/:secret")
  remove(
    @Param("slug") slug: string,
    @Param("id") id: string,
    @Param("secret") secret: string
  ) {
    return this.entrypointService.remove(id, slug, secret)
  }

  @Post("interaction/:slug")
  createInteraction(
    @Param("slug") slug: string,
    @Body() interaction: CreateInteractionEntrypointDto
  ) {
    return this.entrypointService.createInteraction(slug, interaction)
  }

  @Put("interaction/:slug/:interaction_id")
  updateInteraction(
    @Param("slug") slug: string,
    @Param("interaction_id") interaction_id: string,
    @Body() interaction: UpdateInteractionEntrypointDto
  ) {
    return this.entrypointService.updateInteraction(
      slug,
      interaction_id,
      interaction
    )
  }

  @Delete("interaction/:id/:slug/:secret")
  removeInteraction(
    @Param("slug") slug: string,
    @Param("id") id: string,
    @Param("secret") secret: string
  ) {
    return this.entrypointService.removeInteraction(slug, id, secret)
  }
}
