# Implementation Plan: <FEATURE NAME>

- **Spec ID:** <NNN-feature-slug>
- **Status:** draft | reviewed | executing | done
- **Constitution checked:** yes/no (note any deviations + justification)

## 1. Approach
<How we will build it, in prose. The shape of the solution before the task list.>

## 2. Architecture impact
- New/changed modules, layers, boundaries.
- Data model / schema / migration changes.
- API surface changes (endpoints, contracts, versioning).
- Cross-cutting concerns (auth, logging, config, feature flags).

## 3. Constitution & NFR compliance
- How the design meets each relevant NFR from the spec and constitution.
- Any principle that must be bent, and why.

## 4. Technical decisions
- <decision> — chosen because <...>; alternatives rejected: <...>.

## 5. Work breakdown (pre-split)
> High-level tasks. `/specs:split-prs` groups these into pull requests.
> Tag each task with a layer so the splitter can separate concerns.

| Task | Layer (fe/be/db/infra/shared) | Traces to | Notes |
|------|-------------------------------|-----------|-------|
| T-1  | be                            | FR-1      |       |

## 6. Verification strategy
- Which requirements are verified by Playwright (UI flows) vs. test suite (unit/integration).
- New tests to add per area.
- How the app/service is started for E2E (command, port, seed data).

## 7. Regression surface
- Existing behavior that this change could affect.
- Shared code / interfaces touched.
- How each risk will be guarded (characterization tests, contract tests, feature flag).

## 8. Rollout & risk
- Sequencing constraints, migrations that must run first, backward-compat needs.
- Rollback plan.
