// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

/**
 * Represents the error that occurs when a path is not a directory.
 */
export class PathIsNotDirectory extends Error {
    /**
     * Instantiates an instance of {PathIsNotDirectory}.
     * @param {string} path - The path that is not a directory.
     */
    constructor(path: string) {
        super(`'${path}' is not a directory`);
    }
}
