# Command Simplification Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reduce 51 commands to 38 by replacing platform-prefixed commands with auto-detecting verbs, absorbing fix variants, and embedding smart routing into CLAUDE.md.

**Architecture:** New unified verb commands (`/cook`, `/test`, `/debug`, `/fix`, `/plan`, `/bootstrap`) auto-detect platform from git state and delegate to the correct platform agent. CLAUDE.md gets a Smart Routing section so every prompt auto-routes without `/epost`. Platform-prefixed commands are deleted — their content is absorbed into the unified verbs.

**Tech Stack:** Markdown command files, YAML package manifests, Claude Code conventions.

---

## Phase 1: Create Unified Verb Commands in Core

### Task 1: Create `/cook` command

**Files:**
- Create: `packages/core/commands/cook.md`

**Step 1: Write the command file**

```markdown
---
title: Cook
description: (ePost) Implement features — auto-detects platform
agent: epost-implementer
argument-hint: [feature description or plan file]
---

# Cook — Unified Implementation Command

Implement features with automatic platform detection.

## Platform Detection

1. Check `$ARGUMENTS` for explicit platform hint:
   - Starts with "ios", "android", "web", "backend" → use that platform
2. If no hint, detect from changed files:
   - `git diff --cached --name-only` + `git diff --name-only`
   - `.tsx/.ts/.jsx/.js/.scss/.css` → web → delegate to epost-web-developer
   - `.swift` → ios → delegate to epost-ios-developer
   - `.kt/.kts` → android → delegate to epost-android-developer
   - `.java` → backend → delegate to epost-backend-developer
3. If mixed platforms → delegate to epost-orchestrator
4. If no changed files → check CWD path for platform signals
5. If still unknown → ask user (max 1 question)

## Complexity → Variant

- Single file or clear task → fast (skip plan question)
- Multi-file, one module → fast
- Multi-module or unknowns → parallel
- Has existing plan in ./plans/ → follow plan

## Execution

Route to the detected platform agent with feature description and platform context.

<feature>$ARGUMENTS</feature>

**IMPORTANT:** Analyze the skills catalog and activate the skills needed for the detected platform.
```

**Step 2: Verify file exists**

Run: `cat packages/core/commands/cook.md | head -3`
Expected: frontmatter with `title: Cook`

---

### Task 2: Create `/test` command

**Files:**
- Create: `packages/core/commands/test.md`

**Step 1: Write the command file**

```markdown
---
title: Test
description: (ePost) Run tests — auto-detects platform
agent: epost-tester
argument-hint: [--unit | --ui | --coverage | test description]
---

# Test — Unified Test Command

Run tests with automatic platform detection.

## Platform Detection

1. Check `$ARGUMENTS` for explicit platform hint (ios, android, web, backend)
2. If no hint, detect from changed files:
   - `.tsx/.ts/.jsx/.js` → web: Jest + RTL + Playwright (`npm test`, `npx playwright test`)
   - `.swift` → ios: XCTest via XcodeBuildMCP or xcodebuild
   - `.kt/.kts` → android: Gradle JUnit/Espresso (`./gradlew test`, `./gradlew connectedAndroidTest`)
   - `.java` → backend: Maven JUnit (`mvn test`)
3. If mixed → delegate to epost-orchestrator
4. If no files → ask user

## Arguments

- `--unit` — unit tests only
- `--ui` — UI/E2E tests only
- `--coverage` — include coverage report
- Test target name — run specific target

## Execution

1. Detect platform
2. Route to platform-specific agent
3. Run appropriate test commands
4. Report results with pass/fail counts and coverage

<request>$ARGUMENTS</request>

**IMPORTANT:** Analyze the skills catalog and activate needed skills for the detected platform.
```

---

### Task 3: Create `/debug` command

**Files:**
- Create: `packages/core/commands/debug.md`

**Step 1: Write the command file**

