# Kit Skill Analysis Report

## Executive Summary

The **kit** skill is a unified command for kit authoring and management. It operates through:
- **1 main SKILL.md** (69 lines) — the command entry point
- **11 reference files** (965 lines total) — detailed workflows and reference documentation
- **7 declared skills in package.yaml** — which appear to be virtual/aspect-based skills
- **1 evals set** — test cases for proper triggering

The kit skill uses **aspect-file delegation** pattern: a single SKILL.md dispatches to the epost-fullstack-developer agent, which loads specific reference files based on user input.

## 1. Main SKILL.md (/packages/kit/skills/kit/SKILL.md)

**Size:** 69 lines | **Type:** Unified command dispatcher | **Invocable:** Yes

**Description from frontmatter:**
```
(ePost) Scaffolds and manages kit content — agents, skills, hooks — with best-practice templates. Use when creating, editing, or improving kit content — agents, skills, hooks; or when user says "kit authoring", "scaffold a skill", "add an agent", "write a hook"
```

**Key Features:**
- User-invocable (`user-invocable: true`)
- Runs in forked context (`context: fork`)
- Delegates to `epost-fullstack-developer` agent
- Uses flag-based routing: `--add-agent`, `--add-skill`, `--add-hook`, `--optimize`
- Falls back to auto-detection if no flags provided
- Aspect table maps keywords to reference files

**Triggers:**
- `/kit` (slash command)
- "scaffold agent"
- "create skill"
- "manage hooks"
- "add an agent"

**Metadata:**
```yaml
argument-hint: "[--add-agent | --add-skill | --add-hook | --optimize] [name]"
triggers: [/kit, scaffold agent, create skill, manage hooks, add an agent]
connections:
  enhances: []
  requires: []
```

## 2. Reference Files (packages/kit/skills/kit/references/) — Detailed Analysis

### Overview
All 11 files are workflow/teaching documents. Total: 965 lines. None are large enough or self-contained enough to become independent skills — they're tightly coupled to the kit skill's delegation model.

### File-by-file breakdown:

#### **add-agent.md** (61 lines)
**Purpose:** Workflow for creating a new agent definition  
**Type:** Execution workflow (NOT documentation)  
**Content type:** Step-by-step workflow
- Gathers agent info (name, purpose, package, model tier, color)
- Suggests skills based on agent role
- Scaffolds agent file with frontmatter
- Copies to package source
- Registers in package.yaml
- Validates with lint
- Reports results

**Coupled to:** kit skill's `--add-agent` flag  
**Reusability:** Only useful within kit skill context  
**Candidate for independence:** NO — requires kit skill dispatch

---

#### **add-skill.md** (77 lines)
**Purpose:** Workflow for creating a new skill definition  
**Type:** Execution workflow  
**Content type:** Step-by-step workflow with checklist
- Gathers skill info (name, category, purpose, package, invocability, context)
- Suggests skill connections (extends, requires, enhances, conflicts)
- Scaffolds skill directory with SKILL.md
- Progressive disclosure setup (SKILL.md lean, references/ detailed)
- Copies to package source
- Registers in package.yaml
- Validates with lint
- Post-creation checklist (7 items)

**Coupled to:** kit skill's `--add-skill` flag  
**Reusability:** Only useful within kit skill context  
**Candidate for independence:** NO — requires kit skill dispatch

---

#### **add-hook.md** (92 lines)
**Purpose:** Workflow for creating a new hook and wiring it into settings.json  
**Type:** Execution workflow  
**Content type:** Step-by-step workflow with template
- Gathers hook info (name, event type, hook type, tool matcher, package)
- Creates hook script in CommonJS (.cjs)
- Wires into settings.json
- Updates package.yaml
- Tests locally via stdin/stdout
- Regenerates with `epost-kit init --fresh`
- Reports hook integration
- Includes JavaScript template for hook implementation

**Coupled to:** kit skill's `--add-hook` flag  
**Reusability:** Tightly specific to hook creation  
**Candidate for independence:** NO — requires kit skill dispatch

