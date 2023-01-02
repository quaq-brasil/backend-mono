import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateTemplateRequest } from './dto/create-template-request';
import { UpdateTemplateRequest } from './dto/update-template-request';

@Injectable()
export class TemplateService {
  constructor(private prismaService: PrismaService) {}

  async createOne(request: CreateTemplateRequest) {
    return this.prismaService.template.create({
      data: request,
    });
  }

  async findOne(id: string) {
    return this.prismaService.template.findUnique({
      where: {
        id,
      },
    });
  }

  async findOneByUrl(url: string) {
    return this.prismaService.template.findFirst({
      where: {
        url,
      },
    });
  }

  async findManyByPageId(page_id: string) {
    return this.prismaService.template.findMany({
      where: {
        page_id,
      },
    });
  }

  updateOne(id: string, request: UpdateTemplateRequest) {
    return this.prismaService.template.update({
      where: {
        id,
      },
      data: request,
    });
  }

  removeOne(id: string) {
    return this.prismaService.template.delete({
      where: {
        id,
      },
    });
  }
}
