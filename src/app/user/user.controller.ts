import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Put,
	Req,
} from '@nestjs/common'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserService } from './user.service'

@Controller('api/v1/users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	async create() {
		return await this.userService.create()
	}

	@Get()
	async findOne(@Req() req) {
		return await this.userService.findOne(req.user.sub)
	}

	@Put(':id')
	async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return await this.userService.update(id, updateUserDto)
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	async remove(@Param('id') id: string) {
		return await this.userService.remove(id)
	}
}
