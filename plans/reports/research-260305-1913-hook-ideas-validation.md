# Hook Ideas Validation
*Evaluating brainstorm against: (1) Kit automation value, (2) Dev value, (3) Technical feasibility & safety*

---

## Scoring Key
- ✅ IMPLEMENT — passes all 3 criteria
- ⚠️ DEFER — passes 2/3 or has a fixable concern
- ❌ SKIP — fails on 1+ criterion, or violates YAGNI/KISS

---

## A. Reliability / Infrastructure

### Crash wrapper pattern (all hooks)
| Criterion | Verdict | Reason |
|---|---|---|
| Kit automation | ✅ | Silent hook crashes = invisible failures; `.logs/hook-log.jsonl` enables debugging |
| Dev value | ✅ | When a hook silently dies, dev doesn't know why behavior is missing |
| Doable / safe | ✅ | Pure Node.js, append-only write, always exits 0. Proven in ClaudeKit. |

**→ ✅ IMPLEMENT** — Our hooks currently have no outer crash wrapper. A silent crash in `session-init.cjs` means no plan context, no rules injection — invisible. Low effort, high reliability gain.

---

### `isHookEnabled()` toggle system
| Criterion | Verdict | Reason |
|---|---|---|
| Kit automation | ✅ | Per-project hook disable without editing settings.json |
| Dev value | ⚠️ | How often do users actually need to disable individual hooks? |
| Doable / safe | ✅ | Reads `.ck.json` boolean, simple |

**→ ⚠️ DEFER** — Adds a second config mechanism alongside `settings.json`. Violates KISS. Real use case is unclear — if a hook is annoying, remove it from settings.json instead. Revisit if there's a concrete "I want to disable X for this project" request.

---

## B. PreToolUse Guards

### `packages-guard` — PreToolUse(Write|Edit)
| Criterion | Verdict | Reason |
|---|---|---|
| Kit automation | ✅ | `.claude/` is generated — direct edits are wiped on next init |
| Dev value | ✅ | #1 most expensive mistake documented in MEMORY.md. Immediate feedback loop. |
| Doable / safe | ✅ | Check `tool_input.file_path` starts with `.claude/`; only activate when `packages/` dir exists (smart detection avoids false positives on non-kit projects) |

**→ ✅ IMPLEMENT** — Smart guard: `if (packages/ exists && file_path starts with .claude/) → block`. The condition on `packages/` presence makes it kit-aware and safe for normal Claude Code projects that don't use this kit.

---

### `plan-file-guard` — PreToolUse(Write) — block .md outside plans/ or docs/
| Criterion | Verdict | Reason |
|---|---|---|
| Kit automation | ⚠️ | Enforces CLAUDE.md rule, but agents still need to write SKILL.md, README.md, CLAUDE.md |
| Dev value | ⚠️ | Low — most violations are caught by code review anyway |
| Doable / safe | ❌ | Too many false positives: SKILL.md, README.md, AGENTS.md, CLAUDE.md are all `.md` outside plans/docs. No reliable way to distinguish "report" from "doc" from "skill". |

**→ ❌ SKIP** — False positive rate too high. The rule in CLAUDE.md is sufficient.

---

### `commit-message-validator` — PreToolUse(Bash)
| Criterion | Verdict | Reason |
|---|---|---|
| Kit automation | ⚠️ | Conventional commits matter, but Claude is already compliant most of the time |
| Dev value | ⚠️ | Low marginal gain — git hooks handle this at the repo level |
| Doable / safe | ❌ | Parsing `git commit -m "..."` from arbitrary bash commands is fragile — heredocs, multiline strings, aliases, sub-shells all break simple regex. PreToolUse can BLOCK, making a parse failure into a hard block. |

**→ ❌ SKIP** — Fragile parser + aggressive blocking = risk of breaking the git workflow. Enforce at the project git-hooks level instead.

---

## C. PostToolUse Triggers

