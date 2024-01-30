import { DirEntry, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { ModulePrefixModel } from './prefix-model';
import { SchemaOptions } from '../schema-options/schema-options.interface';
import { PathFragment } from '@angular-devkit/core';
export declare function findFilenameInTree(directory: DirEntry, fileMatchesCriteria: (file: string) => boolean): string | null;
export declare function getVerifiedFilePath(pathFragment: PathFragment, directory: DirEntry): string | undefined;
export declare function getHtmlFilesInDirectory(directory: DirEntry): PathFragment[];
export declare function byDirectory(directory: DirEntry, tree: Tree, parentFullPath: string): string[] | null;
export declare function getHtmlFilePathsRecursivelyRoot(tree: Tree, options: SchemaOptions): string[] | null;
export declare function projectName(_options: ModulePrefixModel): Rule;
export declare function setIdsOnFileByName(fileName: string, tree: Tree, _context: SchematicContext, modulePrefix: string, content: any, check: string, elements: string[], platform: 'web'): any;