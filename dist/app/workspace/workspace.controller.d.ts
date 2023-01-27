import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { WorkspaceService } from './workspace.service';
export declare class WorkspaceController {
    private readonly workspaceService;
    constructor(workspaceService: WorkspaceService);
    create(createWorkspaceDto: CreateWorkspaceDto): import(".prisma/client").Prisma.Prisma__WorkspaceClient<import(".prisma/client").Workspace, never>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__WorkspaceClient<import(".prisma/client").Workspace, never>;
    update(id: string, updateWorkspaceDto: UpdateWorkspaceDto): import(".prisma/client").Prisma.Prisma__WorkspaceClient<import(".prisma/client").Workspace, never>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__WorkspaceClient<import(".prisma/client").Workspace, never>;
}
