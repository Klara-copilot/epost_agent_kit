---
type: brainstorm
agent: epost-brainstormer
title: "Platform Skill Auto-Loading Strategy: Nested Discovery vs paths: vs Orchestrator Injection"
verdict: ACTIONABLE
date: 2026-04-03
tags: [architecture, skills, auto-discovery, platform, monorepo]
---

## Problem Statement

Platform-specific skills (ios-development, web-frontend, backend-javaee, etc.) need to load based on editing context. Current mechanisms are fragmented: static `skills:` lists on agents, `paths:` on 3 testing skills, description-based model invocation, orchestrator prompt injection. Need a coherent strategy that works across main sessions AND subagent spawns in both epost_agent_kit (authoring repo) and target repos (consuming repos).

**Core tension**: Subagents have NO auto-discovery (proven in research report 260402-1138). Only `skills:` frontmatter works for subagents. But loading ALL platform skills on every agent wastes context budget.

---

## Approach Evaluation

### A. Per-Package Nested `.claude/skills/` Generation

**Mechanism**: `epost-kit init` generates `.claude/skills/` inside each detected platform package directory. Claude Code's native nested discovery loads these when editing files in that package.

| Dimension | Score | Notes |
|-----------|-------|-------|
| Reliability (main session) | 8/10 | Native Claude Code behavior, documented in ARCH-0004 |
| Reliability (subagent) | 2/10 | **FATAL**: Subagents don't auto-discover. Only `skills:` frontmatter works |
| Context efficiency | 9/10 | Only loads platform skills when editing that platform's files |
| Maintenance burden | 6/10 | Init must detect package→platform mapping; duplicate skill files across locations |
| Generalizability | 7/10 | Works for any monorepo with clear package boundaries; fails for flat repos |

**Second-order effects**:
- Skill files now live in 2+ locations (root `.claude/skills/` + per-package `.claude/skills/`). Which is authoritative? Divergence risk.
- `kit-verify` must check all nested locations.
- `skill-index.json` becomes multi-location or must aggregate.

**Verdict**: Solves main-session context efficiency beautifully but **completely fails for subagents**, which is 80%+ of platform work (agents spawned by orchestrator). Not viable alone.

---

### B. Platform Skill Bundles (Fat SKILL.md)

**Mechanism**: Single `ios-bundle/SKILL.md` that combines ios-development + ios-testing + ios-ui-lib + ios-a11y into one file. Agent loads one skill name, gets everything.

| Dimension | Score | Notes |
|-----------|-------|-------|
| Reliability (main session) | 7/10 | Works via `skills:` or model invocation |
| Reliability (subagent) | 8/10 | Single entry in `skills:` loads full platform context |
| Context efficiency | 3/10 | **BAD**: Loads ALL platform skills even when only testing is relevant |
| Maintenance burden | 8/10 | Single file to update per platform, but it gets huge (1000+ lines) |
| Generalizability | 9/10 | Works identically in any repo |

**Second-order effects**:
- Bundles become monolithic. Editing ios-testing means touching the 1000-line bundle.
- Violates KISS — composability lost.
- Context budget: a full platform bundle (~1500 tokens) loaded into every agent that might touch that platform = significant waste.

**Verdict**: Simplifies agent config but at severe context cost. Anti-pattern for a project that explicitly tracks context budget.

---

### C. Agent-Level `paths:` Frontmatter

**Mechanism**: Add `paths:` to agent definitions so agents only activate when matching files are in context.

| Dimension | Score | Notes |
|-----------|-------|-------|
| Reliability (main session) | ?/10 | **UNVERIFIED**: `paths:` is documented for skills, NOT for agents |
| Reliability (subagent) | 1/10 | Subagents are spawned explicitly by Agent tool, not activated by file patterns |
| Context efficiency | N/A | Agents aren't skills — they don't load incrementally |
| Maintenance burden | N/A | |
| Generalizability | N/A | |

**Fatal assumption**: `paths:` in agent frontmatter is not a documented Claude Code feature. Agents are explicit dispatch targets, not auto-loaded resources. This approach confuses the agent/skill distinction.

**Verdict**: **REJECT** — built on an unverified assumption. Agents are dispatched, not discovered by file pattern.

---

### D. Orchestrator Platform Injection (Current + Enhanced)

**Mechanism**: Orchestrator detects platform from file extensions/git diff/user hint, then injects relevant skill names/knowledge into the Agent tool prompt when spawning subagents.

