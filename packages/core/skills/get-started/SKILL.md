---
name: get-started
description: "(ePost) Onboard to a project — detect state, then orchestrate researcher → documenter → implementer pipeline"
user-invocable: true
context: fork
agent: epost-project-manager
metadata:
  argument-hint: "[project path or question]"
  keywords:
    - onboard
    - get-started
    - begin
    - new-project
    - what-is-this
    - existing-project
  agent-affinity:
    - epost-researcher
  platforms:
    - all
  connections:
    enhances: [docs-init, docs-update]
---

# Get Started

Full onboarding pipeline — detect project state, then dispatch researcher → documenter → implementer subagents in sequence.

## Arguments

- CONTEXT: $ARGUMENTS (optional — project path, specific question, or empty)

## Step 1 — Detect Documentation State

Gather signals (read-only, no file creation):

```
index_json = Glob("docs/index.json")
docs_files = Glob("docs/**/*.md")
readme = Glob("README*")
markers = Glob for: package.json, pom.xml, Package.swift, build.gradle.kts, Cargo.toml
```

Branch:
- `index_json` exists → Step 2a (has KB structure)
- `docs_files` not empty but no `index.json` → Step 2b (has flat docs)
- `docs_files` empty → Step 2c (no docs)

## Step 2a — Has Knowledge Base

Audit KB coverage and health:

1. **Read `docs/index.json`** — parse entries array
2. **Count by category**:
   | Category | Count | Example IDs |
   |----------|-------|-------------|
   | decisions (ADR) | N | ADR-0001, ... |
   | architecture (ARCH) | N | ... |
   | patterns (PATTERN) | N | ... |
   | conventions (CONV) | N | ... |
   | features (FEAT) | N | ... |
   | findings (FINDING) | N | ... |
3. **Check staleness** — for each entry, check if referenced files still exist via Glob/Grep. Flag issues:
   - `BROKEN` — entry references file that doesn't exist
   - `GAP` — major code areas (routes, modules, deps) with no doc coverage
4. **Read project markers** — extract tech stack, scripts
5. **Present** → Step 3

## Step 2b — Has Flat Docs

Read flat docs and suggest migration:

1. **Read each doc file** (first 50 lines) — write 1-2 line summary
2. **Read project markers** (README, package.json, configs) — extract tech stack, scripts
3. **Flag**: "Flat docs detected. Run `/docs-init --migrate` to convert to structured KB format (ADR/ARCH/PATTERN/CONV/FEAT/FINDING + index.json)"
4. **Present** → Step 3

## Step 2c — No Docs

Read project markers only (do NOT create files):

1. **Read** README, package.json/pom.xml/etc, tsconfig, Dockerfile — extract project name, tech stack, scripts, entry points
2. **Scan** directory structure (top 2 levels via `ls`)
3. **Present** → Step 3

## Step 3 — Present Insights

```markdown
## Project: {name}

**Tech Stack**: {framework} / {language} / {build tool}
**Key Commands**: `{dev}` | `{build}` | `{test}`

### Directory Structure
{top 2 levels}

### Entry Points
- {main files}

### Documentation Status
{one of:}
- "KB structure with N entries across M categories" + coverage table + any issues
- "Flat docs found (N files)" + list with summaries + migration suggestion
- "No docs/ directory found"
```

## Step 4 — Orchestrate Subagents

**CRITICAL: You MUST execute ALL 4 phases below in sequence. Do NOT stop after any phase to present "Next Steps" or ask the user what to do. Do NOT present choices. Run Phase 1 → Phase 2 → Phase 3 → Phase 4 automatically without pausing.**

Define shared report path before dispatching:
```
RESEARCH_REPORT = plans/reports/get-started-{YYYYMMDD}-research.md
```

Record the detected docs state from Step 2 as `DOCS_STATE`:
- `index.json` found → `"kb"`
- Flat docs found, no `index.json` → `"flat"`
- No docs → `"none"`

### Phase 1 — Research (epost-researcher)

Use the Agent tool to dispatch read-only codebase explorer:

```
Agent(
  subagent_type: "epost-researcher"
  description: "Research codebase for onboarding"
  prompt: """
  Explore the codebase at {CWD}. Read-only — do NOT create or edit files.

  Goals:
  1. Read README, package.json/pom.xml/Cargo.toml/Package.swift, Dockerfile, CI configs
  2. Scan top 3 directory levels (ls)
  3. Identify: tech stack, language, framework, key entry points, major modules
  4. Extract build + run commands (install, dev, build, test, start)
  5. Identify env requirements (.env.example, required secrets/vars)
  6. Note existing docs structure (docs/index.json, flat docs, or none)

  Write concise report to: {RESEARCH_REPORT}

  ## Tech Stack
  ## Entry Points
  ## Build & Run Commands
  ## Env Requirements
  ## Docs Status
  ## Key Findings (anything unusual or important)
  """
)
```
WAIT for Agent to complete, then READ {RESEARCH_REPORT}.
**Then immediately proceed to Phase 2 — do NOT stop here.**

