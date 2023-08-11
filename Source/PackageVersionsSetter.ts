// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from '@dolittle/github-actions.shared.logging';
import editJsonFile from 'edit-json-file';
import { Package } from './Project';

/**
 * Represents the package.json file editor.
 */
export class PackageVersionsSetter {

    private readonly file: editJsonFile.JsonEditor;
    private readonly packageObject: any;

    /**
     * Initializes a new instance of the {PackageEditor} class.
     * @param {string} path - The filepath to package.json.
     * @param {Logger} logger - The logger.
     */
    constructor(private readonly path: string, private readonly logger: Logger) {
        this.file = editJsonFile(this.path, { stringify_width: 4});
        this.packageObject = this.file.toObject();
    }

    /**
     * Sets the version of the package.
     * @param {string} version - The version to set.
     */
    setVersion(version: string) {
        this.logger.info(`Updating ${this.packageObject.name} to version ${version}`);
        this.file.set('version', version);
    }

    /**
     * Sets the version of the package.
     * @param {string} version - The version to set.
     * @param {Package[]} packages - The packages in the workspace.
     */
    setAllWorkspaceDependencyVersions(version: string, packages: Package[]) {
        const workspaceNames = packages.map(_ => _.packageObject.name);
        const dependenciesObjects = new Map<string, any>();
        for (const dependencyFieldName of Object.keys(this.packageObject).filter(_ => _.endsWith('dependencies') || _.endsWith('Dependencies'))) {
            dependenciesObjects.set(dependencyFieldName, this.packageObject[dependencyFieldName]);
        }
        for (const [field, dependencies] of dependenciesObjects) {
            const newDependencies = dependencies;
            for (const dependencyName of Object.keys(dependencies)) {
                if (workspaceNames.includes(dependencyName)) {
                    this.logger.info(`Updating workspace ${field.replace('ies', 'y')} '${dependencyName}' to version ${version}`);
                    newDependencies[dependencyName] = version;
                }
            }
            this.file.set(field, newDependencies, {merge: true});
        }
    }

    /**
     * Saves the package file to disk.
     */
    save() {
        this.file.save();
    }

}
