# Phase 01: Generalize get-started SKILL.md

## Context Links
- Parent plan: [plan.md](./plan.md)
- Source file: `packages/core/skills/get-started/SKILL.md`

## Overview
**Date**: 2026-03-04
**Priority**: P1
**Description**: Replace all Java/Maven/epost-specific hardcoded examples with generic, detect-from-markers patterns
**Implementation Status**: Pending

## Key Insights
- Phase 1 (Research) and Phase 2 (Docs) are already generic -- they reference multiple project markers
- Phase 3 (Environment Setup) is the main offender -- 90% of the Java bias lives here
- Phase 4 (Final Summary) has minor bias in Setup Guide examples
- The fix pattern: replace hardcoded tool/command lists with "detect project type -> apply matching commands" tables

## Requirements
### Functional
- Phase 3 Step 1 (Install tools): generic detection table, not Java-first if/else chain
- Phase 3 Step 2 (Install deps): detect package manager from markers, not hardcoded priority
- Phase 3 Step 3 (Env vars): generic -- no epost-specific var names
- Phase 3 Step 4 (Build): detect build command from project config
- Phase 3 Step 5 (Start): detect start command from project config
- Phase 4 examples: diverse project types in Setup Guide template

### Non-Functional
- Keep skill under 300 lines
- Maintain same structure (Steps 1-5 in Phase 3)

## Architecture
No structural change. Same 4-phase pipeline. Only the subagent prompt text changes.

## Related Code Files
### Modify (EXCLUSIVE)
- `packages/core/skills/get-started/SKILL.md` - Generalize Phase 3 and Phase 4 examples [OWNED]

### Read-Only
- `.claude/skills/get-started/SKILL.md` - Verify after regeneration

## Implementation Steps

### 1. Rewrite Phase 3 Step 1 (Install missing tools)

Replace the Java-first if/else chain with a detection table approach:

```markdown
## Step 1 -- Install missing tools
Detect required tools from project markers and install via Homebrew (macOS) or project wrapper scripts:

| Marker Found | Tool Needed | Install |
|-------------|------------|---------|
| `pom.xml` | Java + Maven | Use `./mvnw` if exists, else `brew install maven` |
| `build.gradle.kts` / `build.gradle` | Java + Gradle | Use `./gradlew` if exists, else `brew install gradle` |
| `package.json` | Node.js | `brew install node` (includes npm) |
| `Package.swift` | Swift | Xcode CLT (skip install -- assume present on macOS) |
| `Cargo.toml` | Rust | `brew install rust` or note rustup |
| `requirements.txt` / `pyproject.toml` | Python | `brew install python` |
| `go.mod` | Go | `brew install go` |
| `Gemfile` | Ruby | `brew install ruby` |
| `Dockerfile` | Docker | Note: requires Docker Desktop (don't auto-install) |

Check wrappers first (mvnw, gradlew, etc.) -- prefer project wrappers over global installs.
```

### 2. Rewrite Phase 3 Step 2 (Install deps)

Replace hardcoded command list with detection logic:

```markdown
## Step 2 -- Install project dependencies
Detect package manager from lockfiles/manifests and run appropriate install:

| Indicator | Command |
|-----------|---------|
| `package-lock.json` | `npm install` |
| `yarn.lock` | `yarn install` |
| `bun.lockb` | `bun install` |
| `pnpm-lock.yaml` | `pnpm install` |
| `pom.xml` | `./mvnw dependency:resolve` or `mvn dependency:resolve` |
| `build.gradle*` | `./gradlew dependencies` |
| `Package.swift` | `swift package resolve` |
| `Cargo.toml` | `cargo fetch` |
| `requirements.txt` | `pip install -r requirements.txt` |
| `pyproject.toml` | `pip install -e .` or `poetry install` |
| `go.mod` | `go mod download` |
| `Gemfile` | `bundle install` |

Skip if deps already present (node_modules/, target/, .build/, vendor/).
```

