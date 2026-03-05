# Multi-Layer Architecture for epost_agent_kit

## Mental Model: 4-Layer Stack

```
┌──────────────────────────────────────────────────┐
│  Layer 3: KNOWLEDGE                               │  Lib consumer docs (API ref, tokens,
│  knowledge-muji (branded epost-muji agent)         │  integration patterns, contributing)
├──────────────────────────────────────────────────┤
│  Layer 2: DOMAIN + ARCHITECTURE                   │  B2B modules, B2C app, UI libs,
│  domain-b2b, domain-b2c, arch-ui-libs, arch-cloud │  cloud infra (skills + knowledge only)
├──────────────────────────────────────────────────┤
│  Layer 1: PLATFORM                                │  web, ios, android
│  platform-web, platform-ios, platform-android      │  Platform agents + skills + commands
├──────────────────────────────────────────────────┤
│  Layer 0: CORE                                    │  Everyone gets this
│  9 global agents, core skills, commands, hooks     │  Rules, safety, code-review, planning
└──────────────────────────────────────────────────┘
```

Each higher layer depends on lower layers. A B2B web developer gets: **Core → Platform(web) → Domain(b2b) → Knowledge(klara-theme)**.

---

## Organization Map

| Team | Role | Platform | Repos | Profile |
|------|------|----------|-------|---------|
| Miracle, Titan, Helios, Hacka, Kepler | Feature dev | Web | 1 Next.js monorepo (8 modules) | `web-b2b` |
| Optimus | Mobile app | iOS, Android, Backend | ios-app, android-app (separate) | `ios-b2c` / `android-b2c` |
| MUJI | UI libs | Web, iOS, Android | klara-theme, ios-theme-ui, android-theme, showcase | `web-ui-lib` / `ios-ui-lib` / `android-ui-lib` |
| Future / Invisible | Backend arch | Cloud/GCP | gcp-infra, cloud-* | `cloud-architect` |
| (Kit designers) | Agent kit | All | epost_agent_kit | `kit-designer` |

---

## Backend Tech Stack (from `pom.xml` analysis)

| Layer | Technology | Version |
|-------|-----------|---------|
| Language | Java | 8 |
| Platform | Jakarta EE 8 / WildFly | 26.1 |
| REST | JAX-RS via RESTEasy | 3.x |
| CDI / EJB | Jakarta CDI + EJB | 8.0 |
| ORM | Hibernate | 5.6 |
| Databases | PostgreSQL + MongoDB | driver 4.11 |
| Build | Maven | — |
| Microprofile | Eclipse MicroProfile | 4.1 |
| Testing | JUnit 4, Mockito, PowerMock, Arquillian | — |
| Coverage | JaCoCo | 0.8.4 |
| Quality | SonarQube | — |
| Artifacts | GCP Artifact Registry | — |
| Utilities | Lombok, Jackson, Apache POI | — |

**Note**: This is **not** Spring Boot. The backend runs on WildFly (JBoss) with Jakarta EE conventions (WAR packaging, `@Inject`, `@EJB`, `@Path`, `persistence.xml`). The `platform-backend` package's skills must reflect this stack.

---

## Claude Code Discovery Rules (Research Finding)

| Component | Parent traversal | Implication |
|-----------|-----------------|-------------|
| **CLAUDE.md** | YES — merges all found files up the tree | Perfect for workspace-level shared knowledge |
| **settings.json** | NO — isolated per scope | Must be per-repo |
| **Agents** | NO — scoped to their `.claude/agents/` | Must be per-repo (duplication accepted) |
| **Skills** | YES — auto-discover from nested dirs | Works in both models |

**Conclusion**: Core agents are duplicated per-repo (~100KB, acceptable). Workspace `CLAUDE.md` carries org-wide knowledge for free via traversal.

---

## Package Structure in Kit Repo

