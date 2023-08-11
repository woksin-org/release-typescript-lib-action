// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import path from 'path';
import { valid as isValidSemver, SemVer } from 'semver';
import * as core from '@actions/core';
import * as github from '@actions/github';
import { exec } from '@actions/exec';
import { Logger } from '@dolittle/github-actions.shared.logging';
import { Project } from './Project';
import { PackageVersionsSetter } from './PackageVersionsSetter';

const editJsonFile = require('edit-json-file');
const logger = new Logger();

run();

/**
 * Runs the action.
 */
export async function run() {
    try {
        const version = core.getInput('version', { required: true });
        if (!isValidSemver(version)) {
            throw new Error(`${version} is not a valid SemVer`);
        }
        const root = path.join(process.env.GITHUB_WORKSPACE!, core.getInput('root', { required: true }));
        const project = new Project(root);
        logger.info(`Creating release from root ${project.root}`);
        const changedFiles = changeVersionNumbers(version, project);
        await commitChangedFiles(changedFiles, root, version, core.getInput('user-name'), core.getInput('user-email'));
        await pushCommittedChanges(root);
        if (!await publishPackages(project, new SemVer(version))) {
            throw new Error('One or more packages failed to publish');
        }

    } catch (error: any) {
        fail(error);
    }
}

function getPackages(project: Project) {
    return project.hasWorkspaces() ?
        project.workspaces.map(_ => _.workspacePackage)
        : [project.rootPackage];
}

function changeVersionNumbers(version: string, project: Project): string[] {
    const packages = getPackages(project);
    const changedFiles = packages.map(_ => {
        const packageEditor = new PackageVersionsSetter(_.path, logger);
        packageEditor.setVersion(version);

        if (project.hasWorkspaces()) {
            packageEditor.setAllWorkspaceDependencyVersions(version, packages);
        }
        packageEditor.save();
        return _.path;
    });
    return changedFiles;
}

async function commitChangedFiles(changedFiles: string[], gitRoot: string, version: string, username: string, email: string) {
    await configureGitForCommit(gitRoot, username, email);

    for (const file of changedFiles) {
        await exec(
            'git add',
            [
                file
            ],
            { cwd: gitRoot, ignoreReturnCode: true});
    }

    await exec(
        'git commit',
        [
            '--author="github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>"',
            `-m "Update packages and workspace dependencies to ${version}"`
        ],
        { cwd: gitRoot, ignoreReturnCode: true});
}

async function configureGitForCommit(gitRoot: string, username: string, email: string) {
    await exec(
        'git config',
        [
            'user.email',
            `"${email}}"`
        ],
        { cwd: gitRoot, ignoreReturnCode: true});
    await exec(
        'git config',
        [
            'user.name',
            `"${username}"`
        ],
        { cwd: gitRoot, ignoreReturnCode: true});
}

async function pushCommittedChanges(gitRoot: string) {
    const branchName = path.basename(github.context.ref);
    await exec(
        `git push origin ${branchName}`,
        undefined,
        { cwd: gitRoot, ignoreReturnCode: true});
}

async function publishPackages(project: Project, version: SemVer) {
    const packages = getPackages(project);
    let allSucceeded = true;
    for (const packageToPublish of packages) {
        if ((packageToPublish.packageObject as any).private === true) {
            logger.info(`Skipping publishing of ${packageToPublish.packageObject.name}`);
            continue;
        }
        logger.info(`Publishing ${packageToPublish.packageObject.name}`);
        const args: string[] = [];
        const prerelease = version.prerelease;
        if (prerelease?.length && prerelease.length > 0) {
            args.push('--tag');
            args.push(prerelease[0] as string);
        }
        if (await exec('npm publish', args, { ignoreReturnCode: true, cwd: packageToPublish.rootFolder}) !== 0) allSucceeded = false;
    }
    return allSucceeded;
}

function fail(error: Error) {
    logger.error(error.message);
    core.setFailed(error.message);
}
