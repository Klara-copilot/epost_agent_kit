# External Skills Research: Anthropic & Qodex

**Date:** 2026-03-11
**Agent:** epost-researcher
**Scope:** Analyze Anthropic official skill-creator and Qodex multi-agent-orchestration for integration opportunities
**Status:** ACTIONABLE

---

## Executive Summary

Analyzed two external skill repositories against epost_agent_kit's existing infrastructure. Anthropic's official skills framework (Extend Claude with skills) establishes cross-platform portability standards and progressive disclosure patterns. Qodex contributes practical multi-agent orchestration examples (sequential, parallel, hierarchical, consensus) and domain-specific workflow libraries.

**Key finding:** epost_agent_kit is already ahead on core orchestration principles. Anthropic's documentation validates our Iron Law and context-forking patterns. Qodex offers tactical enhancements: domain-specific templates and performance benchmarking across frameworks.

**Recommended actions:** (1) Audit skill descriptions against Anthropic's "third-person specificity" requirement; (2) adopt Qodex's consensus-voting pattern for design decisions; (3) document cross-platform skill discovery priority matrix.

---

## Sources Consulted

1. **Anthropic Claude Code Skills Docs** — https://code.claude.com/docs/en/skills (Credibility: High — Official documentation)
2. **Anthropic Skill Authoring Best Practices** — https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices (Credibility: High)
3. **GitHub: anthropics/skills** — https://github.com/anthropics/skills (Credibility: High)
4. **GitHub: qodex-ai/ai-agent-skills** — https://github.com/qodex-ai/ai-agent-skills (Credibility: Medium)
5. **Qodex Skills Hub** — https://playbooks.com/skills/qodex-ai (Credibility: Medium)
6. **Medium: Multi-Agent Orchestration Comparison** — https://medium.com/@arulprasathpackirisamy/mastering-ai-agent-orchestration-comparing-crewai-langgraph-and-openai-swarm-8164739555ff (Credibility: Medium)

---

## Key Findings

### 1. Anthropic Skills Framework (Extend Claude with skills)

#### What It Does
- **Core function:** Standardized framework for extending Claude's capabilities via `SKILL.md` files with YAML frontmatter + markdown body
- **Problem solved:** Cross-platform portability (Claude Code, Claude API, Agent SDK) with unified skill format
- **Key feature:** Progressive disclosure — metadata pre-loaded at startup; full skill content loads only when invoked; supporting files load on-demand

#### File Structure
```
skill-name/
├── SKILL.md                    # Required: frontmatter + instructions
├── reference.md                # Optional: detailed API docs
├── examples.md                 # Optional: usage examples
└── scripts/
    ├── helper.py               # Optional: utility scripts
    └── validate.sh
```

#### Frontmatter Format (Minimalist)
```yaml
---
name: skill-name               # Required: max 64 chars, lowercase + hyphens only
description: What and when     # Recommended: max 1024 chars, includes "use when"
disable-model-invocation: true # Optional: prevent auto-trigger
user-invocable: false          # Optional: hide from user menu
allowed-tools: Read, Grep      # Optional: restrict tool access
context: fork                  # Optional: run in subagent
agent: Explore                 # Optional: which subagent type
---
```

#### Key Conventions

| Aspect | Convention | Rationale |
|--------|-----------|-----------|
| **Naming** | Gerund form (verb+ing): `processing-pdfs`, `analyzing-spreadsheets` | Describes activity/capability clearly |
| **Description** | Third person, specific keywords, dual purpose (what + when) | Claude uses this to decide skill discovery |
| **Body length** | Max 500 lines for SKILL.md | Token budgets; split larger content across files |
| **File paths** | Forward slashes only (`reference/guide.md`, not `\guide`) | Cross-platform compatibility |
| **References** | One level deep from SKILL.md | Prevents partial reads of nested references |
| **Examples** | Input/output pairs (like prompting) | Teach desired style + level of detail |