```markdown
---
title: Debug
description: (ePost) Debug issues — auto-detects platform
agent: epost-debugger
argument-hint: [issue description or error log]
---

# Debug — Unified Debug Command

Debug platform-specific issues with automatic platform detection.

## Platform Detection

1. Check `$ARGUMENTS` for explicit platform hint
2. If no hint, detect from changed files or error context:
   - `.tsx/.ts/.jsx/.js` → web: Next.js, React, TypeScript, Docker debugging
   - `.swift` → ios: crashes, concurrency, SwiftUI state, log capture via MCP
   - `.kt/.kts` → android: crashes, Compose, Hilt injection, performance
   - `.java` → backend: Java EE, WildFly, JPA/Hibernate, REST API
3. If mixed → delegate to epost-orchestrator
4. If no files → infer from error message keywords

## Execution

1. Detect platform
2. Route to platform-specific agent (read-only investigation tools preferred)
3. Analyze error context, gather logs, identify root cause
4. Explain root cause and suggest fix (do NOT auto-apply fix — that's `/fix`)

<issue>$ARGUMENTS</issue>

**IMPORTANT:** Analyze the skills catalog and activate needed skills for the detected platform.
```

---

### Task 4: Create `/fix` command (absorbs fast/test/types/logs)

**Files:**
- Create: `packages/core/commands/fix.md`

**Step 1: Write the command file**

```markdown
---
title: Fix
description: (ePost) Fix issues — auto-detects error type and platform
agent: epost-debugger
argument-hint: [issue description]
---

# Fix — Unified Fix Command

Fix issues with automatic error type detection. Absorbs `:fast`, `:test`, `:types`, `:logs` into one auto-detecting command.

## Error Type Auto-Detection

Before fixing, detect the error type from context:

### 1. TypeScript Errors (was `/fix:types`)
**Detection:** Web platform detected AND `tsconfig.json` exists
**Action:** Run `tsc --noEmit` → fix all type errors → repeat until clean (zero errors)
**Rules:** NEVER use `any` type. Use proper narrowing, generics, utility types. No `@ts-ignore`.

### 2. Test Failures (was `/fix:test`)
**Detection:** User mentions "test" OR recent test runner output shows "FAIL"/"ERROR"
**Action:** Run test suite → analyze failures → fix production code (not tests) → re-run until green
**Rules:** Do NOT comment out or skip tests. Do NOT change assertions. Fix root causes.

### 3. Log-Based (was `/fix:logs`)
**Detection:** User provides log file path OR `./logs.txt` exists
**Action:** Read log file → grep errors (last 30 lines) → locate in codebase → fix → verify logs clean
**Rules:** Fix ALL logged errors, not just the first one. Set up log piping if missing.

### 4. Quick Fix (was `/fix:fast` — default)
**Detection:** None of the above matched
**Action:** Quick diagnosis → minimal correct change → verify (typecheck, tests, build) → add regression test
**Rules:** Fix root causes, not symptoms. Keep changes minimal.

## Platform Detection

Same as `/cook` — detect from changed files or `$ARGUMENTS` platform hint.

## Explicit Overrides

For cases where auto-detection isn't enough, users can still use:
- `/fix:deep` — full systematic investigation with documentation
- `/fix:ci` — CI pipeline debugging (reads CI logs, reproduces locally)
- `/fix:ui` — visual/layout issues (CSS, a11y check, cross-browser)
- `/fix:a11y` — accessibility findings from `.epost-data/a11y/known-findings.json`

<issue>$ARGUMENTS</issue>

**IMPORTANT:** Analyze the skills catalog and activate needed skills.
```

---

### Task 5: Create `/plan` command

**Files:**
- Create: `packages/core/commands/plan.md`

**Step 1: Write the command file**

```markdown
---
title: Plan
description: (ePost) Create implementation plan — auto-detects complexity
agent: epost-architect
argument-hint: [feature or task description]
---

# Plan — Unified Planning Command

Create implementation plans with automatic complexity detection.

## Complexity Auto-Detection

1. **Simple** (1 module, clear scope, < 5 files) → delegate to `/plan:fast`
2. **Moderate** (multiple files, some research needed) → delegate to `/plan:deep`
3. **Complex** (multi-module, cross-platform, needs dependency mapping) → delegate to `/plan:parallel`

## Heuristics

- Single sentence request → `:fast`
- Request mentions "research" or "investigate" → `:deep`
- Request mentions multiple platforms or modules → `:parallel`
- Request mentions "dependencies" or "phases" → `:parallel`
- If unsure → default to `:fast`, escalate if needed

<request>$ARGUMENTS</request>

**IMPORTANT:** Analyze the skills catalog and activate needed skills.
```

