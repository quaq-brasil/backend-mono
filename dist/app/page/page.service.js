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
exports.PageService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
let PageService = class PageService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async create(createPageDto) {
        if (await this.checkIfUrlAlreadyUsed(createPageDto.url)) {
            throw new common_1.ConflictException('Url already used');
        }
        return this.prismaService.page.create({
            data: createPageDto,
        });
    }
    findAll() {
        return this.prismaService.page.findMany();
    }
    findOne(id) {
        return this.prismaService.page.findUnique({
            where: {
                id,
            },
        });
    }
    findOneByUrl(url) {
        return this.prismaService.page.findUnique({
            where: {
                url,
            },
        });
    }
    findAllByWorkspaceId(workspace_id) {
        return this.prismaService.page.findMany({
            where: {
                workspace_id,
            },
        });
    }
    async update(id, updatePageDto) {
        if (await this.checkIfUrlAlreadyUsed(updatePageDto.url)) {
            throw new Error('Url already used');
        }
        return this.prismaService.page.update({
            where: {
                id,
            },
            data: updatePageDto,
        });
    }
    async remove(id) {
        await this.prismaService.page.delete({
            where: {
                id,
            },
        });
    }
    async checkIfUrlAlreadyUsed(url) {
        if (!url)
            return false;
        const page = await this.prismaService.page.findUnique({
            where: {
                url,
            },
        });
        if (page) {
            return true;
        }
        else {
            return false;
        }
    }
};
PageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PageService);
exports.PageService = PageService;
//# sourceMappingURL=page.service.js.map