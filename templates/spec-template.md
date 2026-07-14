# Spec: <FEATURE NAME>

- **Spec ID:** <NNN-feature-slug>
- **Status:** draft | clarifying | ready | executing | done
- **Created:** <YYYY-MM-DD>
- **Mode:** new-project | add-feature
- **Inputs:** <links to prompts, mockups, screenshots, design files>

## 1. Summary
<2-4 sentences: what this delivers and for whom.>

## 2. Goals
- <measurable outcome>

## 3. Non-goals
- <explicitly out of scope>

## 4. Users & scenarios
- <persona> wants to <do X> so that <benefit>.

## 5. Functional requirements
> Written as testable, EARS-style statements where practical.
> Each has a stable ID so plans, PRs, and tests can trace back to it.

- **FR-1:** WHEN <trigger/condition>, the system SHALL <observable behavior>.
- **FR-2:** ...

## 6. UI / UX (if applicable)
- Screens / states derived from mocks: <list>
- Key interactions and empty/loading/error states.
- Reference mock: <path/link> — deviations noted here.

## 7. Non-functional requirements
> Pull defaults from the constitution; override or tighten per-feature here.

- **NFR-Performance:** <budgets>
- **NFR-Accessibility:** <target>
- **NFR-Security:** <authn/z, validation, data handling>
- **NFR-Reliability:** <error handling, retries, idempotency>
- **NFR-Observability:** <logging/metrics required>
- **NFR-Compatibility:** <browsers/devices/versions>
- **NFR-i18n:** <required strings externalized?>

## 8. Data & contracts
- Data models / schema changes: <...>
- API contracts (endpoints, request/response, errors): <...>
- Migrations / backfills: <...>

## 9. Dependencies & assumptions
- External systems, feature flags, environment, credentials.

## 10. Acceptance criteria
> The definition of done for the whole feature. Each maps to one or more FR/NFR
> and to a verification method (Playwright flow, test suite, manual check).

- [ ] **AC-1:** <given/when/then> — verified by <Playwright flow | test | check>.

## 11. Open questions
- [ ] <question — resolve via /specs:clarify before planning>
