import { DirEntry, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { ModulePrefixModel } from './prefix-model';
import { SchemaOptions } from '../schema-options/schema-options.interface';
import { PathFragment } from '@angular-devkit/core';

function randStr(len: number) {
    let s = '';
    while (s.length < len) s += Math.random().toString(36).substr(2, len - s.length);
    return s;
}

export function findFilenameInTree(
    directory: DirEntry,
    fileMatchesCriteria: (file: string) => boolean
): string | null {
    const pathFragment = directory.subfiles.find(fileMatchesCriteria);

    if (pathFragment) {
        const fileEntry = directory.file(pathFragment);

        if (fileEntry) {
            return fileEntry.path;
        }
    }

    return directory.parent ? findFilenameInTree(directory.parent, fileMatchesCriteria) : null;
}

export function getVerifiedFilePath(pathFragment: PathFragment, directory: DirEntry): string | undefined {
    if (pathFragment) {
        const fileEntry = directory.file(pathFragment);

        if (fileEntry) {
            return fileEntry.path;
        }
    }
}

export function getHtmlFilesInDirectory(directory: DirEntry): PathFragment[] {
    return directory.subfiles.filter(file => file.endsWith('.html'));
}


function directoryByFullPath(newFullParentPath: string, tree: Tree): DirEntry {
    return tree.getDir(newFullParentPath);
}

export function byDirectory(directory: DirEntry, tree: Tree, parentFullPath: string): string[] | null {

    let htmlFiles: string[] = [];

    const htmlFilesInDirectory: PathFragment[] = getHtmlFilesInDirectory(directory);

    htmlFilesInDirectory.forEach(pathFragment => {
        let verifiedFilePath;

        if (pathFragment) {
            verifiedFilePath = getVerifiedFilePath(pathFragment, directory);
        }

        if (verifiedFilePath) {
            htmlFiles.push(verifiedFilePath)
        }
    })

    if (directory.subdirs) {
        directory.subdirs.forEach((childPathFragment: PathFragment) => {
            const directory: DirEntry = tree.getDir(childPathFragment);
            const newFullParentPath = parentFullPath + directory.path;

            const subDirectory = directoryByFullPath(newFullParentPath, tree);
            subDirectory.subfiles;

            const filesInNested = byDirectory(subDirectory, tree, newFullParentPath);

            if (filesInNested && filesInNested.length) {

                htmlFiles = htmlFiles.concat(filesInNested);
            }
        })
    }

    return htmlFiles;
}

export function getHtmlFilePathsRecursivelyRoot(tree: Tree, options: SchemaOptions): string[] | null {
    const rootDirectory: DirEntry = tree.getDir(options.path);
    return byDirectory(rootDirectory, tree, options.path);
}

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function projectName(_options: ModulePrefixModel): Rule {
    return (tree: Tree, _context: SchematicContext) => {
        // tree.create('hello.ts', 'console.log("Hello, World")');

        let content =
            `<md-dialog-content class="md-dialog-content">
    <h2 class="md-title">Failed to load page</h2>
    <div class="md-dialog-content-body">
        <p>Please try to refresh the page in a couple of minutes</p>
    </div>
</md-dialog-content>`;

        // const modulePrefix = 'checklist-ids';
        const modulePrefix = _options.prefix;

        const check = 'id';  // choose attribute inside tag for generating string(in this case id)
        const elements = ['div', 'p']; // choose tags that will be checked for id(in this case it's `a` tag')
        const platform = 'web';
        // const autofix: true,  // if script finds element without id, then she will add id


        const opt: SchemaOptions = {
            name: '',
            path: '/src/'
        }

        const result = getHtmlFilePathsRecursivelyRoot(tree, opt);

        console.log('\x1b[35m%s\x1b[0m', 'RESULT'); // Magenta
        console.log('\x1b[35m%s\x1b[0m', result); // Magenta

        // console.log('\x1b[33m%s\x1b[0m', htmlFileNames); // Yellow
        // console.log('\x1b[36m%s\x1b[0m', htmlFileNames); // Cyan

        result?.forEach(fileNameItem => {
            const fileName = fileNameItem.slice(1); // Delete first character
            // console.log('\x1b[33m%s\x1b[0m', fileName); // Yellow

            // const fileName = 'demo-template.html';
            setIdsOnFileByName(fileName, tree, _context, modulePrefix, content, check, elements, platform);
        })

        return tree;
    };
}

export function setIdsOnFileByName(fileName: string, tree: Tree, _context: SchematicContext, modulePrefix: string, content: any, check: string, elements: string[], platform: 'web'): any {

    if (tree.exists(fileName)) {
        const existsMessage = `PROCESSING ${fileName}`;
        console.log('\x1b[36m%s\x1b[0m', existsMessage); // Cyan

        const fileByName = tree.read(fileName);

        if (!fileByName) {
            return;
        }

        const stringContent = fileByName.toString();

        const split = stringContent.split('\n');

        const linesUpdates: any[] = [];

        if (split[split.length - 1] === '') {
            // console.log('matched');
        }

        split.forEach(lineItem => {

            if (lineItem === '') {
                // if (lineItem === '\\n') {
                // if (lineItem === '\\r') {

                // Avoid creating new lines at the end
                return;
            }

            let line = lineItem;

            elements.forEach(element => {

                const tag = `<${element}`;
                let tagPrefix = `${platform}-${element}-`;

                if (modulePrefix) {

                    tagPrefix = `${platform}-${element}-${modulePrefix}-`;
                }

                if (line.includes(tag)) {

                    const idExists = line.includes('id="');

                    if (!idExists) {

                        const randomId = randStr(15)

                        const index = line.indexOf(tag) + tag.length;
                        const idAttribute = ` ${check}="${tagPrefix}${randomId}"`;

                        const indexToInsertAt = index;
                        const charToInsert = idAttribute;
                        const originalString = line;

                        const newString = originalString.slice(0, indexToInsertAt) + charToInsert + originalString.slice(indexToInsertAt);

                        line = newString;

                    }
                }

            })

            linesUpdates.push(line);

        })

        // console.log('**** linesUpdates', linesUpdates)

        if (!(tree.read(fileName) instanceof Buffer)) {
            throw new Error('not a instanceof Buffer');
        } else {
            // console.log('Buffer');
            // console.log(tree.read(fileName));
        }

        // console.log("overwrite content: ")

        for (let i = 0; i < linesUpdates.length; i++) {

            if (i + 1 === 9) {
                // Last line
                linesUpdates[i] = linesUpdates[i];
            } else {
                linesUpdates[i] = linesUpdates[i] + '\n';
            }
        }

        const output = linesUpdates.join('');

        tree.overwrite(fileName, output);


    } else {
        tree.create(fileName, content);
    }

}