### `post-edit-skill-reminder` — PostToolUse(Edit|Write)
| Criterion | Verdict | Reason |
|---|---|---|
| Kit automation | ✅ | Edit SKILL.md → forget to regenerate skill-index.json is a documented recurring gotcha |
| Dev value | ✅ | Direct workflow improvement for kit authors |
| Doable / safe | ✅ | Check `tool_input.file_path` contains `SKILL.md` → inject `additionalContext` reminder. PostToolUse is non-blocking by design. |

**→ ✅ IMPLEMENT** — Targeted detection: only fires when `SKILL.md` is in the written path. Single-line reminder: *"SKILL.md modified — run `node .claude/scripts/generate-skill-index.cjs` to update the index."*

---

### `post-init-validate` — PostToolUse(Bash) after `epost-kit init`
| Criterion | Verdict | Reason |
|---|---|---|
| Kit automation | ⚠️ | Init already surfaces errors; reminder is low-signal |
| Dev value | ⚠️ | Marginal — devs who run init know to validate |
| Doable / safe | ✅ | Simple command substring check |

**→ ⚠️ DEFER** — Low priority. The validate step can be added to the init output itself rather than a hook.

---

## D. SubagentStop Workflow Chains

### `cook-after-plan-reminder` — SubagentStop
| Criterion | Verdict | Reason |
|---|---|---|
| Kit automation | ✅ | Connects plan → implementation phases automatically |
| Dev value | ✅ | "What do I do after planning?" is a real moment of friction |
| Doable / safe | ✅ | ClaudeKit proven this pattern. Advisory only (console.log), exits 0. |

**→ ✅ IMPLEMENT** — **One concern to resolve**: does the `SubagentStop` matcher match on `agent_type` string (declared in agent frontmatter) or the agent filename? If matcher = `Plan` and our agent is `epost-planner`, it won't fire. Need to verify matcher semantics before implementing. Prototype with `*` matcher first, then narrow.

---

### `review-after-cook-reminder` — SubagentStop(Cook)
| Criterion | Verdict | Reason |
|---|---|---|
| Kit automation | ✅ | Enforces cook → review workflow |
| Dev value | ⚠️ | Could be noisy — cook subagent fires frequently, not every cook needs a review reminder |
| Doable / safe | ✅ | Same pattern as above |

**→ ⚠️ DEFER** — Implement cook-after-plan first, see if the pattern is useful, then extend to review-after-cook. Don't over-chain.

---

## E. SessionStart Enhancements

### Compact context approval-state warning
| Criterion | Verdict | Reason |
|---|---|---|
| Kit automation | ✅ | Approval state loss after compaction is a real safety risk (issue documented in ClaudeKit) |
| Dev value | ✅ | Prevents Claude from proceeding past approval gates after context loss |
| Doable / safe | ✅ | `if (source === 'compact')` — already in ClaudeKit's session-init. 3-line addition to our existing hook. |

**→ ✅ IMPLEMENT** — Extend existing `session-init.cjs`. No new hook needed.

---

### Stale `skill-index.json` detection
| Criterion | Verdict | Reason |
|---|---|---|
| Kit automation | ✅ | Stale index = broken skill discovery = wrong routing |
| Dev value | ✅ | Easy mtime comparison, high signal when stale |
| Doable / safe | ✅ | Compare `mtime(skill-index.json)` vs newest `SKILL.md` in packages/. Advisory only. |

**→ ✅ IMPLEMENT** — Extend `session-init.cjs`. Only activates when `packages/` dir exists (kit repo context). Inject one-line warning if stale.

---

## F. UserPromptSubmit Enhancements

### `platform-signal-inject`
| Criterion | Verdict | Reason |
|---|---|---|
| Kit automation | ⚠️ | Smart routing is already in CLAUDE.md |
| Dev value | ⚠️ | Low marginal gain |
| Doable / safe | ❌ | Parsing user prompts for file extension "signals" has very high false positive rate — user can mention `.tsx` in a discussion, not necessarily indicating platform context |

**→ ❌ SKIP** — CLAUDE.md handles routing. Hook-level prompt parsing is fragile and noisy.

---

