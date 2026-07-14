---
name: review-plan
description: Review a drafted spec + plan + PR split and identify gaps, risks, missing requirements, weak verification, hidden dependencies, and regression blind spots before any code is written. Delegates to the plan-reviewer agent and writes specs/<id>/review.md. Run after /specs:split-prs and before /specs:execute.
disable-model-invocation: true
---

# /specs:review-plan

The quality gate before implementation. Find the problems on paper, where they're cheap to fix.

## Input
- Target spec id in `$ARGUMENTS`. If omitted, use the most recently modified spec.

## Steps

1. Confirm `specs/<id>/spec.md`, `plan.md`, and `prs.md` all exist. If any is missing, point
   the user to the step that produces it.

2. **Delegate a thorough review to the `plan-reviewer` agent** (via the Task/Agent tool),
   passing the paths to the spec, plan, prs, and constitution. Ask it to assess:
   - **Completeness** — every FR covered by a task and a PR; NFRs actually addressed (not just
     listed); acceptance criteria all verifiable.
   - **Traceability** — each PR traces to requirements; no orphan work; no requirement with no
     home.
   - **PR decomposition** — concerns properly separated (fe/be/db/infra); dependency graph is
     minimal and acyclic; execution order is valid; each PR is independently verifiable and
     leaves the app working.
   - **Verification** — each PR has a real verification method; UI covered by Playwright flows,
     logic by tests; the "how the app starts for E2E" is specified.
   - **Regression risk** — shared/touched surfaces identified; guards defined; ordering avoids
     breaking `main` at any merge point.
   - **Constitution compliance** — architecture, standards, and NFR baseline honored;
     deviations justified.
   - **Feasibility & sequencing** — migrations before dependents, backward-compat, rollback.

3. **Write `specs/<id>/review.md`** with findings grouped by severity
   (blocker / major / minor / nit), each with a concrete recommended fix and the artifact +
   location it applies to. Track each **blocker** as a checkbox: `- [ ]` while open, `- [x]`
   once resolved.

4. **Write the execution gate marker.** The very first line of `review.md` MUST be one of:
   - `<!-- specs-gate: status=CLEAR -->` — no open blockers; `/specs:execute` is allowed.
   - `<!-- specs-gate: status=BLOCKED -->` — one or more open blockers remain.

   A `hooks/` guard reads this marker and **refuses to run `/specs:execute`** while status is
   `BLOCKED` or the marker/file is missing. Keep it accurate: set `BLOCKED` whenever any
   blocker is open, and only switch to `CLEAR` once every blocker checkbox is `- [x]`.

5. **Offer to apply fixes.** For blockers/majors, propose edits to spec/plan/prs and, on the
   user's approval, apply them, tick the resolved blocker checkboxes, and — if no blockers
   remain open — update the marker to `status=CLEAR`.

## Output
- `specs/<id>/review.md` (first line = gate marker; and, if approved, updated spec/plan/prs)

Report the count of findings by severity. If no blockers remain, tell the user the plan is
ready and they can run `/specs:execute <id>`.
