import { Injectable } from "@nestjs/common"
import { PrismaService } from "src/prisma.service"
import { WorkspaceAction } from "../ability.enums"
import { PayloadUser } from "../ability.factory"

@Injectable()
export class PublicationIdVerification {
  constructor(private readonly prismaService: PrismaService) {}

  async verify(user: PayloadUser, publication_id: string, can: any) {
    if (!user || !publication_id) return

    const publication = this.prismaService.publication.findFirst({
      where: {
        id: publication_id,
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

    if (publication) {
      can(WorkspaceAction.Manage, "Publication")
    }
  }
}
