import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { BlockService } from '../block/block.service';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { UpdateInteractionDto } from './dto/update-interaction.dto';

@Injectable()
export class InteractionService {
	constructor(
		private prismaService: PrismaService,
		private blockService: BlockService,
	) {}

	async create(createInteractionDto: CreateInteractionDto) {
		const data = await this.blockService.webhookBlockExecution(
			createInteractionDto.blocks,
			createInteractionDto.data,
		);

		if (data) {
			createInteractionDto.data = data;
		}

		return this.prismaService.interaction.create({
			data: createInteractionDto,
		});
	}

	findOne(id: string) {
		return this.prismaService.interaction.findUnique({
			where: {
				id: id,
			},
		});
	}

	findAllByUserId(user_id: string) {
		return this.prismaService.interaction.findMany({
			where: {
				user_id: user_id,
			},
		});
	}

	findAllByPageId(page_id: string) {
		return this.prismaService.interaction.findMany({
			where: {
				page_id: page_id,
			},
		});
	}

	findAllByPublicationId(publication_id: string) {
		return this.prismaService.interaction.findMany({
			where: {
				publication_id: publication_id,
			},
		});
	}

	async update(id: string, updateInteractionDto: UpdateInteractionDto) {
		let executeWebhook = false;

		updateInteractionDto.data.forEach((dataBlock) => {
			if (dataBlock.config === 'button') {
				if (dataBlock.output.data.clicked) {
					executeWebhook = true;
				}
			}
		});

		if (executeWebhook) {
			const data = await this.blockService.webhookBlockExecution(
				updateInteractionDto.blocks,
				updateInteractionDto.data,
			);

			if (data) {
				updateInteractionDto.data = data;
			}
		}

		return await this.prismaService.interaction.update({
			where: {
				id: id,
			},
			data: updateInteractionDto,
		});
	}
}
