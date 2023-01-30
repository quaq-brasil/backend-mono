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
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { WorkspaceService } from './workspace.service';

@Controller('api/v1/workspaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  create(@Body() createWorkspaceDto: CreateWorkspaceDto) {
    return this.workspaceService.create(createWorkspaceDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.workspaceService.findOne(id);
  }

  @Get('/user/:id')
  findManyByUserId(@Param('id', ParseObjectIdPipe) id: string) {
    return this.workspaceService.findAllByUserId(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    return this.workspaceService.update(id, updateWorkspaceDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.workspaceService.remove(id);
  }
}
