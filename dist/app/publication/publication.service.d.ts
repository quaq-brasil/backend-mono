import { PrismaService } from 'src/prisma.service';
import { CreatePublicationRequest } from './dto/create-publication-request';
import { UpdatePublicationRequest } from './dto/update-publication-request';
export declare class PublicationService {
    private prismaService;
    constructor(prismaService: PrismaService);
    createOne(request: CreatePublicationRequest): Promise<import(".prisma/client").Publication>;
    findOne(id: string): Promise<import(".prisma/client").Publication>;
    findManyByTemplateId(template_id: string): Promise<import(".prisma/client").Publication[]>;
    findManyByPageId(page_id: string): Promise<import(".prisma/client").Publication[]>;
    updateOne(id: string, request: UpdatePublicationRequest): Promise<import(".prisma/client").Publication>;
}
