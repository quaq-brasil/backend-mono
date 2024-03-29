import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { AbilityModule } from "./app/ability/ability.module"
import { AuthModule } from "./app/auth/auth.module"
import { BlockModule } from "./app/block/block.module"
import { EntrypointModule } from "./app/entrypoint/entrypoint.module"
import { FileModule } from "./app/file/file.module"
import { InteractionModule } from "./app/interaction/interaction.module"
import { PageModule } from "./app/page/page.module"
import { PublicationModule } from "./app/publication/publication.module"
import { RaffleModule } from "./app/raffle/raffle.module"
import { S3FileUploadModule } from "./app/s3-upload/s3-upload.module"
import { SitemapModule } from "./app/sitemap/sitemap.module"
import { TemplateModule } from "./app/template/template.module"
import { UserModule } from "./app/user/user.module"
import { VariablesModule } from "./app/variables/variables.module"
import { WorkspaceModule } from "./app/workspace/workspace.module"

@Module({
  imports: [
    ConfigModule.forRoot(),
    TemplateModule,
    PublicationModule,
    UserModule,
    FileModule,
    PageModule,
    WorkspaceModule,
    InteractionModule,
    AuthModule,
    VariablesModule,
    S3FileUploadModule,
    AbilityModule,
    EntrypointModule,
    BlockModule,
    SitemapModule,
    RaffleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(
  //       rateLimit({
  //         windowMs: 15 * 60 * 1000, // 15 minutes
  //         max: 200, // limit each IP to 100 requests per windowMs
  //       })
  //     )
  //     .forRoutes({ path: "*", method: RequestMethod.ALL })
  // }
}