### 3. Rewrite Phase 3 Step 3 (Env vars)

Remove epost-specific var names:

```markdown
## Step 3 -- Environment variables
- If `.env.example` exists but `.env` missing: copy `.env.example` to `.env`, list vars that need real values
- If no `.env.example`: check docs/configs for required env vars, list them
- Do NOT fill in real secrets -- just ensure the file structure exists
```

(This step is already mostly generic -- just remove any hardcoded var name examples)

### 4. Rewrite Phase 3 Step 4 (Build)

Make generic:

```markdown
## Step 4 -- Build
Detect and run the build command:

| Indicator | Build Command |
|-----------|--------------|
| `package.json` with `build` script | `npm run build` |
| `pom.xml` | `./mvnw package` or `mvn package` |
| `build.gradle*` | `./gradlew build` |
| `Cargo.toml` | `cargo build` |
| `Makefile` | `make` |
| `Package.swift` | `swift build` |
| `go.mod` | `go build ./...` |

If build fails due to missing env/credentials (e.g., private registry auth), note the blocker clearly.
Skip if project is a library with no build step.
```

### 5. Rewrite Phase 3 Step 5 (Start)

Make generic:

```markdown
## Step 5 -- Start
Detect and run the dev/start command:

| Indicator | Start Command |
|-----------|--------------|
| `package.json` with `dev`/`start` script | `npm run dev` or `npm start` |
| `docker-compose.yml` | `docker-compose up` |
| `Procfile` | `foreman start` or `heroku local` |
| `Makefile` with `run`/`serve` target | `make run` |
| `manage.py` (Django) | `python manage.py runserver` |
| `main.go` | `go run .` |

Confirm startup (look for "ready", "listening on port", etc.).
If can't start due to missing infra (DB, Docker, external service), note what's needed.
Skip if no start command or project requires container orchestration.
```

### 6. Rewrite Phase 4 Setup Guide examples

Replace Java/epost examples with generic diverse ones:

```markdown
### Setup Guide (if blockers remain)
Complete these steps to finish setup:

1. {e.g., "Install Docker Desktop: https://docker.com/products/docker-desktop"}
2. {e.g., "Set DATABASE_URL in .env to your local PostgreSQL connection string"}
3. {e.g., "Run migrations: `npx prisma migrate dev` / `./mvnw flyway:migrate` / `python manage.py migrate`"}
4. {e.g., "Build: `npm run build` / `cargo build` / `./gradlew build`"}
5. {e.g., "Run: `npm run dev` / `docker-compose up` / `cargo run`"}
```

### 7. Regenerate .claude/ from packages/

After editing `packages/core/skills/get-started/SKILL.md`, run `epost-kit init` to regenerate `.claude/skills/get-started/SKILL.md`.

## Todo List
- [ ] Rewrite Phase 3 Step 1 (tool detection table)
- [ ] Rewrite Phase 3 Step 2 (dep install detection table)
- [ ] Clean Phase 3 Step 3 (remove any hardcoded var names)
- [ ] Rewrite Phase 3 Step 4 (build detection table)
- [ ] Rewrite Phase 3 Step 5 (start detection table)
- [ ] Rewrite Phase 4 Setup Guide examples (diverse)
- [ ] Run epost-kit init to regenerate .claude/
- [ ] Verify regenerated file matches

## Success Criteria
- No Java/Maven appears more prominently than any other ecosystem
- No epost-specific env vars or infra references
- All examples show 3+ project types
- Skill stays under 300 lines

## Risk Assessment
**Risks**: None significant -- text-only changes, no logic change
**Mitigation**: N/A

## Security Considerations
- No change to permission model
- Phase 3 still defers file creation to subagent

## Next Steps
After completion:
1. Test `/get-started` on a Node.js project
2. Test `/get-started` on a Python project
3. Test `/get-started` on a Rust project
4. Verify Java projects still work (not broken by generalization)