```
epost_agent_kit/
├── packages/                           # Source of truth for all installable content
│   ├── core/                           # Layer 0
│   │   ├── package.yaml
│   │   ├── agents/                     # 9 global agents
│   │   ├── skills/                     # core/, code-review, debugging, planning, ...
│   │   ├── commands/                   # core/, plan/, fix/, git/, docs/
│   │   ├── hooks/
│   │   ├── scripts/
│   │   ├── output-styles/
│   │   └── settings.json
│   │
│   ├── platform-web/                   # Layer 1
│   │   ├── package.yaml
│   │   ├── agents/                     # epost-web-developer
│   │   ├── skills/                     # web/nextjs, web/frontend-dev, web/backend-dev, docker
│   │   ├── commands/                   # web/cook, web/test
│   │   └── CLAUDE.snippet.md
│   │
│   ├── platform-ios/                   # Layer 1
│   │   ├── package.yaml
│   │   ├── agents/                     # epost-ios-developer
│   │   ├── skills/                     # ios/ios-development
│   │   ├── commands/                   # ios/cook, ios/test, ios/debug, ios/simulator
│   │   └── CLAUDE.snippet.md
│   │
│   ├── platform-android/               # Layer 1
│   │   ├── package.yaml
│   │   ├── agents/                     # epost-android-developer
│   │   ├── skills/                     # android/android-development
│   │   ├── commands/                   # android/cook, android/test
│   │   └── CLAUDE.snippet.md
│   │
│   ├── platform-backend/               # Layer 1 — Java EE / Jakarta EE on WildFly
│   │   ├── package.yaml
│   │   ├── agents/                     # epost-backend-developer (Java EE specialist)
│   │   ├── skills/
│   │   │   └── backend/               # Jakarta EE patterns (JAX-RS, CDI, EJB, JPA),
│   │   │       ├── javaee/            # WildFly server, Hibernate ORM, Maven builds
│   │   │       └── databases/         # PostgreSQL + MongoDB patterns
│   │   ├── commands/
│   │   │   └── backend/               # backend/cook, backend/test
│   │   └── CLAUDE.snippet.md
│   │
│   ├── domain-b2b/                     # Layer 2 (skills + knowledge, no agents)
│   │   ├── package.yaml
│   │   ├── skills/domain/b2b/          # Module patterns: monitoring, communities, inbox,
│   │   │                               # smart-send, composer, archive, contacts, organization
│   │   └── CLAUDE.snippet.md
│   │
│   ├── domain-b2c/                     # Layer 2 (skills + knowledge, no agents)
│   │   ├── package.yaml
│   │   ├── skills/domain/b2c/          # Consumer app patterns
│   │   └── CLAUDE.snippet.md
│   │
│   ├── arch-ui-libs/                   # Layer 2 — MUJI team
│   │   ├── package.yaml
│   │   ├── skills/
│   │   │   ├── arch/ui-libs/           # Design system architecture patterns
│   │   │   ├── web/klara-theme/        # Component pipeline (Figma-to-code)
│   │   │   └── web/figma-integration/  # Figma MCP skills
│   │   ├── commands/                   # docs/component, design/fast
│   │   └── CLAUDE.snippet.md
│   │
│   ├── arch-cloud/                     # Layer 2 — Future/Invisible team
│   │   ├── package.yaml
│   │   ├── agents/                     # epost-database-admin
│   │   ├── skills/arch/cloud/          # GCP, infra, terraform patterns
│   │   └── CLAUDE.snippet.md
│   │
│   ├── knowledge-muji/                 # Layer 3 — MUJI-branded UI lib knowledge
│   │   ├── package.yaml               # Single package, all 3 platform libs
│   │   ├── agents/
│   │   │   └── epost-muji.md           # Branded agent: "Ask MUJI about components"
│   │   │                               # Routes to correct platform knowledge by context
│   │   ├── skills/knowledge/
│   │   │   ├── klara-theme/            # Web UI lib (from Storybook)
│   │   │   │   ├── SKILL.md
│   │   │   │   ├── components.md       # Props, variants, tokens
│   │   │   │   ├── design-system.md    # Spacing, colors, typography
│   │   │   │   ├── integration.md      # Composition, theming, state
│   │   │   │   └── contributing.md     # Propose components back to MUJI
│   │   │   ├── ios-theme/              # iOS UI lib (from Figma)
│   │   │   │   ├── SKILL.md
│   │   │   │   ├── components.md
│   │   │   │   └── design-system.md
│   │   │   └── android-theme/          # Android UI lib (from Figma)
│   │   │       ├── SKILL.md
│   │   │       ├── components.md
│   │   │       └── design-system.md
│   │   └── CLAUDE.snippet.md
│   │
│   └── meta-kit-design/               # Kit developers (you)
│       ├── package.yaml
│       ├── agents/                     # mcp-manager, copywriter, journal-writer
│       ├── skills/agents/claude/       # agent-development, skill-development
│       └── CLAUDE.snippet.md
│
├── profiles/
│   └── profiles.yaml                   # All developer persona → package mappings
│
├── templates/
│   ├── workspace-claude.md.hbs         # Template for workspace-level CLAUDE.md
│   └── repo-claude.md.hbs             # Template for per-repo CLAUDE.md
│
├── epost-agent-cli/                    # CLI tool
├── .claude/                            # Kit repo's own .claude/ (for kit developers)
└── docs/

**Note**: 3 separate `knowledge-*` packages collapsed into single `knowledge-muji` with the branded `epost-muji` agent. The agent detects installed platform (web/iOS/Android) and routes to the correct knowledge skill automatically.
```

