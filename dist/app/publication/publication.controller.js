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
exports.PublicationController = void 0;
const common_1 = require("@nestjs/common");
const parseObjectIdPipe_helper_1 = require("../../helpers/parseObjectIdPipe.helper");
const create_publication_request_1 = require("./dto/create-publication-request");
const update_publication_request_1 = require("./dto/update-publication-request");
const publication_service_1 = require("./publication.service");
let PublicationController = class PublicationController {
    constructor(publicationService) {
        this.publicationService = publicationService;
    }
    create(createPublicationDto) {
        return this.publicationService.createOne(createPublicationDto);
    }
    findOne(id) {
        return this.publicationService.findOne(id);
    }
    update(id, updatePublicationDto) {
        return this.publicationService.updateOne(id, updatePublicationDto);
    }
    findManyByTemplateId(template_id) {
        return this.publicationService.findManyByTemplateId(template_id);
    }
    findManyByPageId(page_id) {
        return this.publicationService.findManyByPageId(page_id);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_publication_request_1.CreatePublicationRequest]),
    __metadata("design:returntype", void 0)
], PublicationController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', parseObjectIdPipe_helper_1.ParseObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PublicationController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', parseObjectIdPipe_helper_1.ParseObjectIdPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_publication_request_1.UpdatePublicationRequest]),
    __metadata("design:returntype", void 0)
], PublicationController.prototype, "update", null);
__decorate([
    (0, common_1.Get)('template/:template_id'),
    __param(0, (0, common_1.Param)('template_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PublicationController.prototype, "findManyByTemplateId", null);
__decorate([
    (0, common_1.Get)('page/:page_id'),
    __param(0, (0, common_1.Param)('page_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PublicationController.prototype, "findManyByPageId", null);
PublicationController = __decorate([
    (0, common_1.Controller)('api/v1/publications'),
    __metadata("design:paramtypes", [publication_service_1.PublicationService])
], PublicationController);
exports.PublicationController = PublicationController;
//# sourceMappingURL=publication.controller.js.map