---

#### **agent-development.md** (179 lines) ⭐ LARGEST
**Purpose:** Complete reference for agent structure, frontmatter, system prompt design  
**Type:** Reference documentation + guide  
**Content type:** Reference material
- Agent file structure (complete format with example)
- Frontmatter field reference (name, description, model, color, allowedTools, tools)
- System prompt design principles
- Ecosystem fields (skills, memory, permissionMode, allowedTools, disallowedTools)
- Data store declaration pattern
- References to agent-creation-guide.md

**Scope:** Covers agent anatomy, triggering conditions, examples, system prompt writing  
**Coupled to:** Used by add-agent.md and agents needing reference material  
**Reusability:** HIGH — Could be read standalone as agent reference guide  
**Candidate for independence:** MAYBE — This reads like it could become a standalone `agent-development` skill if structured as a SKILL.md, but currently functions as supporting documentation for the add-agent workflow.

---

#### **skill-development.md** (124 lines) ⭐ SECOND LARGEST
**Purpose:** Complete reference for skill structure, frontmatter, connections, CSO principles  
**Type:** Reference documentation + guide  
**Content type:** Reference material
- Progressive disclosure (3 levels: frontmatter → SKILL.md body → references/assets/scripts)
- Skill creation process summary
- SKILL.md frontmatter specification (required/valid/invalid fields)
- Skill connections (extends, requires, conflicts, enhances)
- Writing style guidelines (third-person description vs. imperative body)
- Directory structures (minimal vs. standard)
- Extended thinking (`ultrathink` keyword)
- CSO: Cognitive Skill Optimization principles
- Description validation checklist reference
- agentskills.io compliance rules
- Reference file index

**Scope:** Covers skill architecture, philosophy, frontmatter, organization, writing principles  
**Coupled to:** Used by add-skill.md and skills needing reference material  
**Reusability:** VERY HIGH — Could be read standalone as skill reference guide  
**Candidate for independence:** MAYBE — Similar to agent-development.md, this could become a `skill-development` reference skill, but currently part of kit's teaching documentation.

---

#### **hooks.md** (143 lines) ⭐ THIRD LARGEST
**Purpose:** Complete reference for hook development, events, configuration, I/O contract  
**Type:** Reference documentation + guide  
**Content type:** Reference material
- Hook types (command/deterministic vs. prompt/LLM-driven)
- Hook events table (PreToolUse, PostToolUse, UserPromptSubmit, Stop, etc.)
- Hook configuration in settings.json (JSON structure)
- Matchers (exact, multiple, wildcard, regex)
- Input/output contract (JSON via stdin/stdout)
- Exit codes
- epost_agent_kit hook architecture overview
- Directory structure (packages/core/hooks/, packages/kit/hooks/)
- Hook creation steps
- Hook patterns reference

**Scope:** Covers hook mechanics, configuration, event types, I/O contract, architecture  
**Coupled to:** Used by add-hook.md  
**Reusability:** HIGH — Detailed reference material that could stand alone  
**Candidate for independence:** MAYBE — Could be `hooks-development` skill, but currently part of kit documentation.

---

#### **agents.md** (100 lines)
**Purpose:** Ecosystem reference for agents and plugin system  
**Type:** Reference documentation  
**Content type:** Reference tables and specifications
- Claude Code official components (agents, skills, commands, hooks, output styles, MCP, plugins)
- Commands & Skills merge explanation
- Nested directory support
- Agent frontmatter reference table (name, description, model, color, tools, skills, memory, permissionMode, etc.)
- Skill frontmatter reference table
- Naming conventions (agent files, commands, skills)
- Plugin system (JSON structure)
- Component auto-discovery

**Scope:** Ecosystem-level reference, not procedural  
**Coupled to:** Read by anyone needing frontmatter spec  
**Reusability:** HIGH — Standalone reference material  
**Candidate for independence:** MAYBE — Could be a standalone `agent-ecosystem-ref` or `skill-ecosystem-ref` skill, but currently part of kit documentation.

