import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { BlockService } from '../block/block.service';
import { VariablesService } from '../variables/variables.service';
import { CreatePublicationRequest } from './dto/create-publication-request';
import { UpdatePublicationRequest } from './dto/update-publication-request';

@Injectable()
export class PublicationService {
	constructor(
		private prismaService: PrismaService,
		private blockService: BlockService,
		private variablesService: VariablesService,
	) {}

	async createOne(request: CreatePublicationRequest) {
		// if (request.blocks) {
		// 	const variables =
		// 		this.blockService.extractVariables(request.blocks) || {};
		// 	request.dependencies = { ...request.dependencies, variables: variables };
		// }

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

		const variables = this.variablesService.findPanelVariables(
			undefined,
			publication.blocks,
			publication.template_id,
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			publication?.dependencies?.connected_templates || [],
			undefined,
		);

		publication.blocks = this.blockService.compileVariables(
			publication.blocks,
			variables,
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
			const variables =
				this.blockService.extractVariables(request.blocks) || {};
			request.dependencies = { ...request.dependencies, variables: variables };
		}

		return await this.prismaService.publication.update({
			where: {
				id,
			},
			data: request,
		});
	}
}
