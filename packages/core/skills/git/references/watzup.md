# --watzup

Review current branch state and generate an EOD/handoff summary. No implementation.

## Steps

1. Run `git log origin/HEAD..HEAD --oneline` — commits since last push
2. Run `git diff origin/HEAD..HEAD --stat` — files changed
3. Run `git status --short` — current working tree state
4. Summarize:
   - What was built/changed (feature/fix/refactor)
   - Files touched and impact scope
   - Quality notes (test coverage, edge cases addressed)
   - What remains (staged/unstaged, in-progress)
   - Suggested next steps

## Output Format

```
## Session Wrap-up — {date}

### What changed (since last push)
[bullet list of commits with context]

### Impact
[scope: components/files affected, risk level]

### Status
- ✅ Done: [list]
- 🔄 In progress: [list if any unstaged/WIP]
- ⏳ Next: [suggested follow-up]
```

Keep factual, no padding.
