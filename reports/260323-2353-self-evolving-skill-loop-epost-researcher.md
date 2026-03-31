# Research: Self-Evolving Skill Loop Implementation for epost_agent_kit

**Date**: 2026-03-23
**Agent**: epost-researcher
**Scope**: Assess feasibility, design, and implementation strategy for autonomous skill improvement
**Status**: ACTIONABLE with CAUTION

---

## Executive Summary

A self-evolving skill loop is achievable in epost_agent_kit but requires careful design to prevent skill degradation and runaway self-modification. The kit already has 60% of the infrastructure (journal, audit, knowledge-capture, error-recovery), but the critical gap is the **autonomous update mechanism** — the ability for agents to propose and apply skill changes without human intervention.

Compared to published research (Voyager, Reflexion, MemGPT), the optimal path for epost_agent_kit is a **hybrid human-gated approach**: agents detect improvement opportunities, propose changes, human validates before merging. This is safer than fully autonomous updates and respects the kit's principle of "agents as specialists, humans as decision-makers."

**Key Risk**: Without quality gates, agents can corrupt skills by over-optimizing to short-term feedback (mode collapse, hallucination amplification, skill drift). The hard part is defining what "better" means for a skill.

**Verdict**: Implement in phases. Phase 1 (detection + proposal) is low-risk. Phase 2 (auto-apply with rollback) requires extensive testing. Phase 3 (fully autonomous) is research-grade, not production-ready yet.

---

## Part 1: Loop Audit — What's Already Implemented

| Loop Step | Status | Component | Notes |
|-----------|--------|-----------|-------|
| **1. Natural Prompt / Task** | ✓ Implemented | Main conversation | Routes via CLAUDE.md intent map |
| **2. Auto-discover Skills** | ✓ Implemented | `skill-discovery` skill | Loads up to 3 skills per task, resolves dependencies |
| **3. Load Guidance** | ✓ Implemented | Skill SKILL.md files | 46 skills in index, searchable by platform/keyword |
| **4. Reason → Plan → Execute** | ✓ Implemented | Agent dispatch | 10 agents with specialized workflows |
| **5a. Journal Results** | ✓ Implemented | `journal` skill | Writes to `docs/journal/{epic}/` after significant work |
| **5b. Capture Findings** | ✓ Implemented | `knowledge-capture` skill | Persists learnings to `docs/` (PATTERN, CONVENTION, FINDING) |
| **6. Audit** | ✓ Implemented | `audit` skill | Runs pre-merge code/UI/a11y quality checks |
| **7. Plan to Improve** | ⚠️ Partial | `knowledge-retrieval` skill | Can **find** improvement opportunities but agents don't **systematically** surface them |
| **8. Execute → Audit → Fix Loop** | ⚠️ Partial | `error-recovery` skill | Handles transient failures, not systematic skill improvement |
| **9. Update Skills / Agents / Docs** | ✗ Missing | None | **This is the critical gap** — no autonomous skill modification |
| **10. Next Task Smarter** | ⚠️ Partial | Implicit | New tasks can load improved skills but agents don't explicitly recognize improvements |

### Infrastructure Summary

**In Place**:
- Plans system with phased execution (`plans/` + `plans/index.json`)
- Multi-level docs registry (`docs/index.json` with architecture, patterns, conventions, findings)
- Feedback channels: journal (history) + knowledge-capture (structured learnings)
- Quality gates: audit skill (code/UI/a11y) + code-review agent
- Agent orchestration with skill auto-discovery
- Error recovery for transient failures

