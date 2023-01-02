import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePublicationRequest } from './dto/create-publication-request';
import { UpdatePublicationRequest } from './dto/update-publication-request';

@Injectable()
export class PublicationService {
  constructor(private prismaService: PrismaService) {}

  async createOne(request: CreatePublicationRequest) {
    return this.prismaService.publication.create({
      data: request as any,
    });
  }

  async findOne(id: string) {
    return this.prismaService.publication.findUnique({
      where: {
        id,
      },
    });
  }

  async findManyByTemplateId(template_id: string) {
    return this.prismaService.publication.findMany({
      where: {
        template_id,
      },
    });
  }

  async findManyByPageId(page_id: string) {
    return this.prismaService.publication.findMany({
      where: {
        page_id,
      },
    });
  }

  async updateOne(id: string, request: UpdatePublicationRequest) {
    return this.prismaService.publication.update({
      where: {
        id,
      },
      data: request,
    });
  }
}
