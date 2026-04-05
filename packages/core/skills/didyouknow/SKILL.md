---
name: didyouknow
description: (ePost) Surfaces non-obvious kit capabilities, hidden flags, and skill combinations. Use when user says "did you know", "tips", "what can I do with the kit", "underused features", or asks about a specific topic like "testing tips" or "backend tips"
argument-hint: "[<topic>] [--all]"
user-invocable: true
context: inline
model: haiku
metadata:
  keywords: [tips, didyouknow, discovery, hidden-features, skill-combinations]
  platforms: [all]
  triggers: ["did you know", "tips", "kit tips", "underused", "what else can", "hidden features"]
---

# Did You Know?

Surfaces non-obvious kit capabilities dynamically from the live skill index. Always current — no static tip list to maintain.

## Step 0 — Determine Mode

| Argument | Behaviour |
|----------|-----------|
| *(none)* | Today's rotating tip — read skill-index, pick by `dayOfYear % skillCount` |
| `<topic>` | Keyword-match topic against skill keywords → surface tip from best-matched skill |
| `--all` | List all skills grouped by category with one-line hook each |

## Step 1 — Load Source

Read `.claude/skill-index.json` — this is the live index of all installed skills.

## Step 2 — Pick Skill

**Rotating (no args)**:
- Calculate `dayOfYear` (Jan 1 = 1)
- `index = dayOfYear % totalSkills`
- Pick skill at that index from the index array

**Topic match**:
- Match `$ARGUMENTS` words against each skill's `keywords` and `description`
- Pick the 1–3 skills with most overlap
- If no match → fall back to rotating tip + note "No match for '<topic>' — showing today's tip"

**--all**:
- Group skills by their package/category
- Show `name` + first sentence of `description` per skill
- No full body expansion

## Step 3 — Surface the Tip

For the selected skill:
1. Read its `SKILL.md` from `.claude/skills/{name}/SKILL.md`
2. Identify the most non-obvious thing: a hidden flag, a reference file, a combination with another skill, or a constraint most users miss
3. If the skill has a `references/` directory — mention one reference file by name as a "go deeper" pointer

## Step 4 — Format Output

```
💡 Did You Know? — <Skill Name>

<Non-obvious insight — 3-5 lines max>

Example:
  <concrete usage, command, or pattern>

Go deeper: <references/filename.md or related skill>

---
/didyouknow <topic>  to search by topic  |  /didyouknow --all  to browse all skills
```

## Rules

- Max 5 lines in tip body — point to the skill for details, don't expand here
- Never invent capabilities — only surface what exists in the actual SKILL.md
- Non-obvious only: skip the skill's primary purpose (user already knows that), surface what they'd miss
- Topic match: partial word is fine (`form` matches `web-forms`, `forms`)
