import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common"
import { Template } from "@prisma/client"
import { createHash, randomUUID } from "crypto"

import { PrismaService } from "src/prisma.service"
import { AutomationService } from "../block/automation.service"
import { BlockService } from "../block/block.service"
import { VariablesService } from "../variables/variables.service"
import { CreateTemplateRequest } from "./dto/create-template-request"
import { UpdateTemplateRequest } from "./dto/update-template-request"
// eslint-disable-next-line @typescript-eslint/no-var-requires
const getSlug = require("speakingurl")
// eslint-disable-next-line @typescript-eslint/no-var-requires
const uniqueSlug = require("unique-slug")

@Injectable()
export class TemplateService {
  private readonly logger = new Logger(TemplateService.name)
  private readonly MAX_ATTEMPTS = 10
  private readonly RESERVED_TEMPLATE_SLUGS = []

  constructor(
    private prismaService: PrismaService,
    private blockService: BlockService,
    private variablesService: VariablesService,
    private automationService: AutomationService
  ) {}

  async createOne(request: CreateTemplateRequest) {
    if (request.slug && request.page_id) {
      request.slug = await this.generateUniqueSlugByTemplateTitle(
        request.slug,
        request.page_id
      )
    }

    return this.prismaService.template.create({
      data: { ...request },
    })
  }

  async findOne(
    id: string,
    headers: any,
    consumer_id?: string,
    data?: any[],
    token?: string
  ) {
    const include: any = {
      Publications: true,
      Page: true,
    }

    if (headers && headers.request === "logs") {
      include.Publications = {
        orderBy: {
          updated_at: "desc",
        },
        include: {
          Interaction: {
            orderBy: {
              updated_at: "desc",
            },
            select: {
              id: true,
              updated_at: true,
              User: {
                select: {
                  avatar_url: true,
                  name: true,
                },
              },
            },
          },
        },
      }
    }

    const template: any = await this.prismaService.template.findUnique({
      where: {
        id,
      },
      include: include,
    })

    if (template?.visibility === "workspace") {
      await this.handleVisibilityAccess(template.id, token)
    }

    if (template) {
      const publication =
        template.Publications[template?.Publications?.length - 1] || ({} as any)

      const formattedTemplate = {
        ...template,
        publication,
      }

      const variables = await this.variablesService.findPanelVariables(
        undefined,
        formattedTemplate.publication.blocks,
        formattedTemplate.id,
        formattedTemplate.publication?.dependencies?.connected_templates || [],
        consumer_id,
        data
      )

      formattedTemplate.publication.blocks = this.blockService.compileVariables(
        formattedTemplate.publication.blocks,
        variables
      )

      let newBlocks = []

      formattedTemplate.publication.blocks.forEach((block) => {
        if (block?.type === "automation") {
          const automationBlocks =
            this.automationService.automationBlockExecution({
              data: {
                blocks: block.data.automationBlocks,
                conditionals: block.data.conditionals,
              },
            })

          if (automationBlocks && automationBlocks.length > 0) {
            newBlocks = [...newBlocks, ...automationBlocks]
          }
        } else {
          newBlocks.push(block)
        }
      })

      formattedTemplate.publication.blocks = newBlocks

      return formattedTemplate
    }

    throw new NotFoundException({ message: "template not found" })
  }

  async findManyByPageId(page_id: string) {
    return await this.prismaService.template.findMany({
      where: {
        page_id,
      },
    })
  }

  async findOneByPageAndTemplateSlug(
    slug: string,
    page_slug: string,
    consumer_id?: string,
    token?: string,
    compilation?: string
  ) {
    const templates = await this.prismaService.template.findMany({
      where: {
        slug,
      },
      include: {
        Page: true,
        Publications: true,
      },
    })

    let template = undefined

    const newTemplates = templates.filter(
      (template) => template.Page.slug === page_slug
    )

    template = newTemplates[0]

    if (template) {
      if (template?.visibility === "workspace") {
        await this.handleVisibilityAccess(template.id, token)
      }

      const publication =
        template.Publications[template?.Publications?.length - 1] || ({} as any)

      const formattedTemplate = {
        ...template,
        publication,
      }

      if (compilation && compilation !== "false") {
        const variables = await this.variablesService.findPanelVariables(
          undefined,
          formattedTemplate.publication.blocks,
          formattedTemplate.id,
          formattedTemplate.publication?.dependencies?.connected_templates ||
            [],
          consumer_id
        )

        formattedTemplate.publication.blocks =
          this.blockService.compileVariables(
            formattedTemplate.publication.blocks,
            variables
          )
      }

      return formattedTemplate
    }

    throw new NotFoundException({ message: "template not found" })
  }

