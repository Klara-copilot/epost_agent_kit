# Research: Agent Skill Architecture & Adoption Patterns

**Date**: 2026-03-31
**Agent**: epost-researcher
**Scope**: Agent kit design patterns, skill structures, mental models (Anthropic, agentskills.io, superpowers)
**Status**: ACTIONABLE

---

## Executive Summary

Three distinct mental models exist for agent-skill relationships:

1. **Anthropic Model (Native)**: Skills = passive instruction folders with metadata. Agents consume skills via discovery/load.
2. **agentskills.io (Spec)**: Standardized skill format designed for **interoperability across multiple agent products**. Skills are portable, self-contained, SKILL.md-centric.
3. **Superpowers (Framework)**: Skills = mandatory workflows with active triggering and enforcement. Composition over negotiation.

**Current epost_agent_kit**: Hybrid. Borrows Anthropic's passive model but adds extra layers (agents with `skills:` lists, skill-index.json, skill-discovery active loading). This works but diverges from agentskills.io standard, limiting portability and interoperability.

**Key tension**: epost combines Model A (passive, loaded on-demand) + Model B (mandatory, workflow-enforced). This creates cognitive overhead without gaining agentskills.io interop.

**Recommendation**: Commit to **agentskills.io spec compliance**. This unblocks: (a) skill reuse across Claude Code + Cursor + other tools, (b) skill marketplace distribution, (c) community contribution. Requires minimal structural changes (folder layout already compliant; just normalize frontmatter).

---

## Research Scope & Methodology

### Sources Consulted

1. **agentskills.io specification** — https://agentskills.io/specification (official spec, Jan 2026)
2. **agentskills.io overview** — https://agentskills.io/ (vision, adoption)
3. **Anthropic skills repo** — https://github.com/anthropics/skills (17 reference skills)
4. **Anthropic skill-creator skill** — `packages/core/skills/skill-creator/SKILL.md` (design patterns)
5. **Superpowers framework** — https://github.com/obra/superpowers (orchestration model)
6. **epost_agent_kit codebase**:
   - `packages/core/package.yaml` (skill/agent registration)
   - `packages/core/skills/skill-discovery/SKILL.md` (lazy loading)
   - `packages/core/skills/core/SKILL.md` (safety/workflow)
   - `CLAUDE.md` (routing, orchestration)

**Search strategy**: Parallel fetch of official specs + GitHub pattern analysis + cross-project comparison.

---

## Findings

### 1. agentskills.io Specification (Canonical Standard)

**Status**: Open standard, adopted by 30+ tools (Claude Code, Cursor, VS Code Copilot, GitHub Copilot, Gemini CLI, OpenHands, Letta, Databricks, etc.)

#### Canonical Folder Structure

```
my-skill/
├── SKILL.md                    # Required: metadata + instructions
├── scripts/                    # Optional: executable code
├── references/                 # Optional: detailed documentation
└── assets/                      # Optional: templates, images, data files
```

**Key constraints:**
- Minimum viable skill = single `SKILL.md` file
- Optional dirs: `scripts/`, `references/`, `assets/` (free naming within)
- No agents/ or workers/ subdirs in spec
- No version/ or variants/ subdirs in spec

#### SKILL.md Frontmatter

| Field | Required | Notes |
|-------|----------|-------|
| `name` | Yes | 1-64 chars, lowercase, hyphens, no leading/trailing hyphens |
| `description` | Yes | 1-1024 chars. **Both what it does AND when to use it.** Drives discovery. |
| `license` | No | License name or bundled file reference |
| `compatibility` | No | Environment requirements (Python 3.14+, git, docker, etc.) |
| `metadata` | No | Arbitrary key-value map for extensibility |
| `allowed-tools` | No | Space-delimited pre-approved tools (experimental) |

**Critical detail**: `description` field is the **primary discovery mechanism**. Must include triggers explicitly:

> Bad: "Extracts PDF text."
> Good: "Extract text and tables from PDFs. Use when working with PDF documents or when user mentions PDFs, forms, or extraction."

#### Progressive Disclosure

Three loading layers:

1. **Metadata** (~100 tokens): name + description always in context
2. **SKILL.md body** (<500 lines recommended): loaded when skill activates
3. **Bundled resources** (unlimited): `scripts/`, `references/`, `assets/` loaded on demand

Agents load ENTIRE `SKILL.md` when triggered. Moving detailed content to `references/` prevents bloat.

### 2. Anthropic Reference Implementation

**Repository**: github.com/anthropics/skills (17 example skills)

#### Structure Pattern

All examples follow strict agentskills.io format:

