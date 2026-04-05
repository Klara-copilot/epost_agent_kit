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

## Three-Layer Knowledge Authority

Knowledge lives in one of three layers (see ARCH-0003):
- **Layer 0** — `epost_agent_kit` skills: org-wide standards, ground truth, never repo-derived
- **Layer 1** — `epost_knowledge_base`: cross-repo context, dependency graph, domain synthesis
- **Layer 2** — per-repo `docs/`: implementation-specific, deviations from Layer 0 only

**CONV-* scope rule**: A CONV doc answers "how does this repo differ from the org standard?" — never "what is the org standard?" If CONV content restates a Layer 0 skill → delete it. Only deviations belong in CONV.

**Deviation rule**: If a repo deviates from a Layer 0 standard → document it as BOTH:
- `CONV-*` — the valid local convention ("this repo uses X because Y")
- `FINDING-*` — the deviation signal ("deviates from Layer 0 standard Z")

The CONV records the working reality. The FINDING feeds Layer 1 aggregation so deviations across repos can be reviewed, and decisions made: adopt the deviation into Layer 0, or fix Layer 2 repos to align.

**Authority order**: Layer 0 wins over Layer 1 wins over Layer 2. When layers conflict, the higher layer is correct.

## Documentation Lookup

Before implementing, check existing knowledge:

- **Internal** (decisions, patterns, conventions) → `knowledge` skill or read `docs/` directly
- **External** (library APIs, framework docs) → `/research --fast <topic>` for quick lookup, `/research --deep` for full sweep
- Context7 MCP is available for fetching latest library documentation
