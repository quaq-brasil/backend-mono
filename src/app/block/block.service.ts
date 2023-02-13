import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from 'src/prisma.service';

type WebhookBlock = {
	id: string;
	type: string;
	save_as: string;
	data: {
		type?: string;
		link?: string;
		parameters?: string;
		header?: any;
		body?: any;
	};
};

@Injectable()
export class BlockService {
	private instance: BlockService;

	getInstance() {
		if (!this.instance) {
			this.instance = new BlockService(this.prismaService);
		}
		return this.instance;
	}

	constructor(private prismaService: PrismaService) {}

	async webhookBlockExecution(blocks: WebhookBlock[], data: any[]) {
		if (blocks) {
			await Promise.all(
				blocks.map(async (block) => {
					if (block.type === 'webhook') {
						const newData = await this.webhookBlock(block, data);
						data.push(newData);
					}
				}),
			);
		}

		return data;
	}

	async webhookBlock(block: WebhookBlock, data: any[]) {
		let url = block.data.link;

		if (block.data.parameters) {
			url = `${block.data.link}/${block.data.parameters}`;
		}

		const webhookData = {
			config: {
				id: block.id as string,
				save_as: block.save_as as string,
				type: block.type as string,
				data: {
					type: block.data.type,
					link: block.data.link,
					header: block.data.header,
					parameters: block.data.parameters,
					body: block.data.body,
				},
			},
			output: {
				events: {},
				data: {
					data: {},
				},
			},
		};

		const api = axios.create({});

		if (block.data.header) {
			const headers = JSON.parse(block.data.header);
			api.defaults.headers = headers;
		}

		const body = JSON.parse(block.data.body);

		console.log('body', body);

		try {
			switch (block.data.type) {
				case 'GET':
					const getResponse = await api.get(url, body);

					webhookData.output.data = getResponse.data;
					return webhookData;

				case 'POST':
					const postResponse = await api.post(url, body);

					webhookData.output.data = postResponse.data;
					return webhookData;

				case 'PATCH':
					const patchResponse = await api.patch(url, body);

					webhookData.output.data = patchResponse.data;
					return webhookData;

				case 'DELETE':
					const DeleteResponse = await api.delete(url, body);

					webhookData.output.data = DeleteResponse.data;
					return webhookData;
			}
		} catch (error) {
			console.log(error);
		}
	}

	variablesValues = {
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
