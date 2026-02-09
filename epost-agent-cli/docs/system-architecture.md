# System Architecture

## High-Level Overview

epost-kit is a **package-based CLI distribution system** for AI agent frameworks. It orchestrates the installation, configuration, and management of agent kits across multiple IDEs (Claude Code, Cursor, GitHub Copilot).

```
┌─────────────────────────────────────────────────────────────┐
│                     CLI Entry Point                          │
│                      (cli.ts)                                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Commander.js: new, init, doctor, versions, update,  │   │
│  │                uninstall, profile, package, onboard  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   Command Handlers                           │
│                    (commands/)                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   init   │  │   new    │  │  doctor  │  │ onboard  │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │             │              │              │          │
│  ┌────┴─────┐  ┌───┴──────┐  ┌───┴──────┐  ┌───┴──────┐   │
│  │ profile  │  │ package  │  │ versions │  │   dev    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    Core Business Logic                       │
│                       (core/)                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Profile System                                      │   │
│  │  - profile-loader: auto-detect, list, show          │   │
│  │  - package-resolver: dependency resolution          │   │
│  │  - settings-merger: 3-layer merge (base+pkg+prof)   │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  File Operations                                     │   │
│  │  - ownership: track installed files                 │   │
│  │  - checksum: verify file integrity                  │   │
│  │  - smart-merge: conflict resolution                 │   │
│  │  - file-system: safe file operations                │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  External Services                                   │   │
│  │  - github-client: fetch releases, tags              │   │
│  │  - self-update: CLI self-update mechanism           │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Utilities                                           │   │
│  │  - logger: centralized logging                      │   │
│  │  - ui: terminal UI helpers (ora, inquirer)          │   │
│  │  - template-manager: template rendering             │   │
│  │  - backup-manager: backup/restore files             │   │
│  │  - config-loader: cosmiconfig integration           │   │
│  │  - health-checks: installation verification         │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                  File System Targets                         │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  .claude/   │  │  .cursor/    │  │  .github/    │       │
│  │  (Claude    │  │  (Cursor     │  │  (Copilot    │       │
│  │   Code)     │  │   IDE)       │  │   IDE)       │       │
│  └─────────────┘  └──────────────┘  └──────────────┘       │
│  + .epost-metadata.json (ownership tracking)                │
│  + .epost-config.json (user config)                         │
└─────────────────────────────────────────────────────────────┘
```

## Core Modules

### 1. Profile System

**Purpose**: Map developer roles to package sets

#### profile-loader.ts
- **Auto-detection**: Scan project for package.json, .xcodeproj, build.gradle
- **Listing**: Display available profiles with descriptions
- **Confidence**: High/medium/low based on matched detection rules
- **Key functions**:
  - `detectProjectProfile()`: Auto-detect from project structure
  - `listProfiles()`: Get all available profiles
  - `getProfile()`: Load specific profile by name

**Example Detection Rule**:
```typescript
{
  match: {
    files: ['package.json'],
    dependencies: ['next', 'react']
  },
  suggest: 'web-b2b' // Suggests Web B2B profile
}
```

#### package-resolver.ts
- **Dependency Resolution**: Topological sort of package dependencies
- **Circular Detection**: Detect and report circular dependencies
- **Layer System**: Enforce package layer constraints (0=core, 1=platform, etc.)
- **Key functions**:
  - `resolvePackages()`: Resolve profile → package list
  - `validateDependencies()`: Check for circular deps
  - `topologicalSort()`: Sort packages by dependencies

**Package Layers**:
- Layer 0: `core` (foundation)
- Layer 1: `platform-*` (web, iOS, Android)
- Layer 2: `domain-*` (b2b, b2c)
- Layer 3: `ui-ux`, `arch-*`, specialized packages

