import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class VariablesService {
	constructor(private prismaService: PrismaService) {}

	async findPanelVariables(
		creator_id: string,
		blocks?: any[],
		template_id?: string,
		connectedTemplates?: string[],
	) {
		const variables: any = {
			consumer: {},
			events: {},
			blocks: {},
			publications: {},
		};

		await this.findAllVariablesAvailable(
			creator_id,
			variables,
			blocks,
			template_id,
		);

		await this.formatConnectedTemplates(variables, connectedTemplates);

		return variables;
	}

	async findAllVariablesAvailable(
		creator_id: string,
		variables: any,
		blocks?: any[],
		template_id?: string,
	) {
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
			registration_status: 'string',
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
				data: {},
				events: {},
			};

			this.formatBlockData(block, newBlocks);
			this.formatBlockEvents(block, newBlocks);

			variables.blocks[block.saveAs] = newBlocks;
		});
	}

	async formatBlockData(block: any, variables: any) {
		switch (block.type) {
			case 'textentry':
				variables.data = {
					value: 'string',
				};
				break;
			case 'pool':
				variables.data = {
					selected_options: 'string list',
					number_of_selections: 'number',
				};
				break;

			case 'button':
				variables.data = {
					clicked: 'boolean',
				};
				break;

			case 'review':
				variables.data = {
					review: 'number',
				};
				break;

			case 'webhook':
				variables.data = {
					header: 'string',
					body: 'string',
				};
				break;

			default:
				variables.data = {};
				break;
		}
	}

	async formatBlockEvents(block: any, variables: any) {
		switch (block.type) {
			case 'text':
				variables.events = {
					displayedAt: 'string',
				};
				break;
			case 'image':
				variables.events = {
					displayedAt: 'string',
				};
				break;
			case 'chart':
				variables.events = {
					displayedAt: 'string',
				};
				break;
			case 'textentry':
				variables.events = {
					displayedAt: 'string',
					lastInteractionAt: 'string',
					firstInteractionAt: 'string',
				};
				break;
			case 'pool':
				variables.events = {
					displayedAt: 'string',
					lastInteractionAt: 'string',
					firstInteractionAt: 'string',
					maxAchievedAt: 'string',
					minAchievedAt: 'string',
				};
				break;
			case 'button':
				variables.events = {
					displayedAt: 'string',
					lastInteractionAt: 'string',
					firstInteractionAt: 'string',
				};
				break;
			case 'review':
				variables.events = {
					displayedAt: 'string',
					lastInteractionAt: 'string',
					firstInteractionAt: 'string',
				};
				break;
			case 'automation':
				variables.events = {
					displayedAt: 'string',
					lastExecutionAt: 'string',
					firstExecutionAt: 'string',
					hasStopBeenReached: 'string',
				};
				break;
			case 'webhook':
				variables.events = {
					displayedAt: 'string',
					lastExecutionAt: 'string',
					firstExecutionAt: 'string',
					responseReceivedAt: 'string',
					requestSentAt: 'string',
				};
				break;
			default:
				variables.events = {};
				break;
		}
	}

	async formatPublications(template_id: string, variables: any) {
		try {
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
		} catch (error) {
			console.log(error);
		}
	}

	async formatConnectedTemplates(variables: any, connectedTemplates: string[]) {
		if (connectedTemplates && connectedTemplates.length > 0) {
			await Promise.all(
				connectedTemplates.map(async (id) => {
					variables[id] = {};

					await this.findAllVariablesAvailable(
						undefined,
						variables[id],
						undefined,
						id,
					);
				}),
			);
		}
	}
}
