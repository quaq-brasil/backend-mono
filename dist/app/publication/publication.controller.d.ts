import { CreatePublicationRequest } from './dto/create-publication-request';
import { UpdatePublicationRequest } from './dto/update-publication-request';
import { PublicationService } from './publication.service';
export declare class PublicationController {
    private readonly publicationService;
    constructor(publicationService: PublicationService);
    create(createPublicationDto: CreatePublicationRequest): Promise<import(".prisma/client").Publication>;
    findOne(id: string): Promise<import(".prisma/client").Publication>;
    update(id: string, updatePublicationDto: UpdatePublicationRequest): Promise<import(".prisma/client").Publication>;
    findManyByTemplateId(template_id: string): Promise<import(".prisma/client").Publication[]>;
    findManyByPageId(page_id: string): Promise<import(".prisma/client").Publication[]>;
}
