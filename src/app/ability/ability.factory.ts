import {
  AbilityBuilder,
  ExtractSubjectType,
  InferSubjects,
  PureAbility,
} from "@casl/ability"
import { createPrismaAbility } from "@casl/prisma"
import { Injectable } from "@nestjs/common"
import { Page, Template, User, Workspace } from "@prisma/client"
import { PrismaService } from "src/prisma.service"
import { PagesAction, TemplatesAction, WorkspaceAction } from "./ability.enums"
import { InteractionIdVerification } from "./verifications/InteractionId"
import { PageIdVerification } from "./verifications/PageId"
import { PageSlugVerification } from "./verifications/PageSlug"
import { PublicPagesVerification } from "./verifications/PublicPages"
import { PublicationIdVerification } from "./verifications/PublicationId"
import { TemplateIdVerification } from "./verifications/TemplateId"
import { TemplateSlugAndPageSlugVerification } from "./verifications/TemplateSlugAndPageSlug"
import { WorkspaceIdVerification } from "./verifications/WorkspaceId"
import { WorkspaceSlugVerification } from "./verifications/WorkspaceSlug"

export type Action = WorkspaceAction | PagesAction | TemplatesAction

export type Subjects = InferSubjects<User | Workspace | Page | Template>

export type AppAbility = PureAbility<Action, Subjects>

type PayloadPage = {
  id: string
  slug: string
}

type PayloadWorkspace = {
  id: string
  slug: string
  Page: PayloadPage[]
}

export type PayloadUser = {
  sub: string
  email: string
  name: string
  avatar_url: string
  workspaces: PayloadWorkspace[]
}

type AuthProps = {
  user: PayloadUser
}

export type defineAbilityProps = {
  workspace_id?: string
  workspace_slug?: string
  page_id?: string
  page_slug?: string
  template_id?: string
  template_slug?: string
  publication_id?: string
  interaction_id?: string
} & AuthProps

@Injectable()
export class AbilityFactory {
  constructor(private prismaService: PrismaService) {}

  can = undefined
  cannot = undefined

  async defineAbility({
    user,
    workspace_id,
    workspace_slug,
    page_id,
    page_slug,
    template_id,
    template_slug,
    publication_id,
    interaction_id,
  }: defineAbilityProps) {
    const { can, cannot, build } = new AbilityBuilder(createPrismaAbility)

    this.can = can
    this.cannot = cannot

    const workspaceIdVerification = new WorkspaceIdVerification(
      this.prismaService
    )
    const workspaceSlugVerification = new WorkspaceSlugVerification(
      this.prismaService
    )
    const pageIdVerification = new PageIdVerification(this.prismaService)
    const pageSlugVerification = new PageSlugVerification(this.prismaService)
    const templateIdVerification = new TemplateIdVerification(
      this.prismaService
    )
    const templateAndPageSlugVerification =
      new TemplateSlugAndPageSlugVerification(this.prismaService)
    const publicationIdVerification = new PublicationIdVerification(
      this.prismaService
    )
    const interactionIdVerification = new InteractionIdVerification(
      this.prismaService
    )
    const publicPagesVerification = new PublicPagesVerification(
      this.prismaService
    )

    await Promise.all([
      workspaceIdVerification.verify(user, workspace_id, can),
      workspaceSlugVerification.verify(user, workspace_slug, can),
      pageIdVerification.verify(user, page_id, can),
      pageSlugVerification.verify(user, page_slug, can),
      templateIdVerification.verify(user, template_id, can),

      templateAndPageSlugVerification.verify(
        user,
        page_slug,
        template_slug,
        can
      ),
      publicationIdVerification.verify(user, publication_id, can),
      interactionIdVerification.verify(user, interaction_id, can),
      publicPagesVerification.verify(user, workspace_id, can),
    ])

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    })
  }
}