### Phase 2 — Documentation (epost-docs-manager)

Use the Agent tool to dispatch docs agent with mode derived from DOCS_STATE:

```
Agent(
  subagent_type: "epost-docs-manager"
  description: "Generate/update KB docs"
  prompt: """
  Read the researcher report at: {RESEARCH_REPORT}

  Docs state: {DOCS_STATE}

  Based on docs state, apply the matching workflow:
  - DOCS_STATE = "none"  → run docs-init workflow: generate full KB structure in docs/ with index.json
  - DOCS_STATE = "flat"  → run docs-init --migrate workflow: convert flat docs to KB structure
  - DOCS_STATE = "kb"    → run docs-update --verify workflow: check all entries, flag STALE/BROKEN/GAP

  Apply templates from knowledge-base skill. Keep all files under 800 LOC.
  Update docs/index.json after all changes.
  """
)
```
WAIT for Agent to complete.
**Then immediately proceed to Phase 3 — do NOT stop here.**

### Phase 3 — Environment Setup & Run (epost-fullstack-developer)

Use the Agent tool to dispatch implementer to prepare the environment and get the project running.
The implementer should **actively install missing tools** — not just report them.

```
Agent(
  subagent_type: "epost-fullstack-developer"
  description: "Setup env, install deps, build, run project"
  prompt: """
  Read the researcher report at: {RESEARCH_REPORT}

  Your job: get this project running locally. Actively fix missing tools — don't just report them.

  ## Step 1 — Install missing tools
  Check what's missing and install via Homebrew (macOS) or the project's wrapper scripts:
  - If `mvn` not found but `./mvnw` exists → use `./mvnw` instead (no install needed)
  - If `mvn` not found and no wrapper → run `brew install maven`
  - If `node`/`npm` not found → run `brew install node`
  - If `java` not found → run `brew install openjdk@{version from pom.xml}`
  - If `docker` not found → note it but don't install (requires Docker Desktop)
  - If other tools missing → attempt `brew install {tool}`

  ## Step 2 — Install project dependencies
  - Node: `npm install` or `yarn` or `bun install`
  - Maven: `./mvnw dependency:resolve` or `mvn dependency:resolve`
  - Gradle: `./gradlew dependencies`
  - Swift: `swift package resolve`
  - Skip if deps already present (node_modules/, target/, .m2/)

  ## Step 3 — Environment variables
  - If `.env.example` exists but `.env` missing: copy `.env.example` to `.env`, list vars that need real values
  - If no `.env.example`: check docs/configs for required env vars, list them
  - Do NOT fill in real secrets — just ensure the file structure exists

  ## Step 4 — Build
  - Run the build command (mvn package, npm run build, ./gradlew build, etc.)
  - If build fails due to missing env/credentials (e.g., private registry auth), note the blocker clearly
  - Skip if project is a library with no build step

  ## Step 5 — Start
  - Run dev/start command if available
  - Confirm startup (look for "ready", "listening on port", etc.)
  - If can't start due to missing infra (DB, Docker, external service), note what's needed
  - Skip if no start command or project requires container orchestration

  ## Output
  For each step, report: what was done, what succeeded, what's blocked and why.
  Be specific about blockers — e.g., "needs GCP Artifact Registry auth for internal Maven deps" not just "build failed".
  """
)
```
WAIT for Agent to complete.
**Then immediately proceed to Phase 4 — do NOT stop here.**

### Phase 4 — Final Summary

Present a consolidated onboarding summary (this is the ONLY place you stop).
If the implementer reported blockers, include a **Setup Guide** with exact commands the user needs to run manually:

```markdown
## Onboarded: {project-name}

**Tech Stack**: {from researcher}
**Running**: {status from implementer — port, URL, or "not started"}

### What Was Done
- {tools installed, deps resolved, build status}

### Docs
{count} entries generated/updated in docs/index.json

### Setup Guide (if blockers remain)
Complete these steps to finish setup:

1. {e.g., "Install Docker Desktop: https://docker.com/products/docker-desktop"}
2. {e.g., "Authenticate to GCP Artifact Registry: `gcloud auth configure-docker europe-west6-docker.pkg.dev`"}
3. {e.g., "Set env vars in .env: JWT_SERVICE_HOST_PORT, LUZ_DOCS_VIEW_CONTROLLER_HOST_PORT"}
4. {e.g., "Build: `./mvnw clean package`"}
5. {e.g., "Run: `docker-compose up`"}

### Next Steps
- `/{cook|fix|plan}` to start coding
```

## Rules

- **MUST run all 4 phases** — do NOT stop, present choices, or ask user between phases
- **Fast detection** — Steps 1–3 are lightweight scan only, < 15s
- **Sequential dispatch** — use Agent tool for each phase, wait for completion before next
- **Shared report** — researcher writes to `plans/reports/`, other agents read from it
- Only stop early if the user has a specific question (answer from what was read, suggest `/scout` for deeper exploration)
