import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './app/auth/auth.module';
import { FileModule } from './app/file/file.module';
import { InteractionModule } from './app/interaction/interaction.module';
import { PageModule } from './app/page/page.module';
import { PublicationModule } from './app/publication/publication.module';
import { TemplateModule } from './app/template/template.module';
import { UserModule } from './app/user/user.module';
import { WorkspaceModule } from './app/workspace/workspace.module';

@Module({
	imports: [
		ConfigModule.forRoot(),
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
