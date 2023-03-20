import { Controller, Get, Response } from "@nestjs/common"
import { SitemapStream, streamToPromise } from "sitemap"
import { SitemapService } from "./sitemap.service"

@Controller("api/v1/sitemap")
export class SitemapController {
  constructor(private readonly sitemapService: SitemapService) {}

  @Get()
  async sitemap(@Response() res) {
    res.set("Content-Type", "text/xml")

    const sitemaps = await this.sitemapService.findAll()

    const smStream = new SitemapStream({
      hostname: "https://quaq.me",
    })
    sitemaps.forEach((page) => {
      smStream.write({
        url: page,
        changefreq: "daily",
        priority: 1,
      })
    })
    smStream.end()
    streamToPromise(smStream).then((xml) => {
      res.send(xml)
    })
  }
}
