import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ParseObjectIdPipe } from 'src/helpers/parseObjectIdPipe.helper';
import { CreatePublicationRequest } from './dto/create-publication-request';
import { UpdatePublicationRequest } from './dto/update-publication-request';
import { PublicationService } from './publication.service';

@Controller('api/v1/publications')
export class PublicationController {
  constructor(private readonly publicationService: PublicationService) {}

  @Post()
  create(@Body() createPublicationDto: CreatePublicationRequest) {
    return this.publicationService.createOne(createPublicationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.publicationService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updatePublicationDto: UpdatePublicationRequest,
  ) {
    return this.publicationService.updateOne(id, updatePublicationDto);
  }

  @Get('template/:template_id')
  findManyByTemplateId(@Param('template_id') template_id: string) {
    return this.publicationService.findManyByTemplateId(template_id);
  }

  @Get('page/:page_id')
  findManyByPageId(@Param('page_id') page_id: string) {
    return this.publicationService.findManyByPageId(page_id);
  }
}