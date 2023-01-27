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
exports.PageController = void 0;
const common_1 = require("@nestjs/common");
const parseObjectIdPipe_helper_1 = require("../../helpers/parseObjectIdPipe.helper");
const create_page_dto_1 = require("./dto/create-page.dto");
const update_page_dto_1 = require("./dto/update-page.dto");
const page_service_1 = require("./page.service");
let PageController = class PageController {
    constructor(pageService) {
        this.pageService = pageService;
    }
    create(createPageDto) {
        return this.pageService.create(createPageDto);
    }
    findAll() {
        return this.pageService.findAll();
    }
    findOne(id) {
        return this.pageService.findOne(id);
    }
    findOneByUrl(url) {
        return this.pageService.findOneByUrl(url);
    }
    findAllByWorkspaceId(workspace_id) {
        return this.pageService.findAllByWorkspaceId(workspace_id);
    }
    update(id, updatePageDto) {
        return this.pageService.update(id, updatePageDto);
    }
    remove(id) {
        return this.pageService.remove(id);
    }
    checkIfUrlAlreadyUsed(url) {
        return this.pageService.checkIfUrlAlreadyUsed(url);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_page_dto_1.CreatePageDto]),
    __metadata("design:returntype", void 0)
], PageController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PageController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', parseObjectIdPipe_helper_1.ParseObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PageController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('url/:url'),
    __param(0, (0, common_1.Param)('url')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PageController.prototype, "findOneByUrl", null);
__decorate([
    (0, common_1.Get)('workspace/:workspace_id'),
    __param(0, (0, common_1.Param)('workspace_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PageController.prototype, "findAllByWorkspaceId", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', parseObjectIdPipe_helper_1.ParseObjectIdPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_page_dto_1.UpdatePageDto]),
    __metadata("design:returntype", void 0)
], PageController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', parseObjectIdPipe_helper_1.ParseObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PageController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('check-url/:url'),
    __param(0, (0, common_1.Param)('url')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PageController.prototype, "checkIfUrlAlreadyUsed", null);
PageController = __decorate([
    (0, common_1.Controller)('api/v1/pages'),
    __metadata("design:paramtypes", [page_service_1.PageService])
], PageController);
exports.PageController = PageController;
//# sourceMappingURL=page.controller.js.map