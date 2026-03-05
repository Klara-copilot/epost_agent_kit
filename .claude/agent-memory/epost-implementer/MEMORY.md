# epost-implementer Memory

## Project Patterns

### CLI (epost-agent-kit-cli)
- `TargetName` type lives in `src/core/target-adapter.ts` — extend when adding IDE targets
- When extending `TargetName`, must also update: `src/types/index.ts`, `src/core/ownership.ts`, `src/core/config-loader.ts`, `src/core/template-manager.ts`, `src/cli.ts`
- `ClaudeAdapter` handles all non-github-copilot targets — new editors default to `.claude/` install dir
- 4 pre-existing failing tests in `tests/integration/init-command.test.ts` (missing fixture, timeout) — not caused by our changes

### Separator from @inquirer/prompts
- `Separator` is available at top-level: `import { Separator } from "@inquirer/prompts"`
- Type for mixed choice arrays: `(MyChoiceType | Separator)[]`

### Build/Test Commands
- `npm run build` — TypeScript compile check
- `npm test` — vitest (runs in background, slow ~60s)
- Always verify baseline failures before attributing to your changes: `git stash && npm test`

### Index Updates
- Plan INDEX: `plans/INDEX.md` and `plans/index.json`
- Reports go to: `plans/reports/` (project root, not inside epost-agent-cli)
