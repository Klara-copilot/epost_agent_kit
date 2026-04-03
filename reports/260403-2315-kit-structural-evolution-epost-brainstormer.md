---
type: brainstorm
agent: epost-brainstormer
title: "Kit Structural Evolution: Init Pipeline, Nested Discovery, Bundles, Plugins"
verdict: ACTIONABLE
date: 2026-04-03
tags: [architecture, init-pipeline, plugins, nested-discovery, bundles, symlinks]
---

## Problem Statement

Round 1 (report 260403-2306) concluded: `paths:` on all skills + expanded agent `skills:` lists is the winning short-term approach. That work is committed.

This round goes deeper: **should the kit's structure and init pipeline fundamentally evolve** to leverage Claude Code's nested directory discovery, plugin system, or alternative install strategies?

Five structural questions evaluated below. Each targets a different axis of the kit architecture.

---

## Prior Art Summary

| Fact | Source |
|------|--------|
| Subagents only load skills from `skills:` frontmatter | Research 260402-1138 |
| `paths:` is main-session-only auto-load | ARCH-0004, round 1 brainstorm |
| Claude Code has a plugin system with `.claude-plugin/plugin.json` | Research 260403-2157 |
| Subdirectory CLAUDE.md loads on demand when files in that dir are read | Official docs |
| `epost-kit init` copies files flat into `.claude/skills/` | CLI init.ts (line 411) |
| `.claude/` is wiped and regenerated on every init | CONV-0001 |
| Package `files:` mapping drives copy (e.g., `skills/: skills/`) | package.yaml + init.ts |

---

## Q1: Per-Package Nested `.claude/skills/` in Target Repos

### The Idea

Instead of all skills flat under root `.claude/skills/`, init generates per-package skill directories:

```
TARGET REPO:
  packages/mobile-ios/.claude/skills/ios-development/
  packages/web-app/.claude/skills/web-frontend/
  .claude/skills/core/           # only cross-cutting skills at root
```

### Evaluation

| Dimension | Score | Analysis |
|-----------|-------|----------|
| Reliability | 6/10 | Works for main session (native nested discovery). Fails for subagents (proven: skills: only). |
| Maintenance | 3/10 | Init must map package→platform. Skills now exist in 2+ locations. kit-verify must scan all. Divergence risk between root and nested copies. |
| Init complexity | 7/10 | Needs new config: `platform-mapping: { mobile-ios: ios, web-app: web }`. Auto-detection by file extension feasible but fragile for edge cases (mixed-lang packages). |
| Generalizability | 4/10 | Only helps monorepos with clear package boundaries. Flat repos, single-platform repos get zero benefit. |

### Second-Order Effects

- **Dual-source problem**: Skill at root `.claude/skills/ios-development/` AND `packages/mobile-ios/.claude/skills/ios-development/` — which wins? Claude Code loads both. Double context cost.
- **Selective install is hard**: Init must decide which platform skills go where AND still put them at root for subagents.
- **.gitignore complexity**: Each `packages/*/.claude/` must be gitignored (generated output) but developers may not expect generated dirs inside their packages.

### Verdict: DEFER

