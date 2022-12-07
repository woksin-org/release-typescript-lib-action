// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

/**
 * Represents the error that occurs when package.json could not be found.
 */
export class NoPackageJson extends Error {
    /**
     * Instantiates an instance of {NoPackageJson}.
     * @param {string} path - The path where the package.json should have been.
     */
    constructor(path: string) {
        super(`Could not find package.json at path '${path}'`);
    }
}