#### Special Features
1. **String substitution:** `$ARGUMENTS`, `$0`, `${CLAUDE_SESSION_ID}`, `${CLAUDE_SKILL_DIR}` allow dynamic context injection
2. **Shell preprocessing:** `!`command`` syntax runs commands before skill loads; output replaces placeholder
3. **Bundled scripts:** Executable scripts run without loading code into context (only output counts against tokens)
4. **Skill locations:** Enterprise > Personal > Project > Plugin (priority); nested `.claude/skills/` auto-discovered in monorepos
5. **Context forking:** `context: fork` spawns subagent with skill as task prompt; supports preloaded skills

#### Anti-Patterns to Avoid
- Vague descriptions ("Helps with documents")
- Inconsistent terminology (mix "extract/pull/get")
- Time-sensitive information ("If before August 2025...")
- Windows-style paths
- Deeply nested references (>1 level)
- Offering too many options without a default
- "Magic numbers" in scripts (explain configuration)

---

### 2. Qodex Multi-Agent Orchestration

#### What It Does
- **Core function:** Pattern library + templates for coordinating multi-agent systems
- **Problem solved:** Provides tested orchestration patterns and domain-specific workflow examples for enterprises
- **Scale:** 80+ skills across AWS, finance, sales, product, marketing, HR domains

#### Orchestration Patterns (5 Core Types)

| Pattern | Use Case | Characteristic |
|---------|----------|-----------------|
| **Sequential** | Waterfall workflows (A → B → C) | Each agent uses previous outputs; clear ordering |
| **Parallel** | Independent subtasks | Multiple agents work simultaneously; results aggregated |
| **Hierarchical** | Management structure | Senior agents delegate to junior agents; oversight + specialization |
| **Consensus-Based** | High-stakes decisions | Multiple agents debate/vote; refines solution quality |
| **Tool-Mediated** | Loosely coupled | Agents coordinate via shared tools/databases; minimal direct communication |

#### Domain-Specific Libraries
- **AWS workflows:** Multi-service orchestration (compute, storage, identity, observability)
- **Sales:** Pipeline management, opportunity tracking, team communication
- **Finance:** Revenue metrics, billing, ARR analysis
- **HR:** Meeting records, team communications, document management
- **Product:** API usage analytics, feature adoption

#### Framework Integrations
- CrewAI (role-based, linear execution, 5.76x faster for QA tasks)
- LangGraph (DAG-based, graph flexibility, better for conditional logic + cycles)
- AutoGen (multi-agent conversations)
- OpenAI Swarm (simplified agent coordination)

#### Performance Insights
- **CrewAI advantage:** Coordinator-worker model with built-in memory; rapid deployment
- **LangGraph advantage:** Conditional branching, stateful workflows, complex decision trees
- Trade-off: LangGraph more flexible but slower; CrewAI faster but more structured

---

## Comparison: What We Already Have vs. External Resources

### epost_agent_kit Existing Strengths

| Feature | epost_agent_kit | Anthropic | Qodex |
|---------|-----------------|-----------|-------|
| **Iron Law (Iron Law block)** | ✅ Yes; documented in orchestration.md | ❌ No explicit mention | ❌ No |
| **Subagent spawn constraint** | ✅ Yes; explicitly disallowed nested spawns | ⚠️ Implicit (via `context: fork`) | ⚠️ Not addressed |
| **Permutation modes** | ✅ Yes; `plan`, `default`, `fork` | ⚠️ Partial (`context: fork` only) | ❌ No |
| **Skill discovery by signal** | ✅ Yes; skill-discovery.md with platform + task signals | ❌ Description-only, no systematic discovery | ❌ No systematic discovery |
| **Progressive disclosure** | ✅ Yes; aspect files + references/ pattern | ✅ Yes; documented thoroughly | ⚠️ Implied in templates |
| **Multi-agent orchestration docs** | ✅ Yes; orchestration.md with dispatch rules | ⚠️ Minimal (focuses on single-skill invocation) | ✅ Yes; 5 patterns + examples |
| **CSO (Cognitive Skill Optimization)** | ✅ Yes; description = trigger, never workflow summary | ✅ Mentioned (avoid summarizing workflow) | ❌ No |