```
anthropics/skills/
├── algorithmic-art/
│   └── SKILL.md
├── mcp-builder/
│   ├── SKILL.md
│   ├── references/
│   ├── scripts/
│   └── assets/
├── pdf/
├── skill-creator/
│   ├── SKILL.md
│   ├── agents/               # EXTENSION: Anthropic uses this
│   ├── scripts/
│   ├── references/
│   └── assets/
└── [14 more skills]
```

**Note**: Most skills stick to pure agentskills.io. `skill-creator/` is outlier with `agents/` subdir (grader.md).

#### Mental Model

- Skills = passive knowledge documents
- Agents discover and load skills by name + description match
- No mandatory workflows; agents decide when to activate skills
- Skills are **teachable**, not enforceable

#### Consumption

- Claude Code: `/plugin install` from marketplace
- Claude.ai: Upload or use pre-built
- Claude API: Pass skills in system prompt or via Skills API

### 3. superpowers Framework (Mandatory Workflow Model)

**Repository**: https://github.com/obra/superpowers

#### Core Philosophy

**Skills are mandatory pathways, not optional suggestions.**

Sequential enforcement:
1. Brainstorm → spec dialogue
2. Worktree setup → isolation
3. Plan writing → 2-5 min granular tasks
4. Subagent dispatch → fresh agents per task
5. TDD RED-GREEN-REFACTOR enforcement
6. Code review → severity-blocking
7. Merge completion → decision workflow

#### Mental Model

- Skills = state machines with side effects
- Agent MUST follow skill workflow
- Context passing between skill stages
- Composition enforced (no skipping steps)

#### Key Insight

> "The agent checks for relevant skills before any task. Mandatory workflows, not suggestions."

This is **opposite** of Anthropic's optional discovery model.

---

## Mental Model Comparison: Active vs Passive Skills

### Model A: Passive Discovery (Anthropic)

**Skills = instruction libraries loaded on-demand**

| Aspect | Detail |
|--------|--------|
| **Triggering** | Agent decides when skill is relevant (via description matching) |
| **Loading** | Full SKILL.md loaded into context when triggered |
| **Enforcement** | None. Agent can ignore skill recommendations. |
| **Composition** | Skills are independent; agents compose them ad-hoc |
| **Metadata** | name + description for discovery; rest is opaque |
| **Flow** | User → Agent → (skill-discovery) → load skill(s) → execute |

**Pros:**
- Flexible. Agent adapts to unexpected situations.
- Reusable across products (agentskills.io standard).
- Low cognitive overhead for agent.

**Cons:**
- Agents may miss relevant skills (undertrigger).
- No guaranteed workflow consistency.
- Skill ordering not enforced.

---

### Model B: Active Mandatory Workflows (Superpowers)

**Skills = state machines with prescribed order**

| Aspect | Detail |
|--------|--------|
| **Triggering** | Skill triggers based on task classification; agent MUST follow |
| **Loading** | Skills in specific sequence; state carried between steps |
| **Enforcement** | Hard stops at checkpoints (e.g., plan review before code) |
| **Composition** | Linear pipeline with branching; order matters |
| **Metadata** | Skill registers workflow phases, checkpoints, branch conditions |
| **Flow** | User → (route-to-skill) → phase-1 → checkpoint → phase-2 → … |

**Pros:**
- Guaranteed consistency. Workflows enforced.
- Reduced agent decision-making. Less improvisation.
- Easier audit trail (explicit phases).

**Cons:**
- Rigid for edge cases.
- Not reusable (product-specific).
- High cognitive overhead for agent (strict rules).

---

### Model C: epost Hybrid (Mixed Signals)

**Current epost_agent_kit**: Combines both models awkwardly.

| Aspect | epost | Issue |
|--------|-------|-------|
| **Skill registration** | `package.yaml` lists agents + skills | Non-standard; breaks interop |
| **Discovery** | `skill-discovery/` active loading protocol | Non-standard; overcomplicated |
| **Frontmatter** | ePost extensions: `user-invocable:`, `tier:`, `metadata: agent-affinity:` | Diverges from agentskills.io spec |
| **Skill activation** | `skills: [core, ...]` in agent frontmatter | Mandatory pre-load. Opposite of discovery. |
| **Workflows** | Some skills are passive (e.g., web-frontend), others enforce steps (e.g., cook, fix) | Inconsistent mental model |

**Result**: epost skills are **not portable**. Can't reuse in Cursor, VS Code Copilot, or contribute to agentskills.io marketplace.

---

## Folder Structure Standards

### agentskills.io Valid Directories

**Inside skill root:**

| Dir | Purpose | Notes |
|-----|---------|-------|
| `SKILL.md` | **Required** | Metadata + instructions |
| `scripts/` | Executable code | Python, Bash, JavaScript. Self-contained, error-tolerant. |
| `references/` | Detailed docs | Domain-specific files (finance.md, legal.md, etc.). Loaded on demand. |
| `assets/` | Static resources | Templates, images, lookup tables, schemas. No logic. |
| `agents/` | Sub-agents (non-standard) | Anthropic uses in skill-creator. Not in official spec. |
| `evals/` | Skill evaluation | Used by skill-creator; not standard. |
| `tools/` | Bundled MCP tools | Non-standard; emerging pattern. |

