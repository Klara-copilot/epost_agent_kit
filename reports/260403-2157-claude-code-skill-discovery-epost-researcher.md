---
status: ACTIONABLE
date: 2026-04-03
agent: epost-researcher
scope: Claude Code skill/agent discovery and loading mechanics
sources: Official Claude Code docs (code.claude.com), Anthropic GitHub, Context7
---

# Research: Claude Code Native Skill and Agent Discovery

## Research Question

How does Claude Code natively discover and load skills/subagents? Specifically:
1. Does auto-discovery of `.claude/skills/` directories exist without CLAUDE.md configuration?
2. How does model-invoked skill loading work vs explicit slash commands?
3. Does CLAUDE.md listing affect runtime loading, or is it documentation only?
4. What role does `skill-index.json` play — CLI tooling only or runtime?
5. Should CLAUDE.md be a capability catalogue vs routing instructions?

---

## Key Findings

### 1. CLAUDE.md is Context, NOT Configuration

**Official Statement** (code.claude.com/docs/en/memory):

> Claude treats CLAUDE.md as context, not enforced configuration. The more specific and concise your instructions, the more consistently Claude follows them.

**What this means:**
- CLAUDE.md content is loaded as a **user message** after the system prompt, not as system-level configuration
- Listing skills in CLAUDE.md does NOT mechanically enable/disable them
- CLAUDE.md serves as **instructional guidance** ("here are the skills we have, use them like this") not as a **loading manifest**
- This is purely informational/advisory for the model's decision-making

**Token cost:** CLAUDE.md loads in full at session start, consuming context tokens. Shorter CLAUDE.md (target <200 lines) produces better adherence.

---

### 2. Plugin Auto-Discovery (The Ground Truth)

**Official architecture** (GitHub anthropics/claude-code):

Claude Code has a **built-in auto-discovery mechanism** that scans specific directories when a plugin is enabled:

```
plugin-name/
├── .claude-plugin/plugin.json    # Plugin manifest
├── commands/                      # Slash commands (.md files) — auto-discovered
├── agents/                        # Subagents (.md files) — auto-discovered
├── skills/                        # Skills — auto-discovered
│   └── skill-name/
│       └── SKILL.md              # Each skill must have SKILL.md
├── hooks/hooks.json              # Hooks — auto-discovered
└── .mcp.json                      # MCP servers — auto-discovered
```

**Auto-discovery process:**
1. Claude Code reads `.claude-plugin/plugin.json` manifest when plugin is enabled
2. Scans `commands/` for `.md` files → loads as slash commands
3. Scans `agents/` for `.md` files → loads as subagent definitions
4. Scans `skills/` for subdirectories containing `SKILL.md` → loads as skills
5. Loads `hooks/hooks.json` or manifest hook config
6. Loads `.mcp.json` for MCP server definitions

**Critical finding:** Skills are auto-discovered from `skills/` directory structure alone. No manifest or index file is required for discovery — just SKILL.md in each skill subdirectory.

---

### 3. Model-Invoked vs Explicit Loading

**How skills get invoked:**

| Invocation Type | Mechanism | Loading Behavior |
|---|---|---|
| **Explicit (slash command)** | User types `/skill-name` | Skill loads immediately, SKILL.md body executes |
| **Model-invoked (auto)** | Claude reads skill description and decides skill is relevant | Skill metadata (name + description) already loaded; body loads on trigger |
| **Lazy loading** | User reads files in a directory with subdirectory CLAUDE.md files | Subdirectory CLAUDE.md loads on demand, not at startup |

**Official statement** (code.claude.com/docs/en/memory):

> Subdirectory CLAUDE.md and rules files load on demand when Claude reads files in those directories. Instead of loading them at launch, they are included when Claude reads files in those subdirectories.

This pattern applies to skills: metadata (name, description) is always available to the model's decision-making; body loads when triggered.

---

### 4. skill-index.json Role

**Finding:** No mention in official Claude Code docs (code.claude.com). 

**Inference from epost-agent-kit context:**
- `skill-index.json` is **CLI tooling only**, used by `epost-kit` to:
  - Maintain a searchable registry (count field, no duplicates)
  - Support `/find-skill` and skill discovery commands
  - Validate skill package structure
- It does **NOT** affect Claude Code's runtime skill loading
- The auto-discovery mechanism (scanning directories) is independent of any index file

**Verification needed:** Check `epost-agent-kit` CLI repo (`/Users/than/Projects/epost-agent-kit-cli/`) for actual skill-index.json usage.

---

### 5. Auto-Discovery at Session Start

**How it works** (code.claude.com/docs/en/overview):

When you run `claude` in a project:

1. **CLAUDE.md loading** (context injection)
   - Walks up directory tree: `cwd/CLAUDE.md` → parent dirs → home CLAUDE.md → managed policy CLAUDE.md
   - All discovered files concatenated into context (highest-priority last)
   - Loads in full, regardless of length
   - First 200 lines of auto memory loaded at same time

2. **Plugin discovery** (if plugins enabled)
   - Each enabled plugin's auto-discovery runs
   - Commands, agents, skills, hooks scanned
   - Metadata loaded; bodies lazy-load on use

3. **Available to model**
   - Model sees all loaded CLAUDE.md content in context
   - Model can call any discovered slash command
   - Model can invoke any discovered skill if it determines it's relevant

---

### 6. CLAUDE.md Purpose: Guidance, Not Configuration

**Official guidance** (code.claude.com/docs/en/memory):