Context efficiency gain is real but only for main sessions. The dual-source problem creates more confusion than it solves. Revisit if Claude Code adds subagent auto-discovery or if context budget becomes a measured bottleneck (it's currently ~800 tokens — not a bottleneck).

---

## Q2: Platform Bundles (Fat SKILL.md)

### The Idea

Single `ios-bundle/SKILL.md` combining ios-development + ios-testing + ios-ui-lib. Agent loads one skill name, gets everything.

### Evaluation

| Dimension | Score | Analysis |
|-----------|-------|----------|
| Reliability | 8/10 | Works everywhere — main session, subagents, slash command. |
| Maintenance | 4/10 | Bundle becomes monolithic (1000+ lines). Editing one sub-skill means touching the whole bundle. Merging upstream changes is painful. |
| Init complexity | 5/10 | Init generates bundles from individual skills. Or bundles are hand-authored and reference individual skills. Either way, new build step. |
| Generalizability | 9/10 | Works identically everywhere. |

### When Bundles Are Better Than Individual Skills

| Scenario | Individual | Bundle |
|----------|-----------|--------|
| Agent needs all platform skills | 4-5 skills: entries | 1 entry |
| User wants just testing | 1 skill loads | Whole platform loads (waste) |
| Skill author edits one skill | Isolated change | Touches monolith |
| Context budget tight | Load only needed | All-or-nothing |

### The Progressive Disclosure Alternative

Instead of fat bundles, use a **thin router skill**:

```yaml
# platform-ios/SKILL.md (the "router")
---
name: platform-ios
paths: ["**/*.swift"]
user-invocable: false
---
## iOS Platform Skills
When working on iOS code, load the relevant skill by reading its references:
- `references/ios-development.md` — patterns, SwiftUI/UIKit
- `references/ios-testing.md` — XCTest, XCUITest  
- `references/ios-ui-lib.md` — theme components
Read only the reference needed for the current task.
```

This loads a ~100-token router at startup, then reads 200-400 tokens of the specific reference on demand. Better than 1000-token monolith.

### Verdict: PROTOTYPE the thin router variant

The thin router is genuinely novel and fits progressive disclosure. But it requires verifying that "read references/" files are actually consulted reliably by agents. If they are, this replaces both bundles AND individual skills for the subagent problem. One `skills:` entry per platform, progressive content loading.

---

## Q3: Platform Packages as Claude Code Plugins

### The Idea

Each platform package becomes a proper Claude Code plugin:

```
packages/platform-ios/
  .claude-plugin/plugin.json
  skills/ios-development/SKILL.md
  agents/                          # platform-specific agents?
```

### Evaluation

| Dimension | Score | Analysis |
|-----------|-------|----------|
| Reliability | 5/10 | Plugin auto-discovery is documented. But plugin installation/management is unclear — how does a user enable/disable plugins? |
| Maintenance | 7/10 | Each platform is self-contained. Clean boundaries. |
| Init complexity | 8/10 | Init generates `plugin.json` + symlinks/copies the package. Simpler than current flat-copy. |
| Generalizability | 3/10 | **FATAL**: Plugins are designed for external distribution (community skills, third-party tools). Using them for internal platform decomposition is off-label. Plugin APIs may change in ways that break internal-toolkit assumptions. |

### What Plugins Enable

- **Independent versioning**: Platform-ios plugin v1.2 while platform-web is at v1.0
- **User choice**: Enable/disable per-platform in project settings
- **Clean isolation**: Each plugin has its own agents, skills, hooks, MCP
- **Auto-discovery**: No manual wiring — plugin structure IS the manifest

### What Plugins Break

- **Shared agents**: `epost-fullstack-developer` spans platforms. Where does it live — in a plugin, or at root? If root, it can't reference plugin skills via `skills:` frontmatter (different namespace).
- **Cross-platform skills**: `core`, `knowledge`, `debug` — these are platform-agnostic. They must be separate from any platform plugin. Adds a "core plugin" concept.
- **Hook conflicts**: Multiple plugins with hooks on same events. Merge order undefined.
- **agent `skills:` references**: If ios-development lives in the ios plugin, can the root agent reference it by name? Or does it need a plugin-qualified name? Unknown.
- **Kit's wipe-and-rebuild model**: `.claude/` is wiped on init. Plugins may have their own lifecycle. Conflict.

### Critical Unknown

Claude Code's plugin spec is documented in GitHub source but **not in user-facing docs as a stable API**. Building the kit on it risks breakage when the spec changes. The kit should consume stable APIs, not internal scaffolding.

### Verdict: REJECT for now, WATCH for stabilization

Plugins are the architecturally correct long-term answer. But:
1. The spec is not stable enough for a production toolkit
2. Cross-agent skill references across plugin boundaries are unspecified
3. The kit's wipe-rebuild model conflicts with plugin lifecycle

Revisit when Anthropic publishes a stable plugin SDK with documented cross-plugin skill resolution.

---

## Q4: Init Strategy — Copy vs Symlink vs Plugin

### Current: Copy

`epost-kit init` copies files from `packages/*/skills/` into `.claude/skills/`. Deterministic, simple, stale until re-init.

### Alternative A: Symlinks

`.claude/skills/ios-development` → `../../packages/platform-ios/skills/ios-development/`

| Dimension | Score | Analysis |
|-----------|-------|----------|
| Reliability | 4/10 | Symlinks break on: Windows (requires admin), Git (doesn't track symlinks by default), CI (clone doesn't preserve). |
| Maintenance | 9/10 | Changes in packages/ instantly reflected. No re-init needed. |
| Init complexity | 3/10 | Must handle relative paths, cross-platform compat, .gitignore for symlinks |
| Generalizability | 2/10 | **Only works for local dev in the kit's own repo**. Target repos don't have `packages/` — they get files from GitHub releases. Symlinks have no target. |

**Fatal for distribution**: Target repos install from GitHub releases. There is no packages/ directory to symlink to. Symlinks only help epost_agent_kit developers themselves.

**Narrow use case**: Could add `--dev` flag to init that creates symlinks for kit developers only. Saves re-init during development. But this is a DX improvement for 2-3 people, not an architecture change.

### Alternative B: Live discovery via `--add-dir`

No evidence Claude Code supports `--add-dir` for skill discovery. Not in docs, not in source analysis. **REJECT — feature doesn't exist.**

### Alternative C: Plugin manifest per platform

See Q3 above. Same conclusion: architecturally correct but spec not stable.

### Scoring Summary

| Strategy | Reliability | Maintenance | Init Complexity | Generalizability | Total |
|----------|------------|-------------|-----------------|------------------|-------|
| Copy (current) | 9 | 5 | 3 (simple) | 9 | **36** |
| Symlinks | 4 | 9 | 3 | 2 | 18 |
| Live discovery | ? | ? | ? | ? | REJECT |
| Plugin manifest | 5 | 7 | 8 | 3 | 23 |

### Verdict: KEEP COPY

Copy is boring and correct. The staleness problem is mitigated by `epost-kit init` being fast (<5s). Add `--dev symlink` mode as a small DX win for kit developers only, not as the primary strategy.

---

## Q5: The Agent `skills:` Scaling Problem

### The Problem

```yaml
# epost-fullstack-developer today:
skills: [core, knowledge, cook, journal, skill-creator, skill-discovery,
         web-frontend, web-nextjs, web-api-routes, ios-development,
         android-development, backend-javaee]
```

This grows linearly as platforms are added. 4 platforms x 3-4 skills = 12-16 entries. Adding infra, data, ML platforms pushes toward 30+.

### Approach A: Platform Router Skill (from Q2)

One `platform-ios` router skill replaces `ios-development`, `ios-testing`, `ios-ui-lib`, `ios-a11y` — 4 entries become 1. Total: 4-5 platform entries instead of 16.

```yaml
skills: [core, knowledge, cook, journal, platform-ios, platform-android,
         platform-web, platform-backend]
```

The router skill contains a summary + references/ for deep content. Progressive disclosure reduces startup context.

**Cost-benefit**: 16 descriptions (~800 tokens) → 4 descriptions (~200 tokens) + 4 router bodies (~400 tokens) = ~600 tokens. Marginal saving. The real win is **cognitive simplicity** — 8 entries instead of 16+.

### Approach B: Orchestrator-Injected Platform Skills

Agent definition is lean:
```yaml
skills: [core, knowledge, cook, journal]
```

Orchestrator detects platform and adds to the spawn prompt:
```
Also load: .claude/skills/ios-development/SKILL.md
```

**Problem already identified in round 1**: "read these files" is NOT equivalent to `skills:` preload. The agent may not consult them. Preload is reliable; file-reading hints are not.

BUT: what if the orchestrator uses a **dynamic skills: override**? Claude Code's Agent tool accepts a custom system prompt. The question is: can the orchestrator specify additional skills at spawn time?

**Answer: No.** `skills:` is static frontmatter in the agent definition file. The Agent tool spawns the agent as-defined. There is no runtime skill injection API.

### Approach C: Platform-Specific Agent Variants

```
epost-ios-developer.md   — skills: [core, ios-development, ios-testing, ios-ui-lib]
epost-web-developer.md   — skills: [core, web-frontend, web-nextjs, web-testing]
epost-backend-developer.md — skills: [core, backend-javaee, backend-databases]
```

| Pros | Cons |
|------|------|
| Each agent loads exactly what it needs | Agent proliferation: 3-4 platform agents + generic fullstack |
| Orchestrator routes by platform to platform agent | Routing logic must detect platform before dispatch |
| Context-efficient: no unused platform skills loaded | Maintaining 4+ nearly-identical agent definitions |
| Natural extension of ARCH-0002 principle 2 (surface-first) | DRY violation: shared skills repeated across agents |

**The DRY problem is solvable**: Platform agents extend fullstack-developer. Each definition is ~10 lines of frontmatter + 20 lines of platform context. Not burdensome.

**Routing is already happening**: The orchestrator already detects platform from file extensions (CLAUDE.md routing table). The only change is dispatching `epost-ios-developer` instead of `epost-fullstack-developer`.

### Approach D: Accept the Long List

16 skills at ~50 tokens each = 800 tokens. That's 2.5% of a 32K window. Not a real problem.

**The scaling concern is premature.** We have 4 platforms. We're not adding ML, data, infra as Claude Code agent platforms — those are ops domains, not coding contexts. The list will plateau at ~20 entries.

### Scoring

| Approach | Simplicity | Context Efficiency | Maintenance | Routing Complexity | Total |
|----------|-----------|-------------------|-------------|-------------------|-------|
| A. Router skills | 7 | 7 | 6 | Same as current | 20 |
| B. Orchestrator injection | 5 | 9 | 3 | Higher | 17 |
| C. Platform agent variants | 6 | 9 | 5 | Higher | 20 |
| D. Accept long list | 9 | 5 | 9 | Same as current | 23 |

### Verdict: D now, A as next evolution

Accept the long list today. It's 800 tokens and not growing fast. If/when we hit 6+ platforms or context budget becomes a measured constraint, migrate to router skills (A). Don't over-engineer for a scaling problem that hasn't materialized.

---

## Cross-Question Synthesis

### What's Worth Prototyping

| Approach | Effort | Impact | Prototype? |
|----------|--------|--------|------------|
| Q1: Nested per-package `.claude/skills/` | High | Medium (main session only) | **No** — dual-source problem not worth solving |
| Q2: Thin router skills with `references/` | Medium | High (simplifies everything) | **Yes** — validate that agents actually read references/ |
| Q3: Platform plugins | High | High (long-term) | **No** — spec not stable |
| Q4: Symlinks for kit devs | Low | Low (DX for 2-3 people) | **Maybe** — `--dev` flag, low priority |
| Q5a: Router skills | Medium | Medium | Same as Q2 |
| Q5d: Accept long list | Zero | N/A | **Yes** — it's the current state, already working |

### What Should Change in epost-kit CLI

**Short-term (0 effort)**:
- Nothing. Current copy-based init works. `paths:` + expanded `skills:` (already committed) handles the real problem.

**Medium-term (if Q2 prototype validates)**:
- Init generates router skills per platform from individual skills
- New build step: `build-router-skills` that creates `platform-{name}/SKILL.md` + `references/` from individual skills
- Package.yaml gets a `router: true` field or `bundle: [ios-development, ios-testing, ios-ui-lib]` field
- Agent definitions reference router skill names instead of individual skills

**Long-term (when plugin spec stabilizes)**:
- Each platform package includes `.claude-plugin/plugin.json`
- Init installs plugins instead of copying files
- Agent definitions use plugin-qualified skill names
- Kit can distribute platform plugins independently

### Features Requiring Unreleased Claude Code Capabilities

| Feature | Required Capability | Status |
|---------|-------------------|--------|
| Runtime skill injection at agent spawn | Dynamic `skills:` override in Agent tool | **Not available** |
| Subagent auto-discovery | `paths:` or directory scanning in subagent context | **Not available** |
| Plugin cross-references | Agent in root referencing skill in plugin by name | **Unspecified** |
| Per-directory skill scoping | Skill visible ONLY when in a specific directory | **Partial** — `paths:` approximates this |

---

## Concrete Recommendation: Highest Impact/Effort

### Do Now: Nothing New

The `paths:` + expanded `skills:` lists (committed in round 1) is the right answer for the current Claude Code capabilities. The 800-token overhead is acceptable. No CLI changes needed.

### Prototype Next: Thin Router Skills

**What**: Create one `platform-ios/SKILL.md` that summarizes iOS capabilities and points to `references/ios-development.md`, `references/ios-testing.md`, etc. Wire it to `epost-fullstack-developer` as a single `skills:` entry.

**Validation test**: Spawn fullstack-developer via Agent tool with a Swift task. Observe whether the agent reads the references/ files when relevant. If yes, router skills work. If no, the concept fails and we stay with flat lists.

**Effort**: ~2 hours for one platform. No CLI changes.

**Impact**: If validated, reduces agent skills: entries from 16 to 4, adds progressive disclosure, and creates the foundation for the eventual plugin migration.

### Watch: Plugin Spec

When Anthropic documents a stable plugin SDK with cross-plugin skill resolution, revisit Q3. The kit's package structure already maps 1:1 to the plugin structure — migration would be mechanical.

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Router skills' references/ not reliably consulted by agents | Medium | High — concept fails | Prototype with one platform, measure empirically |
| Claude Code changes `paths:` semantics | Low | Medium | `paths:` is official frontmatter; stable |
| Plugin spec changes break future migration | Medium | Low — we haven't built on it | Watching, not building |
| Long skills: list causes noticeable context overhead | Low | Low — 800 tokens | Measure if 6+ platforms are added |

---

## Assumptions Challenged

1. **"Nested discovery is a big win"** — Only for main sessions. Subagents ignore it entirely. The 80/20 of platform work happens in subagents.
2. **"Bundles reduce overhead"** — Thin routers are better. Bundles trade composability for convenience; routers preserve both.
3. **"Plugins are ready"** — The spec exists in source but is not stable. Building on it now means coupling to internal APIs.
4. **"Symlinks solve staleness"** — Only for kit developers (2-3 people). Target repos download from releases, no symlink target exists.
5. **"The skills: list is a scaling problem"** — At 4 platforms, 800 tokens total. Not a real problem yet. YAGNI.

---

## Unresolved Questions

1. Does Claude Code's Agent tool support ANY form of runtime skill override/addition at spawn time? (Would invalidate several conclusions if yes.)
2. When an agent reads `references/ios-development.md` via a router skill, is that content treated equivalently to preloaded skill body? Or is it weaker?
3. Will Anthropic publish a stable plugin SDK? Timeline?
4. For target monorepos with 10+ packages — does the flat `.claude/skills/` with 30+ skills cause discoverability problems for the model? (Too many descriptions to evaluate?)
5. Could `CLAUDE.md` per-package in target repos achieve similar scoping to nested `.claude/skills/` without the dual-source problem?
