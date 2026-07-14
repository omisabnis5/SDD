---
name: constitution
description: Establish or update the project constitution — the durable architecture, tech-stack, coding-standards, testing, and non-functional principles that every spec, plan, and code review in this project is checked against. Run once per project (and edit as it evolves) before /specs:specify.
disable-model-invocation: true
---

# /specs:constitution

Create or update `.specify/memory/constitution.md` — the single source of truth for
how this project is built. Everything downstream (specs, plans, PR splits, code review,
regression checks) is validated against it.

## Steps

1. **Locate or create.** If `.specify/memory/constitution.md` already exists, read it and
   propose targeted edits. Otherwise create it from
   `${CLAUDE_PLUGIN_ROOT}/templates/constitution-template.md`.

2. **Infer from the codebase first.** Before asking the user anything, inspect the repo to
   fill in as much as possible:
   - Detect languages, frameworks, and package manager (manifest files, lockfiles).
   - Detect lint/format/test commands from `package.json` scripts, `Makefile`, `pyproject.toml`, CI config.
   - Detect the default branch (`git symbolic-ref refs/remotes/origin/HEAD`, else `git branch`).
   - Detect existing architecture patterns from the directory layout.
   For a brand-new/empty project, skip inference and gather everything from the user.

3. **Fill gaps with the user.** Only ask about things you could not infer and that matter
   for downstream automation — especially: default branch, the exact **lint / test / build /
   E2E commands**, how the app is started for Playwright (command + URL/port), and the
   non-functional baseline (performance, accessibility, security).

4. **Write concrete, testable principles.** Prefer commands and thresholds over adjectives.
   "p95 API latency < 300ms", "`npm run test` must pass", "WCAG 2.1 AA" — not "should be fast".

5. **Confirm and save.** Show the drafted constitution, apply edits, and write the file.

## Output
- `.specify/memory/constitution.md`

Report the path and remind the user the constitution can be revised anytime, and that
`/specs:specify` is the next step.
