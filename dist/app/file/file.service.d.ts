import { PrismaService } from 'src/prisma.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
export declare class FileService {
    private prismaService;
    constructor(prismaService: PrismaService);
    createOne(request: CreateFileDto): import(".prisma/client").Prisma.Prisma__FileClient<import(".prisma/client").File, never>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__FileClient<import(".prisma/client").File, never>;
    findOneByUrl(url: string): import(".prisma/client").PrismaPromise<import(".prisma/client").File[]>;
    updateOne(id: string, request: UpdateFileDto): import(".prisma/client").Prisma.Prisma__FileClient<import(".prisma/client").File, never>;
    deleteOne(id: string): import(".prisma/client").Prisma.Prisma__FileClient<import(".prisma/client").File, never>;
}