### Where External Resources Add Value

1. **Anthropic Skills Framework**
   - **Validates:** Progressive disclosure, string substitution, context forking (all in our kit already)
   - **Adds:** Official portability standard (Agent Skills at agentskills.io), extended thinking (`ultrathink` keyword), permission-gated tool access
   - **Missing in us:** Explicit naming convention guidance (gerund form), formal description structure (third-person + specificity checklist)

2. **Qodex Multi-Agent Patterns**
   - **Validates:** Parallel execution (subagent-driven-development already does this)
   - **Adds:** Consensus-voting pattern for design decisions, domain-specific templates (AWS, Finance, Sales), performance benchmarking framework
   - **Missing in us:** Formal consensus orchestration protocol; domain-specific workflow templates; performance tradeoff matrix (CrewAI vs. LangGraph style)

---

## Technology Comparison: Consensus on Best Practices

| Aspect | Anthropic | Qodex | epost_agent_kit | Consensus |
|--------|-----------|-------|-----------------|-----------|
| **Description as primary discovery trigger** | Yes | Yes | Yes (skill-index.json) | ✅ STABLE |
| **One-level-deep file references** | Yes | Implied | Yes (aspect files pattern) | ✅ STABLE |
| **Max skill body size** | 500 lines | Not specified | Not specified (aspect files) | ✅ STABLE (500 limit sensible) |
| **Subagent spawn isolation** | Via `context: fork` | Via CrewAI teams | Via Iron Law | ✅ STABLE |
| **Parallel task execution** | Not primary focus | Yes (parallel pattern) | Yes (subagent-driven-development) | ✅ STABLE |
| **Tool restriction per skill** | `allowed-tools` field | Not visible | `disallowedTools` field | ⚠️ DIVERGENT (Anthropic + Qodex = whitelist; ours = blacklist) |
| **Third-person descriptions** | Required | Implicit | Not enforced | ⚠️ EMERGING (Anthropic formal, we informal) |

---

## Code Examples & Patterns

### Example 1: Anthropic's Progressive Disclosure Pattern
```yaml
---
name: pdf-processing
description: Extract text and tables from PDFs, fill forms. Use when working with PDF files or document extraction.
---

# Quick start
Extract text with pdfplumber: [code]

# Advanced features
- Form filling: See [FORMS.md](FORMS.md)
- API reference: See [REFERENCE.md](REFERENCE.md)
- Examples: See [EXAMPLES.md](EXAMPLES.md)
```

**Comparison to our kit:** Matches our aspect-files pattern exactly. They use separate files; we use `references/` subdirectory.

### Example 2: Qodex Consensus Pattern (Design Decision)
```
Setup consensus-based orchestration:
1. Agent A generates option 1
2. Agent B generates option 2
3. Agent C generates option 3
4. Vote on best option (based on criteria)
5. Winning option becomes implementation spec
```

**Our gap:** We have `brainstormer` agent but no formal consensus protocol. Could adopt.

### Example 3: Anthropic's String Substitution
```yaml
---
name: session-logger
description: Log activity for this session
---

Log the following to logs/${CLAUDE_SESSION_ID}.log:

$ARGUMENTS
```

**Our adoption:** Could use `${CLAUDE_SESSION_DIR}` pattern for memory persistence; already use `$ARGUMENTS` in some skills.

---

## Integration Opportunities (Ranked by Value)

