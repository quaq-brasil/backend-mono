import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ParseObjectIdPipe } from 'src/helpers/parseObjectIdPipe.helper';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileService } from './file.service';

@Controller('api/v1/files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  create(@Body() createFileDto: CreateFileDto) {
    return this.fileService.createOne(createFileDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.fileService.findOne(id);
  }

  @Get('url/:url')
  findOneByUrl(@Param('url') url: string) {
    return this.fileService.findOneByUrl(url);
  }

  @Put(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateFileDto: UpdateFileDto,
  ) {
    return this.fileService.updateOne(id, updateFileDto);
  }

  @Delete(':id')
  deleteOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.fileService.deleteOne(id);
  }
}