---

### Task 6: Create `/bootstrap` command (absorbs `/web:new-module`)

**Files:**
- Create: `packages/core/commands/bootstrap.md`

**Step 1: Write the command file**

```markdown
---
title: Bootstrap
description: (ePost) Scaffold new projects or modules — auto-detects scope
agent: epost-implementer
argument-hint: [project or module description]
---

# Bootstrap — Unified Scaffolding Command

Scaffold new projects or modules with automatic scope detection.

## Scope Auto-Detection

### New Module (within existing project)
**Detection:** CWD is inside an existing project (has `package.json`, `build.gradle`, etc.) AND request describes a module/feature
**Action:** Scaffold module structure:
- For web B2B: Create knowledge file from `domain-b2b/references/module-template.md`, scout existing files, populate knowledge, update module index
- For other platforms: Create appropriate directory structure and boilerplate

### New Project (greenfield)
**Detection:** No existing project structure detected OR request says "new project/app"
**Action:** Full project bootstrap:
1. Git init (main branch)
2. Research tech stack (epost-researcher, max 5 sources)
3. Create implementation plan (epost-architect)
4. Design guidelines if UI project (epost-muji)
5. Implement step by step (linear, sequential)
6. Run tests (epost-tester), fix failures (epost-debugger)
7. Code review (epost-reviewer), iterate until clean
8. Create docs (README.md, project-overview-pdr.md)
9. Git commit (DO NOT push)

## Complexity → Variant

- Single-module project → `:fast` (linear)
- Multi-module project → `:parallel` (concurrent)

<request>$ARGUMENTS</request>

**IMPORTANT:** Analyze the skills catalog and activate needed skills.
```

---

### Task 7: Promote `/convert` and `/simulator` to core

**Files:**
- Create: `packages/core/commands/convert.md` (copy from `packages/platform-web/commands/convert.md`, update frontmatter)
- Create: `packages/core/commands/simulator.md` (copy from `packages/platform-ios/commands/simulator.md`, update frontmatter)

**Step 1: Copy convert command to core**

Copy `packages/platform-web/commands/convert.md` → `packages/core/commands/convert.md`
Update frontmatter: remove `slug: web:convert`, keep `agent: epost-web-developer`

**Step 2: Copy simulator command to core**

Copy `packages/platform-ios/commands/simulator.md` → `packages/core/commands/simulator.md`
Keep `agent: epost-ios-developer` and all MCP tool references

**Step 3: Verify**

Run: `ls packages/core/commands/convert.md packages/core/commands/simulator.md`
Expected: both files exist

---

### Task 8: Commit Phase 1

```bash
git add packages/core/commands/cook.md packages/core/commands/test.md packages/core/commands/debug.md packages/core/commands/fix.md packages/core/commands/plan.md packages/core/commands/bootstrap.md packages/core/commands/convert.md packages/core/commands/simulator.md
git commit -m "feat: add unified verb commands (cook, test, debug, fix, plan, bootstrap, convert, simulator)"
```

---

## Phase 2: Delete Platform-Prefixed Commands

### Task 9: Delete web platform commands

**Files:**
- Delete: `packages/platform-web/commands/cook.md`
- Delete: `packages/platform-web/commands/test.md`
- Delete: `packages/platform-web/commands/debug.md`
- Delete: `packages/platform-web/commands/convert.md`
- Delete: `packages/platform-web/commands/new-module.md`

**Step 1: Delete files**

```bash
rm packages/platform-web/commands/cook.md packages/platform-web/commands/test.md packages/platform-web/commands/debug.md packages/platform-web/commands/convert.md packages/platform-web/commands/new-module.md
```

**Step 2: Verify commands directory is empty**

```bash
ls packages/platform-web/commands/
```
Expected: empty or no directory

---

### Task 10: Delete iOS platform commands

