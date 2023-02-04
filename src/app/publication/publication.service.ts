import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePublicationRequest } from './dto/create-publication-request';
import { UpdatePublicationRequest } from './dto/update-publication-request';

@Injectable()
export class PublicationService {
	constructor(private prismaService: PrismaService) {}

	async createOne(request: CreatePublicationRequest) {
		if (request.blocks) {
			const variables = this.extractVariables(request.blocks) || {};
			request.variables = variables;
		}

		return await this.prismaService.publication.create({
			data: request,
		});
	}

	async findOne(id: string) {
		return await this.prismaService.publication.findUnique({
			where: {
				id,
			},
		});
	}

	async findManyByTemplateId(template_id: string) {
		return await this.prismaService.publication.findMany({
			where: {
				template_id,
			},
		});
	}

	async findManyByPageId(page_id: string) {
		return await this.prismaService.publication.findMany({
			where: {
				page_id,
			},
		});
	}

	async updateOne(id: string, request: UpdatePublicationRequest) {
		if (request.blocks) {
			const variables = this.extractVariables(request.blocks) || {};
			request.variables = variables;
		}

		return await this.prismaService.publication.update({
			where: {
				id,
			},
			data: request,
		});
	}

	extractVariables(blocks: any[]) {
		const result = {};

		const extract = (value) => {
			if (typeof value === 'object') {
				for (const key in value) {
					extract(value[key]);
				}
			} else if (typeof value === 'string') {
				const match = value.match(/{{(.*?)}}/g);
				if (match) {
					match.forEach((variable) => {
						let varName = variable.replace(/[{.}]/g, '__');
						varName = varName.substring(4, varName.length - 4);
						if (!result[varName]) {
							result[varName] = variable;
						}
					});
				}
			}
		};

		blocks.forEach((item) => extract(item.data));

		return result;
	}
}
