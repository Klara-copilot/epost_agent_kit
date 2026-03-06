# Plan Templates

Select the right template based on what you're planning.

| Template | When | Token budget |
|----------|------|-------------|
| [feature-plan.md](feature-plan.md) | New feature or capability | plan.md <= 80 lines |
| [bug-fix-plan.md](bug-fix-plan.md) | Bug investigation + fix | plan.md <= 80 lines |
| [refactor-plan.md](refactor-plan.md) | Code quality / architecture cleanup | plan.md <= 80 lines |
| [research-plan.md](research-plan.md) | Technical research before implementation | plan.md <= 80 lines |

## Naming Convention

```
plans/{YYMMDD-HHMM-slug}/
  plan.md              — overview (<=80 lines), required YAML frontmatter
  phase-{N}-{slug}.md  — one file per phase
```

## Platform Tags

Use one of: `web` `ios` `android` `backend` `kit` `all`

## Agent Handoff

```
epost-planner → creates plan
epost-fullstack-developer → implements phases
epost-code-reviewer → reviews output
epost-tester → validates
```

After creating a plan, run:
```
node .claude/scripts/set-active-plan.cjs plans/{slug}
```