**Files:**
- Delete: `packages/platform-ios/commands/cook.md`
- Delete: `packages/platform-ios/commands/test.md`
- Delete: `packages/platform-ios/commands/debug.md`
- Delete: `packages/platform-ios/commands/simulator.md`

**Step 1: Delete files**

```bash
rm packages/platform-ios/commands/cook.md packages/platform-ios/commands/test.md packages/platform-ios/commands/debug.md packages/platform-ios/commands/simulator.md
```

---

### Task 11: Delete Android platform commands

**Files:**
- Delete: `packages/platform-android/commands/cook.md`
- Delete: `packages/platform-android/commands/test.md`
- Delete: `packages/platform-android/commands/debug.md`

**Step 1: Delete files**

```bash
rm packages/platform-android/commands/cook.md packages/platform-android/commands/test.md packages/platform-android/commands/debug.md
```

---

### Task 12: Delete Backend platform commands

**Files:**
- Delete: `packages/platform-backend/commands/cook.md`
- Delete: `packages/platform-backend/commands/test.md`
- Delete: `packages/platform-backend/commands/debug.md`

**Step 1: Delete files**

```bash
rm packages/platform-backend/commands/cook.md packages/platform-backend/commands/test.md packages/platform-backend/commands/debug.md
```

---

### Task 13: Commit Phase 2

```bash
git add -A packages/platform-web/commands/ packages/platform-ios/commands/ packages/platform-android/commands/ packages/platform-backend/commands/
git commit -m "feat: remove platform-prefixed commands (replaced by unified verbs)"
```

---

## Phase 3: Delete Absorbed Fix Variants + Merge add-command

### Task 14: Delete absorbed fix variants from core

**Files:**
- Delete: `packages/core/commands/fix/fast.md`
- Delete: `packages/core/commands/fix/test.md`
- Delete: `packages/core/commands/fix/types.md`
- Delete: `packages/core/commands/fix/logs.md`

**Step 1: Delete files**

```bash
rm packages/core/commands/fix/fast.md packages/core/commands/fix/test.md packages/core/commands/fix/types.md packages/core/commands/fix/logs.md
```

**Step 2: Verify remaining fix variants**

```bash
ls packages/core/commands/fix/
```
Expected: `ci.md  deep.md  ui.md` (3 files remain)
Note: `fix/a11y.md` lives in `packages/a11y/commands/fix/a11y.md` (separate package)

---

### Task 15: Delete `/add-command:simple` and `/add-command:splash`, update `/kit:add-command`

**Files:**
- Delete: `packages/kit/commands/add-command/simple.md`
- Delete: `packages/kit/commands/add-command/splash.md`
- Modify: `packages/kit/commands/kit/add-command.md`

**Step 1: Delete variant files**

```bash
rm packages/kit/commands/add-command/simple.md packages/kit/commands/add-command/splash.md
rmdir packages/kit/commands/add-command 2>/dev/null
```

**Step 2: Update `/kit:add-command` to inline simple/splash detection**

Read current file, then replace the delegation workflow with inline auto-detection:
- Remove references to `delegate to /add-command:splash` and `delegate to /add-command:simple`
- Add: "If `$ARGUMENTS` contains 'splash' or user wants variants → generate splash structure. Otherwise → generate simple command."

---

### Task 16: Rename `/audit:a11y-close` → `/audit-close:a11y`

**Files:**
- Create: `packages/a11y/commands/audit-close/a11y.md` (copy content from `audit/a11y-close.md`)
- Delete: `packages/a11y/commands/audit/a11y-close.md`

**Step 1: Create new directory and copy**

```bash
mkdir -p packages/a11y/commands/audit-close
cp packages/a11y/commands/audit/a11y-close.md packages/a11y/commands/audit-close/a11y.md
rm packages/a11y/commands/audit/a11y-close.md
```

---

### Task 17: Commit Phase 3

```bash
git add -A packages/core/commands/fix/ packages/kit/commands/ packages/a11y/commands/
git commit -m "feat: absorb fix variants into /fix, merge add-command into kit:add-command, rename audit-close"
```

---

## Phase 4: Update Package Manifests

### Task 18: Update `packages/core/package.yaml`

