import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { hashSync } from "bcrypt"
import { PrismaService } from "src/prisma.service"
import { UpdateUserDto } from "./dto/update-user.dto"

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name)

  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService
  ) {}

  async create() {
    const user = await this.prismaService.user.create({
      data: {
        name: `User ${Math.floor(Math.random() * 10000)}`,
      },
    })

    delete user.password

    const payload = {
      sub: user.id,
      type: user.type,
      email: "",
      name: user.name,
      avatar_url: "",
    }

    const token = this.jwtService.sign(payload)

    return { ...user, token }
  }

  async findOne(id: string) {
    try {
      const user = await this.prismaService.user.findUniqueOrThrow({
        where: {
          id,
        },
      })

      delete user.password

      return user
    } catch (error) {
      throw new NotFoundException(error.message)
    }
  }

  async findOneByEmail(email: string) {
    try {
      const user = await this.prismaService.user.findUniqueOrThrow({
        where: {
          email,
        },
      })

      delete user.password

      return user
    } catch (error) {
      throw new NotFoundException(error.message)
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto?.email) {
      if (await this.isEmailTaken(updateUserDto?.email, id)) {
        throw new ConflictException("Email is already in use")
      }
    }

    let hashPassword: string

    if (updateUserDto?.password) {
      hashPassword = hashSync(updateUserDto.password, 10)
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
      })

      delete user.password

      return user
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async remove(id: string) {
    await this.prismaService.user.delete({
      where: {
        id,
      },
    })
  }

  async isEmailTaken(email: string, id?: string) {
    if (id) {
      try {
        const user = await this.prismaService.user.findUnique({
          where: { email },
        })

        if (!user) {
          return false
        }

        return user.id !== id
      } catch (error) {
        this.logger.error(`Error checking if email is taken: ${error.message}`)
        throw new BadRequestException({ message: error.message })
      }
    }

    try {
      return (
        (await this.prismaService.user.findMany({ where: { email } })).length >
        0
      )
    } catch (error) {
      this.logger.error(`Error checking if email is taken: ${error.message}`)
      throw new BadRequestException({ message: error.message })
    }
  }
}
