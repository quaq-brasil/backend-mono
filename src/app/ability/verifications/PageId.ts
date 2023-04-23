import { Injectable } from "@nestjs/common"
import { PrismaService } from "src/prisma.service"
import { WorkspaceAction } from "../ability.enums"
import { PayloadUser } from "../ability.factory"

@Injectable()
export class PageIdVerification {
  constructor(private readonly prismaService: PrismaService) {}

  async verify(user: PayloadUser, page_id: string, can: any) {
    if (!user || !page_id) return

    const page = this.prismaService.page.findFirst({
      where: {
        id: page_id,
        Workspace: {
          members: {
            some: {
              user_id: user.sub,
            },
          },
        },
      },
    })

    if (page) {
      can(WorkspaceAction.Manage, "Page")
    }
  }
}