### `active-plan-reminder` — UserPromptSubmit
| Criterion | Verdict | Reason |
|---|---|---|
| Kit automation | ✅ | Keeps plan alive between prompts |
| Dev value | ⚠️ | Already covered |
| Doable / safe | ✅ | — |

**→ ❌ SKIP (redundant)** — `dev-rules-reminder.cjs` already injects plan context with `wasRecentlyInjected` dedup. Adding a second hook for the same purpose violates DRY.

---

## G. Stop Enhancements

### Session metrics — transcript parsing (replace broken prompt hook)
| Criterion | Verdict | Reason |
|---|---|---|
| Kit automation | ✅ | Rich session data (skills loaded, errors, rework) feeds the auto-improvement pipeline |
| Dev value | ✅ | Without this, session-metrics only captures git diffs; lesson-capture has no signal to evaluate |
| Doable / safe | ⚠️ | Transcript parsing is complex — JSON Lines format, large files. Needs careful implementation with size limits. |

**→ ✅ IMPLEMENT (cautious scope)** — Extend `session-metrics.cjs` to scan transcript for skill activation signals (e.g. lines matching known skill names) and tool usage counts. Do NOT try to parse errors from transcript text (too fragile). Keep it: count tool calls by type, detect skill triggers by keyword. Size limit: read last 50 lines of transcript only.

---

## Final Validation Matrix

| Idea | Kit Auto | Dev Value | Safe | Verdict |
|---|---|---|---|---|
| Crash wrapper (all hooks) | ✅ | ✅ | ✅ | **✅ IMPLEMENT** |
| `packages-guard` PreToolUse | ✅ | ✅ | ✅ | **✅ IMPLEMENT** |
| `post-edit-skill-reminder` PostToolUse | ✅ | ✅ | ✅ | **✅ IMPLEMENT** |
| `cook-after-plan-reminder` SubagentStop | ✅ | ✅ | ✅ | **✅ IMPLEMENT** |
| Compact warning (session-init) | ✅ | ✅ | ✅ | **✅ IMPLEMENT** |
| Stale skill-index hint (session-init) | ✅ | ✅ | ✅ | **✅ IMPLEMENT** |
| session-metrics transcript scan | ✅ | ✅ | ⚠️ | **✅ IMPLEMENT (scoped)** |
| `isHookEnabled()` toggle | ✅ | ⚠️ | ✅ | **⚠️ DEFER** |
| `post-init-validate` | ⚠️ | ⚠️ | ✅ | **⚠️ DEFER** |
| `review-after-cook-reminder` | ✅ | ⚠️ | ✅ | **⚠️ DEFER** |
| `plan-file-guard` | ⚠️ | ⚠️ | ❌ | **❌ SKIP** |
| `commit-message-validator` | ⚠️ | ⚠️ | ❌ | **❌ SKIP** |
| `platform-signal-inject` | ⚠️ | ⚠️ | ❌ | **❌ SKIP** |
| `active-plan-reminder` | ✅ | ❌ | ✅ | **❌ SKIP (redundant)** |

---

## Implementation Order (by risk-adjusted value)

1. **Crash wrapper** — apply to all 8 existing hooks in packages/core/hooks/ (15 min, infrastructure)
2. **Compact warning** + **stale skill-index hint** — extend session-init.cjs (20 min, extend existing)
3. **`packages-guard`** — new PreToolUse hook (30 min, new hook)
4. **`post-edit-skill-reminder`** — new PostToolUse hook (20 min, new hook)
5. **`cook-after-plan-reminder`** — new SubagentStop hook (20 min, new hook + verify matcher)
6. **session-metrics transcript scan** — extend session-metrics.cjs (30 min, careful scope)

---

*Unresolved questions:*
- `SubagentStop` matcher: does it match `agent_type` from frontmatter or the agent filename? If agent filename, our matcher would be `epost-planner` not `Plan`.
- `CLAUDE_ENV_FILE`: is this available in our hooks the same as ClaudeKit? Our session-init uses it — verify it's populated before extending.
- Transcript path format: is `transcript_path` in the Stop hook payload? Need to confirm before scoping session-metrics extension.
