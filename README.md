# specs — spec-driven development, end to end

A Claude Code plugin that automates the full spec-driven development (SDD) loop: turn a
prompt and/or mockups into a rigorous spec (functional **and** non-functional), produce a
technical plan, split it into **logically independent pull requests** (frontend and backend
get separate PRs), review the plan for gaps, then **autonomously execute one PR at a time** —
branch → implement → verify (Playwright + test suite) → iteratively fix → code review →
regression check → commit → push → merge into `main`.

It extends [GitHub Spec Kit](https://github.com/github/spec-kit) conventions and adds the
autonomous execute/verify/review/merge layer that Spec Kit leaves to a human.

## Requirements

- Claude Code with plugin support.
- **GitHub CLI** (`gh`) installed and authenticated (`gh auth status`) — used for PRs, checks,
  and merges.
- **Node/npx** — the Playwright MCP server (`@playwright/mcp`) is launched via `npx` (see
  [`.mcp.json`](.mcp.json)).
- A git repository with a GitHub `origin` remote.

## Install

```
/plugin marketplace add <owner>/<this-repo>
/plugin install specs@specs-marketplace
```

Or run locally without installing:

```
claude --plugin-dir /path/to/this/repo
```

## Workflow

| Step | Command | Produces |
|------|---------|----------|
| 0. Principles | `/specs:constitution` | `.specify/memory/constitution.md` |
| 1. Requirements | `/specs:specify <description>` (attach mocks) | `specs/<id>/spec.md` |
| 2. Clarify gaps | `/specs:clarify <id>` | updated `spec.md` |
| 3. Plan | `/specs:plan <id>` | `specs/<id>/plan.md` |
| 4. Split into PRs | `/specs:split-prs <id>` | `specs/<id>/prs.md`, `state.json` |
| 5. Review the plan | `/specs:review-plan <id>` | `specs/<id>/review.md` |
| 6. Execute | `/specs:execute <id>` | branches, PRs, merges to `main` |
| — | `/specs:status [id]` | read-only progress overview |

### The execute loop (per pull request)

```
select next PR whose dependencies are all merged
  → branch from up-to-date main
  → implement (scoped to this PR only)
  → verify: Playwright (UI) and/or test suite (backend)   ─┐
  → if fail or mismatch → fix → re-verify  (up to N times) ─┘
  → code review vs. constitution → apply must-fixes → re-verify smoke
  → regression check → mitigate so no existing behavior breaks → re-verify
  → commit → push → open PR → wait for CI
  → merge into main   (confirmation gate unless --auto-merge)
  → next PR
```

`/specs:execute` options: `--auto-merge` (skip the confirmation before merging to `main`),
`--dry-run` (no push/merge), `--max-fix-iterations=N` (default 3), `--skip-review-gate`
(bypass the review guard, below), and an optional `PR-<n>` to run a single PR.

### Review gate (hook)

A `UserPromptSubmit` hook ([`hooks/check-execute-guard.js`](hooks/check-execute-guard.js))
**blocks `/specs:execute` unless the spec's `review.md` is clear of open blockers.**
`/specs:review-plan` writes a marker on line 1 of `review.md` —
`<!-- specs-gate: status=CLEAR -->` or `status=BLOCKED` — and the guard refuses to launch
execution while the marker is `BLOCKED` or missing (i.e. review-plan hasn't run). It ignores
every other prompt and fails open on unrelated input. Override intentionally with
`--skip-review-gate` (or `--force`) in the command. Requires `node` on `PATH`.

> **Safety:** merging into the default branch is the one irreversible step, so by default the
> plugin asks for confirmation before it. Pass `--auto-merge` for fully hands-off runs.

## How PRs are split

`/specs:split-prs` decomposes the plan to minimize coupling:
- **Separate concerns** — frontend, backend, database/migrations, infra in distinct PRs.
- **Contracts first** — shared types/schemas/API stubs land early so dependents build in
  parallel against a stable interface.
- **Minimize dependencies** — prefer a wide, shallow, acyclic dependency graph.
- **Independently shippable & verifiable** — each PR reviews on its own, leaves the app
  working, and has its own verification.

## Structure

```
.claude-plugin/
  plugin.json          # plugin manifest
  marketplace.json     # single-plugin marketplace descriptor
.mcp.json              # Playwright MCP server
hooks/
  hooks.json           # registers the UserPromptSubmit review gate
  check-execute-guard.js  # blocks /specs:execute until review.md is CLEAR
skills/                # user-invoked commands (/specs:*)
  constitution/ specify/ clarify/ plan/ split-prs/ review-plan/ execute/ status/
agents/                # specialized subagents used by execute + review-plan
  plan-reviewer.md implementer.md qa-verifier.md code-reviewer.md regression-guard.md
templates/             # artifact templates the skills fill in
  constitution-template.md spec-template.md plan-template.md prs-template.md
```

Feature artifacts are written into the **target project** under `specs/<NNN-slug>/` and
`.specify/memory/`, following Spec Kit conventions.

## License

MIT
