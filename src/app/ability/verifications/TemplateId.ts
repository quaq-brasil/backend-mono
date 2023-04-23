import { Injectable } from "@nestjs/common"
import { PrismaService } from "src/prisma.service"
import { WorkspaceAction } from "../ability.enums"
import { PayloadUser } from "../ability.factory"

@Injectable()
export class TemplateIdVerification {
  constructor(private readonly prismaService: PrismaService) {}

  async verify(user: PayloadUser, template_id: string, can: any) {
    if (!user || !template_id) return

    const page = this.prismaService.template.findFirst({
      where: {
        id: template_id,
        Page: {
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
