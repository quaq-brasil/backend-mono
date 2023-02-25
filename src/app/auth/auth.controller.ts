import { Body, Controller, Get, Post } from '@nestjs/common'
import { AuthService } from './auth.service'

@Controller('api/v1/auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	async login(@Body() body) {
		return { token: await this.authService.login(body.email, body.password) }
	}

	@Get('test')
	test() {
		return {
			name: 'carlos daniel',
		}
	}
}