---

## package.yaml Schema

```yaml
# packages/platform-web/package.yaml
name: platform-web
version: "1.0.0"
description: "Web platform: Next.js, React, TypeScript"
layer: 1                        # 0=core, 1=platform, 2=domain/arch, 3=knowledge
platforms: [web]

dependencies:
  - core                        # Required packages

recommends:                     # Auto-suggested during install
  - knowledge-muji              # "Also install MUJI UI lib knowledge?"

provides:
  agents: [epost-web-developer]
  skills: [web/nextjs, web/frontend-development, web/backend-development, docker]
  commands: [web/cook, web/test]

files:                          # Source → target mapping (relative to .claude/)
  agents/:   agents/
  skills/:   skills/
  commands/: commands/

settings_strategy: merge        # base | merge | skip
claude_snippet: CLAUDE.snippet.md
```

---

## Profiles

```yaml
# profiles/profiles.yaml
profiles:
  # ─── Feature Teams (B2B Web) ───
  web-b2b:
    display_name: "Web B2B Developer (frontend)"
    teams: [miracle, titan, helios, hacka, kepler]
    packages: [core, platform-web, domain-b2b, knowledge-muji]
    optional: [special-scout, special-brainstormer, special-database-admin]

  web-b2b-backend:
    display_name: "Web B2B Developer (backend)"
    teams: [miracle, titan, helios, hacka, kepler]
    packages: [core, platform-backend, domain-b2b]
    optional: [special-database-admin]

  web-b2b-fullstack:
    display_name: "Web B2B Developer (fullstack)"
    teams: [miracle, titan, helios, hacka, kepler]
    packages: [core, platform-web, platform-backend, domain-b2b, knowledge-muji]
    optional: [special-scout, special-database-admin]

  # ─── Mobile Teams (B2C) ───
  ios-b2c:
    display_name: "iOS App Developer"
    teams: [optimus]
    packages: [core, platform-ios, domain-b2c, knowledge-muji]
    optional: [special-scout]

  android-b2c:
    display_name: "Android App Developer"
    teams: [optimus]
    packages: [core, platform-android, domain-b2c, knowledge-muji]
    optional: [special-scout]

  mobile-b2c:
    display_name: "Mobile Developer (iOS + Android)"
    teams: [optimus]
    packages: [core, platform-ios, platform-android, domain-b2c, knowledge-muji]

  mobile-b2c-backend:
    display_name: "Mobile Backend Developer"
    teams: [optimus]
    packages: [core, platform-backend, domain-b2c]
    optional: [special-database-admin]

  # ─── UI Library Teams (MUJI) ───
  web-ui-lib:
    display_name: "Web UI Library Developer"
    teams: [muji]
    packages: [core, platform-web, arch-ui-libs]
    optional: [special-ui-ux-designer]

  ios-ui-lib:
    display_name: "iOS UI Library Developer"
    teams: [muji]
    packages: [core, platform-ios, arch-ui-libs]
    optional: [special-ui-ux-designer]

  android-ui-lib:
    display_name: "Android UI Library Developer"
    teams: [muji]
    packages: [core, platform-android, arch-ui-libs]

  # ─── Architecture Teams ───
  cloud-architect:
    display_name: "Cloud Architect"
    teams: [future, invisible]
    packages: [core, arch-cloud, platform-backend]
    optional: [special-database-admin]

  # ─── Kit Development ───
  kit-designer:
    display_name: "Kit Designer"
    packages: [core, platform-web, platform-ios, platform-android, platform-backend, meta-kit-design]

  full:
    display_name: "Full Kit (everything)"
    packages: [core, platform-web, platform-ios, platform-android, platform-backend, arch-ui-libs, arch-cloud, domain-b2b, domain-b2c, knowledge-muji, meta-kit-design]

auto_detect:
  rules:
    - match: { files: ["next.config.*"], dependencies: ["next"] }
      suggest: web-b2b
    - match: { files: ["pom.xml"], directories: ["src/main/java"] }
      suggest: web-b2b-backend
    - match: { files: ["*.xcodeproj"], directories: ["*Theme*", "*theme*"] }
      suggest: ios-ui-lib
    - match: { files: ["*.xcodeproj"] }
      suggest: ios-b2c
    - match: { files: ["build.gradle.kts"], directories: ["*theme*"] }
      suggest: android-ui-lib
    - match: { files: ["build.gradle.kts"], directories: ["app/src/main/"] }
      suggest: android-b2c
    - match: { files: ["*.tf", "cloudbuild.yaml"] }
      suggest: cloud-architect
```

