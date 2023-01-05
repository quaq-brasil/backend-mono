import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async create(createUserDto) {
    const user = await this.prismaService.user.create({
      data: createUserDto,
    });

    delete user.password;

    return user;
  }

  findOne(id: string) {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    let hashPassword: string;

    if (updateUserDto?.password) {
      hashPassword = await hash(updateUserDto.password, 10);
    }

    const user = await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        ...updateUserDto,
        password: hashPassword || undefined,
      },
    });

    delete user.password;

    return user;
  }

  async remove(id: string) {
    await this.prismaService.user.delete({
      where: {
        id,
      },
    });
  }

  async login(email: string, password: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordCorrect = await compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Invalid credentials');
    }

    delete user.password;

    return user;
  }
}
