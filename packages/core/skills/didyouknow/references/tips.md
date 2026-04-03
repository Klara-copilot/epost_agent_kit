# Kit Tips Library

Each tip has: ID, title, tags, body, example, related.

---

## Hidden Flags

### TIP-001: Generate edge cases before writing tests
tags: testing, scenario, edge-cases, tdd, test-first, before-writing-tests

`/test --scenario <feature>` runs the 12-dimension edge case framework before any test is written.
It analyzes: user types, input extremes, timing, scale, auth, data integrity, compliance, business logic.
Output feeds directly into `/test` as concrete test seeds.

Example:
  `/test --scenario "file upload with tenant isolation"`

Related: `test` skill → `references/scenario-mode.md`

---

### TIP-002: Visual regression testing is built in
tags: testing, visual, playwright, screenshot, regression, web

`/test --visual` runs Playwright screenshot comparisons against baselines.
`/test --visual --update` regenerates baselines after intentional UI changes.

Example:
  `/test --visual` → compares current UI against stored screenshots, fails on pixel diff

Related: `test` skill → `references/visual-mode.md`

---

### TIP-003: Research has two speeds
tags: research, fast, deep, docs, external

`/research --fast <topic>` → quick lookup, single pass, good for API syntax.
`/research --deep <topic>` → comprehensive sweep, multiple sources, good for architecture decisions.

Example:
  `/research --fast "next-intl getTranslations"` for a quick API check
  `/research --deep "multi-tenancy patterns"` before designing a new feature

Related: `research` skill

---

### TIP-004: Parallel agents with explicit override
tags: cook, parallel, agents, performance, phases

When a plan has phases with non-overlapping file ownership, `cook` auto-detects and runs them in parallel.
Force with `--parallel` or `--sequential` when you need to override.

Example:
  `/cook --parallel` when you're confident phases don't share files

Related: `cook` skill, `subagents-driven` skill

---

### TIP-005: epost-tester uses diff-aware mode by default
tags: testing, performance, diff, changed-files, coverage

By default `epost-tester` only runs tests for changed files (strategies: co-located, mirror-dir, import-graph).
Use `--full` to override and run the entire suite.
Auto-escalates to full suite when: config files changed, >70% tests already mapped, or no tests found.

Example:
  After editing `auth.ts`, only auth tests run — not the whole suite

Related: `epost-tester` agent

---

## Skill Combinations

### TIP-010: The full TDD flow in three commands
tags: tdd, testing, workflow, scenario, git

`/test --scenario <feature>` → discover edge cases
`/test` → run tests + coverage
`/git` → commit when passing

Each command passes context to the next. Scenario seeds → test targets → commit message.

Related: `tdd`, `test`, `git` skills

---

### TIP-011: Audit chains — muji first, then code-reviewer
tags: audit, muji, code-review, ui, hybrid

For klara-theme UI code: dispatch `epost-muji` first (UI/design findings), then `epost-code-reviewer` with muji's report.
Never audit UI code with code-reviewer alone — it misses design-system violations.

Example:
  `/audit` on a klara-theme feature module → auto-dispatches in the right order

Related: `audit` skill → `references/delegation-templates.md`

---

### TIP-012: Security scan is part of the test flow
tags: security, testing, owasp, stride

`/security` runs STRIDE threat modeling + OWASP Top 10 scan.
Best used after feature implementation, before PR — not as an afterthought.

Related: `security` skill

---

## Routing & Architecture

### TIP-020: Simple tasks don't need agent spawning
tags: routing, agents, performance, inline

Weight-based rule: < 5 steps + single file + reversible → execute inline, no agent spawn.
Spawning agents costs ~15x token baseline. Only spawn when: work is parallel, needs context isolation, or is destructive.

Example:
  Fixing a typo → inline. Implementing a 3-phase feature → spawn epost-fullstack-developer.

Related: ARCH-0002 routing design

---

### TIP-021: Subagents can't spawn subagents
tags: agents, subagents, orchestration, constraint

Agents spawned via Agent tool can NOT spawn further agents.
Multi-agent workflows must be orchestrated from the main conversation — not from inside a subagent.

Example:
  Main → [Agent] → specialist-1 ✅
  Main → [Agent] → agent-A → [Agent] → agent-B ❌ BLOCKED

Related: `core/rules/orchestration-protocol.md`

---

### TIP-022: Platform is auto-detected from file extensions
tags: routing, platform, detection, web, ios, android, backend

File extensions determine which platform skills load:
`.tsx` / `.ts` → web   |   `.swift` → iOS   |   `.kt` → Android   |   `.java` → backend

You don't need to say "this is a web task" — just mention the file or paste an error.

Related: CLAUDE.md routing rules

---

## Knowledge & Standards

### TIP-030: Layer 0 skills override repo conventions
tags: layer0, knowledge, standards, conventions, finding

