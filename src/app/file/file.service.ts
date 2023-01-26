import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';

@Injectable()
export class FileService {
  constructor(private prismaService: PrismaService) {}

  createOne(request: CreateFileDto) {
    return this.prismaService.file.create({
      data: request,
    });
  }

  findOne(id: string) {
    return this.prismaService.file.findUnique({
      where: {
        id,
      },
    });
  }

  findOneByUrl(url: string) {
    return this.prismaService.file.findMany({
      where: {
        url,
      },
    });
  }

  updateOne(id: string, request: UpdateFileDto) {
    return this.prismaService.file.update({
      where: {
        id,
      },
      data: request,
    });
  }

  deleteOne(id: string) {
    return this.prismaService.file.delete({
      where: {
        id,
      },
    });
  }
}
