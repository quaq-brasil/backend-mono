import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import slugify from 'slugify';
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
    let uniqueURL = slugify(request.url);
    let attempts = 0;

    while (await this.isURLTaken(uniqueURL)) {
      attempts++;
      if (attempts >= this.MAX_ATTEMPTS) {
        throw new BadRequestException('Could not generate unique URL');
      }
      uniqueURL = `${uniqueURL}-${attempts}`;
    }

    return this.prismaService.template.create({
      data: { ...request, url: uniqueURL },
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
    if (request?.url) {
      let uniqueURL = slugify(request.url);

      let attempts = 0;

      while (await this.isURLTaken(uniqueURL, id)) {
        attempts++;
        if (attempts >= this.MAX_ATTEMPTS) {
          throw new ConflictException('Could not generate unique URL');
        }
        uniqueURL = `${uniqueURL}-${attempts}`;
      }

      return this.prismaService.template.update({
        where: {
          id,
        },
        data: { ...request, url: uniqueURL },
      });
    }

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

  async isURLTaken(url: string, id?: string) {
    if (id) {
      try {
        const template = await this.prismaService.template.findUnique({
          where: { url },
        });

        if (!template) {
          return false;
        }

        return template.id !== id;
      } catch (error) {
        this.logger.error(`Error checking if URL is taken: ${error.message}`);
        throw new BadRequestException({ message: error.message });
      }
    }

    try {
      return (
        (await this.prismaService.template.findMany({ where: { url } }))
          .length > 0
      );
    } catch (error) {
      this.logger.error(`Error checking if URL is taken: ${error.message}`);
      throw new BadRequestException({ message: error.message });
    }
  }
}
