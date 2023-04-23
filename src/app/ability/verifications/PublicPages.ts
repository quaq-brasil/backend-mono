import { Injectable } from "@nestjs/common"
import { PrismaService } from "src/prisma.service"
import { PagesAction } from "../ability.enums"
import { PayloadUser } from "../ability.factory"

@Injectable()
export class PublicPagesVerification {
  constructor(private readonly prismaService: PrismaService) {}

  async verify(user: PayloadUser, workspace_id: string, can: any) {
    if (!user || !workspace_id) return

    const publicPages = await this.prismaService.page.findMany({
      where: {
        workspace_id,
        visibility: "public",
      },
    })

    if (publicPages.length > 0) {
      can(PagesAction.ReadPublic, "Page")
    }
  }
}
