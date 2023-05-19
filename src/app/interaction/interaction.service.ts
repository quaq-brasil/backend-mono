import { BadRequestException, Injectable } from "@nestjs/common"
import { PrismaService } from "src/prisma.service"
import { BlockService } from "../block/block.service"
import { TemplateService } from "../template/template.service"
import { CreateInteractionDto } from "./dto/create-interaction.dto"
import { UpdateInteractionDto } from "./dto/update-interaction.dto"

@Injectable()
export class InteractionService {
  constructor(
    private prismaService: PrismaService,
    private blockService: BlockService,
    private templateService: TemplateService
  ) {}

  async create(createInteractionDto: CreateInteractionDto, token?: string) {
    const template = await this.templateService.findOne(
      createInteractionDto.template_id,
      undefined,
      createInteractionDto.user_id,
      createInteractionDto.data,
      token
    )

    const data = await this.blockService.webhookBlockExecution(
      template.Publications[0].blocks.filter(
        (block) => block.type === "webhook"
      ),
      createInteractionDto.data
    )

    if (data) {
      createInteractionDto.data = data
    }

    const interaction = await this.prismaService.interaction.create({
      data: createInteractionDto,
    })

    try {
      template.Publications[0].blocks = template.Publications[0].blocks.filter(
        (block) => block?.type !== "webhook"
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

  async update(
    id: string,
    updateInteractionDto: UpdateInteractionDto,
    token?: string
  ) {
    const template = await this.templateService.findOne(
      updateInteractionDto.template_id,
      undefined,
      updateInteractionDto.user_id,
      updateInteractionDto.data,
      token
    )

    const webhookAlreadyDone = await this.prismaService.interaction.findFirst({
      where: {
        id,
      },
      select: {
        events: true,
      },
    })

    const webhooks = template.Publications[0].blocks.filter(
      (block) =>
        block.type === "webhook" &&
        !webhookAlreadyDone.events.includes(block.id)
    )

    const data = await this.blockService.webhookBlockExecution(
      webhooks,
      updateInteractionDto.data
    )

    if (data) {
      updateInteractionDto.data = data
    }

    await this.prismaService.interaction.update({
      where: {
        id,
      },
      data: {
        ...updateInteractionDto,
        events: [webhooks.map((webhook) => webhook.id)],
      },
    })

    template.Publications[0].blocks = template.Publications[0].blocks.filter(
      (block) => block?.type !== "webhook"
    )

    return this.raffleCreateFunction({ template, data })

    // return template
  }

  raffleCreateFunction({ template, data }: { template: any; data: any }) {
    let isAlreadyParticipating = false
    let participatingData = null

    data.forEach((d) => {
      if (d?.config?.id === "07f82cc5-a513-4065-b48f-6ff426878033") {
        if (d.output.data?.message) {
          isAlreadyParticipating = true
        }
        participatingData = d.output.data
      }
    })

    const newBlocks = template.publication.blocks.map((block) => {
      if (block.id === "2a5f9b6b-c418-4b7d-900e-7089339bfd56") {
        return {
          ...block,
          data: isAlreadyParticipating
            ? `<h3>תודה שנרשמת שוב, כבר רשמנו את ההרשמה הראשונה שלך, המספר שלך להגרלה נשאר אותו הדבר.</h3><p>${participatingData.code}</p>`
            : "<h3>ברוכים הבאים לסירה! נשלח לכם מייל עם המספר המזל שלכם בעוד כמה דקות.</h3>",
        }
      }

      return block
    })

    template.publication.blocks = newBlocks

    return template
  }
}
