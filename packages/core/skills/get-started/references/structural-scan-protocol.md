# Structural Scan Protocol (Phase 1a)

## Purpose

Deterministic phase — runs the same commands every time, produces the same output for the same codebase state. No LLM inference happens here.

## Commands to Run

### 1. File Inventory

```bash
git ls-files | head -200
```

Produces a list of tracked files. Use as the canonical file set.

### 2. Framework Detection

Check for marker files (in order — stop at first match):

| Marker | Framework |
|--------|-----------|
| `package.json` | Node.js / Web |
| `pom.xml` | Java (Maven) |
| `build.gradle` or `build.gradle.kts` | Android (Gradle) |
| `Package.swift` or `*.xcodeproj` | iOS (Swift) |
| `Cargo.toml` | Rust |
| `requirements.txt` or `pyproject.toml` | Python |

### 3. Entry Point Detection

Locate entry points from known paths:

- Web: `src/app/`, `src/index.ts`, `src/main.ts`, `pages/`, `app/`
- iOS: `*App.swift`, `AppDelegate.swift`, `SceneDelegate.swift`
- Android: `MainActivity.kt`, `Application.kt`
- Java: class with `public static void main`, `*Application.java`
- Node: `main` field in `package.json`

### 4. Dependency Manifest Parsing

| Marker | What to extract |
|--------|----------------|
| `package.json` | `dependencies` + `devDependencies` keys |
| `pom.xml` | `<artifactId>` inside `<dependency>` blocks |
| `build.gradle` | `implementation "..."` lines |
| `Cargo.toml` | `[dependencies]` section |

### 5. Import Map Construction

For the top 20 files by line count (from `git ls-files`):

```bash
# Count how many other files import each file
grep -r "from '.*{filename}'" src/ | wc -l
grep -r "import '.*{filename}'" src/ | wc -l
```

Alternative — scan import headers of each file:
```bash
head -30 {file} | grep "^import\|^from"
```

Record `inboundCount` = number of other files that import this file.

## Output Format

Produce a structured summary before semantic annotation:

```json
{
  "framework": "Next.js",
  "language": "TypeScript",
  "entryPoints": ["src/app/layout.tsx", "src/app/page.tsx"],
  "topFiles": [
    { "path": "src/lib/utils.ts", "lines": 340, "inboundCount": 18 },
    { "path": "src/store/index.ts", "lines": 280, "inboundCount": 12 }
  ],
  "importMap": {
    "src/lib/utils.ts": 18,
    "src/store/index.ts": 12,
    "src/components/Button.tsx": 9
  },
  "dependencies": ["react", "next", "redux-toolkit"],
  "entryPointFiles": ["src/app/layout.tsx"]
}
```

## Rules

- Run all commands without LLM interpretation — pure tool calls
- Do NOT annotate or explain during this phase
- If a command fails (e.g., not a git repo), fall back: use `Glob("**/*")` with depth limit
- Inbound count is approximate — grep is sufficient, no AST parsing required
- Output JSON-like structure to pass to semantic annotation phase

## Cross-Reference

See `references/semantic-annotation-protocol.md` for Phase 1b which consumes this output.
