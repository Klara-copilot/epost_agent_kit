# Phase 4 Verification - Unresolved Questions

## Questions Requiring Decision

### Q1: iOS Agent Strategy (Blocks Phase 5)

**Question**: How should iOS commands be handled before Phase 5 (iOS agents) is implemented?

**Current State**:
- iOS commands exist and reference `ios-developer` agent that doesn't exist
- Phase 5 iOS agent creation is pending
- Commands will fail if invoked before Phase 5

**Options**:

**Option A: Create Placeholder ios-developer Agent**
- Create minimal `agents/ios-developer.md` that delegates to `implementer` with iOS context
- Pros: iOS commands work immediately; graceful fallback
- Cons: Temporary solution; not the full iOS implementation

**Option B: Update iOS Commands to Reference Implementer**
- Change iOS commands to reference `implementer` with iOS platform hint
- Pros: Simplifies routing; avoids placeholder
- Cons: Less explicit; requires context detection

**Option C: Disable iOS Commands Until Phase 5**
- Remove `agent:` field or set to disabled in all iOS commands
- Pros: Clear intent; prevents errors
- Cons: Commands unavailable; users confused

**Recommendation**: Option A (placeholder) allows Phase 4 to fully pass while keeping iOS commands working.

---

### Q2: Emoji Prefix Removal Scope

**Question**: Should emoji prefixes be removed from BOTH name and description fields?

**Current State**:
- 4 agents have emojis in `name` field (critical issue)
- Unknown if emojis also in `description` field

**Verification Needed**:
Check if the following agents have emojis in description:
- debugger.md: description contains emoji?
- tester.md: description contains emoji?
- researcher.md: description contains emoji?
- git-manager.md: description contains emoji?

**Decision Needed**: Remove emojis from both fields or only `name` field?

**Recommendation**: Remove from both for consistency with clean naming requirement.

---

### Q3: Malformed Command Routing Resolution

**Question**: What is the intended behavior for `commands/fix/fast.md` with `agent: debugger, implementer`?

**Current State**:
```
agent: debugger, implementer
```

**Questions**:
- Is this intentional dual-agent assignment?
- Should both agents be invoked sequentially?
- Should user choose which agent to use?
- Is this a formatting error?

**Options**:

**Option A: Single Primary Agent**
- Use only `agent: debugger` (or `implementer`)
- Clear routing intent

**Option B: Sequential Delegation**
- Use `agent: debugger` and specify delegation to `implementer` in agent prompt
- Explicit control flow

**Option C: User Choice**
- Split into separate commands: `/fix:fast-debug` and `/fix:fast-impl`
- No ambiguity

**Recommendation**: Option A (single agent) - simplify to either debugger or implementer based on command purpose.

---

### Q4: Old Name References in Documentation

**Question**: Should old agent names in hook documentation be updated?

**Current State**:
- 7 references to old agent names found in `hooks/notifications/docs/telegram-hook-setup.md`
- These are in documentation/examples, not active configuration
- Non-critical but outdated

**Decision Needed**: Update documentation as part of Phase 4 or defer to later phase?

**Impact**: Minimal - documentation examples, no functional impact

**Recommendation**: Defer to Phase 8 (documentation sync) unless updating hook system.

---

## Verification Coverage

### Items Fully Verified

- [x] 9 global agents exist with valid YAML frontmatter
- [x] 3 web agents exist with valid YAML frontmatter
- [x] All commands have `agent:` fields
- [x] All skills have valid SKILL.md files
- [x] Zero old agent names in active files
- [x] Nested agent directory discovery works
- [x] Skill path references correct
- [x] Delegation chains verified

### Items Needing Follow-up

- [ ] Emoji removal impact on Claude Code agent discovery
- [ ] Malformed routing intent clarification
- [ ] iOS strategy decision before Phase 5
- [ ] Documentation update scope

---

## Phase 4 Completion Dependency Graph

```
Fix Emoji Issues (Priority 1)
    └─→ Re-verify agents load
        └─→ Confirm no routing errors
            └─→ Phase 4 Pass

Fix Malformed Routing (Priority 2)
    └─→ Clarify agent intent
        └─→ Update command
            └─→ Phase 4 Pass

Resolve iOS Strategy (Priority 3 - Phase 5 prep)
    └─→ Decide: placeholder or disable
        └─→ Implement decision
            └─→ Update commands
                └─→ Phase 5 ready
```

---

## Recommendation Summary

1. **Immediate (Phase 4 completion)**:
   - Fix 4 emoji issues in agent names
   - Fix 1 malformed command routing
   - Re-verify for pass confirmation

2. **Short-term (Phase 5 prep)**:
   - Implement iOS strategy (recommend: placeholder agent)
   - Update iOS commands if strategy changes routing

3. **Medium-term (Phase 8)**:
   - Update hook documentation examples
   - Verify all agent references in docs

---

**Status**: Awaiting user decisions on Q1-Q4 to complete Phase 4

