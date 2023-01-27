"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./app/auth/auth.module");
const file_module_1 = require("./app/file/file.module");
const interaction_module_1 = require("./app/interaction/interaction.module");
const page_module_1 = require("./app/page/page.module");
const publication_module_1 = require("./app/publication/publication.module");
const template_module_1 = require("./app/template/template.module");
const user_module_1 = require("./app/user/user.module");
const workspace_module_1 = require("./app/workspace/workspace.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            publication_module_1.PublicationModule,
            template_module_1.TemplateModule,
            file_module_1.FileModule,
            user_module_1.UserModule,
            page_module_1.PageModule,
            workspace_module_1.WorkspaceModule,
            interaction_module_1.InteractionModule,
            auth_module_1.AuthModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map