# [1.0.6] - 2021-12-7 [PR: #24](https://github.com/dolittle/release-typescript-lib-action/pull/24)
## Summary

Fixes a problem using this action in workflows where the file-tree is modified during build (like with the `update-version-info-action`), but the other changes should not be committed. This update makes sure only the changed files (the `package.json` files) are committed and pushed.

### Fixed

- Only the changed `package.json` files are committed and pushed.