| Dimension | Score | Notes |
|-----------|-------|-------|
| Reliability (main session) | 5/10 | Works when orchestrator routes; fails for direct inline execution |
| Reliability (subagent) | 7/10 | Explicit context passing = reliable when done consistently |
| Context efficiency | 8/10 | Only sends what's needed per task |
| Maintenance burden | 4/10 | Requires orchestrator to maintain platform→skill mapping; inconsistent today |
| Generalizability | 6/10 | Depends on CLAUDE.md routing table being correct per repo |

**Second-order effects**:
- Orchestrator becomes a bottleneck — every platform context decision flows through it.
- "Inject relevant skills at spawn time" already exists in rules but is inconsistently applied (proven by current state).
- Doesn't help when user bypasses orchestrator (direct `/cook`, direct agent call).

**Verdict**: Good for subagents but fragile. Human discipline required. Works as a SUPPLEMENT, not primary mechanism.

---

### E. Hook-Based Dynamic Skill Loading

**Mechanism**: `PreToolUse` hook detects file extensions in tool arguments, sets env var or injects platform context.

| Dimension | Score | Notes |
|-----------|-------|-------|
| Reliability (main session) | 3/10 | Hooks can inject text but cannot force skill loading |
| Reliability (subagent) | 2/10 | Hooks fire in subagents but can't modify skill preload (happens at startup) |
| Context efficiency | 7/10 | Would only trigger when relevant files appear |
| Maintenance burden | 5/10 | Hook code to maintain; extension→platform mapping in JS |
| Generalizability | 4/10 | Hook must be installed correctly in every target repo |

**Fatal constraint**: Hooks cannot inject skills into a running session. They can append to output or block tool calls, but the skill-loading mechanism is separate. There's no hook event for "skill loading time."

**Verdict**: **REJECT** — hooks operate at wrong layer. Cannot affect skill loading.

---

### F. Skill `paths:` + Description Trigger (Current Approach)

**Mechanism**: Each platform skill has `paths:` globs in frontmatter. Claude Code auto-loads the skill when matching files are in context. Model also reads description to decide relevance.

| Dimension | Score | Notes |
|-----------|-------|-------|
| Reliability (main session) | 8/10 | Native Claude Code behavior, well-documented |
| Reliability (subagent) | 2/10 | `paths:` is main-session auto-load only; subagents use `skills:` exclusively |
| Context efficiency | 9/10 | Only loads when relevant files match |
| Maintenance burden | 3/10 | Just add `paths:` glob to each SKILL.md frontmatter — minimal |
| Generalizability | 9/10 | Works in any repo where the skill files exist |

**Second-order effects**:
- Currently only on 3 testing skills. Extending to all ~20 platform skills is straightforward.
- `paths:` globs must be accurate — `**/*.swift` is broad (catches all Swift files); `**/*.kt` catches all Kotlin.
- Doesn't solve the subagent problem at all.

**Verdict**: Best mechanism for main-session auto-loading. Must be paired with something else for subagents.

---

## Scoring Summary

| Approach | Main Session | Subagent | Context Efficiency | Maintenance | Generalizability | **Total** |
|----------|-------------|----------|-------------------|-------------|------------------|-----------|
| A. Nested `.claude/skills/` | 8 | **2** | 9 | 6 | 7 | 32 |
| B. Fat bundles | 7 | 8 | **3** | 8 | 9 | 35 |
| C. Agent `paths:` | ? | **1** | N/A | N/A | N/A | **REJECT** |
| D. Orchestrator injection | 5 | 7 | 8 | 4 | 6 | 30 |
| E. Hook-based | 3 | **2** | 7 | 5 | 4 | **REJECT** |
| F. Skill `paths:` | 8 | **2** | 9 | 3 | 9 | 31 |

---

## Winning Combination: F + Tiered Agent Skills

No single approach works. The fundamental split is:
- **Main session**: `paths:` auto-loading works natively (F)
- **Subagents**: only explicit `skills:` works (proven research)

### Recommended Strategy: "paths: everywhere + platform-tiered agent skills:"

**Layer 1 — `paths:` on every platform skill (main session)**

Add `paths:` globs to ALL platform skills, not just 3 testing skills. This gives the main session perfect auto-loading with zero context waste.

```yaml
# ios-development/SKILL.md
paths: ["**/*.swift", "**/Package.swift", "**/*.xcodeproj/**"]

# web-frontend/SKILL.md  
paths: ["**/*.tsx", "**/*.jsx", "**/*.ts"]

# backend-javaee/SKILL.md
paths: ["**/*.java", "**/pom.xml", "**/persistence.xml"]

# android-development/SKILL.md
paths: ["**/*.kt", "**/build.gradle.kts", "**/AndroidManifest.xml"]
```

