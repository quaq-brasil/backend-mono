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
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { PageService } from './page.service';

@Controller('api/v1/pages')
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @Post()
  create(@Body() createPageDto: CreatePageDto) {
    return this.pageService.create(createPageDto);
  }

  @Get()
  findAll() {
    return this.pageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.pageService.findOne(id);
  }

  @Get('url/:url')
  findOneByUrl(@Param('url') url: string) {
    return this.pageService.findOneByUrl(url);
  }

  @Get('workspace/:workspace_id')
  findAllByWorkspaceId(@Param('workspace_id') workspace_id: string) {
    return this.pageService.findAllByWorkspaceId(workspace_id);
  }

  @Put(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updatePageDto: UpdatePageDto,
  ) {
    return this.pageService.update(id, updatePageDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.pageService.remove(id);
  }

  @Get('check-url/:url')
  checkIfUrlAlreadyUsed(@Param('url') url: string) {
    return this.pageService.checkIfUrlAlreadyUsed(url);
  }
}
