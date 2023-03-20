import { Injectable } from "@nestjs/common"
import { PrismaService } from "src/prisma.service"

@Injectable()
export class SitemapService {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    const pages = await this.prismaService.page.findMany({
      select: {
        slug: true,
        templates: {
          select: {
            slug: true,
            visibility: true,
          },
        },
      },
      where: {
        visibility: "public",
      },
    })

    const sitemap: string[] = []

    pages.forEach((page) => {
      sitemap.push(page.slug)

      page.templates.forEach((template) => {
        if (template.visibility === "public") {
          sitemap.push(`${page.slug}/${template.slug}`)
        }
      })
    })

    return sitemap
  }
}