**Files:**
- Modify: `packages/core/package.yaml`

**Changes to `provides.commands`:**
- Add: `cook`, `test`, `debug`, `fix`, `plan`, `bootstrap`, `convert`, `simulator`
- Remove: `fix/fast`, `fix/test`, `fix/types`, `fix/logs`

The final commands list should be:
```yaml
  commands:
    - epost
    - cook
    - cook/fast
    - cook/parallel
    - test
    - debug
    - fix
    - fix/deep
    - fix/ci
    - fix/ui
    - plan
    - plan/fast
    - plan/deep
    - plan/parallel
    - plan/validate
    - bootstrap
    - bootstrap/fast
    - bootstrap/parallel
    - convert
    - simulator
    - docs/init
    - docs/update
    - docs/component
    - git/commit
    - git/pr
    - git/push
    - review/code
```

---

### Task 19: Update `packages/platform-web/package.yaml`

**Files:**
- Modify: `packages/platform-web/package.yaml`

**Changes:** Remove all commands from `provides.commands` (all moved to core or deleted).
Remove the `commands/: commands/web/` line from `files:`.

```yaml
provides:
  agents:
    - epost-web-developer
  skills:
    - web-nextjs
    - web-frontend
    - web-api-routes
    - web-modules
    - web-prototype
    - web-rag
  # commands: removed — all moved to core unified verbs
```

---

### Task 20: Update `packages/platform-ios/package.yaml`

**Files:**
- Modify: `packages/platform-ios/package.yaml`

**Changes:** Remove all commands from `provides.commands` and `commands/: commands/ios/` from `files:`.

---

### Task 21: Update `packages/platform-android/package.yaml`

**Files:**
- Modify: `packages/platform-android/package.yaml`

**Changes:** Remove all commands from `provides.commands` and `commands/: commands/android/` from `files:`.

---

### Task 22: Update `packages/platform-backend/package.yaml`

**Files:**
- Modify: `packages/platform-backend/package.yaml`

**Changes:** Remove all commands from `provides.commands` and `commands/: commands/backend/` from `files:`.

---

### Task 23: Update `packages/a11y/package.yaml`

**Files:**
- Modify: `packages/a11y/package.yaml`

**Changes:** Rename `audit/a11y-close` → `audit-close/a11y` in `provides.commands`.

```yaml
  commands:
    - audit/a11y
    - audit-close/a11y    # was: audit/a11y-close
    - fix/a11y
    - review/a11y
```

---

### Task 24: Update `packages/kit/package.yaml`

**Files:**
- Modify: `packages/kit/package.yaml`

**Changes:** Remove `add-command/simple` and `add-command/splash` from `provides.commands`.

```yaml
  commands:
    - kit/add-agent
    - kit/add-skill
    - kit/add-command
    - kit/add-hook
    - kit/optimize-skill
    # add-command/simple — removed (merged into kit/add-command)
    # add-command/splash — removed (merged into kit/add-command)
    - cli/cook
    - cli/doctor
    - cli/test
```

---

### Task 25: Commit Phase 4

```bash
git add packages/core/package.yaml packages/platform-web/package.yaml packages/platform-ios/package.yaml packages/platform-android/package.yaml packages/platform-backend/package.yaml packages/a11y/package.yaml packages/kit/package.yaml
git commit -m "feat: update package manifests for command simplification"
```

---

## Phase 5: CLAUDE.md Auto-Routing + Snippet Updates

### Task 26: Create `packages/core/CLAUDE.snippet.md`

**Files:**
- Create: `packages/core/CLAUDE.snippet.md`

**Step 1: Write the Smart Routing section**

