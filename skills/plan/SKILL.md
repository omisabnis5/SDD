---
name: plan
description: Produce a technical implementation plan from a ready spec — approach, architecture impact, constitution/NFR compliance, a tagged work breakdown, verification strategy, and regression surface. Produces specs/<id>/plan.md. Run after the spec is ready and before /specs:split-prs.
disable-model-invocation: true
---

# /specs:plan

Translate an approved spec into a concrete technical plan grounded in this codebase.

## Input
- Target spec id in `$ARGUMENTS`. If omitted, use the most recently modified spec.

## Steps

1. **Read the inputs:** `specs/<id>/spec.md` and `.specify/memory/constitution.md`. If the
   spec still has unresolved open questions, stop and recommend `/specs:clarify <id>` first.

2. **Ground in the actual code.** Explore the repo to learn the existing architecture,
   patterns, naming, and where analogous features live. The plan must fit the real codebase,
   not a generic ideal. For a new project, propose the initial structure consistent with the
   constitution.

3. **Draft the plan** from `${CLAUDE_PLUGIN_ROOT}/templates/plan-template.md`:
   - **Approach & architecture impact** — modules, layers, data/schema, API surface.
   - **Constitution & NFR compliance** — show how the design satisfies each relevant NFR from
     the spec and constitution. Flag any principle that must be bent and justify it.
   - **Work breakdown** — a table of tasks, each tagged with a **layer** (`fe`/`be`/`db`/
     `infra`/`shared`) and tracing back to FR/NFR IDs. The layer tags are what
     `/specs:split-prs` uses to separate concerns, so tag carefully and keep frontend and
     backend tasks distinct.
   - **Verification strategy** — which requirements are checked by Playwright vs. the test
     suite, what tests to add, and exactly how the app/service is started for E2E.
   - **Regression surface** — existing behavior the change could affect, shared code touched,
     and how each risk is guarded. This feeds the regression checks during execution.

4. **Save** to `specs/<id>/plan.md`, status `draft`.

## Output
- `specs/<id>/plan.md`

Report the plan location and recommend `/specs:split-prs <id>`.
