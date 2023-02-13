import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { BlockService } from '../block/block.service';
import { CreatePublicationRequest } from './dto/create-publication-request';
import { UpdatePublicationRequest } from './dto/update-publication-request';

@Injectable()
export class PublicationService {
	constructor(
		private prismaService: PrismaService,
		private blockService: BlockService,
	) {}

	async createOne(request: CreatePublicationRequest) {
		if (request.blocks) {
			const variables =
				this.blockService.extractVariables(request.blocks) || {};
			request.dependencies = { variables };
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

		publication.blocks = this.blockService.replaceVariablesWithValues(
			publication.blocks,
			this.blockService.variablesValues,
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
			request.dependencies = { variables };
		}

		return await this.prismaService.publication.update({
			where: {
				id,
			},
			data: request,
		});
	}
}
