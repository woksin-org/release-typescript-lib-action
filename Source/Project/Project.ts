// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import path from 'path';
import glob from 'glob';
import isGlob from 'is-glob';
import fs from 'fs';
import { Package, YarnWorkspace, InvalidYarnWorkspace } from './';

/**
 * Represents a project.
 *
 * @class Project
 */
export class Project {

    private _workspaces: YarnWorkspace[] = [];

    /**
     * Instantiates an instance of {Project}.
     * @param {string} [root] - The root folder of the project.
     */
    constructor(root: string) {
        this.root = path.resolve(root);
        this.rootPackage = new Package(this.root);

        if (this.rootPackage.hasWorkspaces()) {
            this.createWorkspaces();
        }
    }

    /**.
     * Gets the absolute path to the root folder
     *
     * @readonly
     */
    readonly root: string;

    /**.
     * Gets the root {Package} for this project
     *
     * @readonly
     */
    readonly rootPackage: Package;

    /**
     * Gets the {YarnWorkspace} configuration for each yarn workspace in the project.
     *
     * @readonly
     */
    get workspaces() {
        return this._workspaces;
    }

    /**
     * Whether or not this project has yarn workspaces.
     *
     * @returns {boolean} - Whether the project has workspaces or not..
     */
    hasWorkspaces() {
        return this._workspaces !== undefined && this._workspaces.length > 0;
    }

    private createWorkspaces() {
        this._workspaces = [];
        const rootPackageObject = this.rootPackage.packageObject;
        rootPackageObject.workspaces!.forEach(workspace => {
            if (isGlob(workspace)) {
                glob.sync(workspace, {absolute: true, }).forEach(workspacePath => {
                    try {
                        if (fs.statSync(workspacePath).isDirectory()) {
                            const workspacePackage = new Package(workspacePath, this.rootPackage);
                            this._workspaces.push(new YarnWorkspace(workspacePackage));
                        }
                    } catch (error: any) {
                        throw new InvalidYarnWorkspace(workspacePath, error);
                    }
                });
            } else {
                try {
                    if (fs.statSync(workspace).isDirectory()) {
                        const workspacePackage = new Package(workspace, this.rootPackage);
                        this._workspaces.push(new YarnWorkspace(workspacePackage));
                    }
                } catch (error: any) {
                    throw new InvalidYarnWorkspace(workspace, error);
                }
            }
        });
    }
}
