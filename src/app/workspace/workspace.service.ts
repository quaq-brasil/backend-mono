import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreateWorkspaceDto } from './dto/create-workspace.dto'
import { UpdateWorkspaceDto } from './dto/update-workspace.dto'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const getSlug = require('speakingurl')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const uniqueSlug = require('unique-slug')

@Injectable()
export class WorkspaceService {
	private readonly logger = new Logger(WorkspaceService.name)
	private readonly MAX_ATTEMPTS = 10
	private instance: WorkspaceService

	constructor(private prismaService: PrismaService) {}

	getInstance() {
		if (!this.instance) {
			this.instance = new WorkspaceService(this.prismaService)
		}

		return this.instance
	}

	async create(createWorkspaceDto: CreateWorkspaceDto, user_id: string) {
		if (createWorkspaceDto.slug) {
			createWorkspaceDto.slug = await this.generateUniqueSlugByWorkspaceName(
				createWorkspaceDto.slug
			)
		}

		delete createWorkspaceDto.user_id

		const workspace = await this.prismaService.workspace.create({
			data: createWorkspaceDto,
		})

		await this.prismaService.workspaceToUser.create({
			data: { workspace_id: workspace.id, user_id: user_id },
		})

		return workspace
	}

	findOne(id: string) {
		return this.prismaService.workspace.findUnique({
			where: {
				id,
			},
			include: {
				members: {
					include: {
						user: {
							select: {
								id: true,
								name: true,
								email: true,
								avatar_url: true,
							},
						},
					},
				},
			},
		})
	}

	async findOneBySlug(slug: string) {
		return await this.prismaService.workspace.findUnique({
			where: {
				slug,
			},
			include: {
				members: {
					include: {
						user: {
							select: {
								id: true,
								name: true,
								email: true,
								avatar_url: true,
							},
						},
					},
				},
			},
		})
	}

	async findAllByUserId(user_id: string) {
		const workspacesToUser = await this.prismaService.workspaceToUser.findMany({
			where: {
				user_id,
			},
			include: {
				workspace: {
					include: {
						Page: true,
						members: {
							include: {
								user: {
									select: {
										id: true,
										name: true,
										email: true,
										avatar_url: true,
									},
								},
							},
						},
					},
				},
			},
		})

		return workspacesToUser.map((workspaceToUser) => workspaceToUser.workspace)
	}

	async findOneByPageSlug(page_slug: string) {
		const page = await this.prismaService.page.findUnique({
			where: {
				slug: page_slug,
			},
			include: {
				Workspace: {
					include: {
						members: {
							include: {
								user: {
									select: {
										id: true,
										name: true,
										email: true,
										avatar_url: true,
									},
								},
							},
						},
					},
				},
			},
		})

		return page.Workspace
	}

	async update(id: string, updateWorkspaceDto: UpdateWorkspaceDto) {
		if (updateWorkspaceDto.slug) {
			updateWorkspaceDto.slug = await this.generateUniqueSlugByWorkspaceName(
				updateWorkspaceDto.slug
			)
		}

		return await this.prismaService.workspace.update({
			where: {
				id,
			},
			data: updateWorkspaceDto,
		})
	}

	remove(id: string) {
		return this.prismaService.workspace.delete({
			where: {
				id,
			},
		})
	}

	async addWorkspaceMember(id: string, email: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				email,
			},
		})

		if (!user) {
			throw new BadRequestException({ message: 'user not found' })
		}

		const workspace = await this.prismaService.workspace.findUnique({
			where: {
				id,
			},
			include: {
				members: true,
			},
		})

		if (!workspace) {
			throw new BadRequestException({ message: 'workspace not found' })
		}

		const userIsAlreadyIncluded = workspace.members.filter(
			(member) => member.id === user.id
		)

		if (userIsAlreadyIncluded && userIsAlreadyIncluded.length > 0) {
			throw new BadRequestException({
				message: 'user is already included in the workspace',
			})
		}

		const workspaceToUserCreated =
			await this.prismaService.workspaceToUser.create({
				data: { user_id: user.id, workspace_id: workspace.id },
				include: {
					workspace: {
						include: {
							members: {
								include: {
									user: {
										select: {
											id: true,
											name: true,
											email: true,
											avatar_url: true,
										},
									},
								},
							},
						},
					},
				},
			})

		return workspaceToUserCreated.workspace
	}

	async removeWorkspaceMember(id: string, user_id: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				id: user_id,
			},
		})

		if (!user) {
			throw new BadRequestException({ message: 'user not found' })
		}

		const workspace = await this.prismaService.workspace.findUnique({
			where: {
				id,
			},
			include: {
				members: {
					include: {
						user: {
							select: {
								id: true,
								name: true,
								email: true,
								avatar_url: true,
							},
						},
					},
				},
			},
		})

		if (!workspace) {
			throw new BadRequestException({ message: 'workspace not found' })
		}

		const relationToDelete = workspace.members.filter(
			(member) => member.user_id === user_id && member.workspace_id === id
		)

		if (!relationToDelete) {
			throw new BadRequestException({
				message: 'user is not part of the workspace',
			})
		}

		const workspaceToUserDeleted =
			await this.prismaService.workspaceToUser.delete({
				where: { id: relationToDelete[0].id },
				include: {
					workspace: {
						include: {
							members: {
								include: {
									user: {
										select: {
											id: true,
											name: true,
											email: true,
											avatar_url: true,
										},
									},
								},
							},
						},
					},
				},
			})

		return workspaceToUserDeleted.workspace
	}

	async generateUniqueSlugByWorkspaceName(name: string, id?: string) {
		const slug = getSlug(name)

		let uniqSlug = slug

		let attempts = 0

		while (await this.isSlugTaken(uniqSlug, id)) {
			attempts++
			if (attempts >= this.MAX_ATTEMPTS) {
				throw new BadRequestException('Could not generate unique slug')
			}

			const randomSlug: string = uniqueSlug()
			uniqSlug = `${slug}-${randomSlug.slice(0, 3)}`
		}

		return uniqSlug
	}

	async isSlugTaken(slug: string, id?: string) {
		if (id) {
			try {
				const workspace = await this.prismaService.workspace.findUnique({
					where: { slug },
				})

				if (!workspace) {
					return false
				}

				return workspace.id !== id
			} catch (error) {
				this.logger.error(`Error checking if slug is taken: ${error.message}`)
				throw new BadRequestException({ message: error.message })
			}
		}

		try {
			return (
				(await this.prismaService.workspace.findMany({ where: { slug } }))
					.length > 0
			)
		} catch (error) {
			this.logger.error(`Error checking if slug is taken: ${error.message}`)
			throw new BadRequestException({ message: error.message })
		}
	}
}