**Layer 2 — Platform-aware agent definitions (subagents)**

Instead of loading ALL skills on every agent, create platform-specific agent variants OR use a "platform skills tier" pattern:

**Option 2a — Platform agent variants** (rejected: agent proliferation)
```
epost-ios-developer, epost-android-developer, epost-web-developer...
```
Too many agents. Orchestrator routing becomes complex. YAGNI.

**Option 2b — Platform skill groups in agent `skills:` (RECOMMENDED)**

Define 4 platform skill groups as lightweight "skill group" SKILL.md files:

```yaml
# platform-ios-group/SKILL.md
---
name: platform-ios-group
description: "iOS platform skills bundle. Use when working on Swift/SwiftUI/UIKit code."
user-invocable: false
paths: ["**/*.swift"]
---
## Skills loaded
This is a platform skill group. When this skill loads, the following individual skills
should also be consulted:
- ios-development: Swift 6, SwiftUI/UIKit patterns, Xcode builds
- ios-testing: XCTest, XCUITest, Swift Testing
- ios-ui-lib: iOS theme components, design tokens
- ios-a11y: VoiceOver, UIKit/SwiftUI accessibility
```

But wait — this is just approach B (bundles) with less content. The actual content still lives in individual skill files. The group is a **pointer**, not a copy.

**Better Option 2c — Conditional `skills:` via orchestrator convention (SIMPLEST)**

Keep `epost-fullstack-developer` with `skills: [core, knowledge, cook, journal]` (no platform skills). The orchestrator appends platform skills to the Agent tool prompt as **file path references**:

```
Task: Implement login screen
Platform: ios
Read these skills for platform context:
- .claude/skills/ios-development/SKILL.md
- .claude/skills/ios-testing/SKILL.md
```

The subagent reads the files at runtime. Not preloaded, but file access works.

**Wait — this has a proven problem**: subagents reading skill files is NOT the same as skill preload. Preloaded skills get full content injected; read skills are just files the agent may or may not consult. Preload is far more reliable.

### Final Recommendation: F + Selective Agent Preload

**The honest answer**: There is no clever way around the subagent skill-preload constraint. The only reliable mechanism for subagents is `skills:` frontmatter.

**Practical approach**:

1. **Add `paths:` to all ~20 platform skills** — handles main session perfectly
2. **Keep agent `skills:` lists lean but platform-complete for primary agents**:
   - `epost-fullstack-developer`: `skills: [core, knowledge, cook, journal]` + whichever platform skills are relevant
   - Problem: agent definition is static, but platform varies per task
3. **Accept the tradeoff**: either load all platform skills (context cost ~3000 tokens) or maintain platform-specific agent variants

**Cost-benefit of "load all platforms"**:
- 4 platforms x ~3-4 skills each = ~16 platform skills
- Average skill description = ~50 tokens loaded at startup (not full body)
- Full body loads only when invoked = ~300-500 tokens per skill
- Total startup overhead: ~800 tokens for descriptions only
- This is ~2-3% of a 32K context window

**800 tokens for universal platform availability is cheap.** The context budget concern was overblown for skill *descriptions*. Full body only loads when needed.

---

## Concrete Implementation Spec

### 1. Add `paths:` to all platform skills

Files to modify (in `packages/`, not `.claude/`):

| Skill | `paths:` value |
|-------|---------------|
| `ios-development` | `["**/*.swift", "**/Package.swift", "**/*.xcodeproj/**"]` |
| `ios-testing` | Already done |
| `ios-ui-lib` | `["**/*.swift"]` |
| `ios-a11y` | `["**/*.swift"]` |
| `android-development` | `["**/*.kt", "**/build.gradle.kts", "**/AndroidManifest.xml"]` |
| `android-testing` | Already done |
| `android-ui-lib` | `["**/*.kt"]` |
| `android-a11y` | `["**/*.kt"]` |
| `backend-javaee` | `["**/*.java", "**/pom.xml", "**/persistence.xml"]` |
| `backend-testing` | Already done |
| `backend-databases` | `["**/*.java", "**/persistence.xml"]` |
| `web-frontend` | `["**/*.tsx", "**/*.jsx"]` |
| `web-nextjs` | `["**/next.config.*", "**/app/**/page.tsx", "**/app/**/layout.tsx"]` |
| `web-api-routes` | `["**/api/**/*.ts", "**/actions/**/*.ts"]` |
| `web-auth` | `["**/auth/**/*", "**/middleware.ts"]` |
| `web-i18n` | `["**/messages/**/*.json", "**/i18n.*"]` |
| `web-testing` | `["**/*.test.tsx", "**/*.test.ts", "**/*.spec.ts"]` |
| `web-modules` | `["**/modules/**/*.tsx"]` |
| `web-ui-lib` | `["**/klara-theme/**/*", "**/components/ui/**/*"]` |
| `web-a11y` | `["**/*.tsx", "**/*.jsx"]` |

