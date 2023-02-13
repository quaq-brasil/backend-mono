import {
	BadRequestException,
	Injectable,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { BlockService } from '../block/block.service';
import { VariablesService } from '../variables/variables.service';
import { CreateTemplateRequest } from './dto/create-template-request';
import { UpdateTemplateRequest } from './dto/update-template-request';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const getSlug = require('speakingurl');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const uniqueSlug = require('unique-slug');

@Injectable()
export class TemplateService {
	private readonly logger = new Logger(TemplateService.name);
	private readonly MAX_ATTEMPTS = 10;
	private readonly RESERVED_TEMPLATE_SLUGS = [];
	private instance: TemplateService;

	constructor(
		private prismaService: PrismaService,
		private blockService: BlockService,
		private variablesService: VariablesService,
	) {}

	getInstance() {
		if (!this.instance) {
			this.instance = new TemplateService(
				this.prismaService,
				this.blockService,
				this.variablesService,
			);
		}
		return this.instance;
	}

	async createOne(request: CreateTemplateRequest) {
		if (request.url && request.page_id) {
			request.url = await this.generateUniqueSlugByTemplateTitle(
				request.url,
				request.page_id,
			);
		}

		return this.prismaService.template.create({
			data: { ...request },
		});
	}

	async findOne(id: string, consumer_id?: string, data?: any[]) {
		return await this.prismaService.template.findUnique({
			where: {
				id,
			},
			include: {
				Publications: true,
				Page: true,
			},
		});

		// if (template) {
		// 	const publication =
		// 		template.Publications[template?.Publications?.length - 1] ||
		// 		({} as any);

		// 	const formattedTemplate = {
		// 		...template,
		// 		publication,
		// 	};

		// 	console.log(
		// 		'formattedTemplate.publication.blocks',
		// 		formattedTemplate.publication.blocks,
		// 	);

		// 	const variables = await this.variablesService.findPanelVariables(
		// 		undefined,
		// 		formattedTemplate.publication.blocks,
		// 		formattedTemplate.id,
		// 		formattedTemplate.publication?.dependencies?.connected_templates || [],
		// 		consumer_id,
		// 		data,
		// 	);

		// 	formattedTemplate.publication.blocks = this.blockService.compileVariables(
		// 		formattedTemplate.publication.blocks,
		// 		variables,
		// 	);

		// 	return formattedTemplate;
		// }

		// throw new NotFoundException({ message: 'template not found' });
	}

	async findOneByUrl(url: string) {
		return this.prismaService.template.findFirst({
			where: {
				url,
			},
		});
	}

	async findManyByPageId(page_id: string) {
		return await this.prismaService.template.findMany({
			where: {
				page_id,
			},
		});
	}

	async findOneByPageAndTemplateUrl(
		url: string,
		page_url: string,
		consumer_id?: string,
	) {
		const templates = await this.prismaService.template.findMany({
			where: {
				url,
			},
			include: {
				Page: true,
				Publications: true,
			},
		});

		if (templates && templates.length > 0) {
			const uniqueTemplate = templates.filter(
				(template) => template.Page.url === page_url,
			);

			const publication =
				uniqueTemplate[0].Publications[
					uniqueTemplate[0]?.Publications?.length - 1
				] || ({} as any);

			const formattedTemplate = {
				...uniqueTemplate[0],
				publication,
			};

			const variables = await this.variablesService.findPanelVariables(
				undefined,
				formattedTemplate.publication.blocks,
				formattedTemplate.id,
				formattedTemplate.publication?.dependencies?.connected_templates || [],
				consumer_id,
			);

			formattedTemplate.publication.blocks = this.blockService.compileVariables(
				formattedTemplate.publication.blocks,
				variables,
			);

			return formattedTemplate;
		}

		throw new NotFoundException({ message: 'template not found' });
	}

	async updateOne(id: string, request: UpdateTemplateRequest) {
		if (request.url && request.page_id) {
			request.url = await this.generateUniqueSlugByTemplateTitle(
				request.url,
				request.page_id,
				id,
			);
		}

		return this.prismaService.template.update({
			where: {
				id,
			},
			data: request,
		});
	}

	removeOne(id: string) {
		return this.prismaService.template.delete({
			where: {
				id,
			},
		});
	}

	async generateUniqueSlugByTemplateTitle(
		title: string,
		page_id: string,
		id?: string,
	) {
		const slug = getSlug(title);

		let uniqSlug = slug;

		let attempts = 0;

		while (await this.isURLTaken(uniqSlug, page_id, id)) {
			attempts++;
			if (attempts >= this.MAX_ATTEMPTS) {
				throw new BadRequestException('Could not generate unique URL');
			}

			const randomSlug: string = uniqueSlug();
			uniqSlug = `${slug}-${randomSlug.slice(0, 3)}`;
		}

		return uniqSlug;
	}

	async isURLTaken(url: string, page_id: string, id?: string) {
		if (this.RESERVED_TEMPLATE_SLUGS.includes(url)) {
			return true;
		}

		if (id) {
			try {
				const templates = await this.prismaService.template.findMany({
					where: { page_id },
				});

				if (!templates) {
					return false;
				}

				templates.forEach((template) => {
					if (template.url === url && template.id !== id) {
						return true;
					}
				});

				return false;
			} catch (error) {
				this.logger.error(`Error checking if URL is taken: ${error.message}`);
				throw new BadRequestException({ message: error.message });
			}
		}

		try {
			const templates = await this.prismaService.template.findMany({
				where: { page_id },
			});

			templates.forEach((template) => {
				if (template.url === url) {
					return true;
				}
			});

			return false;
		} catch (error) {
			this.logger.error(`Error checking if URL is taken: ${error.message}`);
			throw new BadRequestException({ message: error.message });
		}
	}
}
