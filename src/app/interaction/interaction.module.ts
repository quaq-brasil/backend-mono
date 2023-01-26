import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { InteractionController } from './interaction.controller';
import { InteractionService } from './interaction.service';

@Module({
  controllers: [InteractionController],
  providers: [InteractionService, PrismaService],
})
export class InteractionModule {}
