import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileService } from './file.service';
export declare class FileController {
    private readonly fileService;
    constructor(fileService: FileService);
    create(createFileDto: CreateFileDto): import(".prisma/client").Prisma.Prisma__FileClient<import(".prisma/client").File, never>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__FileClient<import(".prisma/client").File, never>;
    findOneByUrl(url: string): import(".prisma/client").PrismaPromise<import(".prisma/client").File[]>;
    update(id: string, updateFileDto: UpdateFileDto): import(".prisma/client").Prisma.Prisma__FileClient<import(".prisma/client").File, never>;
    deleteOne(id: string): import(".prisma/client").Prisma.Prisma__FileClient<import(".prisma/client").File, never>;
}
