---
name: specify
description: Draft a feature specification (functional AND non-functional requirements) from a plain-language description and/or mockups/screenshots. Works for a brand-new project or a feature added to an existing one. Produces specs/<id>/spec.md. Run after /specs:constitution and before /specs:plan.
disable-model-invocation: true
---

# /specs:specify

Turn a request (`$ARGUMENTS`) plus any attached mocks into a rigorous, testable spec.

## Inputs
- The user's description in `$ARGUMENTS`.
- Any images/mockups/screenshots the user attached — read them and derive screens, states,
  and interactions. If a mock is referenced by path, open it.
- The project constitution at `.specify/memory/constitution.md` (read it if present; its
  non-functional baseline seeds this spec's NFR section). If it is missing, tell the user to
  run `/specs:constitution` first, but continue with sensible defaults.

## Steps

1. **Allocate a spec ID and folder.** Pick the next zero-padded number by scanning existing
   `specs/*` directories (start at `001`). Slugify the feature name → `specs/<NNN-slug>/`.
   Detect **mode**: `new-project` if the repo has no application code yet, else `add-feature`.

2. **Draft the spec** from `${CLAUDE_PLUGIN_ROOT}/templates/spec-template.md`. Fill every
   section. Rules:
   - **Functional requirements** get stable IDs (FR-1, FR-2, …) and are written as testable,
     EARS-style statements ("WHEN <condition>, the system SHALL <behavior>").
   - **Non-functional requirements** are always populated — inherit from the constitution and
     tighten per feature. Never leave the NFR section empty; if a category doesn't apply, say
     so explicitly.
   - From mocks, enumerate screens and every state (loading, empty, error, success).
   - **Acceptance criteria** are concrete and each names its verification method
     (Playwright flow, test suite, or manual check). These drive `/specs:execute` later.

3. **Do not invent unknowns.** Anything ambiguous or missing goes in **Open questions** with
   a `[ ]` checkbox rather than a guessed answer.

4. **Save** to `specs/<NNN-slug>/spec.md` and set status to `draft` (or `clarifying` if there
   are open questions).

## Output
- `specs/<NNN-slug>/spec.md`

Report the spec path and a one-paragraph summary. If there are open questions, recommend
`/specs:clarify <NNN-slug>`; otherwise recommend `/specs:plan <NNN-slug>`.