**Nesting**: Max 1 level deep. No deeply nested file chains (docs/ within references/).

### Size Guidelines

| Component | Recommended | Hard Limit |
|-----------|-------------|-----------|
| SKILL.md | <500 lines | None, but context load increases |
| reference file | <300 lines | None, loaded on demand |
| Total skill | No limit | Keep <15 KB per skill for MVP loading |

### Example: Well-Structured Skill

```
mcp-builder/
├── SKILL.md                           # 200 lines
├── scripts/
│   ├── scaffold.py                    # Generate boilerplate MCP
│   └── validate.py                    # Validate MCP structure
├── references/
│   ├── protocol-reference.md          # MCP spec overview
│   ├── patterns.md                    # Common patterns (server, SSE, stdio)
│   └── examples/
│       ├── example-calculator.md
│       └── example-weather-api.md
└── assets/
    ├── mcp-project-template.zip
    └── schema-validator.json
```

---

## Current epost_agent_kit Assessment

### What Aligns with Standards

✓ **Folder structure**: Already compliant (SKILL.md + references/ + scripts/ + assets/)
✓ **Passive discovery model**: Adopted agentskills.io inspiration
✓ **Progressive disclosure**: Uses references/ for detailed docs
✓ **Naming**: Uses lowercase hyphens (agentskills.io standard)
✓ **Execution**: Scripts in scripts/ dir (standard)

### What Diverges (Non-Portable)

✗ **package.yaml registration**: Non-standard. agentskills.io expects file-system discovery only.
✗ **skill-discovery/SKILL.md**: Complex, non-standard lazy-loading protocol. agentskills.io products don't have this skill.
✗ **ePost frontmatter extensions**:
  - `user-invocable: false` — Non-standard
  - `tier: core` — Non-standard
  - `metadata: agent-affinity: [...]` — Non-standard
  - `metadata: keywords: [...]` — Non-standard (description should drive discovery)

✗ **Agent `skills: [core, ...]` frontmatter**: Non-standard. agentskills.io doesn't have agent frontmatter.
✗ **skill-index.json**: Non-standard. File-system discovery expected instead.
✗ **agents/ subdir in skills**: Non-standard. Anthropic uses in skill-creator, but not in spec.

### Impact

**Portability Loss**:
- epost skills can't be used in Cursor, VS Code Copilot, GitHub Copilot, etc.
- Can't contribute to agentskills.io marketplace.
- Implies re-authoring for each platform.

**Interop Loss**:
- Can't consume third-party agentskills.io skills directly.
- Must adapt or re-implement.

**Maintenance Burden**:
- skill-index.json requires manual sync with filesystem.
- skill-discovery/ protocol adds cognitive load without agentskills.io adoption.
- Two conflicting models (passive + mandatory) in same codebase.

---

## Proposals: Path to Standardization

### Proposal 1: Minimal Spec Compliance (Low Effort)

**Objective**: Keep epost structure, normalize frontmatter to agentskills.io-compatible subset.

**Changes**:

1. **Remove non-standard frontmatter from SKILL.md**:
   - ✓ Keep: `name`, `description`, `license`, `compatibility`, `metadata`
   - ✗ Remove: `user-invocable`, `tier`, `agent-affinity` (move to separate agent metadata if needed)

2. **Normalize `description` field**:
   - Include explicit trigger phrases (current: often absent)
   - Example: `description: "Create and improve skills. Use when user says 'create a skill', 'improve this skill', 'run evals'..."`

3. **Deprecate skill-discovery protocol** (phase 1):
   - Keep skill-discovery/ as internal reference (not a shipped skill)
   - Document agentskills.io discovery instead

4. **Deprecate package.yaml skill registration** (phase 2):
   - File-system discovery only
   - Agents load skills via name-matching in context

**Effort**: 1-2 days (update 30+ skill files, test)
**Benefit**: Skills become portable to agentskills.io-compatible tools.
**Risk**: Requires agent frontmatter restructuring; affects orchestration.

---

### Proposal 2: Full Interop (Medium Effort)

**Objective**: Join agentskills.io ecosystem. Reuse third-party skills. Ship to marketplace.

**Changes** (in addition to Proposal 1):

1. **Flatten agent-skill binding**:
   - Remove `skills: [core, ...]` from agent frontmatter
   - Let agents discover skills dynamically (like Anthropic)
   - Trade: Lose pre-loaded optimization; gain flexibility

2. **Migrate from package.yaml to dynamic discovery**:
   - Read agentskills.io spec for discovery algorithm (name + description matching)
   - Implement in agent as simple filter (no skill-index.json needed)

