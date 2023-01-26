import { Module } from '@nestjs/common';
import { FileModule } from './file/file.module';
import { InteractionModule } from './interaction/interaction.module';
import { PageModule } from './page/page.module';
import { PublicationModule } from './publication/publication.module';
import { TemplateModule } from './template/template.module';
import { UserModule } from './user/user.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PublicationModule,
    TemplateModule,
    FileModule,
    UserModule,
    PageModule,
    WorkspaceModule,
    InteractionModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
