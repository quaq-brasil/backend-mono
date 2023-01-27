import { PrismaService } from 'src/prisma.service';
import { CreateTemplateRequest } from './dto/create-template-request';
import { UpdateTemplateRequest } from './dto/update-template-request';
export declare class TemplateService {
    private prismaService;
    constructor(prismaService: PrismaService);
    createOne(request: CreateTemplateRequest): Promise<import(".prisma/client").Template>;
    findOne(id: string): Promise<import(".prisma/client").Template>;
    findOneByUrl(url: string): Promise<import(".prisma/client").Template>;
    findManyByPageId(page_id: string): Promise<import(".prisma/client").Template[]>;
    updateOne(id: string, request: UpdateTemplateRequest): import(".prisma/client").Prisma.Prisma__TemplateClient<import(".prisma/client").Template, never>;
    removeOne(id: string): import(".prisma/client").Prisma.Prisma__TemplateClient<import(".prisma/client").Template, never>;
}
