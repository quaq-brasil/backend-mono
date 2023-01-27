import { PrismaService } from 'src/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserService {
    private prismaService;
    constructor(prismaService: PrismaService);
    create(createUserDto: any): Promise<import(".prisma/client").User>;
    findOne(id: string): Promise<import(".prisma/client").User>;
    findOneByEmail(email: string): Promise<import(".prisma/client").User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<import(".prisma/client").User>;
    remove(id: string): Promise<void>;
}