---

## Installation Model

### Per-Repo Install (primary)

```bash
# Auto-detect project type, suggest profile
npx epost-kit init

# Explicit profile
npx epost-kit init --profile web-b2b

# Explicit packages
npx epost-kit init --packages core,platform-web,domain-b2b
```

**What `init` does:**
1. Resolve profile → package list, validate dependencies (topological sort)
2. Download kit release (or use local `packages/` if in kit repo)
3. For each package (in layer order): copy files into `.claude/` via smart-merge
4. Merge `settings.json` (layer 0 = base, higher layers deep-merge)
5. Generate `CLAUDE.md` from template + assembled `CLAUDE.snippet.md` sections
6. Write `.epost-metadata.json` with per-file package ownership
7. Write `.epostrc.yaml` recording the chosen profile

### Workspace Setup (optional, for multi-repo devs)

```bash
# In workspace root (parent of multiple repos)
npx epost-kit workspace init

# Generates workspace-level CLAUDE.md with org knowledge
# Then install per-repo as usual:
cd ios-app && npx epost-kit init --profile ios-b2c
cd ../ios-ui-lib && npx epost-kit init --profile ios-ui-lib
```

Workspace `CLAUDE.md` (auto-inherited by all repos via traversal) contains:
- Team ownership table
- Cross-repo conventions (API format, branch naming, date format)
- Links to internal resources (Figma, Confluence, API docs)

### Onboarding Flow (new developer)

```bash
npx epost-kit onboard

# Interactive wizard:
# 1. What team? → [Miracle, Titan, Optimus-iOS, Optimus-Android, MUJI-Web, ...]
# 2. Suggested profile + packages shown → confirm
# 3. Include optional agents? → [scout, brainstormer, ...]
# 4. Clone repo? → [select from team's repos / point to existing dir / skip]
# 5. Install kit → auto-detect confirms → done
# 6. epost-kit doctor → verify installation
# 7. Show "try this first" suggestions
```

---

## Knowledge Layer: How Arch Team Knowledge Reaches Feature Devs

