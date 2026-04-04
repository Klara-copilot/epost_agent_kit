# Skill Creator — Detailed Workflow

## Phase 1: Capture Intent

Start by understanding user intent. Extract from conversation history if already present:
1. What should this skill enable Claude to do?
2. When should this skill trigger? (user phrases/contexts)
3. What's the expected output format?
4. Do we need test cases? (skills with verifiable outputs: yes; subjective skills: often no)

### Interview and Research

Ask about edge cases, input/output formats, example files, success criteria, dependencies. Check available MCPs for research. Wait before writing test prompts.

---

## Phase 2: Write SKILL.md

Fill in these components:

- **name** — skill identifier
- **description** — when to trigger + what it does; include specific trigger phrases; be "pushy" to combat undertriggering
- **compatibility** — required tools/dependencies (optional)
- **body** — practical instructions

### CSO Validation (run before test cases)

**Description checks:**
- [ ] Trigger conditions ONLY — no workflow steps, no tool names
- [ ] Key use case front-loaded (truncates at 250 chars)
- [ ] ≥2 quoted user phrases
- [ ] Starts with "Use when..." or equivalent
- [ ] Does NOT summarize the body (Description Trap)

**Discipline skill checks** (verification, review, audit, compliance):
- [ ] Iron Law block present
- [ ] Anti-Rationalization table
- [ ] Red Flags list

See `references/epost-skill-authoring-standards.md` for full CSO spec.

---

## Phase 3: Test Cases

Write 2-3 realistic test prompts. Share with user for approval. Save to `evals/evals.json`:

```json
{
  "skill_name": "example-skill",
  "evals": [
    {
      "id": 1,
      "prompt": "User's task prompt",
      "expected_output": "Description of expected result",
      "files": []
    }
  ]
}
```

See `references/schemas.md` for full schema including `assertions` field.

### Running Test Cases (continuous sequence — do not stop partway)

Workspace: `<skill-name>-workspace/` sibling to skill directory. Organize by `iteration-<N>/eval-<ID>/`.

**Step 1 — Spawn all runs in same turn** (with-skill AND baseline):

With-skill prompt:
```
Execute this task:
- Skill path: <path-to-skill>
- Task: <eval prompt>
- Input files: <eval files or "none">
- Save outputs to: <workspace>/iteration-<N>/eval-<ID>/with_skill/outputs/
```

Baseline: no skill (new skill) or old version snapshot (improving existing skill).

Write `eval_metadata.json` per eval with `eval_id`, `eval_name`, `prompt`, `assertions: []`.

**Step 2 — While runs in progress, draft assertions.** Add to `eval_metadata.json` and `evals.json`. Good assertions: objectively verifiable, descriptive names.

**Step 3 — Capture timing data** from task completion notifications → `timing.json`:
```json
{"total_tokens": 84852, "duration_ms": 23332, "total_duration_seconds": 23.3}
```

**Step 4 — Grade, aggregate, launch viewer:**

1. Spawn grader subagent (reads `agents/grader.md`). Save `grading.json`. Fields must be: `text`, `passed`, `evidence`.
2. Aggregate: `python -m scripts.aggregate_benchmark <workspace>/iteration-N --skill-name <name>`
3. Analyst pass: read benchmark, surface patterns (non-discriminating assertions, high-variance evals, time/token tradeoffs). See `agents/analyzer.md`.
4. Launch viewer:
   ```bash
   nohup python <skill-creator-path>/eval-viewer/generate_review.py \
     <workspace>/iteration-N \
     --skill-name "my-skill" \
     --benchmark <workspace>/iteration-N/benchmark.json \
     > /dev/null 2>&1 &
   ```
   Headless/Cowork: use `--static <output_path>` for standalone HTML.

5. Tell user: "I've opened results in your browser. Outputs tab for feedback, Benchmark tab for stats."

**Step 5 — Read feedback** from `feedback.json`. Empty = fine. Iterate on cases with complaints.

