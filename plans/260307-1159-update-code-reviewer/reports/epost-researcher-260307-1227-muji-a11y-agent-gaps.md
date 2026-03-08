# Research: epost-muji & epost-a11y-specialist Agent Gaps

**Date:** March 7, 2026 | **Agent:** epost-researcher | **Scope:** Agent capability audit | **Status:** ACTIONABLE

---

## Executive Summary

Both agents exist with defined flows but have **critical wiring gaps** preventing proper cross-delegation and knowledge integration. muji (115 lines) has task-type routing (Flow 1 Library Development, Flow 2 Consumer Guidance) but lacks knowledge-retrieval integration and a11y delegation rules. a11y-specialist (70 lines) has platform detection but missing routing table for non-a11y findings and delegation back to code-reviewer or muji for UI-a11y edge cases.

**Verdict:** ACTIONABLE — specific changes needed in both agents to wire delegation rules and knowledge retrieval.

---

## Current State

### epost-muji Agent (115 lines)

**What's there:**
- ✅ Two explicit flows (Library Dev, Consumer Guidance)
- ✅ Platform detection strategy (`.tsx` → web, `.swift` → iOS, `.kt` → Android)
- ✅ Consumer Audit priority checklist (INTEGRITY, PLACE, REUSE, TW, DRY, REACT, POC)
- ✅ Reference to `ui-lib-dev/references/audit-standards.md`
- ✅ Skills list: `[core, skill-discovery, figma, design-tokens, ui-lib-dev, ui-guidance, audit]`