#### settings-merger.ts
- **3-Layer Merge**: base → packages → profile
- **Strategies**: base (replace), merge (deep merge), skip
- **Deep Merge**: Handles nested objects and arrays
- **Key functions**:
  - `mergeSettings()`: Merge base + package + profile settings
  - `applyStrategy()`: Apply merge strategy per package

**Merge Example**:
```typescript
// Base settings
{ agents: ['orchestrator'], skills: ['core'] }

// Package 1 settings (merge)
{ agents: ['web-developer'], skills: ['web'] }

// Result after merge
{ agents: ['orchestrator', 'web-developer'], skills: ['core', 'web'] }
```

### 2. File Operations

#### ownership.ts
- **Metadata Tracking**: Store installed file paths and checksums
- **Modification Detection**: Detect user-modified files
- **Ownership Transfer**: Track file ownership (kit vs user)
- **Key functions**:
  - `loadMetadata()`: Load .epost-metadata.json
  - `saveMetadata()`: Save ownership tracking
  - `isModified()`: Check if file was user-modified

**Metadata Structure**:
```json
{
  "version": "1.0",
  "installedAt": "2025-01-15T10:30:00Z",
  "files": {
    ".claude/agents/orchestrator.ts": {
      "checksum": "abc123...",
      "source": "kit",
      "modifiedAt": null
    }
  }
}
```

#### checksum.ts
- **SHA-256 Hashing**: Generate file checksums
- **Integrity Verification**: Verify files match expected checksums
- **Key functions**:
  - `calculateChecksum()`: Generate SHA-256 hash
  - `verifyChecksum()`: Compare file against expected hash

#### smart-merge.ts
- **Conflict Resolution**: Merge kit updates with user modifications
- **Strategies**: keep (local), overwrite (incoming), merge (smart)
- **Merge Algorithm**: Preserve user content blocks, update kit content
- **Key functions**:
  - `mergeFiles()`: Smart merge two file versions
  - `detectConflicts()`: Find conflicting sections

**Merge Strategies**:
1. **Keep**: Preserve local file, ignore incoming
2. **Overwrite**: Use incoming file, discard local
3. **Merge**: Combine both (preserve user content, update kit content)

#### file-system.ts
- **Safe Operations**: Existence checks before read/write
- **Error Handling**: Graceful handling of ENOENT, EACCES
- **Key functions**:
  - `fileExists()`: Check file existence
  - `dirExists()`: Check directory existence
  - `safeReadFile()`: Read file with error handling
  - `safeWriteFile()`: Write file with error handling

### 3. External Services

#### github-client.ts
- **GitHub API Integration**: Fetch releases, tags
- **Rate Limiting**: Respect GitHub API rate limits
- **Authentication**: Optional GitHub token for higher limits
- **Key functions**:
  - `fetchReleases()`: Get all releases
  - `fetchLatestRelease()`: Get latest stable release
  - `downloadAsset()`: Download release asset

**API Endpoints Used**:
- `GET /repos/Klara-copilot/epost_agent_kit/releases`
- `GET /repos/Klara-copilot/epost_agent_kit/releases/latest`
- `GET /repos/Klara-copilot/epost_agent_kit/releases/tags/{tag}`

#### self-update.ts
- **Self-Update Mechanism**: Update CLI tool itself
- **Version Comparison**: Semver comparison for updates
- **Backup**: Backup current version before update
- **Key functions**:
  - `checkForUpdates()`: Compare local vs remote version
  - `performUpdate()`: Download and install update

### 4. Utilities

#### logger.ts
- **Centralized Logging**: Consistent log format
- **Log Levels**: info, success, warn, error, debug
- **Verbosity Control**: --verbose flag for debug logs
- **Key functions**:
  - `logger.info()`: Informational messages
  - `logger.success()`: Success messages (green ✓)
  - `logger.warn()`: Warnings (yellow ⚠)
  - `logger.error()`: Errors (red ✗)
  - `logger.debug()`: Debug messages (only with --verbose)

