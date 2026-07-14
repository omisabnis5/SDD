---
name: status
description: Show spec-driven development progress — all specs, their stage, and per-PR execution status (pending/in-progress/verifying/in-review/merged/blocked/failed) from state.json. Read-only.
disable-model-invocation: true
---

# /specs:status

Give a quick, read-only overview of where every spec and PR stands.

## Input
- Optional spec id in `$ARGUMENTS` to scope to one spec; otherwise summarize all.

## Steps

1. Scan `specs/*/`. For each spec, read `spec.md` (status) and, if present, `state.json`.
2. Render a compact table per spec:
   - Spec id, name, spec status, whether plan/prs/review exist.
   - Each PR: id, branch, `dependsOn`, status, and (if merged) the merge target.
3. Highlight what's next: the first `pending` PR whose dependencies are all `merged`, any
   `blocked`/`failed` PRs, and any spec with unresolved open questions.

Do not modify anything. End with the single recommended next command (e.g.
`/specs:execute <id>`, `/specs:clarify <id>`).
