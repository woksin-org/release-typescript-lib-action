# GitHub Action - Release TypeScript Library

This GitHub action releases a TypeScript/JavaScript library by updating its package version(s) and publishing it to npm

![Github JavaScript Actions CI/CD](https://github.com/dolittle/release-typescript-lib-action/workflows/Github%20JavaScript%20Actions%20CI/CD/badge.svg)

### Pre requisites

Create a workflow `.yml` file in your `.github/workflows` directory. An [example workflow](#example-workflow) is available below.

For more information, reference the GitHub Help Documentation for [Creating a workflow file](https://help.github.com/en/articles/configuring-a-workflow#creating-a-workflow-file)

### Inputs

-   `version`: The version
-   `root` (optional): The relative path to the root of the TypeScript project. default = root of the repository

### Example Workflow

```yaml
on:
    push:
        branches:
            - "**"
    pull_request:
        types: [closed]

name: GitHub action workflow name

jobs:
    context:
        name: Job name
        runs-on: ubuntu-latest
        steps:
            - name: Checkout code
              uses: actions/checkout@v2
            - name: Name here
              uses: dolittle/action-repository-here@tag-to-use
```

## Contributing

We're always open for contributions and bug fixes!

### Pre requisites

node <= 12
yarn
git
