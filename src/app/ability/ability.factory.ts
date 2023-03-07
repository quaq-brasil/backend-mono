import {
	AbilityBuilder,
	ExtractSubjectType,
	InferSubjects,
	PureAbility
} from '@casl/ability'
import { createPrismaAbility } from '@casl/prisma'
import { Injectable } from '@nestjs/common'
import { Page, Template, User, Workspace } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'
import { PagesAction, TemplatesAction, WorkspaceAction } from './ability.enums'

export type Action = WorkspaceAction | PagesAction | TemplatesAction

export type Subjects = InferSubjects<User | Workspace | Page | Template>

export type AppAbility = PureAbility<Action, Subjects>

type IPayloadPage = {
	id: string
	slug: string
}

type IPayloadWorkspace = {
	id: string
	slug: string
	Page: IPayloadPage[]
}

export type IPayloadUser = {
	sub: string
	email: string
	name: string
	avatar_url: string
	workspaces: IPayloadWorkspace[]
}

type authProps = {
	user: IPayloadUser
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
} & authProps

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
		interaction_id
	}: defineAbilityProps) {
		const { can, cannot, build } = new AbilityBuilder(createPrismaAbility)

		this.can = can
		this.cannot = cannot

		if (workspace_id) {
			await this.verifyByWorkspaceId({ user, workspace_id })
		}

		if (workspace_slug) {
			await this.verifyByWorkspaceSlug({ user, workspace_slug })
		}

		if (page_id) {
			await this.verifyByPageId({ user, page_id })
		}

		if (page_slug) {
			await this.verifyByPageSlug({ user, page_slug })
		}

		if (template_id) {
			await this.verifyByTemplateId({ user, template_id })
		}

		if (template_slug && page_slug) {
			await this.verifyByTemplateAndPageSlug({ user, page_slug, template_slug })
		}

		if (publication_id) {
			await this.verifyByPublicationId({ user, publication_id })
		}

		if (interaction_id) {
			await this.verifyByInteractionId({ user, interaction_id })
		}

		return build({
			detectSubjectType: (item) =>
				item.constructor as ExtractSubjectType<Subjects>
		})
	}

	async verifyByWorkspaceId({
		user,
		workspace_id
	}: {
		user: IPayloadUser
		workspace_id: string
	}) {
		const workspace = await this.prismaService.workspaceToUser.findFirst({
			where: {
				user_id: user.sub,
				workspace_id
			}
		})

		if (workspace) {
			this.can(WorkspaceAction.Manage, 'Workspace')
		}
	}

	async verifyByWorkspaceSlug({
		user,
		workspace_slug
	}: {
		user: IPayloadUser
		workspace_slug: string
	}) {
		const workspace = await this.prismaService.workspaceToUser.findFirst({
			where: {
				user_id: user.sub,
				workspace: {
					slug: workspace_slug
				}
			}
		})

		if (workspace) {
			this.can(WorkspaceAction.Manage, 'Workspace')
		}
	}

	async verifyByPageId({
		user,
		page_id
	}: {
		user: IPayloadUser
		page_id: string
	}) {
		const page = this.prismaService.page.findFirst({
			where: {
				id: page_id,
				Workspace: {
					members: {
						some: {
							user_id: user.sub
						}
					}
				}
			}
		})

		if (page) {
			this.can(WorkspaceAction.Manage, 'Page')
		}
	}

	async verifyByPageSlug({
		user,
		page_slug
	}: {
		user: IPayloadUser
		page_slug: string
	}) {
		const page = this.prismaService.page.findFirst({
			where: {
				slug: page_slug,
				Workspace: {
					members: {
						some: {
							user_id: user.sub
						}
					}
				}
			}
		})

		if (page) {
			this.can(WorkspaceAction.Manage, 'Page')
		}
	}

	async verifyByTemplateId({
		user,
		template_id
	}: {
		user: IPayloadUser
		template_id: string
	}) {
		const page = this.prismaService.template.findFirst({
			where: {
				id: template_id,
				Page: {
					Workspace: {
						members: {
							some: {
								user_id: user.sub
							}
						}
					}
				}
			}
		})

		if (page) {
			this.can(WorkspaceAction.Manage, 'Template')
		}
	}

	async verifyByTemplateAndPageSlug({
		user,
		template_slug,
		page_slug
	}: {
		user: IPayloadUser
		template_slug: string
		page_slug: string
	}) {
		const page = this.prismaService.template.findFirst({
			where: {
				slug: template_slug,
				Page: {
					slug: page_slug,
					Workspace: {
						members: {
							some: {
								user_id: user.sub
							}
						}
					}
				}
			}
		})

		if (page) {
			this.can(WorkspaceAction.Manage, 'Template')
		}
	}

	async verifyByPublicationId({
		user,
		publication_id
	}: {
		user: IPayloadUser
		publication_id: string
	}) {
		const publication = this.prismaService.publication.findFirst({
			where: {
				id: publication_id,
				Page: {
					Workspace: {
						members: {
							some: {
								user_id: user.sub
							}
						}
					}
				}
			}
		})

		if (publication) {
			this.can(WorkspaceAction.Manage, 'Publication')
		}
	}

	async verifyByInteractionId({
		user,
		interaction_id
	}: {
		user: IPayloadUser
		interaction_id: string
	}) {
		const publication = this.prismaService.interaction.findFirst({
			where: {
				id: interaction_id,
				Page: {
					Workspace: {
						members: {
							some: {
								user_id: user.sub
							}
						}
					}
				}
			}
		})

		if (publication) {
			this.can(WorkspaceAction.Manage, 'Interaction')
		}
	}
}
