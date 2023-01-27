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
exports.InteractionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
let InteractionService = class InteractionService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    create(createInteractionDto) {
        return this.prismaService.interaction.create({
            data: createInteractionDto,
        });
    }
    findOne(id) {
        return this.prismaService.interaction.findUnique({
            where: {
                id: id,
            },
        });
    }
    findAllByUserId(user_id) {
        return this.prismaService.interaction.findMany({
            where: {
                user_id: user_id,
            },
        });
    }
    findAllByPageId(page_id) {
        return this.prismaService.interaction.findMany({
            where: {
                page_id: page_id,
            },
        });
    }
    findAllByPublicationId(publication_id) {
        return this.prismaService.interaction.findMany({
            where: {
                publication_id: publication_id,
            },
        });
    }
    update(id, updateInteractionDto) {
        return this.prismaService.interaction.update({
            where: {
                id: id,
            },
            data: updateInteractionDto,
        });
    }
};
InteractionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InteractionService);
exports.InteractionService = InteractionService;
//# sourceMappingURL=interaction.service.js.map