### 2. Agent `skills:` — add platform skills to key agents

For `epost-fullstack-developer` and `epost-tester` (the agents that DO platform work):

```yaml
skills: [core, knowledge, cook, journal, ios-development, ios-testing, android-development, android-testing, backend-javaee, backend-testing, web-frontend, web-testing]
```

This adds ~12 skill descriptions (~600 tokens) to startup. Full content only loads when the agent invokes a skill. Acceptable cost.

For `epost-debugger`: add platform skills relevant to debugging:
```yaml
skills: [core, debug, knowledge, error-recovery, journal, ios-development, android-development, backend-javaee, web-frontend]
```

For read-only agents (reviewer, researcher): DON'T add platform skills. They don't need implementation patterns.

### 3. `epost-kit init` changes

- When generating `.claude/skills/` from packages, preserve `paths:` frontmatter (already works — frontmatter is copied verbatim)
- **No nested `.claude/skills/` generation needed** — `paths:` handles context-aware loading
- **No new CLI features needed** — this is purely SKILL.md frontmatter + agent frontmatter changes

### 4. CLAUDE.md template — no changes needed

The routing table already mentions platform detection. `paths:` works independently of CLAUDE.md.

### 5. For target repos (consuming repos)

When `epost-kit init` runs in a target repo:
- Platform skills get copied to `.claude/skills/` with their `paths:` globs
- Agent definitions get copied with platform skills in `skills:` list
- No repo-specific configuration needed — `paths:` globs are generic (`**/*.swift` works everywhere)

---

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| `paths:` globs too broad (`.tsx` loads web-frontend AND web-a11y AND web-testing) | High | Medium — extra context loaded | Accept: descriptions are cheap (~50 tokens each). Full body only on invoke. |
| Agent startup slower with 12 skills preloaded | Low | Low — descriptions only | Monitor context usage in practice |
| `paths:` behavior undocumented for subagents | High | High — might not work at all | Mitigated by explicit `skills:` on agents. `paths:` is bonus for main session only. |
| Future Claude Code changes to skill loading | Medium | Medium | `paths:` is official frontmatter; `skills:` is core mechanic. Both are stable. |

---

## Assumptions Needing Verification

1. **`paths:` in subagents**: Does `paths:` trigger auto-loading in subagent contexts, or only main session? Research report 260402 says "no auto-discovery in subagents" but doesn't specifically address `paths:`. Need empirical test.

2. **`paths:` firing on directory context**: Does `paths:` fire when the agent's working directory contains matching files, or only when specific files are opened/read? Need empirical test.

3. **Skill description token cost**: Actual measurement of ~20 platform skill descriptions loaded simultaneously. Estimate is ~800 tokens but should be verified.

4. **`paths:` glob performance**: With 20+ skills each having `paths:` globs, does Claude Code's skill resolution slow down? Likely negligible but unverified.

---

## Unresolved Questions

1. Should `web-a11y` and `web-frontend` have identical `paths:` globs? If both trigger on `**/*.tsx`, what's the user experience — both descriptions always visible?
2. Is there a mechanism to make `paths:` hierarchical (e.g., `web-frontend` loads first, `web-a11y` only loads when a11y keywords appear)?
3. For monorepos with mixed platforms in the same directory, does `paths:` correctly load multiple platform skill sets?
4. Should the nested `.claude/skills/` approach (A) be kept as a FUTURE option for large monorepos where context efficiency becomes critical, even though it doesn't help subagents?

---

## Decision

**Recommended**: Layer F (`paths:` on all platform skills) + expanded `skills:` lists on implementation agents.

**Rationale**: Simplest approach that works. `paths:` handles main-session auto-loading natively. Explicit `skills:` handles subagents reliably. ~800 tokens for universal platform descriptions is a cost we can afford. No new CLI features, no architectural changes, no new patterns to maintain.

**KISS score**: 9/10 — two existing, proven mechanisms combined. No new abstractions.

## Next Steps

1. Add `paths:` to all ~17 platform skills missing it (packages/ source)
2. Update `epost-fullstack-developer`, `epost-tester`, `epost-debugger` agent skills lists
3. Run `epost-kit init` to regenerate `.claude/`
4. Empirically test `paths:` behavior in subagent context
5. Measure actual token overhead of expanded `skills:` lists
