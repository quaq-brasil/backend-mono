import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';

@Injectable()
export class PageService {
  constructor(private prismaService: PrismaService) {}

  async create(createPageDto: CreatePageDto) {
    if (await this.checkIfUrlAlreadyUsed(createPageDto.url)) {
      throw new Error('Url already used');
    }

    return this.prismaService.page.create({
      data: createPageDto,
    });
  }

  findAll() {
    return this.prismaService.page.findMany();
  }

  findOne(id: string) {
    return this.prismaService.page.findUnique({
      where: {
        id,
      },
    });
  }

  findOneByUrl(url: string) {
    return this.prismaService.page.findUnique({
      where: {
        url,
      },
    });
  }

  findAllByWorkspaceId(workspace_id: string) {
    return this.prismaService.page.findMany({
      where: {
        workspace_id,
      },
    });
  }

  async update(id: string, updatePageDto: UpdatePageDto) {
    if (await this.checkIfUrlAlreadyUsed(updatePageDto.url)) {
      throw new Error('Url already used');
    }

    return this.prismaService.page.update({
      where: {
        id,
      },
      data: updatePageDto,
    });
  }

  async remove(id: string) {
    await this.prismaService.page.delete({
      where: {
        id,
      },
    });
  }

  async checkIfUrlAlreadyUsed(url: string) {
    if (!url) return false;

    const page = await this.prismaService.page.findUnique({
      where: {
        url,
      },
    });

    if (page) {
      return true;
    } else {
      return false;
    }
  }
}
