import { Folders } from '../folders/folders.enum';
import { PathOptions } from './path-options.interface';
export declare function getFolderType(options: PathOptions): Folders;
export declare function findParentModuleName(options: PathOptions): string | null;
