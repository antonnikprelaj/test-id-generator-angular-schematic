"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findParentModuleName = exports.getFolderType = void 0;
const core_1 = require("@angular-devkit/core");
const folders_enum_1 = require("../folders/folders.enum");
function getReversedPathFragments(options) {
    return (0, core_1.normalize)(options.path)
        .split('/')
        .reverse();
}
function getFolderType(options) {
    for (const pathFragment of getReversedPathFragments(options)) {
        switch (`/${pathFragment}`) {
            case folders_enum_1.Folders.Modules:
                return folders_enum_1.Folders.Modules;
        }
    }
    return folders_enum_1.Folders.Features;
}
exports.getFolderType = getFolderType;
function findParentModuleName(options) {
    const pathFragments = getReversedPathFragments(options);
    const featuresOrModulesIndex = pathFragments.findIndex(pathFragment => {
        switch (`/${pathFragment}`) {
            case folders_enum_1.Folders.Features:
            case folders_enum_1.Folders.Modules:
                return true;
            default:
                return false;
        }
    });
    return featuresOrModulesIndex + 1 <= pathFragments.length
        ? pathFragments[featuresOrModulesIndex + 1]
        : null;
}
exports.findParentModuleName = findParentModuleName;
//# sourceMappingURL=path-options.functions.js.map