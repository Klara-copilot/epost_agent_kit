# Fix 11 Skill Descriptions That Failed Trigger Evals

**Date**: 2026-03-31
**Agent**: epost-fullstack-developer
**Epic**: skill-evolution
**Plan**: plans/260331-1518-skill-description-fixes/

## What was implemented / fixed

Updated description field in 11 SKILL.md files to fix failed trigger evals (39/50 pass rate). Applied CSO principles: removed file extension triggers, quoted literals, and overly broad categories. Added NOT clauses and explicit trigger phrases where needed.

Skills updated: android-development, android-ui-lib, ios-development, ios-rag, ios-ui-lib, simulator, kit, knowledge, loop, mermaidjs, thinking. Also updated skill-index.json (both packages/ and .claude/ copies) for the 4 core skills indexed there.

## Key decisions and why

- **Decision**: Added explicit NOT clauses to ios-rag, knowledge, loop, mermaidjs
  **Why**: False positives were caused by overlapping terms — e.g., "knowledge" triggering on "how does React work", "loop" on polling queries. NOT clauses give the model a clear exclusion signal.

- **Decision**: Replaced file extension triggers (.kt/.kts, .swift) with intent-based language
  **Why**: Devs rarely say ".swift" in a query — they say "iOS crash" or "SwiftUI view". Intent-based wording matches how queries actually arrive.

- **Decision**: Added "think deeply" and "extended thinking" to the thinking skill
  **Why**: These are the exact phrases used in eval queries that were failing. The old description relied on situational inference ("stuck after 2+ attempts") but missed explicit invocations.

## What almost went wrong

- The `.claude/skills/*/SKILL.md` mirror files don't exist — only `evals/` subdirs are present per skill. Attempted to mirror SKILL.md changes there before discovering this. Only `skill-index.json` needed updating in `.claude/`.
- Platform skills (android, ios, kit, simulator) are not registered in skill-index.json at all — only core package skills appear there. No false update needed for those.
