import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	Logger
} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreatePageDto } from './dto/create-page.dto'
import { UpdatePageDto } from './dto/update-page.dto'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const getSlug = require('speakingurl')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const uniqueSlug = require('unique-slug')

@Injectable()
export class PageService {
	private readonly logger = new Logger(PageService.name)
	private readonly MAX_ATTEMPTS = 10
	private instance: PageService
	private readonly RESERVED_PAGE_SLUGS = ['me', 'workspace', 'adm', 'terms']

	constructor(private prismaService: PrismaService) {}

	getInstance() {
		if (!this.instance) {
			this.instance = new PageService(this.prismaService)
		}

		return this.instance
	}

	async create(createPageDto: CreatePageDto) {
		if (createPageDto.slug) {
			createPageDto.slug = await this.generateUniqueSlugByPageName(
				createPageDto.slug
			)
		}

		try {
			return await this.prismaService.page.create({
				data: createPageDto
			})
		} catch (error) {
			this.logger.error(`Error creating page: ${error.message}`)
			throw error
		}
	}

	async findAll() {
		try {
			return await this.prismaService.page.findMany()
		} catch (error) {
			this.logger.error(`Error finding all pages: ${error.message}`)
			throw new BadRequestException({ message: error.message })
		}
	}

	async findOne(id: string, token?: string) {
		try {
			const found = await this.prismaService.page.findUnique({
				where: {
					id
				}
			})

			if (found.visibility === 'workspace') {
				await this.handleVisibilityAccess(id, token)
			}

			return found
		} catch (error) {
			this.logger.error(`Error finding page by id: ${error.message}`)
			throw new BadRequestException({ message: error.message })
		}
	}

	async findOneBySlug(slug: string, token?: string) {
		try {
			const page = await this.prismaService.page.findUnique({
				where: {
					slug
				},
				include: {
					templates: true
				}
			})

			if (page.visibility === 'workspace') {
				await this.handleVisibilityAccess(page.id, token)
			}
		} catch (error) {
			this.logger.error(`Error finding page by slug: ${error.message}`)
			throw new BadRequestException({ message: error.message })
		}
	}

	async findAllByWorkspaceId(workspace_id: string) {
		try {
			return await this.prismaService.page.findMany({
				where: {
					workspace_id
				}
			})
		} catch (error) {
			this.logger.error(`Error finding pages by workspace id: ${error.message}`)
			throw new BadRequestException({ message: error.message })
		}
	}

	async update(id: string, updatePageDto: UpdatePageDto) {
		if (updatePageDto.slug) {
			updatePageDto.slug = await this.generateUniqueSlugByPageName(
				updatePageDto.slug,
				id
			)
		}

		try {
			return await this.prismaService.page.update({
				where: {
					id
				},
				data: updatePageDto
			})
		} catch (error) {
			this.logger.error(`Error updating page: ${error.message}`)
			throw new BadRequestException({ message: error.message })
		}
	}

	async delete(id: string) {
		try {
			return await this.prismaService.page.delete({
				where: {
					id
				}
			})
		} catch (error) {
			this.logger.error(`Error deleting page: ${error.message}`)
			throw new BadRequestException({ message: error.message })
		}
	}

	async generateUniqueSlugByPageName(name: string, id?: string) {
		const slug = getSlug(name)

		let uniqSlug = slug

		let attempts = 0

		while (await this.isSlugTaken(uniqSlug, id)) {
			attempts++
			if (attempts >= this.MAX_ATTEMPTS) {
				throw new BadRequestException('Could not generate unique Slug')
			}

			const randomSlug: string = uniqueSlug()
			uniqSlug = `${slug}-${randomSlug.slice(0, 3)}`
		}

		return uniqSlug
	}

	async isSlugTaken(slug: string, id?: string) {
		if (this.RESERVED_PAGE_SLUGS.includes(slug)) {
			return true
		}

		if (id) {
			try {
				const page = await this.prismaService.page.findUnique({
					where: { slug }
				})

				if (!page) {
					return false
				}

				return page.id !== id
			} catch (error) {
				this.logger.error(`Error checking if Slug is taken: ${error.message}`)
				throw new BadRequestException({ message: error.message })
			}
		}

		try {
			return (
				(await this.prismaService.page.findMany({ where: { slug } })).length > 0
			)
		} catch (error) {
			this.logger.error(`Error checking if Slug is taken: ${error.message}`)
			throw new BadRequestException({ message: error.message })
		}
	}

	async handleVisibilityAccess(id: string, token: string) {
		if (!token) {
			throw new ForbiddenException('permission insufficiently')
		}
		const user = JSON.parse(
			Buffer.from(token.split('.')[1], 'base64').toString('utf8')
		)

		const page = await this.prismaService.page.findUnique({
			where: {
				id
			},
			select: {
				Workspace: {
					select: {
						members: {
							select: {
								user: {
									select: {
										id: true
									}
								}
							}
						}
					}
				}
			}
		})

		const memberFound = page.Workspace.members.filter(
			(member) => member.user.id === user.sub
		)

		if (!memberFound || memberFound.length < 1) {
			throw new ForbiddenException('permission insufficiently')
		}
	}
}
