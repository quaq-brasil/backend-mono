import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hashSync } from 'bcrypt';
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

  async findOne(id: string) {
    try {
      return await this.prismaService.user.findUniqueOrThrow({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async findOneByEmail(email: string) {
    try {
      return await this.prismaService.user.findUniqueOrThrow({
        where: {
          email,
        },
      });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    let hashPassword: string;

    if (updateUserDto?.password) {
      hashPassword = hashSync(updateUserDto.password, 10);
    }

    try {
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
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    await this.prismaService.user.delete({
      where: {
        id,
      },
    });
  }
}
