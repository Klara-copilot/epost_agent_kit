# Kit Skill — Complete File Reference

## Quick Index

```
/packages/kit/skills/kit/
├── SKILL.md (69 lines) — DISPATCHER
├── evals/
│   └── eval-set.json — Test cases (5 should_trigger=true, 5 false)
└── references/ (11 files, 965 total lines)
    ├── add-agent.md
    ├── add-skill.md
    ├── add-hook.md
    ├── agent-development.md
    ├── skill-development.md
    ├── hooks.md
    ├── agents.md
    ├── cli.md
    ├── verify.md
    ├── optimize.md
    └── description-validation-checklist.md
```

## File-by-File Directory

### Core Dispatcher

| File | Lines | Purpose | Category |
|------|-------|---------|----------|
| **SKILL.md** | 69 | Main entry point; flag routing to reference files | Dispatcher |

### Execution Workflows (Must stay with kit)

| File | Lines | Purpose | Triggered by | Type |
|------|-------|---------|--------------|------|
| add-agent.md | 61 | Step-by-step: gather info → scaffold → register → validate agent | `--add-agent [name]` | Workflow |
| add-skill.md | 77 | Step-by-step: gather info → scaffold → register → validate skill | `--add-skill [name]` | Workflow |
| add-hook.md | 92 | Step-by-step: create script → wire to settings → test → regenerate | `--add-hook [name]` | Workflow |
| optimize.md | 31 | Optimize existing skill for token efficiency and progressive disclosure | `--optimize [skill]` | Workflow |
| verify.md | 38 | Pre-release audit: 7 checks (references, connections, frontmatter, etc.) | `--verify` | Workflow |

### Reference Documentation (Heavy lift — candidates for extraction)

| File | Lines | Purpose | Content | Standalone Value |
|------|-------|---------|---------|------------------|
| **agent-development.md** | 179 | Complete agent reference: structure, frontmatter, system prompts | File format, frontmatter fields, ecosystem fields, data stores | ⭐ HIGH — Could be independent `agent-development` skill |
| **skill-development.md** | 124 | Complete skill reference: structure, connections, CSO principles | Progressive disclosure, frontmatter, connections, writing style, CSO, validation | ⭐ HIGH — Could be independent `skill-development` skill |
| **hooks.md** | 143 | Complete hook reference: types, events, configuration, I/O contract | Hook types, events table, settings.json config, matchers, I/O contract, exit codes | ⭐ HIGH — Could be independent `hook-development` skill |

### Reference Documentation (Keep with kit)

| File | Lines | Purpose | Content | Why Keep |
|------|-------|---------|---------|----------|
| agents.md | 100 | Ecosystem reference for Claude Code components | Claude Code official components, frontmatter tables, naming conventions, plugin system | Referenced by other specs; ecosystem-level scope |
| cli.md | 51 | Kit CLI development reference | Tech stack, project structure, key commands, conventions | Too specific to kit CLI; implementation details |
| description-validation-checklist.md | 69 | Quality gate for skill descriptions | 7-point checklist, good/bad examples, fail patterns, quick fix template | Specialized tool; heavily referenced during skill creation |

## Detailed File Purposes

### add-agent.md

**What it teaches:** How to create a new agent definition following epost conventions

**Workflow steps:**
1. Gather agent info (name, purpose, package, model tier, color)
2. Suggest matching skills based on agent role
3. Scaffold agent file with frontmatter
4. Copy to package source (`packages/{package}/agents/{agent-name}.md`)
5. Register in `packages/{package}/package.yaml`
6. Validate with `epost-kit lint`
7. Report results

**Coupling:** Tightly tied to kit skill's `--add-agent` flag dispatch

---

### add-skill.md

**What it teaches:** How to create a new skill definition following epost conventions

**Workflow steps:**
1. Gather skill info (name, category, purpose, package, invocability, context)
2. Suggest skill connections (extends, requires, enhances, conflicts)
3. Scaffold skill directory with SKILL.md and optional references/
4. Implement progressive disclosure (lean SKILL.md, detailed references/)
5. Copy to package source (`packages/{package}/skills/{skill-name}/`)
6. Register in `packages/{package}/package.yaml`
7. Validate with `epost-kit lint`
8. Complete post-creation checklist

**Post-creation checklist:**
- [ ] Frontmatter has name and description with trigger phrases
- [ ] `metadata.keywords` present (min 3)
- [ ] `metadata.platforms` set
- [ ] `metadata.connections` declared if obvious parent/dependency
- [ ] Registered in package.yaml `provides.skills`
- [ ] No lint errors

**Coupling:** Tightly tied to kit skill's `--add-skill` flag dispatch

---

### add-hook.md

**What it teaches:** How to create a hook script and wire it into settings.json

**Workflow steps:**
1. Gather hook info (name, event type, hook type, tool matcher, package)
2. Create hook script in CommonJS (.cjs) format
3. Wire into `packages/core/settings.json` under appropriate event
4. Update `packages/{package}/package.yaml` files mapping
5. Test locally via stdin/stdout
6. Regenerate with `epost-kit init --fresh`
7. Report hook integration details

