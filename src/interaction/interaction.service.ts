import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { UpdateInteractionDto } from './dto/update-interaction.dto';

@Injectable()
export class InteractionService {
  constructor(private prismaService: PrismaService) {}

  create(createInteractionDto: CreateInteractionDto) {
    return this.prismaService.interaction.create({
      data: createInteractionDto,
    });
  }

  findOne(id: string) {
    return this.prismaService.interaction.findUnique({
      where: {
        id: id,
      },
    });
  }

  findAllByUserId(user_id: string) {
    return this.prismaService.interaction.findMany({
      where: {
        user_id: user_id,
      },
    });
  }

  findAllByPageId(page_id: string) {
    return this.prismaService.interaction.findMany({
      where: {
        page_id: page_id,
      },
    });
  }

  findAllByPublicationId(publication_id: string) {
    return this.prismaService.interaction.findMany({
      where: {
        publication_id: publication_id,
      },
    });
  }

  update(id: string, updateInteractionDto: UpdateInteractionDto) {
    return this.prismaService.interaction.update({
      where: {
        id: id,
      },
      data: updateInteractionDto,
    });
  }
}
