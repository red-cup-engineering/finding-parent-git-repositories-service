# finding-parent-git-repositories-service

<!-- 561-group-standards:badges:start -->
[![Red Cup Engineering](https://img.shields.io/badge/561%20Group-Red%20Cup%20Engineering-c0392b)](https://github.com/red-cup-engineering)
[![License: MIT](https://img.shields.io/badge/license-MIT-c0392b)](LICENSE)
[![Indigenous data: CARE](https://img.shields.io/badge/Indigenous%20data-CARE-4b6f44)](https://github.com/red-cup-engineering/.github/blob/main/GOVERNANCE.md)
[![Tips welcome](https://img.shields.io/badge/tips-welcome-d4a017)](https://github.com/561-group/.github/blob/main/TIPS.md)
<!-- 561-group-standards:badges:end -->

Finds the chain of Git repositories that contain a given path, from the
innermost repository up to a specified top-level repository. Each nested
repository is verified against its parent's `.gitmodules` file, so the
result only includes repositories that are properly declared as submodules.

## Install

```sh
npm install @red-cup-engineering/finding-parent-git-repositories-service
```

## Usage

As a library:

```js
import { findParentGitRepositories } from "@red-cup-engineering/finding-parent-git-repositories-service";

const repositories = findParentGitRepositories({
  path: "/repo/services/child/src/file.mjs",
  top: "/repo",
});
// [
//   { repository: "/repo/services/child", parent: "/repo", submodulePath: "services/child" },
//   { repository: "/repo", parent: null, submodulePath: null },
// ]
```

As a CLI:

```sh
find-parent-git-repositories --path <path> --top <repository>
```

Prints the same result as JSON to stdout.

## API

### `findParentGitRepositories({ path, top })`

- `path` — a file or directory path that must exist and lie at or beneath `top`.
- `top` — the path to the outermost Git repository to search up to.

Returns a frozen array of frozen `{ repository, parent, submodulePath }`
objects, ordered from the innermost repository containing `path` to `top`.
For each entry except the last, `parent` is the containing repository and
`submodulePath` is the entry's path relative to `parent`, as declared in
`parent/.gitmodules`. The last entry (`top`) has `parent: null` and
`submodulePath: null`.

Throws if `path` or `top` is missing, if `path` does not exist, if `top` is
not a Git repository, if `path` is not beneath `top`, or if a nested
repository between `path` and `top` is not declared in its parent's
`.gitmodules`.