**Hook template included:**
```javascript
#!/usr/bin/env node
'use strict';

const fs = require('fs');
const input = JSON.parse(fs.readFileSync('/dev/stdin', 'utf8'));

// Extract relevant fields based on event type
const toolName = input.tool_name || '';
const toolInput = input.tool_input || {};

// Hook logic here
const shouldBlock = false;

if (shouldBlock) {
  process.stderr.write(JSON.stringify({
    hookSpecificOutput: { permissionDecision: 'deny' },
    systemMessage: 'Blocked: reason here'
  }));
  process.exit(2);
}

console.log(JSON.stringify({
  systemMessage: 'Hook passed'
}));
```

**Coupling:** Tightly tied to kit skill's `--add-hook` flag dispatch

---

### agent-development.md

**What it teaches:** Complete reference for agent file structure and design

**Sections:**
1. **Agent File Structure** — Complete format example with YAML frontmatter and system prompt body
2. **Frontmatter Fields** — Detailed spec for each field:
   - `name` — Format rules (lowercase, hyphens, 3-50 chars)
   - `description` — When to trigger (must include `<example>` blocks)
   - `model` — Which model (inherit, sonnet, opus, haiku)
   - `color` — Visual identifier (blue, cyan, green, yellow, magenta, red)
   - `allowedTools` — Whitelist of tools (principle of least privilege)
   - `tools` — Deprecated field (use allowedTools instead)
3. **System Prompt Design** — Writing in second person, specific responsibilities, step-by-step process
4. **Ecosystem Fields** — ePost Agent Kit extensions:
   - `skills` — Array of skill IDs to preload
   - `memory` — Scope (project, user, local)
   - `permissionMode` — (default, acceptEdits, plan, bypassPermissions)
   - `allowedTools` — Recommended whitelist approach
   - `disallowedTools` — Deprecated blacklist
5. **Data Store Declaration** — Pattern for persistent agent data (findings, benchmarks, patches)

**Standalone value:** Could be read independently to understand agent anatomy

---

### skill-development.md

**What it teaches:** Complete reference for skill file structure, philosophy, and design

**Sections:**
1. **Progressive Disclosure** — 3-level model:
   - Frontmatter `name` + `description` (~100 tokens, always in context)
   - `SKILL.md` body (< 5k tokens, when skill triggers)
   - `references/`, `scripts/`, `assets/` (unlimited, on demand)
2. **Skill Creation Process** — Summary of steps (understand, plan, create, write, add resources, validate)
3. **SKILL.md Frontmatter** — Required/valid/invalid fields spec
4. **Skill Connections** — Metadata relationships:
   - `extends` — Inherits from parent
   - `requires` — Must be co-loaded
   - `conflicts` — Cannot coexist
   - `enhances` — Optional complement
5. **Writing Style** — Third-person description vs. imperative body
6. **Directory Structures** — Minimal vs. standard layouts
7. **Extended Thinking** — When to use `ultrathink` keyword
8. **CSO: Cognitive Skill Optimization** — Prevents "Description Trap"
9. **Description Validation Checklist** — 7-point quality gate (cross-reference)
10. **agentskills.io Compliance** — Publishing rules (SKILL.md in root, references/ for docs)

**Standalone value:** Could be read independently to understand skill architecture

---

### hooks.md

**What it teaches:** Complete reference for hook mechanics, events, and configuration

**Sections:**
1. **Hook Types** — Command (deterministic bash/node) vs. Prompt (LLM-driven)
2. **Hook Events** — Table of 8 events (PreToolUse, PostToolUse, UserPromptSubmit, Stop, SubagentStop, SessionStart, SessionEnd, PreCompact, Notification)
3. **Hook Configuration** — JSON structure in settings.json
4. **Matchers** — How to target specific tools (exact, multiple, wildcard, regex)
5. **Input/Output Contract** — JSON via stdin/stdout, exit codes
6. **epost_agent_kit Hook Architecture** — Existing hooks in packages/core/hooks/ and packages/kit/hooks/
   - session-init.cjs
   - subagent-init.cjs
   - context-reminder.cjs
   - scout-block.cjs
   - privacy-block.cjs
   - subagent-stop-reminder.cjs
   - session-metrics.cjs
   - lesson-capture.cjs
   - notifications/notify.cjs
   - kit-session-check.cjs
   - kit-write-guard.cjs
   - kit-post-edit-reminder.cjs
7. **Creating a New Hook** — 4-step process (create script, wire to settings, update package.yaml, regenerate)

**Standalone value:** Could be read independently to understand hook architecture

---

### agents.md

**What it teaches:** Ecosystem reference for Claude Code components and agent/skill specifications

