---
name: workflows
description: Team development workflows — feature development, bug fixing, code review, architecture review, project initialization.
---

# Workflows

## Feature Development

6-step canonical workflow for building features.

**1. Plan**
- Spawn parallel researchers (2-3) for: implementation patterns, codebase analysis, dependencies
- Create `plans/{date}-{slug}/plan.md` with YAML frontmatter
- Define phase files with **exclusive file ownership** per phase
- Include success criteria, risk assessment, conflict prevention

**2. Implement** — `/cook` or plan approved
- **Sequential** (default): phases executed in order
- **Parallel** (auto-detected): when phases have non-overlapping file ownership, spawn one subagent per phase
- `--parallel` or `--sequential` force override
- Per-phase implementation follows `subagents-driven` skill when 3+ independent tasks exist

**3. Test**
- Unit tests for new logic
- Integration tests for API/data flow
- E2E tests for user journeys
- Edge case tests (expired tokens, invalid input, race conditions)
- Security tests (CSRF, injection, session hijacking)

**4. Review**
- Scout first: edge-case detection across codebase
- Quality audit: code standards, security, performance, N+1 queries
- Plan compliance: verify all success criteria met
- If issues found → fix → re-test → re-review (max 3 loops)

**5. Docs** — auto after review pass
- Update API documentation with new endpoints
- Update onboarding guide if developer workflow changed
- Generate changelog entry with migration notes

**6. Git**
- Create meaningful conventional commit (`feat:` prefix)
- Create PR with proper description and checklist

**Failure Loops:** Test failure → debugger → fix → re-test (max 3). Review rejection → fix → re-review (max 3). 3 failures → escalate to user.

## Bug Fixing

Investigation-first: Scout → Debug → Fix → Test → Review → Capture → Git.

**1. Scout** — search codebase for related files, map dependencies, provide context for debugger

**2. Debug** — `/debug [issue]` or error detected
- Read logs, error traces, CI output
- Identify failing test or crash site
- Trace to root cause
- Output: root cause analysis + recommended fix

**3. Fix**
- Apply fix based on debugger's analysis
- Write regression test covering the root cause
- Keep changes minimal (surgical fix, not refactor)

**4. Test**
- Run full test suite
- Validate regression test passes
- If fail → back to debugger (max 3 loops)

**5. Review**
- Verify fix correctness
- Check for edge cases and side effects
- Validate test coverage of root cause

**6. Capture** — `journal` skill (auto-trigger on significant fix)
- Record root cause as FINDING in `docs/`
- Document prevention strategy

**7. Git** — commit with `fix:` prefix, reference issue if available

### Bug Complexity

| Complexity | Signal | Approach |
|---|---|---|
| Simple | Typo, missing import, config error | Skip scout, direct fix |
| Medium | Logic error, wrong API usage | Scout + debug + fix |
| Complex | Race condition, memory leak, perf | Full workflow with research |
| Critical | Security vulnerability, data loss | Full workflow + urgent flag |

## Code Review

Scout-first: edge-case detection before quality audit.

**1. Scout**
- If explicit file paths or `--files` list provided → use those directly; skip git diff
- Otherwise → scan changed files via `git diff`
- Search for related code across codebase, map dependencies

**2. Quality Audit**

Klara-theme feature module (20+ files or multi-subdir): use hybrid sequential audit — dispatch muji first via Template A+, then SEC/PERF/TS with dedup. See `code-review/SKILL.md` for full dispatch protocol.

| Category | Checks |
|---|---|
| **Security** | Input validation, SQL injection, XSS, CSRF, secrets exposure |
| **Performance** | N+1 queries, unnecessary re-renders, missing indexes, caching |
| **Correctness** | Edge cases, null handling, error paths, race conditions |
| **Standards** | Naming conventions, file structure, import patterns |
| **Tests** | Coverage of new paths, edge cases tested, no fake data |

**3. Report Output** — per `audit/references/output-contract.md`

**4. Persist Findings**
- Code findings (SEC/PERF/TS/LOGIC/DEAD) → `reports/known-findings/code.json`
- UI findings — persisted by epost-muji (do not duplicate)
- A11Y findings — persisted by epost-a11y-specialist (do not duplicate)
- Pre-scan for regressions before appending

**5. Update Index** — append to `reports/index.json` per `docs/references/index-protocol.md`

**6. Receiving Review** — when your code is being reviewed:
- Read all feedback before responding
- Fix critical issues immediately
- Discuss suggestions — accept or explain why not
- Re-request review after fixes

**7. Knowledge Capture** — if new conventions identified, record as CONV entry in `docs/`

## Architecture Review

Brainstorm → Research → Decide → Document.

**1. Brainstorm**
- Generate multiple solution approaches
- Evaluate trade-offs for each approach
- Prioritize by impact vs effort

**2. Research** — spawn 2-3 researchers in parallel
- Researcher 1: Implementation patterns and best practices
- Researcher 2: Security and compliance implications
- Researcher 3: Performance benchmarks and comparisons

**3. Decide**
- Synthesize brainstormer output + researcher findings
- Create ADR (Architecture Decision Record) via `knowledge --capture`
- Define implementation plan if decision is approved

**4. Document** — `journal` skill
- Record decision rationale, alternatives considered
- Document performance benchmarks before/after

### When to Use

- Technology migration decisions
- New system component design
- Performance optimization strategy
- Security architecture changes
- Infrastructure scaling decisions

## Project Initialization

Bootstrap a new project or module.

**1. Bootstrap** — `/bootstrap`
- Detect project type from context or ask user
- Create project structure (dirs, configs, initial files)
- Set up build tooling, linting, testing framework

**2. Documentation** — `/docs`
- Run KB init — scans codebase and generates structured Knowledge Base
- Category selection is automatic — see `docs/references/init.md`

**3. Git**
- `git init` (if needed)
- Initial commit with all bootstrapped files
- Set up `.gitignore`

### Integration

Also triggered by:
- `/get-started` skill — when onboarding to existing project
- `/bootstrap` skill — when scaffolding new module within existing project
