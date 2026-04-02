# Development Rules

**Always follow: YAGNI (You Aren't Gonna Need It) · KISS (Keep It Simple, Stupid) · DRY (Don't Repeat Yourself)**

## Commits

- Conventional commits: `feat:` `fix:` `docs:` `refactor:` `test:` `chore:`
- Never add AI attribution: no "Generated with Claude Code", no "Co-authored by Claude"
- Run lint before committing (Node: `npm run lint`, Java: `mvn checkstyle:check`)
- Never commit secrets: check for `sk-`, `Bearer `, `password =`, `API_KEY=`
- No force-push to main/master without explicit user request

## Code Changes

- Read files before editing — never assume current state
- Update existing files directly — do NOT create new "enhanced" versions of existing files
- After creating or modifying code, run compile/lint to verify no errors before continuing
- Ask before: deleting files, modifying production configs, introducing new dependencies,
  multi-file refactors, changing API contracts
- Auto-execute: dependency installs, lint fixes, documentation formatting

## Packages as Source of Truth

`.claude/` is generated output — wiped on `epost-kit init`. ALL edits go in `packages/`.
Editing `.claude/` directly = changes lost on next init. Always check you're in `packages/`.

## Verification

Never claim "done", "complete", or "passing" without running verification in the current turn.
Memory of previous results is not evidence. Run the command, read the output, then claim.

## Visual Explanations

When explaining complex code, architecture, or flows — use `/preview` instead of prose:

| Need | Command |
|------|---------|
| Explain unfamiliar pattern or flow | `/preview --explain <topic>` |
| Architecture / data flow diagram | `/preview --diagram <topic>` |
| Step-by-step walkthrough | `/preview --ascii <topic>` |
| Self-contained HTML (opens in browser) | `/preview --html <topic>` |

**When to use**: user asks "explain", "how does X work", "visualize", or topic has 3+ interacting components.

## Documentation Lookup

Before implementing, check existing knowledge:

- **Internal** (decisions, patterns, conventions) → `knowledge` skill or read `docs/` directly
- **External** (library APIs, framework docs) → `/research --fast <topic>` for quick lookup, `/research --deep` for full sweep
- Context7 MCP is available for fetching latest library documentation
