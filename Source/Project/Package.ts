// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import fs from 'fs';
import path from 'path';
import isValidPath from 'is-valid-path';
import { NoPackageJson, PathIsNotDirectory } from './';

/**
 * Represents the package.
 */
export type PackageObject = {
    /**.
     * Name of the package
     *
     * @type {string}
     */
    name: string,
    /**.
     * Version of the package
     *
     * @type {string}
     */
    version: string,
    /**.
     * Yarn workspaces field
     *
     * @type {string[]}
     */
    workspaces?: string[]
};

const PACKAGE_NAME = 'package.json';

/**
 * Represents an npm package.
 *
 * @class Package
 */
export class Package {

    /**
     * Instantiates an instance of {Package}.
     * @param {string} rootFolder - Path to the root of the project containing a package.json file.
     * @param {Package} [_parentPackage] - The parent {Package} if this {Package} is a yarn workspace.
     */
    constructor(rootFolder: string, private _parentPackage?: Package) {
        if (!isValidPath(rootFolder) || !fs.statSync(rootFolder).isDirectory()) {
            throw new PathIsNotDirectory(rootFolder);
        }
        this.rootFolder = path.resolve(rootFolder);
        this.path = path.join(rootFolder, PACKAGE_NAME);
        if (!fs.existsSync(this.path)) {throw new NoPackageJson(this.path);}

        this.packageObject = JSON.parse(fs.readFileSync(this.path) as any);
    }

    /**
     * Gets the absolute path to the package.json.
     *
     * @readonly
     */
    readonly path: string;

    /**.
     * Gets the absolute path to the folder
     *
     * @readonly
     */
    readonly rootFolder: string;

    /**.
     * Gets the package.json object
     *
     * @readonly
     */
    readonly packageObject: PackageObject;

    /**
     * Gets the parent package for this yarn workspace.
     *
     * @readonly
     */
    get parentPackage() {
        return this._parentPackage;
    }

    /**
     * Whether or not this is yarn workspaces root package.
     *
     * @returns {boolean} - Whether the package has workspaces.
     */
    hasWorkspaces() {
        return this.packageObject.workspaces !== undefined;
    }
}
