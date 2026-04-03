---
name: didyouknow
description: (ePost) Surfaces non-obvious kit capabilities, hidden flags, and skill combinations. Use when user says "did you know", "tips", "what can I do with the kit", "underused features", or asks about a specific topic like "testing tips" or "backend tips"
user-invocable: true
context: inline
metadata:
  argument-hint: "[<topic>] [--all]"
  keywords: [tips, didyouknow, discovery, hidden-features, skill-combinations]
  platforms: [all]
  triggers: ["did you know", "tips", "kit tips", "underused", "what else can", "hidden features"]
---

# Did You Know?

Surfaces non-obvious kit capabilities. Rotates daily or matches a topic.

## Step 0 — Determine Mode

| Argument | Behaviour |
|----------|-----------|
| *(none)* | Return today's rotating tip — use `dayOfYear % tipCount` to pick deterministically |
| `<topic>` | Keyword-match topic against tip tags → return best 1–3 matches |
| `--all` | Print all tips grouped by category |

For topic matching: read `references/tips.md`, scan each tip's `tags:` line for matches against `$ARGUMENTS` words. Return the tip(s) with the most tag overlap. If no match → return today's tip + "No tips matched '<topic>' — showing today's tip instead."

## Step 2 — Format Single Tip

```
💡 Did You Know? — <Tip Title>

<Tip body — 3-6 lines max>

Example:
  <concrete usage example>

Related: <skill or flag to explore next>

---
/didyouknow <topic>  to search by topic  |  /didyouknow --all  to browse all tips
```

## Step 3 — Format --all

Group tips by category. Show title + one-line summary per tip. Don't expand full body.

```
## Kit Tips — All Categories

### Hidden Flags
- TIP-001: `test --scenario` — 12-dimension edge case generator before writing tests
- TIP-002: `test --visual` — Playwright screenshot regression testing
...

### Skill Combinations
- TIP-010: scenario → test → git — the full TDD flow
...
```

## Rules

- Single tip mode: body max 6 lines — if more is needed, point to the skill
- Never invent tips — only surface what is actually in `references/tips.md`
- Topic match: partial word match is fine (`form` matches `forms`, `web-forms`)
