import { Injectable } from "@nestjs/common"
import { PrismaService } from "src/prisma.service"
import { WorkspaceAction } from "../ability.enums"
import { PayloadUser } from "../ability.factory"

@Injectable()
export class PageSlugVerification {
  constructor(private readonly prismaService: PrismaService) {}

  async verify(user: PayloadUser, page_slug: string, can: any) {
    if (!user || !page_slug) return

    const page = this.prismaService.page.findFirst({
      where: {
        slug: page_slug,
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
