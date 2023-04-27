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

    // console.log("template", template.publication.blocks)

    console.log("data", data[1])

    if (template.publication.blocks[1]) {
      function substituirNome(array, name) {
        array.forEach(function (elemento) {
          if (elemento.data && elemento.data.text === "sortear") {
            // Não faz nada quando encontra o botão "sortear"
          } else if (elemento.data && elemento.data.text) {
            // Se o elemento tem um campo "data.text", não é um texto formatado e não precisa ser processado
          } else if (elemento.data) {
            // Se o elemento tem um campo "data", é um texto formatado e precisa ser processado
            const novoTexto = elemento.data.replace(
              "{{blocks.webhook.data.output.data.name}}",
              name
            )

            // const newText = novoTexto.data.replace(
            //   "{{blocks.webhook.data.output.data.email}}",
            //   email
            // )
            elemento.data = novoTexto
          }
        })

        return array
      }

      function substituirEmail(array, name) {
        array.forEach(function (elemento) {
          if (elemento.data && elemento.data.text === "sortear") {
            // Não faz nada quando encontra o botão "sortear"
          } else if (elemento.data && elemento.data.text) {
            // Se o elemento tem um campo "data.text", não é um texto formatado e não precisa ser processado
          } else if (elemento.data) {
            // Se o elemento tem um campo "data", é um texto formatado e precisa ser processado
            const novoTexto = elemento.data.replace(
              "{{blocks.webhook.data.output.data.email}}",
              name
            )

            // const newText = novoTexto.data.replace(
            //   "{{blocks.webhook.data.output.data.email}}",
            //   email
            // )
            elemento.data = novoTexto
          }
        })

        return array
      }

      substituirNome(template.publication.blocks, data[1].output.data.name)
      substituirEmail(template.publication.blocks, data[1].output.data.email)
    }

    return template
  }
}
