import { BadRequestException, Injectable } from "@nestjs/common"
import { PrismaService } from "src/prisma.service"
import { AutomationService } from "../block/automation.service"
import { BlockService } from "../block/block.service"
import { TemplateService } from "../template/template.service"
import { CreateInteractionDto } from "./dto/create-interaction.dto"
import { UpdateInteractionDto } from "./dto/update-interaction.dto"

@Injectable()
export class InteractionService {
  constructor(
    private prismaService: PrismaService,
    private blockService: BlockService,
    private templateService: TemplateService,
    private automationService: AutomationService
  ) {}

  async create(createInteractionDto: CreateInteractionDto) {
    const data = await this.blockService.webhookBlockExecution(
      createInteractionDto.blocks,
      createInteractionDto.data
    )

    if (data) {
      createInteractionDto.data = data
    }

    const interaction = await this.prismaService.interaction.create({
      data: createInteractionDto,
    })

    try {
      const template = await this.templateService.findOne(
        createInteractionDto.template_id,
        undefined,
        createInteractionDto.user_id,
        createInteractionDto.data
      )

      return {
        ...template,
        interaction_id: interaction.id,
      }
    } catch (err) {

      throw new BadRequestException("template does not exists", err)
    }
  }

  findOne(id: string) {
    return this.prismaService.interaction.findUnique({
      where: {
        id: id,
      },
      include: {
        Publication: {
          select: {
            dependencies: true,
          },
        },
        Template: {
          select: {
            id: true,
            title: true,
            slug: true,
            shortcut_image: true,
          },
        },
        User: {
          select: {
            id: true,
            avatar_url: true,
            name: true,
          },
        },
        Page: {
          select: {
            id: true,
            slug: true,
            title: true,
            avatar_url: true,
            background_url: true,
          },
        },
      },
    })
  }

  findAllByUserId(user_id: string) {
    return this.prismaService.interaction.findMany({
      where: {
        user_id: user_id,
      },
    })
  }

  findAllByPageId(page_id: string) {
    return this.prismaService.interaction.findMany({
      where: {
        page_id: page_id,
      },
    })
  }

  findAllByPublicationId(publication_id: string) {
    return this.prismaService.interaction.findMany({
      where: {
        publication_id: publication_id,
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar_url: true,
            email_verified: true,
            type: true,
          },
        },
      },
    })
  }

  findAllByTemplateId(template_id: string) {
    return this.prismaService.interaction.findMany({
      where: {
        template_id: template_id,
      },
    })
  }

  async update(id: string, updateInteractionDto: UpdateInteractionDto) {
    let executeWebhook = false

    if (updateInteractionDto?.data) {
      updateInteractionDto.data.forEach((dataBlock) => {
        if (dataBlock.config === "button") {
          if (dataBlock.output.data.clicked) {
            executeWebhook = true
          }
        }
      })
    }

    if (executeWebhook) {
      const data = await this.blockService.webhookBlockExecution(
        updateInteractionDto.blocks,
        updateInteractionDto.data
      )

      if (data) {
        updateInteractionDto.data = data
      }
    }

    await this.prismaService.interaction.update({
      where: {
        id: id,
      },
      data: updateInteractionDto,
    })

    return await this.templateService.findOne(
      updateInteractionDto.template_id,
      undefined,
      updateInteractionDto.user_id,
      updateInteractionDto.data
    )
  }
}