  async updateOne(id: string, request: UpdateTemplateRequest) {
    if (request.slug && request.page_id) {
      request.slug = await this.generateUniqueSlugByTemplateTitle(
        request.slug,
        request.page_id,
        id
      )
    }

    return this.prismaService.template.update({
      where: {
        id,
      },
      data: request,
    })
  }

  async removeOne(id: string) {
    let template: Template
    try {
      template = await this.prismaService.template.findUniqueOrThrow({
        where: {
          id,
        },
      })
    } catch (err) {
      throw new NotFoundException({ message: "template not found" })
    }

    if (template && !template.deleted) {
      try {
        const hashTitle = createHash("sha256")
          .update(template.title)
          .digest("hex")
        const hashSlug = randomUUID()
        const hashShortcutImage = createHash("sha256")
          .update(template.shortcut_image)
          .digest("hex")
        const hashShortcutSize = createHash("sha256")
          .update(template.shortcut_size)
          .digest("hex")
        const hashTrackers = createHash("sha256")
          .update(JSON.stringify(template.trackers))
          .digest("hex")
        const hashNumberOfNewInteractions =
          (template.number_of_new_interactions + 2) * 164
        const hashPageId = createHash("sha256")
          .update(JSON.stringify(template.page_id))
          .digest("hex")
        const hashCurrentPublicationId = createHash("sha256")
          .update(template.current_publication_id)
          .digest("hex")

        await this.prismaService.template.update({
          where: {
            id,
          },
          data: {
            title: hashTitle,
            slug: hashSlug,
            shortcut_image: hashShortcutImage,
            shortcut_size: hashShortcutSize,
            trackers: { hash: hashTrackers },
            number_of_new_interactions: hashNumberOfNewInteractions,
            page_id: hashPageId,
            current_publication_id: hashCurrentPublicationId,
            deleted: true,
          },
        })
        return { message: "deleted template" }
      } catch (err) {
        throw new InternalServerErrorException({
          message: `error deleting template, ${err}`,
        })
      }
    }

    throw new NotFoundException({ message: "template not found" })
  }

  async generateUniqueSlugByTemplateTitle(
    title: string,
    page_id: string,
    id?: string
  ) {
    const slug = getSlug(title)

    let uniqSlug = slug

    let attempts = 0

    while (await this.isSlugTaken(uniqSlug, page_id, id)) {
      attempts++
      if (attempts >= this.MAX_ATTEMPTS) {
        throw new BadRequestException("Could not generate unique Slug")
      }

      const randomSlug: string = uniqueSlug()
      uniqSlug = `${slug}-${randomSlug.slice(0, 3)}`
    }

    return uniqSlug
  }

  async isSlugTaken(slug: string, page_id: string, id?: string) {
    if (this.RESERVED_TEMPLATE_SLUGS.includes(slug)) {
      return true
    }

    if (id) {
      try {
        const templates = await this.prismaService.template.findMany({
          where: { page_id },
        })

        if (!templates) {
          return false
        }

        templates.forEach((template) => {
          if (template.slug === slug && template.id !== id) {
            return true
          }
        })

        return false
      } catch (error) {
        this.logger.error(`Error checking if Slug is taken: ${error.message}`)
        throw new BadRequestException({ message: error.message })
      }
    }

    try {
      const templates = await this.prismaService.template.findMany({
        where: { page_id },
      })

      templates.forEach((template) => {
        if (template.slug === slug) {
          return true
        }
      })

      return false
    } catch (error) {
      this.logger.error(`Error checking if Slug is taken: ${error.message}`)
      throw new BadRequestException({ message: error.message })
    }
  }

  async handleVisibilityAccess(id: string, token: string) {
    if (!token) {
      throw new ForbiddenException("permission insufficiently")
    }
    const user = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString("utf8")
    )

    const template = await this.prismaService.template.findUnique({
      where: {
        id,
      },
      select: {
        Page: {
          select: {
            Workspace: {
              select: {
                members: {
                  select: {
                    user: {
                      select: {
                        id: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })

    const memberFound = template.Page.Workspace.members.filter(
      (member) => member.user.id === user.sub
    )

    if (!memberFound || memberFound.length < 1) {
      throw new ForbiddenException("permission insufficiently")
    }
  }
}
