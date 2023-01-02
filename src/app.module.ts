import { Module } from '@nestjs/common';
import { PublicationModule } from './publication/publication.module';
import { TemplateModule } from './template/template.module';

@Module({
  imports: [PublicationModule, TemplateModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