---

## Phase 4: Improve the Skill

### How to think about improvements

1. **Generalize** — skill must work across many prompts, not just test cases. Avoid overfitting.
2. **Keep lean** — remove things not pulling their weight. Read transcripts, not just outputs.
3. **Explain the why** — explain reasoning; avoid ALWAYS/NEVER in caps when explanation works better.
4. **Bundle repeated work** — if all test cases wrote the same helper script, put it in `scripts/`.

### Iteration loop

1. Apply improvements
2. Rerun all test cases into `iteration-<N+1>/`, including baseline runs
3. Launch reviewer with `--previous-workspace` pointing at previous iteration
4. Wait for user review
5. Repeat until: user happy, all feedback empty, or no meaningful progress

---

## Phase 5: Description Optimization

### Step 1 — Generate 20 eval queries (should-trigger + should-not-trigger)

```json
[
  {"query": "concrete detailed user prompt", "should_trigger": true},
  {"query": "near-miss prompt", "should_trigger": false}
]
```

Good queries: realistic, specific, have backstory. Bad queries: generic one-liners.
Near-misses for negatives — not obviously irrelevant.

### Step 2 — Review with user

1. Read `assets/eval_review.html`
2. Replace `__EVAL_DATA_PLACEHOLDER__`, `__SKILL_NAME_PLACEHOLDER__`, `__SKILL_DESCRIPTION_PLACEHOLDER__`
3. Write to `/tmp/eval_review_<skill-name>.html` and open
4. User edits, exports `eval_set.json` to Downloads

### Step 3 — Run optimization loop

```bash
node .claude/scripts/run-skill-optimize.cjs <skill-path> --eval-set <path> [--model <id>] [--max-iterations 5] [--verbose]
```

Splits 60/40 train/test, evaluates current description, proposes improvements, iterates up to 5x. Returns `best_description` by test score (avoids overfitting).

### Step 4 — Apply result

Update SKILL.md `description` with `best_description`. Show user before/after + scores.

---

## Kit Integration — npm Script Aliases

| Script | Purpose |
|--------|---------|
| `node .claude/scripts/run-skill-eval.cjs <skill-path>` | Run evaluation suite |
| `node .claude/scripts/run-skill-benchmark.cjs <ws/iter-N>` | Aggregate benchmark |
| `node .claude/scripts/run-skill-optimize.cjs <skill-path> --eval-set <path>` | Full optimization loop |
| `node .claude/scripts/run-skill-improve-desc.cjs <skill-path>` | One-shot description improvement |
| `node .claude/scripts/run-skill-report.cjs <loop-output.json>` | HTML report |
| `node .claude/scripts/run-skill-package.cjs <skill-path>` | Package to `.skill` file |

Prerequisites: `python3`, `pyyaml`, `claude` CLI on PATH.

---

## Blind Comparison (Advanced)

For rigorous A/B comparison between skill versions. Read `agents/comparator.md` and `agents/analyzer.md`. Requires subagents. Optional — human review loop is usually sufficient.

## Claude.ai Adaptations

- No subagents → run test cases sequentially, inline
- No browser → skip viewer, present results in conversation
- Skip quantitative benchmarking
- Skip description optimization (requires `claude` CLI)
- Blind comparison: skip (requires subagents)

## Cowork Adaptations

- Subagents available → main workflow applies
- No display → use `--static <output_path>` for viewer
- "Submit All Reviews" downloads `feedback.json` (no running server)
- GENERATE THE EVAL VIEWER *BEFORE* evaluating inputs yourself — get in front of human ASAP

## Updating an Existing Skill

- Preserve the original `name` frontmatter field unchanged
- Copy to writeable location before editing: `cp -r <skill-path> /tmp/<skill-name>/`
- Package from copy, not original path

## Packaging (if `present_files` tool available)

```bash
python -m scripts.package_skill <path/to/skill-folder>
```

Direct user to resulting `.skill` file.