#### ui.ts
- **Terminal UI**: Spinners (ora), tables (cli-table3), prompts (inquirer)
- **Progress Indicators**: Show progress during long operations
- **Interactive Prompts**: Select, input, confirm
- **Key components**:
  - `spinner()`: Create ora spinner
  - `table()`: Create cli-table3 table
  - `select()`: Inquirer select prompt
  - `confirm()`: Inquirer confirm prompt

#### template-manager.ts
- **Template Rendering**: Replace placeholders in templates
- **Variables**: project name, profile, packages, date
- **Key functions**:
  - `renderTemplate()`: Replace {{var}} with values
  - `loadTemplate()`: Load template from file

#### claude-md-generator.ts
- **CLAUDE.md Generation**: Generate IDE config from packages
- **Multi-Layer**: Merge package snippets + profile snippet
- **Deduplication**: Remove duplicate sections
- **Key functions**:
  - `generateClaudeMd()`: Generate complete CLAUDE.md content
  - `mergeSnippets()`: Merge snippets from multiple packages

**Generated Structure**:
```markdown
# CLAUDE.md

## Project: {project_name}
## Installed Profile: {profile_name}

### Packages
- core: Core agents and skills
- platform-web: Web development tools

### Commands
/web:cook, /web:test, /profile:list

### Agents
- orchestrator, web-developer, tester

[Package-specific snippets merged here]
```

## Data Flow

### Command: `init` (Initialize Existing Project)

```
1. Parse CLI Args
   ├─ Read opts: kit, profile, packages, fresh, dry-run, dir
   └─ Set defaults: dir = cwd, verbose from global opts

2. Load Config
   ├─ Cosmiconfig search: .epostrc, epost.config.js, etc.
   └─ Merge CLI opts + config file

3. Profile Resolution
   ├─ If --profile given → use it
   ├─ Else → Auto-detect project type
   │   ├─ Check package.json (web project?)
   │   ├─ Check .xcodeproj (iOS project?)
   │   ├─ Check build.gradle (Android project?)
   │   └─ Return DetectionResult (profile, confidence, rules)
   └─ If no match → Interactive selection (inquirer)

4. Package Resolution
   ├─ Load profile definition from profiles.json
   ├─ Load package manifests (core, platform-*, etc.)
   ├─ Resolve dependencies (topological sort)
   ├─ Check for circular dependencies
   └─ Return ordered package list

5. Settings Merge
   ├─ Load base settings (base-settings.json)
   ├─ For each package:
   │   ├─ Load package settings
   │   ├─ Apply merge strategy (base/merge/skip)
   │   └─ Deep merge into base
   ├─ Load profile settings
   └─ Return merged settings

6. Conflict Detection
   ├─ Load existing metadata (.epost-metadata.json)
   ├─ For each file to install:
   │   ├─ Check if exists locally
   │   ├─ Compare checksums
   │   ├─ Detect modification (user vs kit)
   │   └─ Flag conflicts
   └─ Return conflict list

7. User Confirmation
   ├─ If --dry-run → Show preview, exit
   ├─ If conflicts:
   │   ├─ Show conflict details
   │   ├─ Ask strategy: keep/overwrite/merge
   │   └─ Record choices
   └─ If --yes → Skip confirmation

8. File Installation
   ├─ For each package (in dependency order):
   │   ├─ For each file:
   │   │   ├─ Check conflict strategy
   │   │   ├─ Backup existing (if overwrite/merge)
   │   │   ├─ Write file (keep/overwrite/merge)
   │   │   ├─ Calculate checksum
   │   │   └─ Update metadata
   │   └─ Track installed files
   └─ Save metadata

9. CLAUDE.md Generation
   ├─ Collect snippets from all packages
   ├─ Merge snippets (deduplicate)
   ├─ Render template with variables
   └─ Write .claude/CLAUDE.md

10. Health Check
    ├─ Verify all files installed
    ├─ Verify checksums match
    ├─ Check IDE directories exist
    └─ Report status

11. Post-Install
    ├─ Log success message
    ├─ Show next steps
    └─ Exit 0
```

