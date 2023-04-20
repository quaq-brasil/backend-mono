import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from "@nestjs/common"
import { JwtGuard } from "../auth/jwt.guard"
import { UpdateUserDto } from "./dto/update-user.dto"
import { UserService } from "./user.service"

@Controller("api/v1/users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create() {
    return await this.userService.create()
  }

  @UseGuards(JwtGuard)
  @Get()
  async findOne(@Req() req) {
    return await this.userService.findOne(req.user.sub)
  }

  // @UseGuards(JwtGuard)
  @Put(":user_id")
  async update(
    @Param("user_id") user_id: string,
    @Req() req,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return await this.userService.update(user_id, updateUserDto)
  }

  @UseGuards(JwtGuard)
  @Delete(":user_id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Req() req) {
    return await this.userService.remove(req.user.sub)
  }
}
