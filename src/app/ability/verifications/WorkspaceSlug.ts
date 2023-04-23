import { Injectable } from "@nestjs/common"
import { PrismaService } from "src/prisma.service"
import { WorkspaceAction } from "../ability.enums"
import { PayloadUser } from "../ability.factory"

@Injectable()
export class WorkspaceSlugVerification {
  constructor(private readonly prismaService: PrismaService) {}

  async verify(user: PayloadUser, workspace_slug: string, can: any) {
    if (!user || !workspace_slug) return

    const workspace = await this.prismaService.workspaceToUser.findFirst({
      where: {
        user_id: user.sub,
        workspace: {
          slug: workspace_slug,
        },
      },
    })

    if (workspace) {
      can(WorkspaceAction.Manage, "Workspace")
    }
  }
}
