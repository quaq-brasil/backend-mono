import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const getSlug = require('speakingurl');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const uniqueSlug = require('unique-slug');

@Injectable()
export class PageService {
	private readonly logger = new Logger(PageService.name);
	private readonly MAX_ATTEMPTS = 10;
	private instance: PageService;
	private readonly RESERVED_PAGE_SLUGS = ['me', 'workspace', 'adm', 'terms'];

	constructor(private prismaService: PrismaService) {}

	getInstance() {
		if (!this.instance) {
			this.instance = new PageService(this.prismaService);
		}

		return this.instance;
	}

	async create(createPageDto: CreatePageDto) {
		if (createPageDto.url) {
			createPageDto.url = await this.generateUniqueSlugByPageName(
				createPageDto.url,
			);
		}

		try {
			return await this.prismaService.page.create({
				data: createPageDto,
			});
		} catch (error) {
			this.logger.error(`Error creating page: ${error.message}`);
			throw error;
		}
	}

	async findAll() {
		try {
			return await this.prismaService.page.findMany();
		} catch (error) {
			this.logger.error(`Error finding all pages: ${error.message}`);
			throw new BadRequestException({ message: error.message });
		}
	}

	async findOne(id: string) {
		try {
			const found = await this.prismaService.page.findUnique({
				where: {
					id,
				},
			});

			return found;
		} catch (error) {
			this.logger.error(`Error finding page by id: ${error.message}`);
			throw new BadRequestException({ message: error.message });
		}
	}

	async findOneByUrl(url: string) {
		try {
			return await this.prismaService.page.findUnique({
				where: {
					url,
				},
				include: {
					templates: true,
				},
			});
		} catch (error) {
			this.logger.error(`Error finding page by url: ${error.message}`);
			throw new BadRequestException({ message: error.message });
		}
	}

	async findAllByWorkspaceId(workspace_id: string) {
		try {
			return await this.prismaService.page.findMany({
				where: {
					workspace_id,
				},
			});
		} catch (error) {
			this.logger.error(
				`Error finding pages by workspace id: ${error.message}`,
			);
			throw new BadRequestException({ message: error.message });
		}
	}

	async update(id: string, updatePageDto: UpdatePageDto) {
		if (updatePageDto.url) {
			updatePageDto.url = await this.generateUniqueSlugByPageName(
				updatePageDto.url,
			);
		}

		try {
			return await this.prismaService.page.update({
				where: {
					id,
				},
				data: updatePageDto,
			});
		} catch (error) {
			this.logger.error(`Error updating page: ${error.message}`);
			throw new BadRequestException({ message: error.message });
		}
	}

	async delete(id: string) {
		try {
			return await this.prismaService.page.delete({
				where: {
					id,
				},
			});
		} catch (error) {
			this.logger.error(`Error deleting page: ${error.message}`);
			throw new BadRequestException({ message: error.message });
		}
	}

	async generateUniqueSlugByPageName(name: string, id?: string) {
		const slug = getSlug(name);

		let uniqSlug = slug;

		let attempts = 0;

		while (await this.isURLTaken(uniqSlug, id)) {
			attempts++;
			if (attempts >= this.MAX_ATTEMPTS) {
				throw new BadRequestException('Could not generate unique URL');
			}

			const randomSlug: string = uniqueSlug();
			uniqSlug = `${slug}-${randomSlug.slice(0, 3)}`;
		}

		return uniqSlug;
	}

	async isURLTaken(url: string, id?: string) {
		if (this.RESERVED_PAGE_SLUGS.includes(url)) {
			return true;
		}

		if (id) {
			try {
				const page = await this.prismaService.page.findUnique({
					where: { url },
				});

				if (!page) {
					return false;
				}

				return page.id !== id;
			} catch (error) {
				this.logger.error(`Error checking if URL is taken: ${error.message}`);
				throw new BadRequestException({ message: error.message });
			}
		}

		try {
			return (
				(await this.prismaService.page.findMany({ where: { url } })).length > 0
			);
		} catch (error) {
			this.logger.error(`Error checking if URL is taken: ${error.message}`);
			throw new BadRequestException({ message: error.message });
		}
	}
}