```
Team MUJI maintains                    Feature teams consume
─────────────────                      ──────────────────
packages/arch-ui-libs/                 packages/knowledge-muji/
  skills/web/klara-theme/                agents/epost-muji.md  — branded agent
  (component creation pipeline)            (auto-routes to platform knowledge)
  (Figma-to-code workflow)               skills/knowledge/klara-theme/
  (design token architecture)              SKILL.md, components.md, design-system.md
                                           integration.md, contributing.md
                                         skills/knowledge/ios-theme/
                                           SKILL.md, components.md, design-system.md
                                         skills/knowledge/android-theme/
                                           SKILL.md, components.md, design-system.md

Installed when: profile = web-ui-lib    Installed when: profile = web-b2b, ios-b2c, etc.
(MUJI team members)                     (feature team members — epost-muji agent included)
```

**4 types of knowledge feature devs need:**

| Need | Served by | Example content |
|------|-----------|-----------------|
| Component API reference | `knowledge/klara-theme/components.md` | Props table, variant matrix, code snippets |
| Design system guidelines | `knowledge/klara-theme/design-system.md` | 3-layer token system, spacing scale, color palette |
| Integration patterns | `knowledge/klara-theme/integration.md` | Theme provider setup, composition rules, state patterns |
| Contributing back | `knowledge/klara-theme/contributing.md` | PR template, component proposal process |

Knowledge sources (current state → all inside `knowledge-muji`):
- **Web**: Storybook (primary) → Figma → tribal → `knowledge/klara-theme/`
- **iOS**: Figma (primary) → tribal → `knowledge/ios-theme/`
- **Android**: Figma → tribal → `knowledge/android-theme/`

---

## CLAUDE.md Strategy

### Two tiers

| Level | File | Generated by | Contains |
|-------|------|-------------|----------|
| Workspace | `~/workspace/CLAUDE.md` | `epost-kit workspace init` | Org conventions, team ownership, cross-repo rules |
| Repo | `~/workspace/ios-app/CLAUDE.md` | `epost-kit init` | Tech stack, build commands, assembled from template + snippets |

Repo CLAUDE.md is assembled from:
1. Base template (`templates/repo-claude.md.hbs`) — project overview, detected tech stack
2. Each installed package's `CLAUDE.snippet.md` — appended in layer order

---

## CLI Changes

### New commands

| Command | Purpose |
|---------|---------|
| `epost-kit init --profile <name>` | Install with profile |
| `epost-kit init --packages <list>` | Install with explicit packages |
| `epost-kit onboard` | Guided first-time setup wizard |
| `epost-kit profile list` | List available profiles |
| `epost-kit profile show <name>` | Show profile details |
| `epost-kit package list` | List available packages |
| `epost-kit package add <name>` | Add a package to existing install |
| `epost-kit package remove <name>` | Remove a package |
| `epost-kit workspace init` | Generate workspace CLAUDE.md |
| `epost-kit dev` | Watch `packages/` and live-sync to test `.claude/` |
| `epost-kit dev --target <dir>` | Watch and sync to specific project directory |

### Dev Watcher (`epost-kit dev`)

For kit designers iterating on packages. Watches `packages/` for file changes and live-syncs them into a target `.claude/` directory so you can test changes without re-running `init`.

```bash
# Watch and sync to kit repo's own .claude/ (default)
epost-kit dev

# Watch and sync to a specific project
epost-kit dev --target ~/Projects/ios-app

# Watch with specific profile filter (only sync relevant packages)
epost-kit dev --profile web-b2b --target ~/Projects/web-monorepo
```

**How it works:**
1. Resolve which packages to watch (from `--profile`, or all packages if omitted)
2. Start `chokidar` (or `fs.watch`) watcher on `packages/<name>/` directories
3. On file change: re-run the file copy + smart-merge for the changed file only
4. Re-generate `CLAUDE.md` if a `CLAUDE.snippet.md` changed
5. Re-merge `settings.json` if any package's settings changed
6. Log each synced file with package name and action (created/updated/deleted)