The kit's skills are Layer 0 — ground truth for org-wide standards.
If a repo has a CONV doc that contradicts a Layer 0 skill → the skill is correct; the CONV is a FINDING.
Agents running code-review MUST compare against Layer 0, not just the repo's own docs.

Related: ARCH-0003 Three-Layer Knowledge Model

---

### TIP-031: CONV docs should only document deviations
tags: conv, conventions, layer2, deviation, docs

A CONV doc in a repo answers: "How does THIS repo differ from the org standard?"
If a CONV doc restates what a Layer 0 skill already says → delete it (DRY violation).
Only local deviations from Layer 0 belong in CONV.

Related: ARCH-0003 → Layer 2 rules

---

### TIP-032: Deviation = CONV + FINDING, both at once
tags: deviation, finding, conv, layer1, aggregation

When a repo deviates from a Layer 0 standard:
- Write `CONV-*` — the valid local convention ("this repo uses X because Y")
- Write `FINDING-*` with `layer-0-deviation: true` — the signal for Layer 1 aggregation

Layer 1 collects FINDING-* across all repos. When multiple repos share a deviation → human decision: adopt into Layer 0, fix Layer 2, or accept.

Related: ARCH-0003 Deviation Detection

---

## Backend

### TIP-040: backend-quarkus is for NEW services only
tags: backend, quarkus, java21, new-service, legacy, backend-javaee

Existing repos use `backend-javaee` (WildFly + Java 8 + Jakarta EE 8).
New services use `backend-quarkus` (Quarkus LTS + Java 21 + Cloud Run + AlloyDB).
Never apply Quarkus patterns to existing repos — different framework, different DI, different deployment.

Related: `backend-quarkus`, `backend-javaee`

---

### TIP-041: Two internal JWT tokens — user token vs tenant token
tags: backend, jwt, auth, token, tenant, permission

The system has TWO internal token types (never exposed to clients):
- User token: platform-level roles (`user_roles`)
- Tenant token: tenant-scoped context (`company-tenant`, `person-tenant`, `tenantId`, tenant `roles`)

Backend endpoints use `@AccessibleWithoutTenant` (user token OK) or `@PermissionAllowed(PermissionConstant.X)` (needs tenant token + permission).
External clients use Keycloak token only.

Related: `backend-auth` skill → `references/token-schemas.md`

---

### TIP-042: AlloyDB is the new database standard
tags: backend, database, alloydb, postgresql, new-service

New services use AlloyDB (PostgreSQL-compatible, GCP-managed).
Existing services are migrating from self-managed PostgreSQL to AlloyDB.
New database provisioning goes via `luzfin_scripts` repo → SQL template → shell runner → Kubernetes Job.

Related: `backend-databases`, `backend-quarkus`, `infra-kubernetes`

---

## Web

### TIP-050: Import navigation helpers from navigation.ts — not next/link
tags: web, nextjs, navigation, routing, link

Always import `Link`, `redirect`, `usePathname`, `useRouter` from your `navigation.ts` — NOT from `next/link` or `next/navigation`.
This ensures locale-aware routing works correctly.

Example:
  `import { Link } from '@/navigation'` ✅
  `import Link from 'next/link'` ❌

Related: `web-nextjs`, `web-i18n`

---

### TIP-051: Never call backend APIs from client components
tags: web, nextjs, server-actions, security, backend, client

All calls to backend services MUST go through Server Actions, Route Handlers, or server components.
Never call backend APIs directly from Client Components — keeps secrets off the client, avoids CORS.

Example:
  Client → `useAction(serverAction)` → Server Action → `FetchBuilder.get(backendUrl)` ✅
  Client → `fetch(process.env.BACKEND_URL)` ❌

Related: `web-nextjs`, `web-api-routes`

---

### TIP-052: web-frontend has RAG search for the codebase
tags: web, rag, vector-search, codebase, frontend

`web-frontend` skill includes `references/rag.md` — instructions for using MCP vector search to find existing patterns in the web codebase.
Before building something new, check if it already exists.

Related: `web-frontend` → `references/rag.md`, `ios-rag` skill

---

## Infra

### TIP-060: Always validate K8s changes with deploy_to_stdout.sh
tags: kubernetes, infra, validation, kustomize, sops

After ANY change to `luz_kubernetes`, run `deploy_to_stdout.sh` inside the Docker container to verify the final YAML generates correctly.
If it fails → the change is broken. Fix before committing.
Never push unencrypted secrets — delete raw `.yaml` files after encrypting to `.sops.yaml`.

Related: `infra-kubernetes` → `references/sops-workflow.md`

---

### TIP-061: GCP compute preference order
tags: infra, gcp, cloud-run, gke, compute-engine, deployment

Always prefer: Cloud Run (scale-to-zero, event-driven) → GKE (long-running, custom orchestration) → Compute Engine (last resort only).
Most new services should go on Cloud Run unless they have specific long-running or stateful requirements.

Related: `infra-kubernetes`, `backend-quarkus`
