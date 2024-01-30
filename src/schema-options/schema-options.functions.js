"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContainingFolderPath = exports.validateRegularSchema = void 0;
const schematics_1 = require("@angular-devkit/schematics");
function validateRegularSchema(options) {
    if (!options.name) {
        throw new schematics_1.SchematicsException('Option (name) is required.');
    }
    if (!options.path) {
        throw new schematics_1.SchematicsException('Option (path) is required.');
    }
}
exports.validateRegularSchema = validateRegularSchema;
function getContainingFolderPath(path, folder) {
    return path.endsWith(folder) ? path : `${path}${folder}`;
}
exports.getContainingFolderPath = getContainingFolderPath;
//# sourceMappingURL=schema-options.functions.js.map