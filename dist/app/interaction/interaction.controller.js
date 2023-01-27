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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionController = void 0;
const common_1 = require("@nestjs/common");
const parseObjectIdPipe_helper_1 = require("../../helpers/parseObjectIdPipe.helper");
const create_interaction_dto_1 = require("./dto/create-interaction.dto");
const update_interaction_dto_1 = require("./dto/update-interaction.dto");
const interaction_service_1 = require("./interaction.service");
let InteractionController = class InteractionController {
    constructor(interactionService) {
        this.interactionService = interactionService;
    }
    create(createInteractionDto) {
        return this.interactionService.create(createInteractionDto);
    }
    findOne(id) {
        return this.interactionService.findOne(id);
    }
    findAllByUserId(user_id) {
        return this.interactionService.findAllByUserId(user_id);
    }
    findAllByPageId(page_id) {
        return this.interactionService.findAllByPageId(page_id);
    }
    findAllByPublicationId(publication_id) {
        return this.interactionService.findAllByPublicationId(publication_id);
    }
    update(id, updateInteractionDto) {
        return this.interactionService.update(id, updateInteractionDto);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_interaction_dto_1.CreateInteractionDto]),
    __metadata("design:returntype", void 0)
], InteractionController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', parseObjectIdPipe_helper_1.ParseObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InteractionController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('user/:user_id'),
    __param(0, (0, common_1.Param)('user_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InteractionController.prototype, "findAllByUserId", null);
__decorate([
    (0, common_1.Get)('page/:page_id'),
    __param(0, (0, common_1.Param)('page_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InteractionController.prototype, "findAllByPageId", null);
__decorate([
    (0, common_1.Get)('publication/:publication_id'),
    __param(0, (0, common_1.Param)('publication_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InteractionController.prototype, "findAllByPublicationId", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', parseObjectIdPipe_helper_1.ParseObjectIdPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_interaction_dto_1.UpdateInteractionDto]),
    __metadata("design:returntype", void 0)
], InteractionController.prototype, "update", null);
InteractionController = __decorate([
    (0, common_1.Controller)('api/v1/interactions'),
    __metadata("design:paramtypes", [interaction_service_1.InteractionService])
], InteractionController);
exports.InteractionController = InteractionController;
//# sourceMappingURL=interaction.controller.js.map