# ARCH-0002: Claude Native Mechanics & Routing Design Principles

**Category**: architecture
**Status**: current
**Audience**: agent, human
**Tags**: routing, agents, skills, claude-mechanics, design-principles

---

## Purpose

This document captures how Claude Code works natively — what it loads, when, and why — and derives design principles for building the kit on top of those mechanics rather than against them.

---

## 1. What Claude Code Does Natively

### Always loaded (session-wide)
- **CLAUDE.md** — injected at session start, no trigger needed
- Parent-directory CLAUDE.md files up the tree (if present)

### Loaded when agent spawns
- **Agent system prompt** (the agent's `.md` file)
- **Skills listed in `skills:` frontmatter** — guaranteed, synchronous

### Loaded on demand (trigger-based)
- **Slash commands** (`/skill-name`) — injects the skill's `SKILL.md` into context
- **Agent tool call** — spawns agent with its full system prompt + wired skills
- **Model-matched skills** — Claude *may* invoke a skill if its description matches; unreliable, do not depend on this

### Never auto-loaded
- `skill-index.json` — consumed by CLI tooling only, invisible to Claude
- Skills not listed in an agent's `skills:` and not invoked via slash command

### Load priority
```
CLAUDE.md (always, session-wide)
  └─ Agent system prompt (on spawn)
       └─ Agent skills: [] (wired, on spawn)
            └─ /slash-command skills (on demand)
                 └─ Model-matched skills (unreliable)
```

---

## 2. What Spawning an Agent Actually Does

### What you gain
| Benefit | When it matters |
|---|---|
| Fresh context window | Long tasks that would bloat main conversation |
| Parallel execution | Genuinely independent tasks running concurrently |
| Permission scoping | Restricting tools/writes to a specific task |
| Worktree isolation | Agent works on separate git branch |
| Failure containment | Agent fails without crashing main conversation |

### What you pay
| Cost | Impact |
|---|---|
| Zero conversation memory | Must re-inject all context in the prompt |
| Token re-injection overhead | Pay to describe situation on every spawn |
| No further delegation | Subagents cannot spawn subagents — terminal node |
| Latency overhead | Even simple tasks pay the spawn cost |
| Manual result merging | Orchestrator must read + integrate agent output |
| Prompt quality dependency | Agent quality = prompt quality, no more |

### The core heuristic
> "Would a human open a new terminal window for this task?"
> If no → execute inline. If yes → spawn agent.

Every spawn is a fresh hire who knows nothing — you must brief them completely. The "specialization" of a named agent only exists if its prompt actually contains specialized knowledge, not just a label.

---

## 3. Why the Current Kit Got Complex

The routing complexity grew from three compounding causes:

**1. Early trust deficit**
When the kit was designed, Claude's judgment wasn't trusted to classify intent. Explicit routing rules compensated. Claude's capability has since improved — many rules are now redundant.

**2. Agents ≠ capability**
More agents felt like more power. In practice, specialized agents (planner, debugger, reviewer) are all the same Claude with slightly different system prompts. The apparent specialization rarely justifies the overhead.

**3. Edge-case patching**
Every routing failure added a new rule. Rules accumulated into a maze. The maze now has more maintenance cost than the problems it solves.

### The result
The kit optimizes for **predictability** (Claude does what the rules say) at the cost of **simplicity**. The routing table duplicates reasoning Claude already does naturally.

---

## 4. Design Principles for a Simpler Kit

### Principle 1: Don't duplicate Claude's reasoning
CLAUDE.md should declare *what exists* (skills, agents, tools), not *how to think*. Claude already classifies intent — routing tables are instructions Claude ignores or re-derives anyway.

**Instead of**: "If user says X, route to Y"
**Write**: "Available for debugging: `epost-debugger` agent with tools [...]. Available skills: `debug`, `fix`."

### Principle 2: Surface-first context loading
The strongest routing signal is *what files are being touched*, not intent labels. Platform context from the diff tells you 80% of what skills to load.

```
.tsx/.ts/.scss  →  web skill bundle
.swift          →  ios skill bundle
.kt/.java       →  android/backend skill bundle
no file signal  →  ask one question
```

### Principle 3: Two-tier execution
Most tasks don't need an agent. Default to inline execution; spawn only when isolation genuinely helps.

```
Tier 1 — Inline (default)
  Simple, short, reversible, sequential
  < 5 steps, single platform, no parallelism needed

Tier 2 — Agent spawn
  Long, parallel, destructive, cross-platform
  Needs permission isolation or worktree
```

### Principle 4: Capability bundles over agent-per-intent
Replace `agent-per-role` with `skill bundles` loaded into the main context. Agents exist for isolation, not specialization.

```
# Instead of: spawn epost-debugger
# Load debug skill inline:
skills: [debug, web-frontend]
# Then execute directly
```

### Principle 5: Risk-based confirmation, not intent-based routing
Route confirmation gates by *risk level*, not intent category. All intents reduce to a risk level.

```
Low risk   (read, explain, draft)      →  execute immediately
Med risk   (write, refactor, multi-file) →  confirm before execute
High risk  (delete, push, deploy)       →  always isolate + confirm
```

### Principle 6: Output contract is invariant
Skill behavior and output format are identical regardless of execution mode. Whether a skill runs inline in the main context or via an agent spawn, the output structure, report format, and file naming follow the same contract. Execution mode is an implementation detail the user never sees.

### Principle 7: Spawn-time skill injection
Platform and domain skills are not pre-wired to general-purpose agents. The orchestrator detects platform from surface signals and injects relevant skills into the agent spawn prompt at dispatch time. This keeps agent frontmatter minimal and prevents wiring all platforms to all agents.

---

## 5. When Agents Are Still Worth It

Agents remain valuable for genuinely parallel, isolated, or long-running work:

- **3+ independent tasks** — parallel agent spawn is a real speedup
- **Destructive operations** — worktree isolation protects main branch
- **Cross-platform work** — agent per platform, run concurrently
- **Context-polluting research** — keep deep exploration out of main conversation
- **Long implementation phases** — agent runs for 20+ steps without bloating main context

The anti-pattern: spawning an agent for every single task regardless of complexity.

---

## 6. Implication for Kit Architecture

| Current | Simpler alternative |
|---|---|
| Routing table in CLAUDE.md | Weight-based execution rule (inline vs. spawn) |
| Agent-per-intent (10 agents) | Same agents, used by weight not intent label |
| Skills pre-wired per-agent | Core skills pre-wired; platform skills injected at spawn |
| Intent classification rules | Trust Claude's natural classification |
| skill-discovery as runtime loader | skill-discovery as passive catalogue reference |

The simplest viable kit:
1. CLAUDE.md declares capabilities (not rules)
2. Surface detection loads the right skill bundle
3. Risk level determines inline vs. spawn
4. Agents exist for parallelism and isolation only

---

## Related
- `ARCH-0001` — Current system architecture
- `PATTERN-0001` — Agent & skill development patterns
