import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { JwtGuard } from './jwt.guard'

@Controller('api/v1/auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	async login(@Body() body) {
		return { token: await this.authService.login(body.email, body.password) }
	}

	@UseGuards(JwtGuard)
	@Get('test')
	test() {
		return {
			name: 'carlos daniel',
		}
	}
}
