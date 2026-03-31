# Research: Anthropic Skills Repository Taxonomy & Structure Analysis

**Date:** 2026-03-31
**Agent:** epost-researcher
**Scope:** Anthropic's official skills taxonomy, naming patterns, metadata structure, and organizational principles vs epost_agent_kit approach
**Status:** Complete

---

## Executive Summary

Anthropic's skills repository uses **functional domain organization** (17 categories by use case) with a minimal, standardized structure. The open specification at agentskills.io defines 5 required+optional metadata fields, progressive disclosure principles, and constraints on naming/descriptions. Key difference from epost_agent_kit: **Anthropic avoids complexity-tier categorization** (core/tier1/utility) in favor of **use-case clustering**. epost_agent_kit's multi-layer categorization (platform, domain, action, quality, meta) is more sophisticated but requires stronger discovery mechanisms to avoid cognitive overhead.

---

## Key Findings

### 1. Anthropic's Skill Organization (17 Categories)

Anthropic organizes by **functional domain**, not complexity:

| Category | Examples | Pattern |
|----------|----------|---------|
| Creative & Design | algorithmic-art, brand-guidelines, canvas-design, theme-factory | Output: visual artifacts |
| Document Formats | docx, pptx, pdf, xlsx | Input/Output: specific file types |
| Development & Integration | claude-api, mcp-builder, web-artifacts-builder, webapp-testing | Process: building/testing tools |
| Communication | doc-coauthoring, internal-comms, slack-gif-creator | Workflow: collaborative/sync tools |
| Meta | skill-creator | Skill authoring itself |

**No distinction** between "core action" vs "utility" vs "platform". Everything is flat discovery by purpose.

### 2. epost_agent_kit's Organization (8+ Categories)

epost_agent_kit layers complexity:

| Layer | Categories | Pattern |
|-------|-----------|---------|
| **Core Action** | cook, plan, debug, fix, test, docs, git, audit | Universal workflows |
| **Platform** | web-*, ios-*, android-*, backend-* | Execution context |
| **Domain** | domain-b2b, domain-b2c | Feature ownership |
| **Quality** | clean-code, code-review, security, tdd | Non-functional concerns |
| **Utility** | mermaidjs, repomix, error-recovery | Infrastructure |
| **Meta** | skill-creator, skill-discovery | Self-referential |
| **Kit Authoring** | kit (agent-development, skill-development) | Toolkit evolution |

**Why this matters:** epost_agent_kit prioritizes **execution context** (which agent runs what, when) vs Anthropic's **discovery context** (what does the user need, now).

### 3. Metadata Field Requirements

**Anthropic's spec (agentskills.io):**

| Field | Required | Max | Notes |
|-------|----------|-----|-------|
| `name` | Yes | 64 chars | Lowercase, hyphens, no leading/trailing/consecutive hyphens |
| `description` | Yes | 1024 chars | Both "what it does" + "when to use it" |
| `license` | No | — | License name or file reference |
| `compatibility` | No | 500 chars | Environment/system requirements |
| `metadata` | No | — | Arbitrary key-value pairs |
| `allowed-tools` | No | — | Space-delimited pre-approved tools (experimental) |

**epost_agent_kit's frontmatter (current):**

| Field | Used | Notes |
|-------|------|-------|
| `name` | Yes | Kebab-case, hierarchical (platform-subskill pattern) |
| `description` | Yes | Trigger conditions + brief capability |
| `user-invocable` | Yes | Boolean; false for passive/reference skills |
| `context` | Partial | fork/inline; relates to execution model, not discovery |
| `agent` | Yes | Which agent loads this skill by default |
| `skills` (in agents) | Yes | Explicit load list in agent frontmatter |
| `extends` | No | Dependency graph (only in skill-index.json) |
| `license` | No | Not used |
| `compatibility` | No | Not used |
| `version` | No | Invalid field — not recognized by Claude Code |

**Divergence:** Anthropic uses optional but **rich metadata for discovery** (compatibility, metadata map, allowed-tools). epost_agent_kit uses **execution metadata** (user-invocable, context, agent affinity).

### 4. SKILL.md Description Patterns

**Anthropic's guidance:**

> "Should describe both what the skill does and when to use it. Should include specific keywords that help agents identify relevant tasks."

**Example (pdf skill):**
```
Extracts text and tables from PDF files, fills PDF forms, and merges multiple PDFs.
Use when working with PDF documents or when the user mentions PDFs, forms, or document extraction.
```

**Anti-pattern (what Anthropic rejects):**
```
Helps with PDFs.  # Too vague, no keywords, no trigger conditions
```

**epost_agent_kit's approach (current CLAUDE.md):**

> "Description = triggering conditions ONLY ("Use when..."), never workflow summary"

**Example (web-testing skill):**
```
Use when writing tests, configuring Jest/Playwright, checking coverage, or working with test patterns
```

**Key difference:** epost_agent_kit is **more prescriptive** (triggers only), Anthropic **includes both capability + trigger**.

### 5. File Structure & Progressive Disclosure

**Both follow the same principle:**