---

#### **cli.md** (51 lines)
**Purpose:** Reference for CLI development patterns and tech stack  
**Type:** Reference documentation  
**Content type:** Reference material
- Tech stack (Node.js 20+, TypeScript 5+, cac, @inquirer/prompts, vitest)
- Project structure overview (epost-agent-kit-cli repo structure)
- Key commands (lint, fix-refs, verify, doctor, init)
- Key conventions (YAML parser, file ownership, settings merge, profiles, topological sort)
- Testing approach (vitest)
- Import path conventions (@/ alias)

**Scope:** CLI implementation reference, not procedural  
**Coupled to:** Read by developers working on CLI  
**Reusability:** MODERATE — Technical reference for kit CLI development  
**Candidate for independence:** NO — Too specific to kit CLI implementation details.

---

#### **verify.md** (38 lines)
**Purpose:** Workflow for pre-release/pre-init audit pipeline  
**Type:** Execution workflow  
**Content type:** CLI command reference
- When to use verify
- CLI commands (`epost-kit verify`, `epost-kit verify --strict`)
- 7 checks performed (references, connections, frontmatter, package.yaml sync, skill-index staleness, orphan detection, dependency graph)
- Exit codes
- CI/pre-commit integration patterns

**Scope:** Single command reference and usage patterns  
**Coupled to:** Related to `--verify` operations  
**Reusability:** LOW — Specific to kit verify command  
**Candidate for independence:** NO — Too narrowly focused and part of kit ecosystem.

---

#### **optimize.md** (31 lines)
**Purpose:** Workflow for optimizing existing skills  
**Type:** Execution workflow  
**Content type:** Short workflow reference
- Frontmatter indicating this is a skill (kit-optimize-skill)
- Mission: optimize skill in `.claude/skills/${SKILL}` directory
- Arguments: SKILL (default: `*`), PROMPT (default: empty)
- Instructions on progressive disclosure and token efficiency
- Note that skills are NOT documentation
- Placeholder for additional instructions

**Scope:** Single-task workflow  
**Coupled to:** kit skill's `--optimize` flag  
**Reusability:** LOW — Specific to skill optimization task  
**Candidate for independence:** NO — Too narrowly focused.

---

#### **description-validation-checklist.md** (69 lines)
**Purpose:** 7-point checklist for validating skill descriptions  
**Type:** Reference documentation + checklist  
**Content type:** Validation guide
- 7-point checklist table (trigger phrasing, concrete triggers, no workflow summary, character limit, quoted phrases, third-person voice, outcome signal)
- Good vs. Bad examples with detailed comparison
- Common fail patterns with fixes
- Quick fix template
- Character count verification

**Scope:** Quality gate for skill descriptions  
**Coupled to:** Referenced by add-skill.md and skill development process  
**Reusability:** MODERATE — Could be used standalone for description validation  
**Candidate for independence:** NO — Too specialized for skill description validation only.

---

#### **summary-table.md** (mentioned in SKILL.md, but read from SKILL.md line 42-54)
**Purpose:** Maps aspect files to their purpose  
**Type:** Quick reference  
**Content type:** Mapping table

From SKILL.md:
```
| File | Purpose |
|------|---------|
| references/add-agent.md | Create a new agent definition |
| references/add-skill.md | Create a new skill definition |
| references/add-hook.md | Create a new hook for Claude Code automation |
| references/optimize.md | Optimize an existing agent skill |
| references/agent-development.md | Agent frontmatter, system prompts, ecosystem fields |
| references/skill-development.md | Skill structure, frontmatter, CSO principles |
| references/hooks.md | Hook events, I/O contract, architecture |
| references/cli.md | CLI tech stack, project structure, commands |
| references/agents.md | Ecosystem reference, frontmatter tables, naming |
| references/verify.md | Pre-release audit workflow, CLI commands |
```

---

