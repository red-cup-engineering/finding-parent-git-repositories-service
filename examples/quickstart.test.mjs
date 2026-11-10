// Adapted from test/find-parent-git-repositories.test.mjs to import the installed package.
import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { findParentGitRepositories } from "@red-cup-engineering/finding-parent-git-repositories-service";

test("PARENT-GIT-QUICKSTART", async () => {
  const root = await mkdtemp(join(tmpdir(), "find-parent-git-repositories-"));
  const top = join(root, "top");
  const child = join(top, "services", "child");
  const target = join(child, "src", "file.mjs");
  try {
    await mkdir(join(top, ".git"), { recursive: true });
    await mkdir(join(child, ".git"), { recursive: true });
    await mkdir(join(child, "src"), { recursive: true });
    await writeFile(target, "export {};\n");
    await writeFile(join(top, ".gitmodules"), '[submodule "services/child"]\n\tpath = services/child\n\turl = https://example.invalid/child.git\n');
    const repositories = findParentGitRepositories({ path: target, top });
    assert.deepEqual(repositories, [
      { repository: child, parent: top, submodulePath: "services/child" },
      { repository: top, parent: null, submodulePath: null },
    ]);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