```
skill/
├── SKILL.md          # Metadata + instructions (<500 lines recommended)
├── scripts/          # Executable code (optional)
├── references/       # Documentation (optional, loaded on-demand)
└── assets/           # Templates, images, data (optional)
```

**Token budgets (Anthropic spec):**
- Metadata: ~100 tokens (always loaded)
- Instructions (SKILL.md body): <5000 tokens (loaded on activation)
- Resources: Unlimited (on-demand)

**epost_agent_kit aligns:** Uses this structure consistently. Max 500 lines per SKILL.md is honored. References subdirectory pattern is standard.

### 6. Naming Conventions

**Anthropic:**
- Single hyphen separator: `pdf-processing`, `web-artifacts-builder`, `slack-gif-creator`
- No platforms prefix unless contextually necessary
- Flat namespace (no `/` in names)

**epost_agent_kit:**
- Platform prefix required for platform skills: `web-frontend`, `ios-development`, `backend-javaee`
- Hierarchical reference only in asset paths, not names
- Flat namespace in skill directory structure

**Alignment:** Both use kebab-case consistently. epost_agent_kit's platform prefix is additive, not contradictory.

### 7. Complexity & Scope Variation

**Anthropic observed sizes:**
- **Small skills** (single focused task): skill-creator, slack-gif-creator
- **Medium skills** (workflow + references): doc-coauthoring, webapp-testing
- **Large skills** (multi-framework): web-artifacts-builder (handles React, Vue, Svelte)

**epost_agent_kit observed sizes:**
- **Microskills** (<200 lines): error-recovery, clean-code
- **Standard skills** (300-600 lines): cook, debug, plan, test
- **Macro skills** (800+ lines): web-frontend, backend-javaee, audit
- **Meta skills** (300+ lines): skill-discovery, skill-creator, knowledge-capture

**Pattern:** Both support variable scope. Anthropic doesn't constrain by tier; epost_agent_kit's tier system is orthogonal to scope.

### 8. Discovery Mechanisms

**Anthropic:** Relies on description keywords + manual context routing. No built-in discovery skill.

**epost_agent_kit:** Has explicit `skill-discovery` skill that:
- Detects platform signals (file extensions, CWD)
- Detects task-type signals (keywords, git state)
- Queries skill-index.json (central registry)
- Resolves dependency graph (extends, requires, conflicts)
- Suggests enhancers

**Assessment:** epost_agent_kit's discovery is **more automated and context-aware**, reducing manual routing overhead.

---

## Technology Comparison

| Aspect | Anthropic | epost_agent_kit | Trade-off |
|--------|-----------|-----------------|-----------|
| **Organization** | Functional domains (flat) | Layers (core, platform, domain, quality, meta) | Anthropic = simpler; epost = more precise routing |
| **Metadata** | Minimal+rich optional | Execution-focused | Anthropic = discovery-first; epost = execution-first |
| **Naming** | Single-level kebab-case | Hierarchical prefixes (platform-subskill) | epost = self-documenting; Anthropic = simpler |
| **Discovery** | Manual (description keywords) | Automated (skill-discovery skill + index) | epost = less overhead; Anthropic = more flexible |
| **Scope Constraints** | None | None (but tier system implies complexity) | Both permissive |
| **Spec** | Minimal (agentskills.io) | Rich (CLAUDE.md + skill-discovery + agents) | Anthropic = portable; epost = integrated |
| **Dependency Graph** | Implicit (manual bundling) | Explicit (extends/requires in skill-index.json) | epost = clearer contracts; Anthropic = implicit coupling |

---

## Best Practices We Can Learn

### 1. Description Hygiene (Adopt)

Anthropic's description field is **action + trigger**:
```
Extract text and tables from PDFs, fill forms, merge files. Use when working with PDF documents,
forms, or document extraction.
```

**epost_agent_kit's current pattern** (triggers only) is stricter but less helpful. **Recommend:** Expand to include capability overview after the trigger phrase.

**Action:** Update 45 skill descriptions to include both trigger + brief capability (CSO audit completed Feb 2026 — consider this a follow-up pass).

### 2. File Organization (Already Aligned)

Both use progressive disclosure: `SKILL.md` + `scripts/` + `references/` + `assets/`. No changes needed.

### 3. Metadata Enrichment (Selective Adoption)

Anthropic's optional fields (`license`, `compatibility`, `metadata` map) enable:
- **License clarity** for distribution/compliance
- **Compatibility disclosure** (e.g., "Requires Python 3.14+")
- **Author/version tracking** in metadata

**epost_agent_kit recommendation:** Add optional `license` field to agent-authored skills (especially kit authoring skills). `compatibility` useful only if truly different (e.g., platform-specific constraints).

**Keep as-is:** Don't adopt `allowed-tools` (experimental in Anthropic spec, not stable).

### 4. Avoid Complexity Tiers in Public Specs

Anthropic **doesn't expose tier hierarchy** in the spec. It's internal orchestration, not user-facing taxonomy.

**epost_agent_kit:** The `core`, `platform`, `quality` tiers are implementation details. They should stay in CLAUDE.md + skill-index.json, **not exposed in skill names or descriptions**. This is already correct.

### 5. Discovery Automation (Strength, Keep)

