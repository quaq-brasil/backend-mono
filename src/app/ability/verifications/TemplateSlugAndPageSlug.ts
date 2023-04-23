import { Injectable } from "@nestjs/common"
import { PrismaService } from "src/prisma.service"
import { WorkspaceAction } from "../ability.enums"
import { PayloadUser } from "../ability.factory"

@Injectable()
export class TemplateSlugAndPageSlugVerification {
  constructor(private readonly prismaService: PrismaService) {}

  async verify(
    user: PayloadUser,
    template_slug: string,
    page_slug: string,
    can: any
  ) {
    if (!user || !page_slug || !template_slug) return

    const page = this.prismaService.template.findFirst({
      where: {
        slug: template_slug,
        Page: {
          slug: page_slug,
          Workspace: {
            members: {
              some: {
                user_id: user.sub,
              },
            },
          },
        },
      },
    })

    if (page) {
      can(WorkspaceAction.Manage, "Template")
    }
  }
}
