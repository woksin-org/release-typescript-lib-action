// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Package } from './';

/**
 * Represents a yarn workspace.
 *
 * @class YarnWorkspace
 */
export class YarnWorkspace {

    /**
     * Initializes a new instance of the {YarnWorkspace} class.
     * @param { Package } _workspacePackage - The Package.
     */
    constructor(private _workspacePackage: Package) { }

    /**
     * Gets the {Package} for this yarn workspace.
     *
     * @readonly
     */
    get workspacePackage() {
        return this._workspacePackage;
    }
}
