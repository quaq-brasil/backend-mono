"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateWorkspaceDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_workspace_dto_1 = require("./create-workspace.dto");
class UpdateWorkspaceDto extends (0, mapped_types_1.PartialType)(create_workspace_dto_1.CreateWorkspaceDto) {
}
exports.UpdateWorkspaceDto = UpdateWorkspaceDto;
//# sourceMappingURL=update-workspace.dto.js.map