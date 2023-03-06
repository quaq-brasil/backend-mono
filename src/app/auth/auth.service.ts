import { BadRequestException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class AuthService {
	constructor(
		private prismaService: PrismaService,
		private jwtService: JwtService,
	) {}

	async login(email: string, password: string) {
		const user = await this.validateCredentials(email, password)

		const payload = {
			sub: user.id,
			email: user.email,
			name: user.name,
			avatar_url: user.avatar_url,
			workspaces: user.workspaces,
		}

		return this.jwtService.sign(payload)
	}

	async validateCredentials(email: string, password: string) {
		try {
			const user = await this.prismaService.user.findUniqueOrThrow({
				where: {
					email,
				},
				include: {
					workspaces: {
						select: {
							workspace: {
								select: {
									id: true,
									slug: true,
									Page: {
										select: {
											id: true,
											slug: true,
										},
									},
								},
							},
						},
					},
				},
			})

			const workspaces = user.workspaces.map((workspace) => workspace.workspace)

			if (bcrypt.compareSync(password, user?.password)) {
				delete user.password
				return {
					...user,
					workspaces: workspaces,
				}
			}

			throw new BadRequestException({
				message: 'email or password are incorrect!',
			})
		} catch (err) {
			throw new BadRequestException({
				message: 'email or password are incorrect!',
			})
		}
	}
}
