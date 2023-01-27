import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { PageService } from './page.service';
export declare class PageController {
    private readonly pageService;
    constructor(pageService: PageService);
    create(createPageDto: CreatePageDto): Promise<import(".prisma/client").Page>;
    findAll(): import(".prisma/client").PrismaPromise<import(".prisma/client").Page[]>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__PageClient<import(".prisma/client").Page, never>;
    findOneByUrl(url: string): import(".prisma/client").Prisma.Prisma__PageClient<import(".prisma/client").Page, never>;
    findAllByWorkspaceId(workspace_id: string): import(".prisma/client").PrismaPromise<import(".prisma/client").Page[]>;
    update(id: string, updatePageDto: UpdatePageDto): Promise<import(".prisma/client").Page>;
    remove(id: string): Promise<void>;
    checkIfUrlAlreadyUsed(url: string): Promise<boolean>;
}