### Command: `doctor` (Health Check)

```
1. Load Metadata
   └─ Read .epost-metadata.json

2. Check Installation
   ├─ Verify metadata exists
   ├─ Check installed files exist
   ├─ Verify checksums match
   └─ Detect user modifications

3. Check Environment
   ├─ Verify Node.js version >= 18
   ├─ Check IDE directories (.claude, .cursor, .github)
   └─ Check config file validity

4. Check Updates
   ├─ Fetch latest release from GitHub
   ├─ Compare with installed version
   └─ Report update availability

5. Generate Report
   ├─ ✓ Installation integrity
   ├─ ✓ Environment checks
   ├─ ✗ Issues found
   └─ Fix suggestions

6. Auto-Fix (if --fix)
   ├─ Restore modified files to kit version
   ├─ Update checksums
   └─ Regenerate CLAUDE.md
```

## Key Patterns

### 1. Commander.js Command Registration
```typescript
program
  .command('init')
  .description('Initialize in existing project')
  .option('--profile <name>', 'Developer profile')
  .option('--dry-run', 'Preview changes')
  .action(async (opts) => {
    const { runInit } = await import('./commands/init.js');
    await runInit({ ...program.opts(), ...opts });
  });
```

### 2. Inquirer Interactive Prompts
```typescript
const profile = await select({
  message: 'Select a developer profile:',
  choices: profiles.map(p => ({
    name: p.display_name,
    value: p.name
  }))
});
```

### 3. Ownership Tracking
```typescript
// Save file ownership
const metadata = {
  version: '1.0',
  files: {
    [filePath]: {
      checksum: await calculateChecksum(content),
      source: 'kit',
      modifiedAt: null
    }
  }
};
await saveMetadata(metadata);
```

### 4. Topological Sort (Dependency Resolution)
```typescript
// Kahn's algorithm for dependency ordering
function topologicalSort(packages: Package[]): Package[] {
  const sorted: Package[] = [];
  const noIncoming = packages.filter(p => p.dependencies.length === 0);
  
  while (noIncoming.length > 0) {
    const pkg = noIncoming.shift()!;
    sorted.push(pkg);
    // Remove edges and update noIncoming
  }
  
  return sorted;
}
```

### 5. Deep Merge for Settings
```typescript
function deepMerge(base: any, incoming: any): any {
  if (Array.isArray(base) && Array.isArray(incoming)) {
    return [...new Set([...base, ...incoming])]; // Deduplicate
  }
  
  if (isObject(base) && isObject(incoming)) {
    const result = { ...base };
    for (const key in incoming) {
      result[key] = deepMerge(base[key], incoming[key]);
    }
    return result;
  }
  
  return incoming; // Scalar: incoming wins
}
```

### 6. Smart File Merge
```typescript
async function smartMerge(local: string, incoming: string): Promise<string> {
  // Parse both files into sections
  const localSections = parseSections(local);
  const incomingSections = parseSections(incoming);
  
  // Preserve user sections, update kit sections
  const merged = {
    ...incomingSections, // Start with incoming
    ...localSections.filter(s => s.source === 'user') // Add user sections
  };
  
  return renderSections(merged);
}
```

## Security Considerations

### Protected Files
- `.env`, `.env.*` (environment variables)
- `*.key`, `*.pem`, `*.p12`, `*.pfx` (secrets)
- `.git/**` (git internal files)
- `node_modules/**` (dependencies)

### Checksum Verification
- SHA-256 hashes for all installed files
- Detect tampering or corruption
- Verify updates before applying

### User Confirmation
- Require confirmation before overwriting user files
- Show diff for conflicts
- Backup before destructive operations

### GitHub API
- Optional authentication token
- Respect rate limits (60/hour unauthenticated, 5000/hour authenticated)
- Validate release assets before download