| Opportunity | Effort | Impact | Recommendation |
|-------------|--------|--------|-----------------|
| **Adopt third-person description checklist** | Low | High | Add to kit-skill-development/references/ as `description-checklist.md` |
| **Implement description audit script** | Medium | Medium | Validate all 45 skills against Anthropic's rules (non-empty, max 1024 chars, third-person, keywords) |
| **Add consensus-voting orchestration pattern** | Medium | Medium | Create `consensus-orchestration` skill; document when to use (design decisions, multi-perspective analysis) |
| **Formalize tool whitelist vs. blacklist** | Medium | Low | Document rationale for `disallowedTools` approach; align with Anthropic if tools become portable |
| **Adopt Qodex domain templates** | High | Low | Could port AWS, Finance, Sales templates; low priority (domain-specific, not core kit) |
| **Create performance benchmark framework** | High | Low | Document CrewAI vs. LangGraph tradeoffs; low priority (not in our scope) |
| **Document gerund naming convention** | Low | Low | Add to kit-skill-development as optional pattern; we already do this informally |

---

## Best Practices Alignment

### Stable / Proven
- **Progressive disclosure:** Metadata preload, on-demand file loading, script execution without context cost
- **Description-driven discovery:** Single, concise description must include both what + when
- **One-level file references:** Prevents partial reads, ensures complete context
- **Subagent isolation:** `context: fork` prevents nested spawns; matches our Iron Law
- **Parallel task execution:** Multiple independent agents work simultaneously; validated by Qodex perf metrics

### Experimental / Emerging
- **Consensus-based orchestration:** Qodex pattern; not yet standard in Anthropic framework; could differentiate our kit
- **Third-person description enforcement:** Anthropic recommends; not yet checked in our audit; easy win
- **Domain-specific templates:** Qodex strength; valuable for enterprises; not core to our kit philosophy (YAGNI)

### Divergent / Needs Resolution
- **Tool access model:** Anthropic = whitelist (`allowed-tools`); ours = blacklist (`disallowedTools`). Both work; document tradeoff.

---

## Unresolved Questions

1. **Tool portability:** When Agent Skills become fully portable (Claude Code → Claude API → Agent SDK), should we switch from blacklist to whitelist model?
2. **Consensus pattern adoption:** Is consensus-voting useful for epost_agent_kit given we already have brainstormer? (Probably too specialized.)
3. **Description audit scope:** Should all 45 existing skills be re-audited against third-person requirement, or only new skills going forward?
4. **Domain templates:** Do we want Qodex-style AWS/Finance/Sales templates, or keep kit minimalist (YAGNI)?
5. **Extended thinking:** Anthropic supports `ultrathink` keyword in skill content for extended thinking; should we adopt this for complex orchestration skills?

---

## Verdict: ACTIONABLE

**epost_agent_kit is architecturally sound.** Our orchestration model (Iron Law, subagent constraints, progressive disclosure) is validated by Anthropic's official framework and Qodex's practical examples.

**Immediate actions:**
1. Add description validation checklist to kit-skill-development (low effort, high clarity)
2. Audit existing 45 skills for third-person compliance (medium effort, medium impact)
3. Document consensus-voting pattern as optional advanced skill (medium effort, niche use)
4. Keep tool model (blacklist) as-is unless portability requires standardization

**Long-term:** Monitor Anthropic's skills standard evolution and Qodex's performance benchmarks; no urgent integration needed.

---

## References

- [Extend Claude with skills](https://code.claude.com/docs/en/skills) — Anthropic official documentation
- [Skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) — Anthropic official best practices
- [GitHub: anthropics/skills](https://github.com/anthropics/skills) — Official skill repository
- [GitHub: qodex-ai/ai-agent-skills](https://github.com/qodex-ai/ai-agent-skills) — Qodex skills library
- [Qodex Skills Hub](https://playbooks.com/skills/qodex-ai) — Qodex public portal
- [Multi-Agent Orchestration Comparison (Medium)](https://medium.com/@arulprasathpackirisamy/mastering-ai-agent-orchestration-comparing-crewai-langgraph-and-openai-swarm-8164739555ff) — Framework comparison
