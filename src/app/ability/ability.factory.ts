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

    await Promise.all([
      this.verifyByWorkspaceId({ user, workspace_id }),
      this.verifyByWorkspaceSlug({ user, workspace_slug }),
      this.verifyByPageId({ user, page_id }),
      this.verifyByPageSlug({ user, page_slug }),
      this.verifyByTemplateId({ user, template_id }),
      this.verifyByTemplateAndPageSlug({ user, page_slug, template_slug }),
      this.verifyByPublicationId({ user, publication_id }),
      this.verifyByInteractionId({ user, interaction_id }),
      this.verifyPublicPages({ user, workspace_id }),
    ])

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    })
  }

  async verifyByWorkspaceId({
    user,
    workspace_id,
  }: {
    user: PayloadUser
    workspace_id: string
  }) {
    if (!user || !workspace_id) return

    const workspace = await this.prismaService.workspaceToUser.findFirst({
      where: {
        user_id: user.sub,
        workspace_id,
      },
    })

    if (workspace) {
      this.can(WorkspaceAction.Manage, "Workspace")
    }
  }

  async verifyByWorkspaceSlug({
    user,
    workspace_slug,
  }: {
    user: PayloadUser
    workspace_slug: string
  }) {
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
      this.can(WorkspaceAction.Manage, "Workspace")
    }
  }

  async verifyByPageId({
    user,
    page_id,
  }: {
    user: PayloadUser
    page_id: string
  }) {
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
      this.can(WorkspaceAction.Manage, "Page")
    }
  }

  async verifyByPageSlug({
    user,
    page_slug,
  }: {
    user: PayloadUser
    page_slug: string
  }) {
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
      this.can(WorkspaceAction.Manage, "Page")
    }
  }

  async verifyPublicPages({
    user,
    workspace_id,
  }: {
    user: PayloadUser
    workspace_id: string
  }) {
    if (!user || !workspace_id) return

    const publicPages = await this.prismaService.page.findMany({
      where: {
        workspace_id,
        visibility: "public",
      },
    })

    if (publicPages.length > 0) {
      this.can(PagesAction.ReadPublic, "Page")
    }
  }

  async verifyByTemplateId({
    user,
    template_id,
  }: {
    user: PayloadUser
    template_id: string
  }) {
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
      this.can(WorkspaceAction.Manage, "Template")
    }
  }

  async verifyByTemplateAndPageSlug({
    user,
    template_slug,
    page_slug,
  }: {
    user: PayloadUser
    template_slug: string
    page_slug: string
  }) {
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
      this.can(WorkspaceAction.Manage, "Template")
    }
  }

  async verifyByPublicationId({
    user,
    publication_id,
  }: {
    user: PayloadUser
    publication_id: string
  }) {
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
      this.can(WorkspaceAction.Manage, "Publication")
    }
  }

  async verifyByInteractionId({
    user,
    interaction_id,
  }: {
    user: PayloadUser
    interaction_id: string
  }) {
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
      this.can(WorkspaceAction.Manage, "Interaction")
    }
  }
}
