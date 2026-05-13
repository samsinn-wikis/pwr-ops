# procmd-core (vendored)

This directory is a **vendored copy** of
[`michaelhil/samsinn/src/procmd-core/`](https://github.com/michaelhil/samsinn/tree/master/src/procmd-core).
The canonical source lives in samsinn; this copy is consumed by:

- `validate.ts` — corpus-wide structural validator
- `scripts/render-procmd.ts` — procmd → MkDocs-flavored markdown
- `scripts/build-manifest.ts` — `_manifest.json` builder

Pinning is via [`procmd-core.sha`](../procmd-core.sha) at the repo
root: a 40-char git SHA in samsinn that this vendored copy must match.
CI verifies the match (see `.github/workflows/deploy.yml`); drift
becomes a CI red.

## Updating procmd-core

When samsinn lands a procmd-core change:

1. Note the new samsinn SHA (e.g. from `git rev-parse HEAD` in the
   samsinn repo after the change is on `master`).
2. In this repo, copy the updated files:
   ```bash
   cp ~/path/to/samsinn/src/procmd-core/{parser,types,index}.ts procmd-core/
   ```
3. Update `procmd-core.sha` to the new samsinn SHA.
4. Run `bun validate.ts` locally; commit the file changes + the SHA bump
   in one commit. Push.

The two-PR pattern (samsinn first, then wiki) is intentional: the spec
lives in samsinn; this repo follows.

## What's NOT here

This vendored copy contains parser + types only. The samsinn-side
renderer (procmd → agent markdown + mermaid) stays in samsinn because
its output is agent-specific. The wiki's own renderer
(`scripts/render-procmd.ts`) stays here because its output is
MkDocs-specific. Both renderers consume `procmd-core`'s parser.
