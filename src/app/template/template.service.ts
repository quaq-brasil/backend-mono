import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateTemplateRequest } from './dto/create-template-request';
import { UpdateTemplateRequest } from './dto/update-template-request';

@Injectable()
export class TemplateService {
  private readonly logger = new Logger(TemplateService.name);
  private readonly MAX_ATTEMPTS = 10;
  private instance: TemplateService;

  constructor(private prismaService: PrismaService) {}

  getInstance() {
    if (!this.instance) {
      this.instance = new TemplateService(this.prismaService);
    }
    return this.instance;
  }

  async createOne(request: CreateTemplateRequest) {
    return this.prismaService.template.create({
      data: { ...request },
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

  async updateOne(id: string, request: UpdateTemplateRequest) {
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
