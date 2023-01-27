import { CreateTemplateRequest } from './dto/create-template-request';
import { UpdateTemplateRequest } from './dto/update-template-request';
import { TemplateService } from './template.service';
export declare class TemplateController {
    private readonly templateService;
    constructor(templateService: TemplateService);
    create(createTemplateDto: CreateTemplateRequest): Promise<import(".prisma/client").Template>;
    findOne(id: string): Promise<import(".prisma/client").Template>;
    findOneByUrl(url: string): Promise<import(".prisma/client").Template>;
    findManyByPageId(page_id: string): Promise<import(".prisma/client").Template[]>;
    update(id: string, updateTemplateDto: UpdateTemplateRequest): import(".prisma/client").Prisma.Prisma__TemplateClient<import(".prisma/client").Template, never>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__TemplateClient<import(".prisma/client").Template, never>;
}
