import { Module } from '@nestjs/common';
import { PublicationModule } from './publication/publication.module';
import { TemplateModule } from './template/template.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [PublicationModule, TemplateModule, FileModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