```markdown
## Smart Routing

On every user prompt involving a dev task, sense context before acting:
1. Check git state (branch, staged/unstaged files)
2. Detect platform from changed file extensions (`.tsx`→web, `.swift`→ios, `.kt`→android, `.java`→backend)
3. Check for active plans in `./plans/`
4. Route to best-fit command based on intent + context

**This applies to every prompt — not just `/epost` invocations.**

### Prompt Classification
- **Dev task** (action verbs: cook, fix, plan, test, debug, etc.) → route via intent map below
- **Kit question** ("which agent", "list commands", "our conventions") → route to `epost-guide`
- **External tech question** ("how does React...", "what is gRPC") → route to `epost-researcher`
- **Conversational** (greetings, opinions, clarifications) → respond directly, no routing

### Intent → Command Map

| Intent | Signal Words | Routes To |
|--------|-------------|-----------|
| Build | cook, implement, build, create, add, make, continue | `/cook` |
| Fix | fix, broken, error, crash, failing, what's wrong | `/fix` |
| Plan | plan, design, architect, spec, roadmap | `/plan` |
| Test | test, coverage, validate, verify | `/test` |
| Debug | debug, trace, inspect, diagnose | `/debug` |
| Review | review, check code, audit | `/review:code` |
| Git | commit, push, pr, merge, done, ship | `/git:commit`, `/git:push`, `/git:pr` |
| Docs | docs, document, write docs | `/docs:init` or `/docs:update` |
| Scaffold | bootstrap, init, scaffold, new project, new module | `/bootstrap` |
| Convert | convert, prototype, migrate | `/convert` |
| A11y | a11y, accessibility, wcag | `/fix:a11y` or `/review:a11y` |

### Context Boost Rules
- TypeScript/build errors detected → always route to `/fix` first
- Staged files present → boost Git or Review intent
- Active plan file exists → boost Build intent ("continue" → `/cook`)
- Merge conflicts → suggest fix/resolve
- Feature branch with no changes → boost Plan or Build

### Rules
- If user types a slash command explicitly → execute it directly, skip routing
- If ambiguous → use context boost to break tie; if still ambiguous → ask user (max 1 question)
- If multi-intent ("plan and build X") → delegate to `epost-orchestrator`
```

---

### Task 27: Update platform CLAUDE.snippet.md files

**Files:**
- Modify: `packages/platform-web/CLAUDE.snippet.md`
- Modify: `packages/platform-ios/CLAUDE.snippet.md`
- Modify: `packages/platform-android/CLAUDE.snippet.md`
- Modify: `packages/platform-backend/CLAUDE.snippet.md`

**Changes for each:** Remove command references to deleted platform-prefixed commands. Update to reference unified verbs.

Example for web:
```markdown
## Web Platform

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- ... (unchanged)

### Commands
- `/cook` — Implement features (auto-detects web from `.tsx`/`.ts` files)
- `/test` — Run tests (auto-detects web: Jest, Playwright, RTL)

### Agent
- `epost-web-developer` — Web platform specialist for Next.js development
```

---

### Task 28: Update `/epost` hub command

**Files:**
- Modify: `packages/core/commands/epost.md`

**Changes:**
- Replace platform prefix routing table with unified verb references
- Update discovery menu to show `/cook`, `/test`, `/fix`, `/debug`, `/plan`, `/bootstrap`
- Remove the "Platform Commands" grid (no longer exists)
- Update Smart Hub v2 routing to reference unified verbs

---

### Task 29: Commit Phase 5

```bash
git add packages/core/CLAUDE.snippet.md packages/platform-web/CLAUDE.snippet.md packages/platform-ios/CLAUDE.snippet.md packages/platform-android/CLAUDE.snippet.md packages/platform-backend/CLAUDE.snippet.md packages/core/commands/epost.md
git commit -m "feat: add Smart Routing to CLAUDE.md, update snippets and hub for unified verbs"
```

---

## Phase 6: Final Verification

### Task 30: Verify command counts and coverage

**Step 1: Count all command files across all packages**

```bash
find packages -name "*.md" -path "*/commands/*" | wc -l
```
Expected: ~38 files

**Step 2: Verify no orphaned references**

```bash
grep -r "web:cook\|ios:cook\|android:cook\|backend:cook\|web:test\|ios:test\|web:debug\|ios:debug" packages/ --include="*.yaml" --include="*.md" -l
```
Expected: no matches (all old references cleaned up)

**Step 3: Verify package.yaml provides counts**

For each package, verify the `provides.commands` list matches actual files in `commands/` directory.

**Step 4: Final commit if any fixes needed**

```bash
git add -A
git commit -m "chore: clean up remaining references to deleted commands"
```
