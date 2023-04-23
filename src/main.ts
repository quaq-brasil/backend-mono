import { ValidationPipe } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import { inject } from "@vercel/analytics"
import { AppModule } from "./app.module"
import { PrismaService } from "./prisma.service"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(new ValidationPipe())

  const prismaService = app.get(PrismaService)
  await prismaService.enableShutdownHooks(app)

  app.enableCors({
    allowedHeaders: "*",
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
  })

  app.useGlobalPipes(new ValidationPipe())

  inject()

  await app.listen(5000)
}
bootstrap()
