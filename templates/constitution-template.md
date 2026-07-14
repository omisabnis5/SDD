# Project Constitution

> The durable engineering principles for this project. Every spec, plan, PR, and code
> review is checked against this document. Keep it short, opinionated, and testable.

## Architecture
- <e.g. layered / hexagonal / feature-sliced; where business logic lives; allowed dependencies between layers>
- <how frontend and backend communicate; API style (REST/GraphQL/RPC)>
- <state management, data access patterns>

## Tech stack & conventions
- Languages / frameworks: <...>
- Package manager / build: <...>
- Directory layout: <...>
- Naming conventions: <files, components, tests>

## Coding standards
- Formatting / lint: <tool + command, e.g. `npm run lint`>
- Type safety: <e.g. strict TypeScript, no `any`>
- Error handling: <expected pattern>
- Logging / observability: <expected pattern>

## Testing
- Unit test framework + command: <...>
- Integration/API test approach + command: <...>
- E2E via Playwright: <command, base URL, how the app is started for tests>
- Minimum coverage / required gates: <...>

## Non-functional baseline (applies to every feature)
- Performance budgets: <e.g. p95 API < 300ms, LCP < 2.5s>
- Accessibility: <e.g. WCAG 2.1 AA>
- Security: <authn/z model, input validation, secrets handling>
- i18n / l10n: <required?>
- Browser/device support: <...>

## Git & delivery
- Default branch: <main | master>
- Branch naming: <e.g. `feat/<spec-id>-<pr-slug>`>
- Commit style: <e.g. Conventional Commits>
- PR requirements: <checks that must pass before merge>
- CI command(s): <...>