**What's missing:**
- ❌ NO explicit task-type routing table (unlike researcher's routing pattern)
- ❌ NO mention of `knowledge-retrieval` skill (should load for audit accuracy)
- ❌ NO delegation rule for a11y findings found during UI audit → epost-a11y-specialist
- ❌ NO code review mode documented (only library dev + consumer guidance)
- ❌ NO mention of `audit --ui` command wiring
- ❌ NO mention of `skill-discovery` dynamic loading pattern (listed but not explained in flows)

### epost-a11y-specialist Agent (70 lines)

**What's there:**
- ✅ Four operating modes (Guidance, Audit, Fix, Close)
- ✅ Platform detection table (`.swift` → iOS, `.kt` → Android, `.tsx` → Web)
- ✅ Command format: `/audit --a11y`, `/fix --a11y`, `/review --a11y`, `/audit --close`
- ✅ Reference to platform-specific skills (ios-a11y, android-a11y, web-a11y)
- ✅ Skills list: `[core, skill-discovery, a11y]`
- ✅ Data store structure (`.epost-data/a11y/`)

**What's missing:**
- ❌ NO task-type routing table (which mode to activate based on intent)
- ❌ NO mention of `knowledge-retrieval` skill (should activate for audit accuracy)
- ❌ NO delegation rule for UI-related a11y issues → epost-muji
- ❌ NO delegation rule for non-a11y findings found during a11y audit → epost-code-reviewer
- ❌ NO wiring to the new `/audit --a11y`, `/fix --a11y`, `/review --a11y`, `/audit --close` command format
- ❌ NO mention of a11y skills in `extensions/requires` pattern (ios-a11y, android-a11y, web-a11y should be documented as auto-loaded)

---

## Gap Analysis Table

| Gap | epost-muji | epost-a11y-specialist | Impact |
|-----|-----------|---------------------|--------|
| Task-type routing table | Missing | Missing | Both agents lack decision logic for which mode/flow to activate. Code-review skill must guess intent. |
| knowledge-retrieval integration | Missing | Missing | Audits lack context (prior findings, conventions, code patterns). Audit accuracy suffers. |
| Delegation back to code-reviewer | N/A (muji doesn't interact with code-review) | Missing | If a11y audit finds non-a11y issues, they're ignored or muji reviews them blind. |
| Delegation to epost-muji for UI-a11y | Missing | Missing | When a11y audit finds UI component issues (token misuse, theme not applied), a11y specialist can't delegate. |
| Command wiring documentation | Missing (audit listed but not explained) | Missing (commands listed but flow not explained) | Unclear which agent responds to `/audit --ui`, `/audit --a11y` at execution time. |
| Skill-discovery pattern explanation | Listed, not explained | Listed, not explained | Both agents mention skill-discovery but don't explain how to activate platform-specific skills. |
| code-review skill in muji | Missing | N/A | muji should have code-review escalation gate for code audit mode (when asked to review UI code, not just audit components). |

---

## Detailed Findings

### Finding 1: muji Missing `knowledge-retrieval` Integration

**Location:** `packages/design-system/agents/epost-muji.md`, lines 1–116

**Current state:**
- Consumer Audit section (line 69–82) lists 8 audit categories but doesn't mention knowledge-retrieval
- Flow 2 (Consumer Guidance) mentions `platform knowledge skill` routing but not knowledge retrieval for accuracy
- audit skill is listed but audit reference files don't activate knowledge-retrieval before auditing

**Should be:**
- Add to agent definition: explicit knowledge-retrieval activation step before audit
- Document in Consumer Audit section: "Before audit, activate knowledge-retrieval to load L1 `docs/` conventions + L2 RAG code patterns"

**Actionable fix:** Add section to Consumer Audit explaining knowledge retrieval protocol.

---

### Finding 2: muji Missing a11y Delegation Rule

**Location:** `packages/design-system/agents/epost-muji.md`, lines 69–82

**Current state:**
- Consumer Audit lists 8 categories (INTEGRITY, PLACE, REUSE, TW, DRY, REACT, POC) but **skips A11Y**
- Reference says "Apply standard STRUCT / PROPS / TOKEN / A11Y / TEST" but muji agent doesn't mention what to do with a11y findings
- No delegation rule to epost-a11y-specialist

**Should be:**
- Add delegation rule: "If UI audit finds a11y violations, delegate to epost-a11y-specialist"
- Link to a11y audit with full WCAG ruleset, not muji's mini rules

---

### Finding 3: a11y-specialist Missing Code-Reviewer Delegation

**Location:** `packages/a11y/agents/epost-a11y-specialist.md`, lines 1–71

**Current state:**
- Audit mode scans for a11y violations only
- No mention of what happens if audit finds non-a11y issues (security, performance, code quality)
- No back-reference to epost-code-reviewer for escalation

**Should be:**
- Add delegation rule: "If audit finds critical non-a11y issues, escalate to code-reviewer"
- Document: "a11y specialist's scope is accessibility only. General code quality issues route back to code-review"

---

### Finding 4: a11y-specialist Missing UI Component A11y Handling

**Location:** `packages/a11y/agents/epost-a11y-specialist.md`, lines 1–71

**Current state:**
- Platform detection works (iOS, Android, Web)
- a11y audit activates platform-specific skills (ios-a11y, android-a11y, web-a11y)
- But if audit finds **UI component a11y issues** (wrong token color, missing aria-label in button), a11y specialist can't ask muji to fix component

**Should be:**
- Add delegation rule: "If a11y violation is caused by design system component defect, escalate to epost-muji"
- Example: "Missing aria-label in EpostButton → muji fixes button component library"

---

### Finding 5: Missing Task-Type Routing Table (Both Agents)

**Location:** Both agent files

**Current state:**
- epost-muji has Flow 1 + Flow 2 but no decision table for which flow to activate
- epost-a11y-specialist has 4 modes but no decision table for which mode to activate
- code-review skill has the **pattern** that both agents should adopt (see `code-review/SKILL.md` lines 50–62)

**Should be:**
Both agents need "When to Activate" section with intent → flow/mode mapping (matching code-review pattern).

---

### Finding 6: Skill-Discovery Not Explained in Agent Flows

**Location:** Both agent files, skills lists

**Current state:**
- muji lists `skill-discovery` in skills but Flow 2 says "load via skill-discovery" without explaining how
- a11y-specialist lists `skill-discovery` but no mention of how platform-specific skills are activated
- Makes it unclear whether agents should pre-load all platform skills or let skill-discovery decide

**Should be:**
Add explicit "Skill Activation" section in both agents explaining lazy-loading:
- Which skills are always-loaded (core skills)
- Which skills are lazy-loaded (platform-specific)
- Reference to skill-discovery skill for platform detection priority

---

### Finding 7: muji Missing Code Review Mode

**Location:** `packages/design-system/agents/epost-muji.md`, lines 1–116

**Current state:**
- Flow 1: Library Dev (Figma pipeline)
- Flow 2: Consumer Guidance (component usage)
- NO mention of code review mode (when code-review skill escalates UI code to muji)

**Should be:**
- Add Flow 3: Code Review (escalation from epost-code-reviewer)
- Document: "When code-reviewer finds UI code issues, it delegates to muji. Muji runs full component audit, not just guidance."

---

## Verdict: ACTIONABLE

**Summary:** Both agents have solid foundational definition but lack integration wiring. Specific documented changes needed in **2 files**, total ~150 lines of additions/clarifications.

**Priority:** HIGH (blocks effective delegation between code-review → muji → a11y-specialist workflow)

**Next step:** epost-planner will create plan to update both agents with routing tables, delegation rules, knowledge-retrieval integration.

---

## Unresolved Questions

1. Should muji load `code-review` skill explicitly, or does code-review delegate via Task tool?
2. Should a11y-specialist's platform-specific skills (ios-a11y, etc.) be in `connections:requires` or left to skill-discovery?
3. Does muji's `audit` skill in skills list work, or should reference be to `references/ui.md` instead?
4. Should code-review skill's escalation logic be replicated in both muji + a11y agent frontmatter, or just documented?

---

## Related Files

- `packages/design-system/agents/epost-muji.md` — Needs Flow 3 + knowledge-retrieval integration + a11y delegation
- `packages/a11y/agents/epost-a11y-specialist.md` — Needs routing table + knowledge-retrieval integration + delegation rules
- `packages/core/skills/code-review/SKILL.md` — Reference model (already correct, lines 50–66)
- `packages/core/skills/audit/SKILL.md` — Reference model (already correct, lines 40–45)
- `packages/core/skills/audit/references/ui.md` — Reference model (already correct, lines 71–72)

