# ARCH-0003: Three-Layer Knowledge Model

**Category**: architecture
**Status**: current
**Audience**: agent, human
**Tags**: knowledge, standards, layers, epost_knowledge_base, conventions, deviations

---

## Purpose

Defines the authority hierarchy for all knowledge consumed by agents across the ePost engineering organisation. Three layers exist. Each layer has a single owner, a defined scope, and clear rules about what belongs there.

---

## The Three Layers

```
Layer 0 — epost_agent_kit (ground truth, org-wide standards)
Layer 1 — epost_knowledge_base (cross-repo context, live dependency graph)
Layer 2 — per-repo docs/ (implementation-specific, deviations only)
```

### Layer 0 — epost_agent_kit Skills

**Location**: `epost_agent_kit/packages/*/skills/`
**Owner**: Kit team
**Authority**: Ground truth. Never derived from any repo.

What lives here:
- REST conventions, CDI, Jakarta EE patterns
- React/Redux composition patterns
- Error handling standards
- Design system token architecture
- Infrastructure patterns
- Security standards

**Rule**: If a standard applies uniformly across the org → it belongs in Layer 0.
**Rule**: If a repo deviates from Layer 0 → that is a **FINDING** (Layer 2), not a new convention.
**Rule**: Layer 0 is never updated based on what repos happen to do. It is prescriptive, not descriptive.

---

### Layer 1 — epost_knowledge_base

**Location**: `/Users/than/Projects/epost_knowledge_base/`
**Owner**: KB pipeline
**Authority**: Cross-repo context, derived from the whole graph.

What lives here:
- `luz/{slug}/index.json` — per-repo cached doc registry
- `luz/{slug}/ARCH-0001-*.md` — per-repo architecture summary
- `luz/master-status.json` — cross-repo processing status and quality
- Dependency graph (built by `scripts/build-graph.sh`) — which repos depend on which
- Domain synthesis — B2B/B2C module relationships
- Org-level ADRs (decisions spanning multiple repos)
- `catalog-info.yaml` maintenance (future)

**Rule**: Layer 1 is derived from repos, not authored manually.
**Rule**: Layer 1 does NOT override Layer 0. If a repo's docs contradict a Layer 0 standard, that's a Layer 2 FINDING.
**Rule**: Cross-repo questions ("what depends on luz_core?", "which repos use Monitoring?") are answered from Layer 1.

**Agent access pattern**:
```
Read /Users/than/Projects/epost_knowledge_base/luz/{slug}/index.json
Read /Users/than/Projects/epost_knowledge_base/luz/{slug}/ARCH-0001-*.md
```

Note: Path is local (workstation). Cloud migration path: TBD when pipeline moves off local.

---

### Layer 2 — Per-Repo docs/

**Location**: `{repo}/docs/` in each Bitbucket repository
**Owner**: KB pipeline (generated) + repo team (curated)
**Authority**: Implementation-specific context for that repo only.

Document types and their scope:

| Type | Scope | Rule |
|------|-------|------|
| `ARCH-*` | How this repo is structured | Keep as-is |
| `FEAT-*` | What features this repo provides | Keep as-is |
| `FINDING-*` | Bugs, gotchas, deviations from Layer 0 | Keep — deviations from Layer 0 belong here |
| `CONV-*` | Conventions used in this repo | **Deviations from Layer 0 only** — never restate what Layer 0 already defines |
| `API-*` | REST/GraphQL endpoints | Prefer OpenAPI spec link over markdown prose |
| `ADR-*` | Decisions scoped to this repo | Keep — org-spanning ADRs belong in Layer 1 |
| `PATTERN-*` | Reusable code patterns specific to this repo | Keep |
| `GUIDE-*` | Dev setup, onboarding | Keep |
| `INFRA-*` | Docker, CI/CD, deployment config | Keep |
| `INTEG-*` | Third-party SDK integrations | Keep |

**CONV-* rule (critical)**:
> A CONV doc in a repo should answer: "How does this repo differ from the org standard?" — not "What is the org standard?" If the CONV content already exists verbatim in a Layer 0 skill, delete it. If it documents a deliberate local deviation, keep it and reference the Layer 0 rule it deviates from.

**API-* rule**:
> Prefer linking to or generating an OpenAPI spec (`docs/api/openapi.yaml`) over maintaining markdown API docs. Markdown API docs go stale; specs are machine-readable and auto-validated.

---

## Authority Resolution

When an agent encounters a conflict between layers:

```
Layer 0 wins over Layer 1 wins over Layer 2
```

Conflict scenarios:

| Scenario | Resolution |
|----------|-----------|
| Repo's CONV-* contradicts Layer 0 skill | Layer 0 is correct. Repo CONV is a FINDING. |
| Two repos have different patterns for same problem | Check Layer 0. If no standard → escalate to kit team to define one. |
| Layer 1 dependency graph contradicts repo's own docs | Layer 1 graph is more current (pipeline-generated). Repo docs may be stale. |
| Layer 0 skill is absent for a technology | Repo CONV may be authoritative temporarily. Signal to kit team to add Layer 0 coverage. |

---

## Deviation Detection

A deviation from Layer 0 is **both a valid local convention and a finding** — simultaneously. These are not mutually exclusive.

When an agent finds a deviation from Layer 0 in a repo:

1. **Write a `CONV-*`** — the working reality: "this repo uses X because Y". This is the valid convention for that repo.
2. **Write a `FINDING-*`** — the deviation signal: "deviates from Layer 0 standard Z". Tag with `layer-0-deviation: true`.
3. Layer 1 aggregates FINDING-* entries across repos. When multiple repos share the same deviation → human decision point:
   - **Adopt**: promote the pattern into Layer 0 (fix the standard)
   - **Fix**: align the deviating repos to Layer 0 (fix Layer 2)
   - **Accept**: leave as documented local variance (keep CONV + FINDING)

This flow means Layer 2 deviations are never silently ignored. They're visible, aggregated, and resolved deliberately.

Agents running `code-review` or `audit` MUST compare against Layer 0 skills as ground truth, not just repo conventions.

---

## Agent Loading Model

| Context | What agents see |
|---------|----------------|
| Any session | Layer 0 via CLAUDE.md (auto-loaded) + skills (wired to agent) |
| Cross-repo questions | Layer 1 via explicit Read of `epost_knowledge_base/luz/` files |
| Per-repo work | Layer 2 via `knowledge` skill → reads repo's `docs/index.json` |

Layer 1 is NOT auto-loaded. Agents must explicitly read from `epost_knowledge_base` when cross-repo context is needed. Orchestrator should inject the path when spawning agents that need it.

---

## Layer 1 Pipeline Status (as of 2026-04-02)

| Metric | Value |
|--------|-------|
| Total repos tracked | 197 |
| Processed (PR open or merged) | ~74 (37%) |
| Pending | 123 |
| KB entries indexed | 628 |
| Dependency graph | built from processed repos |

Pipeline runs daily at 10 AM (init-batch, 10 repos/run). Full coverage estimated: ~12 more daily runs.

---

## Related

- `ARCH-0001` — Current kit system architecture
- `ARCH-0002` — Claude native mechanics and routing design
- `epost_knowledge_base/README.md` — Layer 1 pipeline documentation
- `knowledge` skill — How agents query Layer 2 (per-repo KB)
- `domain-b2b`, `domain-b2c` skills — Domain context from Layer 0
