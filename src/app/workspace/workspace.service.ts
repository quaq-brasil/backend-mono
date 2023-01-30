import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';

@Injectable()
export class WorkspaceService {
  constructor(private prismaService: PrismaService) {}

  create(createWorkspaceDto: CreateWorkspaceDto) {
    return this.prismaService.workspace.create({
      data: createWorkspaceDto,
    });
  }

  findOne(id: string) {
    return this.prismaService.workspace.findUnique({
      where: {
        id,
      },
    });
  }

  async findAllByUserId(user_id: string) {
    return await this.prismaService.workspace.findMany({
      where: {
        user_id,
      },
    });
  }

  update(id: string, updateWorkspaceDto: UpdateWorkspaceDto) {
    return this.prismaService.workspace.update({
      where: {
        id,
      },
      data: updateWorkspaceDto,
    });
  }

  remove(id: string) {
    return this.prismaService.workspace.delete({
      where: {
        id,
      },
    });
  }
}
