import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { PrismaService } from './../../prisma.service'

@Injectable()
export class WorkspaceGuard implements CanActivate {
	constructor(private prismaService: PrismaService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const data = context.switchToHttp().getRequest()

		console.log(data)

		// const workspace = await this.prismaService.workspace.
		return true
	}
}
