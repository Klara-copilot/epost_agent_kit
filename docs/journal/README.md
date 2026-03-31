# Development Journal

Implementation history organized by epic. Written automatically by agents after significant work.

## Structure

```
docs/journal/
  {epic-slug}/
    YYMMDD-{feature-slug}.md   — implementation entry
    YYMMDD-{bug-slug}.md       — debug/fix entry
```

## When to write

| Trigger | Agent | Writes to |
|---------|-------|-----------|
| Feature phase completed | epost-fullstack-developer | `journal/{epic}/YYMMDD-{feature}.md` |
| Hard bug resolved | epost-debugger | `journal/{epic}/YYMMDD-fix-{bug}.md` |
| Key decision made | epost-planner | `journal/{epic}/YYMMDD-decision-{slug}.md` |

## Epic naming

Use the plan slug or feature domain as the epic folder name:
- `skill-discovery/` — skill discovery improvements
- `web-platform/` — web platform features
- `a11y/` — accessibility work
- `kit/` — kit authoring changes
- `design-system/` — design system development

## Entry template

```markdown
# {Title}

**Date**: YYYY-MM-DD
**Agent**: epost-{name}
**Epic**: {epic-slug}
**Plan**: plans/{plan-slug}/ (if applicable)

## What was implemented / fixed
{concise description}

## Key decisions and why
- **Decision**: {what was decided}
  **Why**: {rationale, trade-offs considered}

## What almost went wrong
{risks encountered, near-misses, gotchas to remember}
```
