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

Tone: sharp colleague dropping a useful shortcut. Output must render cleanly in plain text and Slack — no markdown bold (`**`), no triple backticks.

```
💡 Did You Know? — <Skill Name>

<Hook sentence — what problem this solves or what most people miss. 1 line.>

<2–3 lines of the actual insight. Specific. Actionable. No filler.>

Example:
  <concrete invocation or pattern — indented 2 spaces, not fenced>

Go deeper: <references/filename.md> or combine with /<related-skill>

---
/didyouknow <topic>  ·  /didyouknow --all
```

**For `--all` mode**, plain grouped list:

```
Kit Skills at a Glance

[Category]
  /<skill> — <one-liner: what it does, not what it is>
  ...
```

## Rules

- Hook first — lead with the payoff, not the setup
- Plain text only — no `**bold**`, no triple backtick fences, no `→` arrows
- Examples: indent 2 spaces under "Example:" label, never fenced code block
- One insight per tip — don't stack multiple tricks
- Non-obvious only — skip primary purpose, surface flags/combos/constraints most users miss
- Never invent capabilities — only surface what exists in the actual SKILL.md
- Topic match: partial word is fine (`form` matches `web-forms`, `forms`)
