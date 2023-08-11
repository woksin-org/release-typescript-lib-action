# [1.1.2] - 2023-8-11 [PR: #2](https://github.com/woksin-org/release-typescript-lib-action/pull/2)
## Summary

Removes debug code


# [1.1.1] - 2023-8-11 [PR: #1](https://github.com/woksin-org/release-typescript-lib-action/pull/1)
## Summary

Fixes an issue with how the dependencies were written to the package files.

### Fixed

- Setting workspace dependencies correctly in packages


# [1.1.0] - 2022-12-7 [PR: #25](https://github.com/dolittle/release-typescript-lib-action/pull/25)
## Summary

Update dependencies and modernise


# [1.0.6] - 2021-12-7 [PR: #24](https://github.com/dolittle/release-typescript-lib-action/pull/24)
## Summary

Fixes a problem using this action in workflows where the file-tree is modified during build (like with the `update-version-info-action`), but the other changes should not be committed. This update makes sure only the changed files (the `package.json` files) are committed and pushed.

### Fixed

- Only the changed `package.json` files are committed and pushed.


