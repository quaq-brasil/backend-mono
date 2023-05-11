import { Injectable } from "@nestjs/common"
import { PrismaService } from "src/prisma.service"

@Injectable()
export class VariablesService {
  constructor(private readonly prismaService: PrismaService) {}

  EVENT_PROPERTIES = {
    text: {
      displayed_at: "string",
    },
    image: {
      displayed_at: "string",
    },
    chart: {
      displayed_at: "string",
    },
    textentry: {
      displayed_at: "string",
      last_interaction_at: "string",
      first_interaction_at: "string",
    },
    pool: {
      displayed_at: "string",
      last_interaction_at: "string",
      first_interaction_at: "string",
      maxAchievedAt: "string",
      minAchievedAt: "string",
    },
    poll: {
      displayed_at: "string",
      last_interaction_at: "string",
      first_interaction_at: "string",
      maxAchievedAt: "string",
      minAchievedAt: "string",
    },
    button: {
      displayed_at: "string",
      last_interaction_at: "string",
      first_interaction_at: "string",
    },
    review: {
      displayed_at: "string",
      last_interaction_at: "string",
      first_interaction_at: "string",
    },
    automation: {
      displayed_at: "string",
      last_execution_at: "string",
      first_execution_at: "string",
      has_stop_been_reached: "string",
    },
    webhook: {
      displayed_at: "string",
      last_execution_at: "string",
      first_execution_at: "string",
      response_received_at: "string",
      request_sent_at: "string",
    },
    embed: {
      displayed_at: "string",
    },
    redirect: {
      displayed_at: "string",
      redirected_at: "string",
    },
    toggle: {
      displayed_at: "string",
      last_interaction_at: "string",
      first_interaction_at: "string",
    },
    dropdownmenu: {
      displayed_at: "string",
      last_interaction_at: "string",
      first_interaction_at: "string",
    },
    whatsapp: {
      phone_number: "string",
      data: "string",
    },
  }

  async findPanelVariables(
    creator_id: string,
    blocks?: any[],
    template_id?: string,
    connectedTemplates?: string[],
    consumer_id?: string,
    data?: any[]
  ) {
    const variables: any = {
      consumer: {},
      events: {},
      blocks: {},
      publications: {},
    }

    await this.findAllVariablesAvailable(
      creator_id,
      variables,
      blocks,
      template_id,
      consumer_id,
      data
    )

    await this.formatConnectedTemplates(variables, connectedTemplates)

    return variables
  }

  async findAllVariablesAvailable(
    creator_id: string,
    variables: any,
    blocks?: any[],
    template_id?: string,
    consumer_id?: string,
    data?: any[]
  ) {
    if (creator_id) {
      await this.formatCreator(creator_id, variables)
    }

    this.formatConsumer(variables, consumer_id)
    this.formatEvents(variables)

    if (blocks && blocks.length > 0) {
      await this.formaBlocks(blocks, variables, data)
    }

    if (template_id) {
      await this.formatPublications(template_id, variables)
    }
  }

  async formatCreator(creator_id: string, variables: any) {
    try {
      const creator = await this.prismaService.user.findUnique({
        where: {
          id: creator_id,
        },
      })

      variables.creator = {
        id: creator.id || "string",
        name: creator.name || "string",
        email: creator.email || "string",
        profile_picture: creator.avatar_url || "string",
      }
    } catch (error) {
      console.warn(error)
    }
  }

  async formatConsumer(variables: any, consumer_id?: string) {
    if (consumer_id) {
      try {
        const consumer = await this.prismaService.user.findUnique({
          where: {
            id: consumer_id,
          },
        })

        variables.consumer = {
          id: consumer.id || "string",
          name: consumer.name || "string",
          email: consumer.email || "string",
          profile_picture: consumer.avatar_url || "string",
          registration_status: consumer.type || "string",
        }
      } catch (error) {
        console.warn(error)
      }
    }

    variables.consumer = {
      id: "string",
      name: "string",
      email: "string",
      profile_picture: "string",
      registration_status: "string",
    }
  }

  async formatEvents(variables: any) {
    variables.events = {}
  }

  async formaBlocks(blocks: any[], variables: any, data?: any[]) {
    variables.blocks = {}

    let allBlocks = [...blocks]

    blocks.forEach((block) => {
      if (block.type === "automation") {
        allBlocks = [...allBlocks, ...block.data.automationBlocks]
      }
    })

    allBlocks.forEach((block) => {
      const currentData = data
        ? data.filter((cData) => cData.id === block.id)
        : undefined

      const newBlocks = {
        config: {
          id: block.id,
          type: block.type,
          title: block.save_as,
          content: block.data,
        },
        data: {},
        events: {},
      }

      if (!currentData || currentData?.length < 1) {
        this.formatBlockData(block, newBlocks)
        this.formatBlockEvents(block, newBlocks)
      } else {
        newBlocks.data = currentData[0]?.output?.data
        newBlocks.events = currentData[0]?.output?.events
      }

      variables.blocks[block.save_as] = newBlocks
    })
  }

  async formatBlockData(block: any, variables: any) {
    switch (block.type) {
      case "textentry":
        variables.data = {
          value: "string",
        }
        break
      case "poll":
        variables.data = {
          selected_options: "string list",
          number_of_selections: "number",
        }
        break

      case "dropdownmenu":
        variables.data = {
          selected_option: "string",
        }
        break

      case "button":
        variables.data = {
          clicked: "boolean",
        }
        break

      case "review":
        variables.data = {
          review: "number",
        }
        break

      case "webhook":
        variables.data = {
          header: "string",
          body: "string",
        }
        break
      case "embed":
        variables.data = {
          link: "string",
        }
        break
      case "redirect":
        variables.data = {
          description: "string",
          link: "string",
          type: "string",
          image: "string",
        }
        break
      case "toggle":
        variables.data = {
          description: "string",
          off_label: "string",
          on_label: "string",
        }
        break
      case "whatsapp":
        variables.data = {
          phone_number: "string",
          data: "string",
        }
        break

      default:
        variables.data = {}
        break
    }
  }

  async formatBlockEvents(block: any, blockData: any) {
    const eventType = this.EVENT_PROPERTIES[block.type] || {}
    blockData.events = { ...eventType }
  }

  async formatPublications(template_id: string, variables: any) {
    try {
      const template = await this.prismaService.template.findUnique({
        where: {
          id: template_id,
        },
        include: {
          Publications: true,
          Interactions: true,
        },
      })

      const publications = {}

      template.Publications.forEach((publication) => {
        const interactions = template.Interactions.filter(
          (interaction) => interaction.publication_id === publication.id
        )

        const newInteractions = interactions.map((interaction) => {
          return {
            consumer: {
              id: interaction.user_id,
            },
            events: interaction.events,
            locations: interaction.locations,
            data: interaction.data,
          }
        })

        publications[publication.title] = newInteractions
      })

      variables.publications = publications
    } catch (error) {
      console.warn(error)
    }
  }

  async formatConnectedTemplates(variables: any, connectedTemplates: string[]) {
    if (connectedTemplates && connectedTemplates.length > 0) {
      try {
        await Promise.all(
          connectedTemplates.map(async (id) => {
            variables.connected_templates = {}
            variables.connected_templates[id] = {}

            await this.findAllVariablesAvailable(
              undefined,
              variables.connected_templates[id],
              undefined,
              id
            )
          })
        )
      } catch (error) {
        console.warn(error)
      }
    }
  }
}
