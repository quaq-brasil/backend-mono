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
exports.TemplateController = void 0;
const common_1 = require("@nestjs/common");
const parseObjectIdPipe_helper_1 = require("../../helpers/parseObjectIdPipe.helper");
const create_template_request_1 = require("./dto/create-template-request");
const update_template_request_1 = require("./dto/update-template-request");
const template_service_1 = require("./template.service");
let TemplateController = class TemplateController {
    constructor(templateService) {
        this.templateService = templateService;
    }
    create(createTemplateDto) {
        return this.templateService.createOne(createTemplateDto);
    }
    findOne(id) {
        return this.templateService.findOne(id);
    }
    findOneByUrl(url) {
        return this.templateService.findOneByUrl(url);
    }
    findManyByPageId(page_id) {
        return this.templateService.findManyByPageId(page_id);
    }
    update(id, updateTemplateDto) {
        return this.templateService.updateOne(id, updateTemplateDto);
    }
    remove(id) {
        return this.templateService.removeOne(id);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_template_request_1.CreateTemplateRequest]),
    __metadata("design:returntype", void 0)
], TemplateController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', parseObjectIdPipe_helper_1.ParseObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TemplateController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('url/:url'),
    __param(0, (0, common_1.Param)('url')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TemplateController.prototype, "findOneByUrl", null);
__decorate([
    (0, common_1.Get)('page/:page_id'),
    __param(0, (0, common_1.Param)('page_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TemplateController.prototype, "findManyByPageId", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', parseObjectIdPipe_helper_1.ParseObjectIdPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_template_request_1.UpdateTemplateRequest]),
    __metadata("design:returntype", void 0)
], TemplateController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', parseObjectIdPipe_helper_1.ParseObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TemplateController.prototype, "remove", null);
TemplateController = __decorate([
    (0, common_1.Controller)('api/v1/templates'),
    __metadata("design:paramtypes", [template_service_1.TemplateService])
], TemplateController);
exports.TemplateController = TemplateController;
//# sourceMappingURL=template.controller.js.map