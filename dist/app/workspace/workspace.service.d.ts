import { PrismaService } from 'src/prisma.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
export declare class WorkspaceService {
    private prismaService;
    constructor(prismaService: PrismaService);
    create(createWorkspaceDto: CreateWorkspaceDto): import(".prisma/client").Prisma.Prisma__WorkspaceClient<import(".prisma/client").Workspace, never>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__WorkspaceClient<import(".prisma/client").Workspace, never>;
    update(id: string, updateWorkspaceDto: UpdateWorkspaceDto): import(".prisma/client").Prisma.Prisma__WorkspaceClient<import(".prisma/client").Workspace, never>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__WorkspaceClient<import(".prisma/client").Workspace, never>;
}
