import { Module } from '@nestjs/common';
import { PublicationModule } from './publication/publication.module';

@Module({
  imports: [PublicationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