## 3. Virtual Skills (Listed in package.yaml)

The following 7 skills are listed in `packages/kit/package.yaml` provides.skills, but do NOT have corresponding physical SKILL.md files:

```yaml
provides:
  skills:
    - kit-agents
    - kit-agent-development
    - kit-skill-development
    - kit-hooks
    - kit-cli
    - kit
    - kit-verify
```

**Analysis:**

These appear to be **virtual or aspect-based skills** that are either:
1. **Generated aliases** mapping reference files to skill names (most likely)
2. **Declared in a manifest** rather than as separate SKILL.md files
3. **Frontmatter extensions** that are programmatically created

The actual **one-to-one mapping** appears to be:
- `kit-agents` → references/agents.md (ecosystem reference)
- `kit-agent-development` → references/agent-development.md (agent reference)
- `kit-skill-development` → references/skill-development.md (skill reference)
- `kit-hooks` → references/hooks.md (hooks reference)
- `kit-cli` → references/cli.md (CLI reference)
- `kit` → SKILL.md (main skill, aspect dispatcher)
- `kit-verify` → references/verify.md (verify workflow)

These are **NOT independent skills** — they're metadata declarations for reference material that gets loaded on-demand by the kit skill or agent workflows.

---

## 4. Package.yaml Configuration

**Location:** `/packages/kit/package.yaml`

**Key fields:**
```yaml
name: kit
version: "2.0.0"
description: "Kit authoring and CLI development tools for epost_agent_kit"
layer: 1
platforms: [all]

dependencies:
  - core

provides:
  agents: []
  skills:
    - kit-agents
    - kit-agent-development
    - kit-skill-development
    - kit-hooks
    - kit-cli
    - kit
    - kit-verify

files:
  agents/: agents/
  skills/: skills/
  hooks/: hooks/
  settings.json: settings.json

settings_strategy: merge
claude_snippet: CLAUDE.snippet.md
```

**Analysis:**
- Layer 1 (foundation)
- Depends on `core` package
- Provides 7 skills (6 virtual, 1 main)
- Provides 0 agents (delegation model)
- File mappings point to source directories
- Settings merge strategy (adds/overwrites settings)

---

## 5. Candidate Skills for Independence

### Could Become Independent Skills (with conversion):

**1. agent-development.md** (179 lines)
- **Current status:** Reference documentation bundled with kit
- **Could become:** `agent-development` skill (SKILL.md with agent-dev reference)
- **Rationale:** 
  - Comprehensive agent anatomy reference
  - Standalone pedagogical value
  - Not directly tied to add-agent workflow
  - Could be loaded independently when user wants to understand agents
- **Concern:** Would need separate SKILL.md with proper triggers
- **Verdict:** ⭐ GOOD CANDIDATE

**2. skill-development.md** (124 lines)
- **Current status:** Reference documentation bundled with kit
- **Could become:** `skill-development` skill
- **Rationale:**
  - Comprehensive skill architecture reference
  - CSO principles, progressive disclosure, validation checklist references
  - Standalone pedagogical value
  - Not directly tied to add-skill workflow
- **Concern:** Would need separate SKILL.md with proper triggers
- **Verdict:** ⭐ GOOD CANDIDATE

**3. hooks.md** (143 lines)
- **Current status:** Reference documentation bundled with kit
- **Could become:** `hook-development` skill
- **Rationale:**
  - Complete hook architecture and mechanics reference
  - Event types, I/O contract, configuration patterns
  - Significant knowledge independent of hook creation
- **Concern:** Would need separate SKILL.md with proper triggers
- **Verdict:** ⭐ GOOD CANDIDATE

### Should Remain Part of Kit (No candidate):

**add-agent.md, add-skill.md, add-hook.md, optimize.md**
- These are **execution workflows**, not reference documentation
- Tightly coupled to kit skill's delegation model
- Only useful within the context of running `/kit --add-agent|skill|hook` or `/kit --optimize`
- Would become orphaned if separated

