# Claude Code Native Mechanics & Routing Design

*Ground truth for how CC loads context and when to spawn agents.*

---

## What Claude Code Loads and When

### Always loaded (session-wide)
- **CLAUDE.md** — injected at session start, no trigger needed
- Parent-directory CLAUDE.md files up the tree (if present)

### Loaded when agent spawns
- **Agent system prompt** (the agent's `.md` file body)
- **Skills in `skills:` frontmatter** — guaranteed, synchronous, full content injected

### Loaded on demand (trigger-based)
- **`/skill-name`** slash command — injects the skill's full `SKILL.md` into context
- **Agent tool call** — spawns agent with system prompt + wired skills
- **Model-matched skills** — Claude *may* load a skill if its description matches; unreliable, do not depend on this as the only trigger path

### Never auto-loaded
- `skill-index.json` — consumed by CLI tooling only, invisible to Claude
- Skills not listed in an agent's `skills:` and not invoked via slash command

### Load priority
```
CLAUDE.md (always, session-wide)
  └─ Agent system prompt (on spawn)
       └─ Agent skills: [] (wired, full content injected on spawn)
            └─ /slash-command skills (on demand)
                 └─ Model-matched skills (unreliable)
```

---

## Cost-Benefit of Spawning an Agent

Every agent spawn is a **fresh hire who knows nothing**. You must brief them completely in the prompt. The "specialization" of a named agent only exists if its prompt contains specialized knowledge, not just a label.

### What you gain

| Benefit | When it matters |
|---------|----------------|
| Fresh context window | Long tasks that would bloat main conversation |
| Parallel execution | Genuinely independent tasks running concurrently |
| Permission scoping | Restricting tools/writes to a specific task |
| Worktree isolation | Agent works on separate git branch |
| Failure containment | Agent fails without crashing main conversation |

### What you pay

| Cost | Impact |
|------|--------|
| Zero conversation memory | Must re-inject all context in the prompt |
| Token re-injection overhead | Pay to describe situation on every spawn |
| No further delegation | Sub-agents cannot spawn sub-agents — terminal node |
| Latency overhead | Even simple tasks pay the spawn cost |
| Manual result merging | Orchestrator must read + integrate agent output |
| Prompt quality dependency | Agent quality = prompt quality, no more |

### The core heuristic

> "Would a human open a new terminal window for this task?"
> If no → execute inline. If yes → spawn agent.

---

## Two-Tier Execution Model

```
Tier 1 — Inline (default)
  Simple, short, reversible, sequential
  < 5 steps, single platform, no parallelism needed

Tier 2 — Agent spawn
  Long, parallel, destructive, cross-platform
  Needs permission isolation or worktree
```

**When agents are still worth it:**
- 3+ independent tasks → parallel agent spawn is a real speedup
- Destructive operations → worktree isolation protects main branch
- Cross-platform work → agent per platform, run concurrently
- Context-polluting research → keep deep exploration out of main conversation
- Long implementation phases → agent runs for 20+ steps without bloating main context

**Anti-pattern:** Spawning an agent for every single task regardless of complexity.

---

## Design Principles for Skill & Agent Authors

**Principle 1: Don't duplicate Claude's reasoning**
CLAUDE.md and skills should declare *what exists*, not *how to think*. Claude already classifies intent — routing tables are instructions Claude ignores or re-derives.

**Principle 2: Surface-first context loading**
Platform context from file extensions tells you 80% of what skills to load:
```
.tsx/.ts/.scss  →  web skill bundle
.swift          →  ios skill bundle
.kt/.java       →  android/backend skill bundle
```

**Principle 3: Capability bundles over agent-per-intent**
Replace `agent-per-role` with `skill bundles` loaded into the main context. Agents exist for isolation, not specialization.

**Principle 4: Risk-based confirmation**
Route confirmation gates by *risk level*, not intent category:
```
Low risk   (read, explain, draft)        →  execute immediately
Med risk   (write, refactor, multi-file) →  confirm before execute
High risk  (delete, push, deploy)        →  always isolate + confirm
```

**Principle 5: Output contract is invariant**
Skill behavior and output format are identical regardless of execution mode. Whether a skill runs inline or via agent spawn, the output structure, report format, and file naming follow the same contract.

**Principle 6: Spawn-time skill injection**
Platform and domain skills are not pre-wired to all agents. The orchestrator detects platform from surface signals and injects relevant skills into the agent spawn prompt at dispatch time.

**Principle 7: Skill descriptions as routing signal**
The description field is the primary routing mechanism. It must describe *when to trigger*, not *what the skill does internally*. Front-load key use cases — descriptions truncate at 250 chars in the skill listing.
