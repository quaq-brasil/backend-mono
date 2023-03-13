import { BadRequestException, Injectable } from "@nestjs/common"
import { PrismaService } from "src/prisma.service"
import { CreateInteractionEntrypointDto } from "./dto/create-entrypoint-interaction.dto"
import { CreateEntrypointDto } from "./dto/create-entrypoint.dto"
import { UpdateInteractionEntrypointDto } from "./dto/update-entrypoint-interaction.dto"
import { UpdateEntrypointDto } from "./dto/update-entrypoint.dto"

@Injectable()
export class EntrypointService {
  constructor(private prismaService: PrismaService) {}

  async create(createEntrypointDto: CreateEntrypointDto) {
    const publicationId = createEntrypointDto.publication_id

    delete createEntrypointDto.publication_id

    const entrypoint = await this.prismaService.entrypoint.create({
      data: {
        ...createEntrypointDto,
      },
    })

    await this.prismaService.entrypointToPublication.create({
      data: {
        entrypoint_id: entrypoint.id,
        publication_id: publicationId,
      },
    })

    return entrypoint
  }

  async update(id: string, updateEntrypointDto: UpdateEntrypointDto) {
    return await this.prismaService.entrypoint.update({
      where: {
        id,
      },
      data: {
        ...updateEntrypointDto,
      },
    })
  }

  async remove(id: string, slug: string, secret: string) {
    const entrypoint = await this.prismaService.entrypoint.findFirst({
      where: {
        id,
        slug,
        secret,
      },
    })

    if (!entrypoint) {
      throw new BadRequestException("entrypoint not found or secret invalid!")
    }

    return await this.prismaService.entrypoint.delete({
      where: {
        id: entrypoint.id,
      },
    })
  }

  async createInteraction(
    slug: string,
    interaction: CreateInteractionEntrypointDto
  ) {
    const entrypoint = await this.prismaService.entrypoint.findFirst({
      where: {
        slug,
        secret: interaction.secret,
      },
      include: {
        EntrypointToPublication: {
          include: {
            publication: true,
          },
        },
      },
    })

    if (!entrypoint) {
      throw new BadRequestException("entrypoint not found or secret invalid!")
    }

    return await this.prismaService.interaction.create({
      data: {
        blocks: entrypoint.EntrypointToPublication[0].publication.blocks,
        page_id: entrypoint.EntrypointToPublication[0].publication.page_id,
        publication_id: entrypoint.EntrypointToPublication[0].publication_id,
        template_id:
          entrypoint.EntrypointToPublication[0].publication.template_id,
        events: [],
        external: true,
        date_of_consensus: interaction.date_of_consensus,
        user_id: interaction.user_id || "",
        data: interaction.data,
      },
    })
  }

  async updateInteraction(
    slug: string,
    interaction_id: string,
    interaction: UpdateInteractionEntrypointDto
  ) {
    const entrypoint = await this.prismaService.entrypoint.findFirst({
      where: {
        slug,
        secret: interaction.secret,
      },
      include: {
        EntrypointToPublication: {
          include: {
            publication: true,
          },
        },
      },
    })

    if (!entrypoint) {
      throw new BadRequestException("entrypoint not found or secret invalid!")
    }

    return await this.prismaService.interaction.update({
      where: {
        id: interaction_id,
      },
      data: {
        blocks: entrypoint.EntrypointToPublication[0].publication.blocks,
        page_id: entrypoint.EntrypointToPublication[0].publication.page_id,
        publication_id: entrypoint.EntrypointToPublication[0].publication_id,
        template_id:
          entrypoint.EntrypointToPublication[0].publication.template_id,
        events: [],
        user_id: interaction.user_id || "",
        data: interaction.data,
      },
    })
  }

  async removeInteraction(slug: string, id: string, secret: string) {
    const entrypoint = await this.prismaService.entrypoint.findFirst({
      where: {
        slug,
        secret,
      },
      include: {
        EntrypointToPublication: {
          include: {
            publication: true,
          },
        },
      },
    })

    if (!entrypoint) {
      throw new BadRequestException("entrypoint not found or secret invalid!")
    }

    return await this.prismaService.interaction.delete({
      where: {
        id,
      },
    })
  }
}
