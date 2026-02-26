---
name: kit-cli
description: TypeScript CLI development patterns with Commander, @inquirer/prompts, and vitest testing for epost-kit
user-invocable: false
---

# CLI Development Patterns

## Tech Stack
- **Runtime**: Node.js 20+
- **Language**: TypeScript 5+
- **CLI Framework**: Commander.js
- **Prompts**: @inquirer/prompts
- **Testing**: vitest
- **Build**: tsc (no bundler)

## Project Structure

```
epost-agent-cli/
├── src/
│   ├── cli.ts              — Entry point, Commander setup
│   ├── commands/            — Command implementations (init, onboard, update, doctor)
│   ├── core/                — Shared utilities (package-resolver, profile-loader, template-manager)
│   └── types/               — TypeScript interfaces (PackageManifest, FileOwnership, etc.)
├── dist/                    — Compiled output
└── package.json
```

## Key Conventions
- Custom lightweight YAML parser (`parseSimpleYaml()` in package-resolver.ts) — no js-yaml dependency
- File ownership tracking with SHA256 checksums (`.epost-metadata.json`)
- Settings merge strategies: base (overwrite), merge (deep), skip (no-op)
- Profile-based package selection via `profiles/profiles.yaml`
- Topological sort for dependency resolution (layer-based install order)
- Skill index auto-generation from installed SKILL.md files

## Testing
- Unit tests with vitest in `__tests__/` directories
- Mock filesystem operations for package install tests
- Run: `cd epost-agent-cli && npm test`