epost_agent_kit's `skill-discovery` skill is more sophisticated than Anthropic's approach. This is a competitive advantage.

**Recommendation:** Document this in skill-discovery's opening statement. Marketing angle: "Intelligent context-aware discovery vs manual keyword matching."

---

## Options & Recommendations

| Option | Pros | Cons | Recommendation |
|--------|------|------|-----------------|
| **Flatten taxonomy to Anthropic's 17 domains** | Simpler, portable spec | Loses platform/quality context | Reject — epost_agent_kit's precision is valuable |
| **Expand descriptions to capability + trigger** | More helpful for discovery | Slightly longer (still <500 chars) | Adopt — low-cost, high-value |
| **Add optional license/metadata fields** | Better distribution support | Minor maintenance | Adopt — for public kit distribution only |
| **Rename skills to remove platform prefix** | Matches Anthropic naming | Loses self-documentation | Reject — platform prefix is helpful heuristic |
| **Implement Anthropic's allowed-tools field** | Standard compliance | Experimental, not stable | Defer — wait 6+ months for stabilization |
| **Document skill-discovery as competitive advantage** | Clarifies positioning | Minor documentation work | Adopt — update CLAUDE.md section |

---

## Consensus vs Experimental

### Stable/Proven (Anthropic)
- YAML frontmatter: `name`, `description` (required)
- File structure: SKILL.md + scripts/ + references/ + assets/
- Progressive disclosure principle
- Kebab-case naming
- Max 500 lines SKILL.md body

### Stable/Proven (epost_agent_kit)
- Hierarchical platform prefixes (web-*, ios-*, backend-*)
- Skill-discovery automation with platform + task-type detection
- Explicit dependency graph (extends/requires/conflicts)
- Execution metadata (user-invocable, context, agent affinity)
- Multi-tier organization (for internal routing, not public facing)

### Experimental (Anthropic)
- `allowed-tools` field (subject to change)
- Metadata map (stability TBD)

### Experimental (epost_agent_kit)
- None identified — practices are stable

---

## Actionable Findings

### High-Confidence Actions

1. **Expand skill descriptions** (Feb 2026 CSO audit follow-up)
   - Current: triggers only
   - Target: triggers + brief capability (1-2 sentences)
   - Example: "Use when..." + "Handles X, Y, Z tasks."
   - Effort: ~2 hours, 45 skills
   - Impact: Improves discovery without code changes

2. **Document skill-discovery in CLAUDE.md**
   - Add section: "Skill Discovery Advantage"
   - Highlight: automated platform/task detection
   - Mention: dependency resolution (Anthropic has no equivalent)
   - Effort: <30 min

3. **Add optional license field to kit authoring skills**
   - Covers: skill-creator, knowledge-capture, skill-discovery, kit/references/*
   - Example: `license: Apache-2.0` or `license: Proprietary. See LICENSE.md`
   - Effort: <15 min

### Medium-Confidence Actions

4. **Audit skill-index.json for metadata accuracy**
   - Verify `extends`, `requires`, `conflicts` entries align with actual references
   - Ensure count fields match reality
   - Effort: <1 hour
   - Impact: Prevents discovery script failures

### Low-Confidence Actions (Defer)

- Rename platform skills without prefix (breaks self-documentation heuristic)
- Adopt Anthropic's allowed-tools field (still experimental)
- Flatten 8-layer taxonomy to 17 domains (loses precision)

---

## Sources

- [Anthropic Skills Repository](https://github.com/anthropics/skills) — Directory structure, 17 categories, skill examples
- [Agent Skills Specification](https://agentskills.io/specification) — Official metadata schema, naming rules, progressive disclosure
- [skill-creator SKILL.md](https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md) — Frontmatter structure, eval framework
- [doc-coauthoring SKILL.md](https://github.com/anthropics/skills/blob/main/skills/doc-coauthoring/SKILL.md) — Workflow skill structure, stage patterns
- [webapp-testing SKILL.md](https://github.com/anthropics/skills/blob/main/skills/webapp-testing/SKILL.md) — Helper scripts pattern, automation
- [Anthropic Skills README](https://github.com/anthropics/skills/blob/main/README.md) — Skill categories, usage patterns
- epost_agent_kit CLAUDE.md — Local comparison baseline
- epost_agent_kit `.claude/skills/skill-discovery/SKILL.md` — Discovery mechanism reference

---

## Verdict

**ACTIONABLE**

epost_agent_kit's skill organization is **already well-aligned** with Anthropic's open spec. The 3 high-confidence actions (expand descriptions, document discovery, add license field) are low-effort, high-value improvements that increase discoverability without architectural changes.

The core differences (hierarchical platform prefixes, multi-tier internal organization, automated discovery) are **strengths**, not weaknesses. They provide better routing precision than Anthropic's flat approach.

---

## Unresolved Questions

- Should we publish epost_agent_kit skills to Anthropic's marketplace once stabilized? (Depends on org policy)
- Do we need `allowed-tools` field support as Anthropic stabilizes it? (Timeline: 6+ months, defer)
- Should skill-discovery be published as a standalone tool for other kit projects? (Strategic question, not research scope)
