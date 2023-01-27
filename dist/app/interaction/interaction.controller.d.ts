import { CreateInteractionDto } from './dto/create-interaction.dto';
import { UpdateInteractionDto } from './dto/update-interaction.dto';
import { InteractionService } from './interaction.service';
export declare class InteractionController {
    private readonly interactionService;
    constructor(interactionService: InteractionService);
    create(createInteractionDto: CreateInteractionDto): import(".prisma/client").Prisma.Prisma__InteractionClient<import(".prisma/client").Interaction, never>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__InteractionClient<import(".prisma/client").Interaction, never>;
    findAllByUserId(user_id: string): import(".prisma/client").PrismaPromise<import(".prisma/client").Interaction[]>;
    findAllByPageId(page_id: string): import(".prisma/client").PrismaPromise<import(".prisma/client").Interaction[]>;
    findAllByPublicationId(publication_id: string): import(".prisma/client").PrismaPromise<import(".prisma/client").Interaction[]>;
    update(id: string, updateInteractionDto: UpdateInteractionDto): import(".prisma/client").Prisma.Prisma__InteractionClient<import(".prisma/client").Interaction, never>;
}
