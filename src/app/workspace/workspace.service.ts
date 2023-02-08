import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const getSlug = require('speakingurl');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const uniqueSlug = require('unique-slug');

@Injectable()
export class WorkspaceService {
	private readonly logger = new Logger(WorkspaceService.name);
	private readonly MAX_ATTEMPTS = 10;
	private instance: WorkspaceService;

	constructor(private prismaService: PrismaService) {}

	getInstance() {
		if (!this.instance) {
			this.instance = new WorkspaceService(this.prismaService);
		}

		return this.instance;
	}

	async create(createWorkspaceDto: CreateWorkspaceDto) {
		if (createWorkspaceDto.slug) {
			createWorkspaceDto.slug = await this.generateUniqueSlugByWorkspaceName(
				createWorkspaceDto.slug,
			);
		}

		return await this.prismaService.workspace.create({
			data: createWorkspaceDto,
		});
	}

	findOne(id: string) {
		return this.prismaService.workspace.findUnique({
			where: {
				id,
			},
		});
	}

	async findOneBySlug(slug: string) {
		return await this.prismaService.workspace.findUnique({
			where: {
				slug,
			},
		});
	}

	async findAllByUserId(user_id: string) {
		return await this.prismaService.workspace.findMany({
			where: {
				user_id,
			},
		});
	}

	async update(id: string, updateWorkspaceDto: UpdateWorkspaceDto) {
		if (updateWorkspaceDto.slug) {
			updateWorkspaceDto.slug = await this.generateUniqueSlugByWorkspaceName(
				updateWorkspaceDto.slug,
			);
		}

		return await this.prismaService.workspace.update({
			where: {
				id,
			},
			data: updateWorkspaceDto,
		});
	}

	remove(id: string) {
		return this.prismaService.workspace.delete({
			where: {
				id,
			},
		});
	}

	async generateUniqueSlugByWorkspaceName(name: string, id?: string) {
		const slug = getSlug(name);

		let uniqSlug = slug;

		let attempts = 0;

		while (await this.isSlugTaken(uniqSlug, id)) {
			attempts++;
			if (attempts >= this.MAX_ATTEMPTS) {
				throw new BadRequestException('Could not generate unique slug');
			}

			const randomSlug: string = uniqueSlug();
			uniqSlug = `${slug}-${randomSlug.slice(0, 3)}`;
		}

		return uniqSlug;
	}

	async isSlugTaken(slug: string, id?: string) {
		if (id) {
			try {
				const workspace = await this.prismaService.workspace.findUnique({
					where: { slug },
				});

				if (!workspace) {
					return false;
				}

				return workspace.id !== id;
			} catch (error) {
				this.logger.error(`Error checking if slug is taken: ${error.message}`);
				throw new BadRequestException({ message: error.message });
			}
		}

		try {
			return (
				(await this.prismaService.workspace.findMany({ where: { slug } }))
					.length > 0
			);
		} catch (error) {
			this.logger.error(`Error checking if slug is taken: ${error.message}`);
			throw new BadRequestException({ message: error.message });
		}
	}
}
