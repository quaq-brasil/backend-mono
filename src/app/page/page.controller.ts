import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from "@nestjs/common"

import { User } from "@prisma/client"
import { GetUser } from "src/decorators/user.decorator"
import { CheckAbilities } from "../ability/abilities.decorator"
import { WorkspaceAction } from "../ability/ability.enums"
import { JwtGuard } from "../auth/jwt.guard"
import { AbilitiesGuard } from "./../ability/abilities.guard"
import { CreatePageDto } from "./dto/create-page.dto"
import { UpdatePageDto } from "./dto/update-page.dto"
import { PageService } from "./page.service"

@Controller("api/v1/pages")
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createPageDto: CreatePageDto) {
    return this.pageService.create(createPageDto)
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll() {
    return this.pageService.findAll()
  }

  @Get(":page_id")
  async findOne(@Req() req, @Param("page_id") page_id: string) {
    const token = req?.headers?.authorization

    return await this.pageService.findOne(page_id, token)
  }

  @Get("slug/:page_slug")
  findOneBySlug(@Req() req, @Param("page_slug") page_slug: string) {
    const token = req?.headers?.authorization

    return this.pageService.findOneBySlug(page_slug, token)
  }

  @UseGuards(JwtGuard)
  @Get("workspace/:workspace_id")
  findAllByWorkspaceId(
    @Param("workspace_id") workspace_id: string,
    @GetUser() user: User
  ) {
    return this.pageService.findAllByWorkspaceId(workspace_id, user)
  }

  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities({ action: WorkspaceAction.Manage, subject: "Page" })
  @Put(":page_id")
  update(
    @Param("page_id") page_id: string,

    @Body() updatePageDto: UpdatePageDto
  ) {
    return this.pageService.update(page_id, updatePageDto)
  }

  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities({ action: WorkspaceAction.Manage, subject: "Page" })
  @Delete(":page_id")
  remove(@Param("page_id") page_id: string) {
    return this.pageService.delete(page_id)
  }

  @Post("generate_unique_slug")
  generateUniqueSlugByPageName(@Body() data: { name: string; id?: string }) {
    return this.pageService.generateUniqueSlugByPageName(data.name, data.id)
  }
}
