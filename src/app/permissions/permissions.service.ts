import { ForbiddenException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'

type IPage = {
	id: string
	slug: string
}

type IWorkspace = {
	id: string
	slug: string
	Page: IPage[]
}

type IUser = {
	sub: string
	email: string
	name: string
	avatar_url: string
	workspaces: IWorkspace[]
}

@Injectable()
export class PermissionsService {
	constructor(private prismaService: PrismaService) {}

	async workspaceValidate(user: IUser, workspace_id: string) {
		const doesUserHavePermission = user.workspaces.filter(
			(workspace) => workspace.id === workspace_id
		)

		if (!doesUserHavePermission || doesUserHavePermission.length < 1) {
			throw new ForbiddenException({
				message: 'user permission is insufficient to complete this action'
			})
		}
	}

	async workspaceValidateBySlug(user: IUser, slug: string) {
		const doesUserHavePermission = user.workspaces.filter(
			(workspace) => workspace.slug === slug
		)

		if (!doesUserHavePermission || doesUserHavePermission.length < 1) {
			throw new ForbiddenException({
				message: 'user permission is insufficient to complete this action'
			})
		}
	}

	async workspaceValidateByPageSlug(user: IUser, slug: string) {
		const doesUserHavePermission = []

		user.workspaces.forEach((workspace) =>
			workspace.Page.forEach((page) => {
				if (page.slug === slug) {
					doesUserHavePermission.push(workspace)
				}
			})
		)

		if (!doesUserHavePermission || doesUserHavePermission.length < 1) {
			throw new ForbiddenException({
				message: 'user permission is insufficient to complete this action'
			})
		}
	}
}
