import { Module } from '@nestjs/common';
import { PublicationModule } from './publication/publication.module';
import { TemplateModule } from './template/template.module';
import { FileModule } from './file/file.module';
import { UserModule } from './user/user.module';
import { PageModule } from './page/page.module';
import { WorkspaceModule } from './workspace/workspace.module';

@Module({
  imports: [PublicationModule, TemplateModule, FileModule, UserModule, PageModule, WorkspaceModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
