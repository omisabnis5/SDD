---
name: execute
description: Autonomously implement a spec one pull request at a time. For each PR it creates a branch, implements the changes, verifies with Playwright and/or the test suite, iteratively fixes failures, runs a code review against the constitution, re-verifies, checks for regressions, then commits, pushes, and merges to main (final merge gated by confirmation unless auto-merge is enabled). Run after /specs:review-plan.
disable-model-invocation: true
---

# /specs:execute

The orchestrator. It walks the PR plan and drives each pull request through the full loop.
It coordinates specialized agents (`implementer`, `qa-verifier`, `code-reviewer`,
`regression-guard`) and owns all git/`gh` operations and the `state.json` state machine.

## Input & options
`$ARGUMENTS` may contain:
- a **spec id** (else use the most recently modified spec),
- an optional **PR id** (e.g. `PR-2`) to run just that one,
- flags: `--auto-merge` (skip the human confirmation before merging into the default branch),
  `--dry-run` (do everything except push/merge), `--max-fix-iterations=N` (default 3).

## Preconditions (check first, stop with a clear message if unmet)
- `specs/<id>/{spec.md,plan.md,prs.md,state.json}` exist and `review.md` has no open blockers.
  A `UserPromptSubmit` hook (`hooks/check-execute-guard.js`) enforces this automatically: it
  refuses to launch `/specs:execute` unless the spec's `review.md` gate marker reads
  `status=CLEAR`. If a run is blocked, run `/specs:review-plan <id>` to resolve blockers (or,
  deliberately, re-invoke with `--skip-review-gate` to bypass the guard).
- Working tree is clean and on the default branch; `git` and `gh` are available and `gh auth
  status` is authenticated; a GitHub `origin` remote exists.
- The constitution's E2E start command and test commands are known (from `plan.md` /
  constitution). If the app-start command for Playwright is unknown, ask before starting.

## PR selection
From `state.json`, pick the next PR whose `status` is `pending` and whose every `dependsOn`
entry is `merged`. If none are eligible but pending PRs remain, report the blocking
dependency and stop. Process **one PR at a time**; after a PR merges, re-select and continue
until all are `merged` or a stop condition is hit.

## Per-PR loop

For the selected PR, follow these phases in order. Update `state.json` at every transition.

### 1. Branch
- `git checkout <defaultBranch>` and `git pull` to start from up-to-date main.
- Create the PR's branch from `prs.md` (e.g. `git checkout -b feat/<id>-NN-slug`).
- Set PR status → `in_progress`.

### 2. Implement
- Delegate to the **`implementer`** agent with: the PR's scope (in/out), the FR/NFR it traces
  to, the plan's architecture notes, the constitution, and the regression-watch list.
- The implementer writes code + tests to satisfy exactly this PR's scope — nothing from later
  PRs. It must follow the constitution's standards and add the tests named in the plan.

### 3. Verify
- Set status → `verifying`. Delegate to the **`qa-verifier`** agent.
- It runs the PR's verification method: **Playwright** flows for UI PRs (using the Playwright
  MCP against the app started per the constitution) and/or the **test suite** for
  backend/library PRs (lint, typecheck, unit, integration per the plan).
- It returns a structured pass/fail with concrete failure details.

### 4. Fix loop
- If verification fails **or** the result doesn't match the spec/plan (missing behavior, wrong
  UI state, unmet NFR such as an accessibility or performance budget), send the failures back
  to the `implementer` to fix, then re-verify.
- Repeat up to `--max-fix-iterations` (default 3). If still failing, set status → `failed`,
  write a short diagnosis to `specs/<id>/state.json` notes, stop, and report. Do not push
  broken work.

### 5. Code review
- Set status → `in_review`. Delegate to the **`code-reviewer`** agent to check the diff
  against the constitution (architecture, standards, naming, error handling, security, test
  quality) and the plan.
- Apply the review's must-fix items. If fixes touch runtime behavior, **re-run verification**
  (a quick Playwright smoke pass + relevant tests) to confirm nothing broke.

### 6. Regression check
- Delegate to the **`regression-guard`** agent with the diff and the plan's regression
  surface. It determines whether the change could break existing behavior.
- If regression risk is found, have the `implementer` adjust the approach so it does **not**
  introduce a regression (e.g. preserve the old contract, add a compat shim, guard behind a
  flag) and add a characterization/contract test that locks the existing behavior. Re-verify.
- Do not proceed while an unmitigated regression risk remains.

### 7. Commit & push
- Stage and commit with a message following the constitution's commit style (e.g. Conventional
  Commits), referencing the spec/PR id. End the commit body with the required co-author trailer.
- `git push -u origin <branch>`.
- Open the pull request with `gh pr create` — title, a body summarizing scope + the ACs it
  satisfies + verification evidence, and `--base <defaultBranch>`.

### 8. Merge to main
- Wait for required checks: `gh pr checks <branch> --watch`. If CI fails, treat it like a
  verification failure (back to the fix loop).
- **Final merge gate:** unless `--auto-merge` was passed, **ask the user to confirm** before
  merging into the default branch (this is the one irreversible step). With `--auto-merge`,
  proceed automatically once all gates and checks are green.
- Merge via `gh pr merge <branch> --squash --delete-branch` (respect the constitution's merge
  strategy if it specifies one). This merges the feature branch into `main`/`master`.
- Set PR status → `merged` (record the merge commit). Return to **PR selection** for the next PR.

## Stop conditions
- A PR reaches `failed` after the fix budget, CI cannot be made green, an unresolved
  regression risk remains, or the user declines the merge. In every case: leave the tree in a
  known state, update `state.json`, and report exactly where it stopped and why.

## Reporting
After each PR and at the end, summarize: what merged, verification/review/regression outcomes,
any follow-ups, and the next eligible PR. Keep `state.json` authoritative so a later
`/specs:execute` or `/specs:status` resumes cleanly.

## Notes
- **One PR at a time**, always branching fresh from an updated default branch, keeps
  inter-PR coupling low and each change independently reviewable.
- Never skip verification, review, or the regression check to "save time" — they are the
  point of the workflow.
- If the user passed a specific PR id, run only that PR's loop and stop.
