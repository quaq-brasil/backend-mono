import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class VariablesService {
	constructor(private prismaService: PrismaService) {}

	async findAllVariablesAvailable(
		creator_id: string,
		blocks?: any[],
		template_id?: string,
	) {
		const variables: any = {
			creator: {},
			consumer: {},
			events: {},
			blocks: {},
			publications: {},
		};

		if (creator_id) {
			await this.formatCreator(creator_id, variables);
		}

		this.formatConsumer(variables);
		this.formatEvents(variables);

		if (blocks && blocks.length > 0) {
			await this.formaBlocks(blocks, variables);
		}

		if (template_id) {
			await this.formatPublications(template_id, variables);
		}
	}

	async formatCreator(creator_id: string, variables: any) {
		try {
			const creator = await this.prismaService.user.findUnique({
				where: {
					id: creator_id,
				},
			});

			variables.creator = {
				id: creator.id || 'string',
				name: creator.name || 'string',
				email: creator.email || 'string',
				profile_picture: creator.avatar_url || 'string',
			};
		} catch (error) {
			console.log(error);
		}
	}

	async formatConsumer(variables: any) {
		variables.consumer = {
			id: 'string',
			name: 'string',
			email: 'string',
			profile_picture: 'string',
		};
	}

	async formatEvents(variables: any) {
		variables.events = {};
	}

	async formaBlocks(blocks: any[], variables: any) {
		variables.blocks = {};

		blocks.forEach((block) => {
			const newBlocks = {
				config: {
					id: block.id,
					type: block.type,
					title: block.saveAs,
					content: block.data,
				},
				data: this.formatBlockData(block),
				events: this.formatBlockEvents(block),
			};

			variables.blocks[block.saveAs] = newBlocks;
		});
	}

	async formatBlockData(block: any) {
		switch (block.type) {
			case 'textentry':
				return {
					value: 'string',
				};
			case 'pool':
				return {
					selected_options: 'string list',
					number_of_selections: 'number',
				};
			case 'button':
				return {
					clicked: 'boolean',
				};
			case 'review':
				return {
					review: 'number',
				};
			case 'webhook':
				return {
					header: 'string',
					body: 'string',
				};
			default:
				return {};
		}
	}

	async formatBlockEvents(block: any) {
		switch (block.type) {
			case 'text':
				return {
					displayedAt: 'string',
				};
			case 'image':
				return {
					displayedAt: 'string',
				};
			case 'chart':
				return {
					displayedAt: 'string',
				};
			case 'textentry':
				return {
					displayedAt: 'string',
					lastInteractionAt: 'string',
					firstInteractionAt: 'string',
				};
			case 'pool':
				return {
					displayedAt: 'string',
					lastInteractionAt: 'string',
					firstInteractionAt: 'string',
					maxAchievedAt: 'string',
					minAchievedAt: 'string',
				};
			case 'button':
				return {
					displayedAt: 'string',
					lastInteractionAt: 'string',
					firstInteractionAt: 'string',
				};
			case 'review':
				return {
					displayedAt: 'string',
					lastInteractionAt: 'string',
					firstInteractionAt: 'string',
				};
			case 'automation':
				return {
					displayedAt: 'string',
					lastExecutionAt: 'string',
					firstExecutionAt: 'string',
					hasStopBeenReached: 'string',
				};
			case 'webhook':
				return {
					displayedAt: 'string',
					lastExecutionAt: 'string',
					firstExecutionAt: 'string',
					responseReceivedAt: 'string',
					requestSentAt: 'string',
				};
			default:
				return {};
		}
	}

	async formatPublications(template_id: string, variables: any) {
		const template = await this.prismaService.template.findUnique({
			where: {
				id: template_id,
			},
			include: {
				Publications: true,
				Interactions: true,
			},
		});

		const publications = {};

		template.Publications.forEach((publication) => {
			const interactions = template.Interactions.filter(
				(interaction) => interaction.publication_id === publication.id,
			);

			const newInteractions = interactions.map((interaction) => {
				return {
					consumer: {
						id: interaction.user_id,
					},
					events: interaction.events,
					locations: interaction.locations,
					data: interaction.data,
				};
			});

			publications[publication.title] = newInteractions;
		});

		variables.publications = publications;
	}
}
