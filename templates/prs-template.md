# Pull Request Plan: <FEATURE NAME>

- **Spec ID:** <NNN-feature-slug>
- **Default branch:** <main | master>
- **Ordering principle:** minimize dependencies between PRs; separate concerns
  (frontend / backend / db / infra) so PRs can proceed and merge as independently
  as possible. Shared contracts land first so dependents can build against them.

## Dependency graph
```
PR-1 (contracts/schema) ──> PR-2 (backend) ──> PR-4 (frontend integration)
                        └──> PR-3 (frontend scaffolding, mock data)
```

## Pull requests

### PR-1: <title>
- **Branch:** `feat/<spec-id>-01-<slug>`
- **Layer:** db | be | fe | infra | shared
- **Depends on:** none | PR-x
- **Scope (in):** <what this PR contains>
- **Scope (out):** <explicitly deferred to later PRs>
- **Traces to:** FR-1, FR-2, NFR-Security
- **Verification:** Playwright flow(s) `<name>` | test suite `<command>` | both
- **Regression watch:** <existing behavior to protect>
- **Definition of done:** <the ACs this PR fully or partially satisfies>

### PR-2: <title>
- ...

## Execution order
1. PR-1
2. PR-2
3. ...

> `/specs:execute` walks this list top to bottom, skipping PRs whose dependencies
> are not yet merged, and records status in `state.json`.