**Sections:**
1. **Claude Code Official Components** — Table of auto-discovered components (agents, skills, commands, hooks, output styles, MCP, plugins)
2. **Commands & Skills Merge** — How commands and skills are equivalent and functionally merge
3. **Nested Directory Support** — SKILL.md auto-discovery at any depth
4. **Agent Frontmatter Reference** — Table of fields with types and descriptions (official vs. ecosystem)
5. **Skill Frontmatter Reference** — Table of fields with descriptions
6. **epost-kit metadata extensions** — Keywords, platforms, triggers, agent-affinity, connections
7. **Naming Conventions** — Agent files, commands, skills patterns
8. **Plugin System** — JSON structure for distributable plugins
9. **Component Auto-discovery** — How Claude Code finds agents, skills, hooks

**Standalone value:** Reference material, but tied to kit ecosystem; better kept together

---

### cli.md

**What it teaches:** CLI development reference and technical patterns for kit CLI

**Content:**
1. **Tech Stack** — Node.js 20+, TypeScript 5+, cac, @inquirer/prompts, vitest, tsc + tsc-alias
2. **Project Structure** — epost-agent-kit-cli directory layout (src/, tests/, dist/)
3. **Key Commands** — lint, fix-refs, verify, doctor, init
4. **Key Conventions** — YAML parser, file ownership tracking, settings merge, profiles, topological sort, skill index, import paths
5. **Testing** — vitest approach

**Standalone value:** Implementation details, too specific to kit CLI

---

### verify.md

**What it teaches:** Pre-release/pre-init audit workflow and quality gates

**Content:**
1. **When to Use** — Before init, before release, after batch edits, for CI gates
2. **CLI Commands** — `epost-kit verify`, `epost-kit verify --strict`
3. **7 Checks Performed:**
   - Reference validation (all agent/skill/command refs are valid)
   - Connection integrity (extends/requires/enhances targets exist, no cycles)
   - Frontmatter completeness (skills have description, keywords, platforms)
   - Package.yaml sync (skills on disk match declarations)
   - Skill-index staleness (index count matches actual files)
   - Orphan detection (unreferenced skills)
   - Dependency graph (auto-generates mermaid)
4. **Exit Codes** — 0 (pass), 1 (fail)
5. **Integration** — Pre-commit hook, CI, pre-init option

**Standalone value:** Single command reference; narrow scope

---

### optimize.md

**What it teaches:** Workflow for optimizing an existing skill

**Content:**
1. **Purpose** — Optimize skill for token efficiency and progressive disclosure
2. **Arguments** — SKILL (default `*`), PROMPT (optional)
3. **Instructions:**
   - Keep SKILL.md short and concise
   - Progressive disclosure is critical
   - SKILL.md is quick reference guide, NOT documentation
   - Skills teach HOW to perform tasks, not what tools do
   - Claude can activate multiple skills to achieve requests
4. **Additional instructions placeholder** — For custom prompts

**Standalone value:** Single-task workflow; narrow scope

---

### description-validation-checklist.md

**What it teaches:** 7-point quality gate for skill descriptions

**The 7 Checks:**
1. **Trigger phrasing** — Starts with "Use when..." (third-person)
2. **Concrete triggers** — 2+ quoted trigger examples
3. **No workflow summary** — No steps, tools, or sequences
4. **Character limit** — Under 1024 chars total
5. **Quoted user phrases** — At least 2 literal phrases in quotes
6. **Third-person voice** — "Use when user says..." not "I will..."
7. **Outcome signal** — States domain/capability, not HOW

**Content:**
- Check table with pass/fail examples
- Good vs. Bad examples with detailed explanation
- Common fail patterns with fixes
- Quick fix template
- Character count verification bash command

**Standalone value:** Specialized validation tool; better kept with kit for easy cross-reference during creation

---

## Dependencies Between Files

```
SKILL.md (dispatcher)
├── add-agent.md (workflow)
│   └── agent-development.md (reference)
├── add-skill.md (workflow)
│   ├── skill-development.md (reference)
│   └── description-validation-checklist.md (reference)
├── add-hook.md (workflow)
│   └── hooks.md (reference)
├── optimize.md (workflow)
│   └── skill-development.md (reference)
└── verify.md (workflow)
    └── agents.md (reference)

agents.md, cli.md are "floating" references used by developers
as independent lookups, not workflows
```

## Quick Stats

| Category | Count | Lines | Purpose |
|----------|-------|-------|---------|
| Dispatcher | 1 | 69 | Main entry point |
| Workflows | 5 | 229 | Execution steps |
| Large References | 3 | 446 | ⭐ Extraction candidates |
| Small References | 3 | 221 | Keep with kit |
| **TOTAL** | **12** | **965** | Unified authoring system |

## How to Use This Reference

1. **Quick lookup** — Find file, read purpose column
2. **Deep dive** — Read full detailed section
3. **Understand kit structure** — See "Dependencies Between Files" section
4. **Evaluate independence** — Check "Standalone value" column for each file
5. **Plan extraction** — Look at 3 extraction candidates (agent-dev, skill-dev, hooks)