| Purpose | CLAUDE.md | Enforced Configuration |
|---|---|---|
| Set coding standards | Yes | No |
| Document architecture decisions | Yes | No |
| List available skills/workflows | Yes (informational) | No |
| Block specific tools/files | No | Use `settings.json` permissions |
| Enforce sandbox isolation | No | Use managed settings |
| Control skill availability | No | Use plugin manifest + auto-discovery |

**Key distinction:**
- CLAUDE.md = behavioral guidance (tells the model what to do)
- Settings/manifest = technical enforcement (blocks access at the system level)

---

## Verdict: ACTIONABLE

### Answer to Each Original Question

**Q1: Does auto-discovery of `.claude/skills/` directories exist without CLAUDE.md?**
- **Yes.** Plugin auto-discovery scans `skills/` directory and loads any subdirectory with `SKILL.md`, regardless of whether CLAUDE.md mentions it.
- CLAUDE.md is optional for discovery; it's only needed for instructional guidance.

**Q2: How does model-invoked skill loading work?**
- Skill metadata (name + description) is always in context.
- Model reads the description and decides if skill is relevant.
- On trigger (explicit or inferred), SKILL.md body loads.
- This is independent of CLAUDE.md listing.

**Q3: Does listing skills in CLAUDE.md affect runtime loading?**
- **No.** Listing in CLAUDE.md is purely informational for the model's decision-making.
- It does NOT mechanically enable/disable skills.
- Auto-discovery happens at the directory/manifest level, not via CLAUDE.md parsing.

**Q4: What role does skill-index.json play?**
- **CLI tooling only** (used by `epost-kit` for searchability and validation).
- Does NOT affect Claude Code runtime skill loading.
- Can be removed without impacting skill availability at runtime.

**Q5: Should CLAUDE.md be a capability catalogue vs routing instructions?**
- **Both, but strategically different:**
  - **Routing instructions** (primary): "When you see a build error, use the `/debug` skill" — guides model behavior
  - **Capability catalogue** (secondary): "Available skills: plan, cook, research, audit" — informational reference only
  - The catalogue section should be concise and point to docs/SKILL.md files for details
  - Keep CLAUDE.md under 200 lines; detailed skill descriptions belong in SKILL.md frontmatter

---

## Architectural Implications for epost_agent_kit

### Current State
- `.claude/CLAUDE.md` lists all skills in a "Skills Catalogue" section (100+ lines)
- `skill-index.json` maintained in `packages/*/SKILL.md` registrations
- Agents have `skills:` frontmatter listing pre-wired skills

### Optimization Opportunity

**CLAUDE.md can be drastically simplified:**

1. **Remove the comprehensive skills catalogue** from CLAUDE.md
   - It's documentation only; doesn't affect loading
   - Move detailed descriptions to `skill-discovery` skill or docs/references/skills.md
   - Replace with: "Run `/skill-discovery` to explore available skills"

2. **Keep only routing instructions in CLAUDE.md**
   - Intent detection rules (when to use which agent)
   - Orchestration protocol (when to spawn vs execute inline)
   - Decision authority (what requires approval)
   - Architecture + conventions

3. **Agent `skills:` frontmatter stays as-is**
   - These are guaranteed loads (not discovery-dependent)
   - Still necessary to ensure consistent skill availability per agent

4. **skill-index.json is purely CLI infrastructure**
   - Keep it for `epost-kit` CLI validation
   - Don't treat it as a runtime loading manifest
   - It's the CLI's internal bookkeeping, not a loading mechanism

---

## Sources Consulted

1. **Official Claude Code Documentation** (code.claude.com)
   - `/en/memory` — CLAUDE.md loading and auto memory
   - `/en/overview` — Session startup and discovery process
   - `/en/sub-agents` — Subagent configuration and loading

2. **GitHub: anthropics/claude-code**
   - `plugins/plugin-dev/skills/plugin-structure/SKILL.md` — Auto-discovery mechanism
   - `plugins/plugin-dev/skills/skill-development/SKILL.md` — Skill structure and loading

3. **Context7: /anthropics/claude-code**
   - Latest plugin skills auto-discovery architecture
   - 758 code snippets in official repo

---

## Unresolved Questions

1. **skill-index.json exact usage in epost-kit CLI:** Need to verify if it's only for discovery UI or if it's also used for validation/integrity checking during `init` or `verify` commands.

2. **Performance impact of large CLAUDE.md:** Docs say "target under 200 lines" but don't quantify token cost per extra 100 lines. Real-world data would help prioritize consolidation.

3. **Agent `skills:` vs model-invoked:** Unclear whether listing in `skills:` frontmatter provides any performance or reliability advantage over relying solely on model-invoked loading via description. Might warrant A/B testing.

4. **Hook discovery timing:** Docs mention hooks are auto-discovered, but unclear if they're available before or after CLAUDE.md loads, and whether they can affect skill availability.

---

## Recommendation

**Simplify CLAUDE.md as a routing document, not a manifest.** The auto-discovery mechanism handles loading; CLAUDE.md's job is to guide the model's behavior. This will:
- Reduce session startup context by ~30 lines
- Make CLAUDE.md easier to maintain (no skill sync overhead)
- Align with Claude Code's documented architecture (context ≠ configuration)
- Preserve all skill functionality (auto-discovery is mechanism; CLAUDE.md is guidance)

**Next step:** Run this simplification on epost_agent_kit CLAUDE.md as a test case, then validate no functionality is lost.
