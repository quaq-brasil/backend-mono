import { Injectable } from "@nestjs/common"
import { PrismaService } from "src/prisma.service"
import { WorkspaceAction } from "../ability.enums"
import { PayloadUser } from "../ability.factory"

@Injectable()
export class InteractionIdVerification {
  constructor(private readonly prismaService: PrismaService) {}

  async verify(user: PayloadUser, interaction_id: string, can: any) {
    if (!user || !interaction_id) return

    const publication = this.prismaService.interaction.findFirst({
      where: {
        id: interaction_id,
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
      can(WorkspaceAction.Manage, "Interaction")
    }
  }
}
