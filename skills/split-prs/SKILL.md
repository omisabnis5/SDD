---
name: split-prs
description: Decompose an implementation plan into a sequence of logically independent pull requests that minimize inter-PR dependencies and separate concerns (e.g. frontend vs backend get separate PRs). Produces specs/<id>/prs.md and initializes execution state. Run after /specs:plan and before /specs:review-plan.
disable-model-invocation: true
---

# /specs:split-prs

Group the plan's work breakdown into a set of pull requests that can proceed and merge with
as little coupling as possible.

## Input
- Target spec id in `$ARGUMENTS`. If omitted, use the most recently modified spec.

## Steps

1. Read `specs/<id>/plan.md` (work breakdown + regression surface) and the constitution
   (branch naming, PR requirements, default branch).

2. **Partition the work into PRs** using these principles, in priority order:
   - **Separate concerns.** Frontend, backend, database/migrations, and infra work go in
     different PRs. Do not mix a schema migration with UI work.
   - **Contracts first.** Shared contracts, types, schemas, and API stubs land in an early PR
     so dependent frontend/backend PRs can build against a stable interface in parallel.
   - **Minimize dependencies.** Prefer a wide, shallow dependency graph over a long chain.
     Where a dependency is unavoidable, make it explicit. Frontend can often proceed against
     mock data / the agreed contract without waiting for the backend PR to merge.
   - **Independently shippable & verifiable.** Each PR should be reviewable on its own, leave
     the app in a working state, and have its own verification (a Playwright flow, a test
     command, or both). Avoid PRs that only make sense once a later PR merges.
   - **Right-sized.** Small enough to review well; large enough to be coherent.

3. **Write the PR plan** from `${CLAUDE_PLUGIN_ROOT}/templates/prs-template.md`. For each PR
   record: branch name (per constitution convention), layer, dependencies, in/out scope, the
   FR/NFR it traces to, its verification method, the regression behavior to protect, and its
   definition of done. Include the dependency graph and a top-to-bottom execution order
   (topologically sorted so no PR precedes its dependencies).

4. **Initialize execution state.** Create `specs/<id>/state.json`:
   ```json
   {
     "specId": "<id>",
     "defaultBranch": "<main|master>",
     "prs": [
       { "id": "PR-1", "branch": "feat/<id>-01-slug", "dependsOn": [], "status": "pending" }
     ]
   }
   ```
   Valid `status` values: `pending`, `in_progress`, `verifying`, `in_review`, `merged`,
   `blocked`, `failed`. All start as `pending`.

## Output
- `specs/<id>/prs.md`
- `specs/<id>/state.json`

Report the PR list with its dependency graph and recommend `/specs:review-plan <id>`.