**Output:**
```
[dev] Watching 4 packages: core, platform-web, domain-b2b, knowledge-muji
[dev] → core/skills/core/SKILL.md → .claude/skills/core/SKILL.md (updated)
[dev] → platform-web/CLAUDE.snippet.md → regenerating CLAUDE.md...
[dev] ✓ CLAUDE.md regenerated (3 snippets merged)
```

**Key behaviors:**
- Debounce: 300ms to batch rapid saves
- Respects `.epost-metadata.json` file ownership (won't overwrite user-modified files unless `--force`)
- Skips `package.yaml` and `profiles.yaml` (meta files, not installed content)
- Ctrl+C stops cleanly, no temp files left behind

### Config schema extension

```typescript
// epost-agent-cli/src/core/config-loader.ts
const ConfigSchema = z.object({
  // Existing
  kit: z.string().optional(),
  version: z.string().optional(),
  target: z.enum(['claude', 'cursor', 'github-copilot']).optional(),
  registry: z.string().url().optional(),
  // New
  profile: z.string().optional(),
  packages: z.array(z.string()).optional(),
  optional: z.array(z.string()).optional(),
  exclude: z.array(z.string()).optional(),
  workspace: z.object({
    root: z.string().optional(),
    shared_claude_md: z.boolean().default(true),
  }).optional(),
});
```

### Metadata extension

```typescript
// epost-agent-cli/src/types/index.ts
interface Metadata {
  cliVersion: string;
  target: 'claude' | 'cursor' | 'github-copilot';
  kitVersion: string;
  profile: string;                  // NEW
  installedPackages: string[];      // NEW
  installedAt: string;
  updatedAt?: string;
  files: Record<string, FileOwnership>;
}

interface FileOwnership {
  path: string;
  checksum: string;
  installedAt: string;
  version: string;
  modified: boolean;
  package: string;                  // NEW: which package owns this file
}
```

### New core modules

| Module | Purpose | Path |
|--------|---------|------|
| `package-resolver.ts` | Resolve profile → packages, validate deps, topological sort | `src/core/` |
| `profile-loader.ts` | Load `profiles.yaml`, auto-detect rules | `src/core/` |
| `claude-md-generator.ts` | Assemble CLAUDE.md from template + snippets | `src/core/` |
| `settings-merger.ts` | Deep-merge settings.json from multiple packages | `src/core/` |
| `dev-watcher.ts` | File watcher for live-sync during kit development | `src/core/` |

---

## Migration Path

### Phase 1: Package structure (kit repo restructure, no CLI changes) ✅ DONE
- Create `packages/` directory, move files from current `.claude/`
- Create `package.yaml` for each package
- Create `profiles.yaml`
- Create `templates/` with CLAUDE.md templates
- Keep current `.claude/` working for kit developers

### Phase 1.5: iOS Accessibility Migration
- Migrate `.ai-agents/` accessibility content → `packages/platform-ios/`
- Create 3 Claude Code agents from GitHub Copilot agents
- Convert 8 accessibility rules → Claude Code skill
- Convert 7 accessibility prompts → Claude Code commands
- Integrate known-findings schema
- Remove duplicate core rules from `.ai-agents/rules/`
- Keep `.ai-agents/` and `.github/agents/` as backward-compat symlinks or thin wrappers

### Phase 2: CLI package support
- Add new core modules: `package-resolver`, `profile-loader`, `claude-md-generator`, `settings-merger`
- Extend `init` with `--profile` and `--packages`
- Extend config schema and metadata types
- Update `template-manager.ts` to extract from `packages/` subdirectories
- Update `smart-merge.ts` for package-aware conflicts

### Phase 3: New commands
- Add `onboard`, `profile list/show`, `package list/add/remove`, `workspace init`
- Add `dev` watcher command with `--target`, `--profile`, `--force` flags
- Add auto-detect logic
- Add migration bridge for existing flat installs

### Phase 4: Knowledge + domain packages
- Create `knowledge-muji` with branded `epost-muji` agent and 3 platform knowledge skills
  - `knowledge/klara-theme/` from existing klara-theme skill content
  - `knowledge/ios-theme/` and `knowledge/android-theme/` (initially from Figma specs)
- Create `domain-b2b` (8 module patterns) and `domain-b2c` (consumer app patterns)
- Create `arch-cloud` (GCP/infra patterns)

### Phase 5: Workspace support
- Implement `workspace init`
- Generate workspace CLAUDE.md from template
- Document workspace setup for multi-repo developers

---

## File Movement Map (Current → Packages)

| Current path | Package | New path |
|---|---|---|
| `.claude/agents/epost-orchestrator.md` + 8 global agents | `core` | `packages/core/agents/` |
| `.claude/agents/epost-web-developer.md` | `platform-web` | `packages/platform-web/agents/` |
| `.claude/agents/epost-ios-developer.md` | `platform-ios` | `packages/platform-ios/agents/` |
| `.claude/agents/epost-android-developer.md` | `platform-android` | `packages/platform-android/agents/` |
| `.claude/agents/epost-database-admin.md` | `arch-cloud` | `packages/arch-cloud/agents/` |
| `.claude/agents/epost-{scout,brainstormer,ui-ux-designer,copywriter,journal-writer,mcp-manager}` | `meta-kit-design` | `packages/meta-kit-design/agents/` |
| `.claude/skills/core/` + 10 general skills | `core` | `packages/core/skills/` |
| `.claude/skills/web/{nextjs,frontend-dev,backend-dev}` | `platform-web` | `packages/platform-web/skills/` |
| `.claude/skills/web/{klara-theme,figma-integration}` | `arch-ui-libs` | `packages/arch-ui-libs/skills/` |
| `.claude/skills/ios/` | `platform-ios` | `packages/platform-ios/skills/` |
| `.claude/skills/android/` | `platform-android` | `packages/platform-android/skills/` |
| `.claude/skills/docker/` | `platform-web` | `packages/platform-web/skills/` |
| `.claude/skills/agents/claude/` | `meta-kit-design` | `packages/meta-kit-design/skills/` |
| `.claude/commands/{core,plan,fix,git,docs}` | `core` | `packages/core/commands/` |
| `.claude/commands/web/` | `platform-web` | `packages/platform-web/commands/` |
| `.claude/commands/ios/` | `platform-ios` | `packages/platform-ios/commands/` |
| `.claude/commands/android/` | `platform-android` | `packages/platform-android/commands/` |
| `.claude/commands/{docs/component,design}` | `arch-ui-libs` | `packages/arch-ui-libs/commands/` |
| `.claude/output-styles/` | `core` | `packages/core/output-styles/` |
| `.claude/hooks/` | `core` | `packages/core/hooks/` |
| `.claude/scripts/` | `core` | `packages/core/scripts/` |
| `.claude/settings.json` | `core` | `packages/core/settings.json` |

---

## Verification

After full implementation:

1. `epost-kit profile list` shows all 14 profiles
2. `epost-kit init --profile web-b2b` installs: 10 agents, ~16 skills, ~28 commands
3. `epost-kit init --profile ios-b2c` installs: 10 agents, ~12 skills, ~22 commands
4. `epost-kit init --profile ios-ui-lib` installs: 10 agents, ~15 skills, ~24 commands
5. `epost-kit doctor` passes for every profile
6. `epost-kit package add special-scout` adds scout without affecting other files
7. `epost-kit package remove domain-b2b` removes only b2b skills
8. `epost-kit workspace init` generates valid workspace CLAUDE.md
9. Auto-detect correctly identifies Next.js → web-b2b, .xcodeproj → ios-b2c
10. `epost-kit onboard` walks through full wizard without errors
11. No circular dependencies in any package graph
12. Existing `epost-kit init --kit engineer` still works (backward compat bridge)
13. `epost-kit dev --target /tmp/test-project` watches and syncs file changes in real-time
14. `epost-kit dev --profile web-b2b` only watches packages relevant to that profile
