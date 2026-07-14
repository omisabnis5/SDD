---
name: clarify
description: Resolve the open questions and ambiguities in a spec by asking the user targeted questions, then fold the answers back into specs/<id>/spec.md. Run between /specs:specify and /specs:plan when the spec has unresolved open questions.
disable-model-invocation: true
---

# /specs:clarify

Close the gaps in a spec before planning, so the plan is built on decisions rather than guesses.

## Input
- Target spec id in `$ARGUMENTS` (e.g. `001-checkout`). If omitted, use the most recently
  modified spec under `specs/`.

## Steps

1. Read `specs/<id>/spec.md` and the constitution.

2. **Gather questions.** Collect the items under **Open questions**, plus any additional
   ambiguities, contradictions, or missing decisions you find while re-reading (unspecified
   error behavior, undefined data limits, unclear auth, missing NFR targets, etc.). Prioritize
   the ones that would most change the plan or the PR split.

3. **Ask the user** the highest-impact questions (batch them; prefer concrete multiple-choice
   options with a recommended default). Do not ask about things you can reasonably infer from
   the constitution or codebase — resolve those yourself and note the assumption.

4. **Fold answers back in.** Update the relevant FR/NFR/data/acceptance sections, remove
   resolved items from Open questions, and record any assumptions you made. If everything is
   resolved, set spec status to `ready`.

## Output
- Updated `specs/<id>/spec.md`

Report what was resolved and what (if anything) remains open. When the spec is `ready`,
recommend `/specs:plan <id>`.
