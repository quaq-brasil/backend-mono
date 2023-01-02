import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateTemplateRequest } from './dto/create-template-request';
import { UpdateTemplateRequest } from './dto/update-template-request';
import { TemplateService } from './template.service';

@Controller('template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Post()
  create(@Body() createTemplateDto: CreateTemplateRequest) {
    return this.templateService.createOne(createTemplateDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.templateService.findOne(id);
  }

  @Get('url/:url')
  findOneByUrl(@Param('url') url: string) {
    return this.templateService.findOneByUrl(url);
  }

  @Get('page/:page_id')
  findManyByPageId(@Param('page_id') page_id: string) {
    return this.templateService.findManyByPageId(page_id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTemplateDto: UpdateTemplateRequest,
  ) {
    return this.templateService.updateOne(id, updateTemplateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.templateService.removeOne(id);
  }
}
