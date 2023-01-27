"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt_1 = require("bcrypt");
const prisma_service_1 = require("../../prisma.service");
let UserService = class UserService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async create(createUserDto) {
        const user = await this.prismaService.user.create({
            data: createUserDto,
        });
        delete user.password;
        return user;
    }
    async findOne(id) {
        try {
            return await this.prismaService.user.findUniqueOrThrow({
                where: {
                    id,
                },
            });
        }
        catch (error) {
            throw new common_1.NotFoundException(error.message);
        }
    }
    async findOneByEmail(email) {
        try {
            return await this.prismaService.user.findUniqueOrThrow({
                where: {
                    email,
                },
            });
        }
        catch (error) {
            throw new common_1.NotFoundException(error.message);
        }
    }
    async update(id, updateUserDto) {
        let hashPassword;
        if (updateUserDto === null || updateUserDto === void 0 ? void 0 : updateUserDto.password) {
            hashPassword = (0, bcrypt_1.hashSync)(updateUserDto.password, 10);
        }
        try {
            const user = await this.prismaService.user.update({
                where: {
                    id,
                },
                data: Object.assign(Object.assign({}, updateUserDto), { password: hashPassword || undefined }),
            });
            delete user.password;
            return user;
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async remove(id) {
        await this.prismaService.user.delete({
            where: {
                id,
            },
        });
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map