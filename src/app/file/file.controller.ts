import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	UseGuards,
} from '@nestjs/common'
import { JwtGuard } from '../auth/jwt.guard'
import { CreateFileDto } from './dto/create-file.dto'
import { UpdateFileDto } from './dto/update-file.dto'
import { FileService } from './file.service'

@UseGuards(JwtGuard)
@Controller('api/v1/files')
export class FileController {
	constructor(private readonly fileService: FileService) {}

	@Post()
	create(@Body() createFileDto: CreateFileDto) {
		return this.fileService.createOne(createFileDto)
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.fileService.findOne(id)
	}

	@Get('url/:url')
	findOneByUrl(@Param('url') url: string) {
		return this.fileService.findOneByUrl(url)
	}

	@Put(':id')
	update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
		return this.fileService.updateOne(id, updateFileDto)
	}

	@Delete(':id')
	deleteOne(@Param('id') id: string) {
		return this.fileService.deleteOne(id)
	}
}