3. **Contributors can add agentskills.io third-party skills**:
   - Symlink or vendor into `skills/` directory
   - Agents discover transparently

4. **Publish epost skills to agentskills.io marketplace**:
   - Validate with agentskills.io reference library
   - Open PR to anthropics/skills or community registry

**Effort**: 3-5 days (agent refactoring, discovery algorithm, testing)
**Benefit**:
   - Skills work in Cursor, VS Code, GitHub Copilot, etc.
   - Reuse community skills (pdf, xlsx, pptx, mcp-builder, etc.)
   - Establish epost as ecosystem contributor

**Risk**: Loses agent-level skill pre-loading; may affect discovery latency.

---

### Proposal 3: Hybrid Interop (Recommended)

**Objective**: Opt-in standardization. Core skills stay ePost-specific; platform-agnostic skills become interop-compliant.

**Strategy**:

1. **Tier 1: ePost-native skills** (remain non-standard)
   - `core`, `cook`, `fix`, `plan`, `debug`, etc.
   - ePost-orchestration specific
   - Keep agent `skills: [core, ...]` binding

2. **Tier 2: Portable skills** (become agentskills.io-compliant)
   - `web-frontend`, `backend-javaee`, `figma`, `design-tokens`, `web-testing`, etc.
   - Remove `agent-affinity` from frontmatter
   - Normalize description for discovery
   - No ePost-specific extensions

3. **Implementation**:
   - Create `skills/portable/` subdirectory
   - Move platform/domain skills there
   - Validate against agentskills.io spec
   - Allow third-party skill vendoring in `skills/third-party/`

4. **Agents**:
   - Core agents still pre-load Tier 1 skills (`skills: [core, cook, ...]`)
   - Discover Tier 2 + third-party dynamically
   - No breaking changes to CLAUDE.md

**Effort**: 2-3 days
**Benefit**:
   - Incremental migration path
   - Portable skills reusable in ecosystem
   - Doesn't disrupt ePost orchestration
   - Unblocks community contribution

**Risk**: Maintains two parallel models (complexity).

---

## Unresolved Questions

1. **Agent frontmatter in agentskills.io spec?** The spec defines SKILL.md but not AGENT.md. How do agents declare their skills in an interop scenario?
   - Anthropic example: agents are Claude Code-specific, not part of spec.
   - Implication: ePost agents can't be portable (by design).

2. **Skill discovery algorithm details?** agentskills.io spec says agents use description matching but doesn't codify the algorithm. Should ePost implement a standard?

3. **Mandatory vs optional workflows?** superpowers enforces ordering. ePost skills are mixed (some passive, some enforcing). Should we commit to one model?
   - Current: Unanswered in codebase.

4. **Skill-index.json purpose?** Why maintain this when file-system discovery is simpler?
   - Current: Optimization for large skill sets? Caching? Not documented.

5. **agents/ subdir in skill-creator?** Why include grader.md in skill-creator/agents/? Non-standard in spec.
   - Hypothesis: Sub-agents for skill evaluation. Undocumented.

---

## Verdict

**ACTIONABLE** — Clear path to adoption.

### Recommended Approach

**Start with Proposal 3 (Hybrid Interop)**:

1. **Phase 1 (1 week)**: Normalize frontmatter in 10-15 portable skills (web-*, backend-*, figma, design-tokens).
2. **Phase 2 (1 week)**: Validate against agentskills.io reference validator. Document discovery mechanism.
3. **Phase 3 (optional, 2 weeks)**: Full Proposal 2 (agent discovery refactoring). Migrate to dynamic skill loading.

### Key Decisions

**Keep**: Tier 1 skills (core, cook, fix, etc.) remain ePost-specific. Agent frontmatter with `skills:` binding stays.

**Normalize**: Tier 2 skills (platform/domain) → agentskills.io compliance. Remove ePost extensions.

**Enable**: Vendoring third-party agentskills.io skills (pdf, xlsx, etc.). Unblock community skills.

### Success Criteria

- [ ] 10-15 portable skills pass agentskills.io validator
- [ ] Skills work in Cursor, VS Code Copilot, or other agentskills.io-compatible tool
- [ ] Documentation updated (CLAUDE.md, skill-discovery/ deprecated or replaced)
- [ ] skill-index.json deprecation plan drafted

---

## Sources

- [agentskills.io Specification](https://agentskills.io/specification)
- [agentskills.io Overview](https://agentskills.io/)
- [Anthropic Skills Repository](https://github.com/anthropics/skills)
- [Superpowers Framework](https://github.com/obra/superpowers)
- [Anthropic Skill Creator](https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md)
- epost_agent_kit codebase: CLAUDE.md, package.yaml, skill-discovery/SKILL.md, core/SKILL.md