**agents.md**
- Ecosystem-level reference (could argue for independence, but heavily ties to kit ecosystem structure)
- Better kept with kit as it's referenced by agent frontmatter specs

**cli.md**
- Implementation reference for kit CLI developers
- Too specific to epost-agent-kit-cli internals

**verify.md**
- Single command reference, tightly tied to kit verify workflow
- Too narrow for independence

**description-validation-checklist.md**
- Specialized validation checklist
- Only used during skill creation
- Better kept with kit for easy cross-reference

---

## 6. Overall Coverage Assessment

### What the Kit Skill Currently Covers:

✅ **Agent authoring:**
- Creating new agents
- Frontmatter specification
- System prompt design
- Skill assignment
- Ecosystem integration

✅ **Skill authoring:**
- Creating new skills
- Frontmatter specification
- Progressive disclosure architecture
- Skill connections (extends, requires, conflicts, enhances)
- Description validation
- CSO principles

✅ **Hook authoring:**
- Creating hook scripts
- Event configuration
- I/O contract specification
- Settings.json wiring
- Hook patterns

✅ **Optimization:**
- Optimizing existing skills
- Progressive disclosure efficiency
- Token management

✅ **Verification:**
- Pre-release audit
- Reference validation
- Connection integrity
- Frontmatter completeness
- Dependency graph generation

✅ **CLI development:**
- Tech stack reference
- Project structure
- Key commands
- Conventions

### What's Missing:

- No direct workflow for validating agent descriptions (only frontmatter reference)
- No direct workflow for publishing/distributing skills
- No direct workflow for testing hooks before integration
- No direct workflow for managing skill versions

---

## 7. Recommendations

### Immediate (No changes needed):
- Current structure is solid for a unified kit authoring command
- The aspect/reference model with delegation is appropriate
- Virtual skills declaration in package.yaml works for ecosystem integration

### Medium-term (Consider):
1. **Extract agent-development.md** → Create `agent-development` skill with SKILL.md trigger wrapper
2. **Extract skill-development.md** → Create `skill-development` skill with SKILL.md trigger wrapper
3. **Extract hooks.md** → Create `hook-development` skill with SKILL.md trigger wrapper

**Benefits of extraction:**
- Developers can `/skill-development` to read comprehensive guide independently
- Reduces cognitive load on single skill
- Allows independent skill triggers and search indexing
- Maintains existing kit skill as execution dispatcher

**Implementation:**
- Create 3 new skill directories
- Write lightweight SKILL.md files with proper triggers
- Move reference markdown files into references/ subdirectories
- Update kit skill to reference them (e.g., "See `/skill-development` for details")
- Update package.yaml provides.skills list

### Long-term:
- Consider creating `skill-management` agent (not skill) that wraps `/kit` for autonomous workflows
- Consider `skill-validator` helper skill for quality gates
- Document the virtual vs. physical skill distinction in agents.md

---

## Summary Table

| Aspect | Lines | Type | Independence Candidate | Notes |
|--------|-------|------|----------------------|-------|
| SKILL.md | 69 | Dispatcher | Core | Main entry point |
| add-agent.md | 61 | Workflow | No | Coupled to kit |
| add-skill.md | 77 | Workflow | No | Coupled to kit |
| add-hook.md | 92 | Workflow | No | Coupled to kit |
| agent-development.md | 179 | Reference | ⭐ YES | Large, self-contained |
| skill-development.md | 124 | Reference | ⭐ YES | Large, self-contained |
| hooks.md | 143 | Reference | ⭐ YES | Large, self-contained |
| agents.md | 100 | Reference | Maybe | Ecosystem spec |
| cli.md | 51 | Reference | No | Too specific |
| verify.md | 38 | Workflow | No | Coupled to kit |
| optimize.md | 31 | Workflow | No | Coupled to kit |
| description-validation-checklist.md | 69 | Checklist | No | Too specialized |
| **TOTAL** | **965** | **Mixed** | **3 candidates** | **Unified dispatcher** |

