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
		const publication = await this.prismaService.publication.findUnique({
			where: {
				id,
			},
		});

		const variablesValues = {
			title: 'titulo',
			input__placeholder: 'digite aqui',
			answer2: 3,
			outro__template__block1__name__0: [
				1,
				2,
				{
					test: 'adsda',
				},
			],
			test1: 'teste1',
			test2: 'teste2',
		};

		publication.blocks = this.replaceVariablesWithValues(
			publication.blocks,
			variablesValues,
		);

		return publication;
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

	replaceVariablesWithValues(blocks, variablesValues) {
		if (typeof blocks === 'object') {
			return Object.keys(blocks).reduce((obj, key) => {
				obj[key] = this.replaceVariablesWithValues(
					blocks[key],
					variablesValues,
				);
				return obj;
			}, {});
		} else if (
			typeof blocks === 'string' &&
			blocks.startsWith('{{') &&
			blocks.endsWith('}}')
		) {
			const variable = blocks.substring(2, blocks.length - 2);
			return variablesValues[variable.replace(/\./g, '__')] || undefined;
		}
		return blocks;
	}
}