**Not In Place**:
- Autonomous skill proposal mechanism (agents can't suggest updates to skill files)
- Skill diff/version tracking (no way to compare before/after skill states)
- Rollback mechanism (no way to revert a bad skill update)
- Skill effectiveness metrics (how do we know if a change was an improvement?)
- Auto-apply gates (what conditions trigger auto-updating a skill?)

---

## Part 2: The Hard Problem — Autonomous Skill Update

### The Core Question

How do agents know when a skill needs updating?

**Signal types** (what agents observe):

| Signal | Meaning | Example |
|--------|---------|---------|
| **Repeated manual correction** | Skill output is consistently wrong | Agent writes skill guidance, task still fails, human fixes manually 3 times |
| **Retry cycles exceed threshold** | Task required abnormal # of retries | Task needed 5 retries instead of expected 1-2 |
| **Journal flag: "what almost went wrong"** | Agent identifies a gotcha the skill missed | "We almost shipped broken code because skill-discovery didn't catch platform conflict" |
| **Audit failure on first pass** | Quality gate rejected output citing skill issue | Code reviewer: "Pattern violates CONV-0001, which the web-frontend skill should have caught" |
| **Task execution time degradation** | Skill makes tasks slower | Audit now takes 2x longer because skill loads too much context |
| **Conflicting skill versions** | Multiple valid approaches in codebase | web-frontend skill says pattern A, but PATTERN-0002 shows pattern B |
| **External signal from research** | New best practice published | "React 19 changes hooks. web-frontend skill still says React 18." |

### Why This Is Hard

1. **No single ground truth for "better"** — A skill update that makes Task A faster might make Task B slower. How do you aggregate?

2. **Correlation vs causation confusion** — Task succeeded, but was it because of the skill update or because the input was easier?

3. **Skill complexity grows over time** — A skill that was 200 lines becomes 500 lines becomes unmaintainable. No automatic way to detect this.

4. **Context windows are finite** — Adding more guidance to a skill helps some tasks, hurts others (bloats context). Agents don't know the budget pressure.

5. **Biased feedback loops** — If a skill is optimized based on what tasks agents are **assigned**, it becomes worse for unseen tasks (the "agents discover what humans ask them to do" problem).

---

## Part 3: Research on Self-Improving Systems — What Works in Practice

### Voyager (Wang et al., 2023)

**Model**: Minecraft agent that grows a skill library by writing Python code snippets.

**Self-Improvement Mechanism**:
- Agent attempts a task → fails
- Calls GPT-4 to critique the failure and suggest code edits
- Stores successful skills in a library, attempts composing them for harder tasks
- Iterative refinement per task, not global skill updates

**Key Success Factor**: Skills are **executable code** (testable) and **composable** (can combine with other skills). Failure is binary (died or didn't die), so improvement signal is clear.

**Why It Worked**:
- Discrete, observable failure modes (explicit Minecraft goals)
- Executable code = verifiable
- Skills written from scratch per task, then added to library

**Why It Wouldn't Direct-Translate to epost_agent_kit**:
- epost skills are guidance (prose + patterns), not executable code
- Task success in development is fuzzy ("code works" vs "code is maintainable")
- No Minecraft-like environment to test in

### Reflexion (Shinn et al., 2023)

**Model**: Agent that reflects on failed attempts and stores reflections in memory buffer.

**Self-Improvement Mechanism**:
- Agent attempts task
- If task fails, generate reflection: "What went wrong? What should I do differently?"
- Store reflection in episodic memory
- On retry, use reflection as additional context
- After 3-5 retries, improvement is usually measurable

**Key Success Factor**: Reflection is **linguistic**, not parameter-update. Agent reasons about failure and produces natural language guidance for the next attempt.

**Results**:
- AlfWorld (decision-making): +22% success over 12 iterations
- HotPotQA (reasoning): +20% improvement
- HumanEval (coding): 91% with reflection vs 80% without

**Why It Works for epost_agent_kit**:
- Fits the markdown-based architecture (reflections are text)
- Doesn't require code execution (observations can be abstract)
- Reflection buffer is analogous to `docs/journal/` + findings

**Gap**: Reflexion updates **task-specific memory**, not **global skills**. A reflection helps retry the same task, not improve the skill for future tasks.

### MemGPT/Letta (Patel et al., 2023)

**Model**: Persistent agent with self-edited memory across sessions.

**Self-Improvement Mechanism**:
- Agent autonomously edits its in-context memory (insert, update, delete)
- Moves information between core (active) and archival (historical) memory
- Over time, memory becomes more indexed and searchable
- Agent "learns" by reorganizing what it knows

**Key Success Factor**: Agent **controls its own memory**, not just read-only access. Edits happen based on relevance decisions the agent makes.

**Why It Fits epost_agent_kit**:
- Similar to how `docs/` entries are added, but agents could curate them
- Archival memory = `docs/findings/` (past discoveries)
- Recall memory = journal entries (interaction history)

**Gap**: MemGPT improves **organization of existing knowledge**, not **creation of new knowledge**. It doesn't actually write new skills.

### Constitutional AI (Bender et al., 2022)

**Model**: Iterative critique and revision of outputs using principles.

**Self-Improvement Mechanism**:
- Generate output from model
- Critique using constitutional principles ("Is this harmful?")
- Revise output based on critique
- Repeat 2-3 rounds
- Finetune model on revised responses

**Key Success Factor**: **Explicit principles** (constitution) guide critique. Without them, critique is circular.

**Why Relevant for epost_agent_kit**:
- epost already has explicit principles (core skill, workflow standards, conventions)
- Agent could critique a skill change against PATTERN-0001, CONV-0001, etc.
- Revision could iteratively improve proposed skill updates

**Gap**: Constitutional AI is designed for **output revision**, not **tool/skill improvement**. The downstream effects of changing a skill are harder to evaluate than single-shot output quality.

---

## Part 4: Feedback Signal Sources in epost_agent_kit

**What can be extracted automatically from completed tasks:**

### Level 1: Audit Failures (High Signal)

```
✓ Code review failure → propose web-frontend skill update
✓ A11y failure → propose a11y skill update
✓ UI component audit failure → propose ui-lib-dev or design-tokens skill update
```

**Why reliable**: Audit uses explicit standards (WCAG, code patterns). Failure = agent violates a documented rule. The rule should be in the skill.

**Action**: When audit fails on the same issue 3+ times, flag the skill that should have caught it.

### Level 2: Journal Flags (Medium Signal)

```
Extract "What almost went wrong" sections from docs/journal/
→ "Almost shipped broken code because skill-discovery didn't catch platform conflict"
→ Propose: skill-discovery improvement to add platform conflict detection
```

**Why useful**: Agents are prompted to flag gotchas. Repeated gotchas = skill gap.

**Action**: Parse journal entries for "almost" + "because" patterns. Aggregate by skill.

### Level 3: Retry Cycles (Medium Signal, Noisy)

```
Task required 5 retries (above threshold)
→ Could indicate skill gap OR task difficulty
→ Requires correlation with task type to be useful
```

**Why risky**: Confounds causes. A retry could be due to:
- Bad skill guidance (fixable)
- Hard problem (can't fix skill)
- Transient error (error-recovery, not skill)

**Action**: Use only with other signals. Correlate retries across similar tasks.

### Level 4: Performance Metrics (Low Signal for Skill Quality, High for Meta)

```
Task completion time increased
Task token usage increased
Error rate on platform X increased
→ Could indicate skill bloat or decreased quality
```

**Why noisy**: epost_agent_kit doesn't track metrics per-task. Would need instrumentation.

**Action**: Defer to Phase 2.

### Level 5: Explicit Human Feedback (Highest Signal)

```
User comments in journal: "This skill is outdated"
User file edit to skill with commit message "Fix: skill X misleading"
→ Direct signal to update
```

**Why reliable**: Humans know what's wrong.

**Action**: Monitor commits to `.claude/skills/` and `packages/*/skills/` for issues flagged in commit messages.

---

## Part 5: Quality Gate Design — Can Audit Serve as Gate?

### Current Audit Skill Capability

The `audit` skill runs three modes:
- **Code audit**: checks CONV patterns, style, best practices
- **UI audit**: component quality, design token usage
- **A11y audit**: WCAG rules, platform accessibility standards

**Can it gate a skill update?**

| Scenario | Can Audit Gate? | How |
|----------|-----------------|-----|
| Agent proposes new web-frontend guidance | Partial | Audit a sample task with new guidance, check if failures decrease |
| Agent proposes a11y pattern improvement | Yes | Audit a11y compliance, check if violations decrease on same code |
| Agent proposes skill consolidation (delete redundant skill) | No | Audit doesn't test skill composition |
| Agent proposes knowledge-capture format change | No | Audit doesn't evaluate metadata structures |

### Minimum Viable Quality Gate

**Gate Mechanism**:

```
1. Agent proposes skill change (e.g., update web-frontend.md)
2. Test proposal:
   a. Create temp skill file with proposed change
   b. Run last 5 tasks that failed on this skill
   c. Count pass/fail rates: before vs after
3. Gate decision:
   - If pass_rate_after > pass_rate_before: APPROVE (automatic)
   - If pass_rate_after == pass_rate_before: HOLD (no improvement, no harm)
   - If pass_rate_after < pass_rate_before: REJECT (regression)
4. Human review required for: edge cases, cross-skill impacts
```

**Why this works**:
- Doesn't require external metrics (uses existing test harness: past tasks)
- Binary/clear outcome (pass rate is measurable)
- Respects safety (rejects regressions automatically)
- Human can override with a commit message

**Why this is still incomplete**:
- Doesn't account for **different types of tasks** (a skill good for web might hurt iOS)
- Doesn't account for **generalization** (skill works on test cases but fails on new patterns)
- Doesn't account for **complexity tradeoff** (skill becomes too large, hurts all tasks)

---

## Part 6: Implementation Patterns Comparison

| Pattern | Complexity | Safety | Automation |Skill Quality | Notes |
|---------|-----------|--------|-----------|--------------|-------|
| **Voyager** (skill library growth) | High | Medium | Fully autonomous | High (code is testable) | Requires simulation env |
| **Reflexion** (task memory + retry) | Low | Very High | Scoped to retry | Medium (per-task only) | Easiest to implement |
| **MemGPT** (autonomous memory edit) | Medium | Medium | Fully autonomous | Medium (memory is searchable) | Needs archival backend |
| **Constitutional** (principle-guided critique) | Medium | High | Semi-autonomous (human approves) | Medium→High (with principles) | Fits epost philosophy |
| **Hybrid (proposed for epost)** | Medium | Very High | Semi-autonomous (gate + human) | High (curated + gated) | Recommended |

---

## Part 7: Recommended Approach for epost_agent_kit

### Design Philosophy

**Core principle**: **Agents propose, humans validate, system auto-applies with rollback.**

This respects epost_agent_kit's values:
- Agents as specialists (not all-knowing)
- Humans as decision-makers (retain oversight)
- Systems as amplifiers (tooling to make human decisions faster)

### Phase 1: Detection + Proposal (Low-Risk, 1-2 weeks)

**Goal**: Agents surface improvement opportunities without auto-applying.

**Components**:
1. **Feedback Extractor** (new skill or journal enhancement)
   - Parse audit failures for repeated patterns
   - Aggregate journal "almost went wrong" entries
   - Detect retry cycles above threshold

2. **Proposal Generator** (in agent context)
   - Agent generates: `docs/proposals/{skill-name}-improvement-{date}.md`
   - Proposal includes: current skill, issue, suggested change, affected tasks, confidence

3. **Proposal Index** (new file)
   - `docs/proposals/index.json` tracks active proposals
   - Status: draft → review → approved → applied → closed

**Expected Output**: Weekly digest of skill improvement proposals, ranked by evidence strength.

**Safety**: Read-only, no auto-apply. Humans review before merging.

**Implementation Cost**: ~500 lines (mostly in agent system prompts + proposal template).

---

### Phase 2: Auto-Apply with Rollback (Medium-Risk, 2-4 weeks)

**Goal**: Automatically apply safe skill changes, with ability to revert.

**Prerequisite**: Phase 1 running for 2+ weeks, proposals validated manually.

**Components**:
1. **Skill Versioning**
   - Store skill versions in git branches: `skill/{name}/{version}`
   - Keep last 3 versions
   - Allow git bisect to find regression

2. **Quality Gate** (as described in Part 5)
   - Test proposed change on past failed tasks
   - Measure pass_rate improvement
   - Auto-apply if improvement >= threshold (e.g., +10%)
   - Reject if regression detected

3. **Rollback Mechanism**
   - If a skill causes cascading failures, detect automatically via audit failures
   - `git revert` the skill file in the repository
   - Trigger re-run of affected tasks

4. **Notification**
   - Slack/email: "Skill X auto-updated (version 2.5 → 2.6), improvement: +12%"
   - If rollback triggered: "Skill X reverted due to regression"

**Safety Guardrails**:
- Only apply to discoverable-tier skills (not core, not agent definitions)
- Require write permissions in source package (packages/*/skills/)
- Audit must pass for merged change before production use
- Keep audit trail in proposal index

**Implementation Cost**: ~1500 lines (git wrappers, gates, notifications).

---

### Phase 3: Fully Autonomous (Research-Grade, Post-2026)

**Goal**: Agents improve skills without human involvement.

**Why defer**:
- Requires 6+ months of Phase 1 + 2 data to define reliable metrics
- Risk of mode collapse (agent optimizes to what it sees, ignores long-tail)
- Organizational knowledge loss if skills change faster than documentation
- No published production case studies yet

**Considerations if attempted**:
- Constitutional AI principles: define what makes a "good" skill update
- MemGPT-style memory: long-term skill impact tracking
- Voyager-style composition: test new skills on novel tasks before adoption
- Rollback budget: how many rollbacks before stopping auto-apply?

---

## Part 8: Risk Assessment — What Could Go Wrong

### High-Risk Failure Modes

| Scenario | Impact | Prevention |
|----------|--------|-----------|
| **Skill drift** | Skill gradually changes away from original intent | Version control + manual audit every N changes |
| **Mode collapse** | Skill overoptimizes to training tasks, breaks on novel tasks | Test on held-out task set (Phase 2 gate) |
| **Circular logic** | Skill's guidance leads to audit failures that trigger skill update that causes more failures | Human review + constitutional principles |
| **Cascading corruption** | Bad update to core skill breaks all dependent skills | Dependency graph validation before apply |
| **Skill bloat** | Skill grows from 500 lines to 2000 lines by always adding context | Complexity budget: reject updates that add >10% lines without removing lines |
| **Organizational knowledge loss** | Skill changes so fast humans can't keep up with **why** it changed | Proposal includes: rationale, links to evidence, decision record |

### Medium-Risk Failure Modes

| Scenario | Impact | Mitigation |
|----------|--------|-----------|
| **Overfitting to recent tasks** | Skill improves on last 10 tasks, fails on unseen patterns | Rotate test task set monthly |
| **False signal from single user** | User asks for unusual pattern, skill updates, hurts general case | Aggregate signals across users/plans |
| **Skill redundancy** | Two overlapping skills both update independently | Conflict detection + merge proposals before apply |
| **Documentation-code mismatch** | Proposal updates skill but not docs/PATTERN entry | Require related docs update in same proposal |

---

## Part 9: Unresolved Questions & Research Gaps

1. **How to measure skill quality independently of task difficulty?**
   - Current approach (pass rate) conflates task hardness with skill quality
   - Alternative: multi-task evaluation (does skill help broad set of tasks?)
   - Research needed: benchmark suite for skill evaluation

2. **What's the right feedback aggregation function?**
   - Should audit failure 1x weighted same as journal flag 5x?
   - How to weight different signal types (audit fail vs retry vs journal)?
   - Research needed: Bayesian model of skill improvement evidence

3. **Can skill updates be decomposed into micro-changes?**
   - Instead of updating whole skill, propose: add 1 pattern, remove 1 gotcha, clarify 1 section
   - Benefit: easier to test, easier to rollback
   - Research needed: how fine-grained is too fine?

4. **How do we prevent "skill arms race" where agents keep improving skills but agents never improve?**
   - If we only update skills, agent capabilities plateau
   - But agent updates (system prompts) are more dangerous
   - Research needed: what's the right balance of skill vs agent evolution?

5. **Can we use external research automatically?**
   - When a new React pattern is published, should skill update automatically?
   - Requires: semantic understanding of "this paper applies to this codebase"
   - Research needed: literature-to-code relevance detection

6. **What's the minimal set of constitutional principles for skill updates?**
   - epost has CONV-0001 (package structure), CONV-0002 (release). Is that enough?
   - Should we add CONV-0003 (skill authoring) as a gate?
   - Research needed: codify what makes a "good" skill update

---

## Recommendations for Implementation

### Immediate (Next Sprint)

1. **Audit Phase 1 infrastructure**: Can current audit skill serve as a quality gate? Run a test.
   - Create a mock skill update proposal
   - Run audit before/after the change
   - Measure if audit can reliably detect regression

2. **Design feedback extractor**: Implement journal flag parser
   - Weekly scan of `docs/journal/*/` for "almost went wrong" entries
   - Aggregate by skill name
   - Create sample proposal from highest-confidence signal

3. **Proposal template**: Draft `docs/proposals/` structure and index schema
   - What fields does a proposal need?
   - How to link to evidence (audit logs, journal entries, task history)?
   - How to track approval/rejection/application?

### Phase 1 (2-4 weeks)

1. Build feedback extractor as post-task hook
2. Implement proposal generator (skill improvement suggestions)
3. Create proposal review workflow (human approval gate)
4. Document 5 real proposals from live tasks

### Phase 2 (4-8 weeks)

1. Add skill versioning to git workflow
2. Implement quality gate (test proposed change on past failures)
3. Add rollback mechanism
4. Run 10+ auto-apply cycles with human review still required (safety mode)

### Phase 3 (Post-2026)

1. Collect metrics on Phase 1 + 2
2. Define constitutional principles for skill updates
3. Consider fully autonomous apply (with aggressive rollback thresholds)

---

## Comparison with Research: Why epost Approach is Different

| Aspect | Voyager | Reflexion | MemGPT | epost_agent_kit |
|--------|---------|-----------|--------|-----------------|
| **Update target** | Skill library (code) | Task memory | Agent memory | Skill SKILL.md (prose) |
| **Test environment** | Minecraft (simulation) | Task runner | Persistent session | Live development tasks |
| **Failure signal** | Binary (win/fail) | Success metric | Memory coherence | Audit gate + manual review |
| **Rollback capability** | Replace skill | N/A (per-task) | Delete memory | Git revert + re-run |
| **Autonomy level** | Fully autonomous | Scoped to retry | Fully autonomous | Semi-autonomous (human gate) |
| **Skill quality** | High (code is verifiable) | Medium (context-dependent) | Medium (memory is opaque) | High (principles-guided) |
| **Production readiness** | Research prototype | Prototype | Production (Letta) | Design phase |

---

## Sources

- [Voyager: An Open-Ended Embodied Agent with Large Language Models](https://arxiv.org/abs/2305.16291) — Wang et al., 2023. Skill library growth via iterative task-specific improvement.
- [Reflexion: Language Agents with Verbal Reinforcement Learning](https://arxiv.org/abs/2303.11366) — Shinn et al., 2023. Self-reflection and memory for task retry improvement.
- [Constitutional AI: Harmlessness from AI Feedback](https://arxiv.org/abs/2212.08073) — Bender et al., 2022. Principle-guided iterative critique and revision.
- [MemGPT: Towards LLMs as Operating Systems](https://arxiv.org/abs/2310.08560) — Patel et al., 2023. Persistent agent with self-edited memory.
- [Taxonomy of Failure Modes in Agentic AI Systems](https://cdn-dynmedia-1.microsoft.com/is/content/microsoftcorp/microsoft/final/en-us/microsoft-brand/documents/Taxonomy-of-Failure-Mode-in-Agentic-AI-Systems-Whitepaper.pdf) — Microsoft, 2025. Failure modes including organizational knowledge degradation.
- [Achieving Self-Improvement in Agentic Systems with Skill Harvesting](https://www.emergence.ai/blog/achieving-self-improvement-in-agentic-systems-with-skill-harvesting) — Emergence.AI, 2024. Skill harvesting patterns.
- [Letta Docs: Agent Memory](https://docs.letta.com/concepts/memgpt/) — Persistent memory architecture and autonomous memory management patterns.

---

## Verdict

**ACTIONABLE** — Implement Phase 1 (detection + proposal) as a low-risk pilot. This gives epost_agent_kit the feedback loop without automation risk. Phase 2 (auto-apply with gates) is feasible in 4-8 weeks if Phase 1 validates the signal quality. Phase 3 (fully autonomous) is research-grade; defer until 2027 with 12+ months of data.

The kit already has the hardest pieces (audit, journal, knowledge-capture, skill-discovery). The missing piece is the **plumbing to connect feedback signals to skill updates**. Start there.

**Key insight from research**: Voyager works because Minecraft is a perfect simulation environment. Reflexion works because reflections are cheap and scoped to retries. MemGPT works because memory edits are local. epost_agent_kit's constraint — skill updates are global and expensive — suggests a **human-gated approach is the right fit**. Don't chase full autonomy until you have the data to justify it.
