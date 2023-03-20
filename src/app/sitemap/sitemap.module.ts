import { Module } from "@nestjs/common"
import { PrismaService } from "src/prisma.service"
import { SitemapController } from "./sitemap.controller"
import { SitemapService } from "./sitemap.service"

@Module({
  controllers: [SitemapController],
  providers: [SitemapService, PrismaService],
})
export class SitemapModule {}
