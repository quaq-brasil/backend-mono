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
exports.PublicationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
let PublicationService = class PublicationService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async createOne(request) {
        return this.prismaService.publication.create({
            data: request,
        });
    }
    async findOne(id) {
        return this.prismaService.publication.findUnique({
            where: {
                id,
            },
        });
    }
    async findManyByTemplateId(template_id) {
        return this.prismaService.publication.findMany({
            where: {
                template_id,
            },
        });
    }
    async findManyByPageId(page_id) {
        return this.prismaService.publication.findMany({
            where: {
                page_id,
            },
        });
    }
    async updateOne(id, request) {
        return this.prismaService.publication.update({
            where: {
                id,
            },
            data: request,
        });
    }
};
PublicationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PublicationService);
exports.PublicationService = PublicationService;
//# sourceMappingURL=publication.service.js.map