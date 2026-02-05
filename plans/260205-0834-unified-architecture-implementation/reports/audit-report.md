# Dependency Audit Report
**Date:** 2026-02-05
**Project:** epost_agent_kit
**Purpose:** Comprehensive dependency analysis for architecture restructuring

---

## 1. Agent Inventory

| Agent | Alias | Model | Tools | Color | Status |
|-------|-------|-------|-------|-------|--------|
| code-reviewer | reviewer | inherit | default | yellow | Active |
| debugger | debugger | inherit | default | red | Active |
| docs-manager | docs | inherit | default | blue | Active |
| fullstack-developer | developer | inherit | default | green | Active |
| git-manager | git | inherit | explicit (6 tools) | purple | Active |
| performance-analyst | perf | inherit | default | orange | Active |
| planner | planner | inherit | default | blue | Active |
| project-manager | project | inherit | default | green | Active |
| researcher | researcher | inherit | default | purple | Active |
| tester | tester | inherit | default | yellow | Active |
| ui-designer | design | inherit | default | purple | Active |

**Total:** 11 agents

**Missing:** ios-developer (referenced in 4 iOS commands)

---

## 2. Command-to-Agent Mapping

### Core Commands (6)
| Command | Agent | Status |
|---------|-------|--------|
| /ask | researcher | ✓ |
| /bootstrap | fullstack-developer | ✓ |
| /cook | fullstack-developer | ✓ |
| /debug | debugger | ✓ |
| /plan | planner | ✓ |
| /test | tester | ✓ |

### Design Commands (1)
| Command | Agent | Status |
|---------|-------|--------|
| /design:fast | ui-designer | ✓ |

### Docs Commands (2)
| Command | Agent | Status |
|---------|-------|--------|
| /docs:init | planner | ✓ |
| /docs:update | docs-manager | ✓ |

### Fix Commands (5)
| Command | Agent | Status |
|---------|-------|--------|
| /fix:ci | debugger | ✓ |
| /fix:fast | debugger, fullstack-developer | ✓ (multi-agent) |
| /fix:hard | debugger | ✓ |
| /fix:test | tester | ✓ |
| /fix:ui | debugger | ✓ |

### Git Commands (5)
| Command | Agent | Status |
|---------|-------|--------|
| /git:cm | git-manager | ✓ (alias) |
| /git:commit | git-manager | ✓ |
| /git:cp | git-manager | ✓ (alias) |
| /git:pr | git-manager | ✓ |
| /git:push | git-manager | ✓ |

### iOS Commands (4)
| Command | Agent | Status |
|---------|-------|--------|
| /ios:cook | ios-developer | ✗ ORPHAN |
| /ios:debug | ios-developer | ✗ ORPHAN |
| /ios:simulator | ios-developer | ✗ ORPHAN |
| /ios:test | ios-developer | ✗ ORPHAN |

**Total:** 23 commands
**Orphaned:** 4 (all iOS commands)

---

## 3. Skill Inventory

| Skill | References | Status |
|-------|-----------|--------|
| backend-development | 0 | Unused |
| better-auth | 0 | Unused |
| databases | 0 | Unused |
| debugging | 0 | Unused |
| docker | 0 | Unused |
| frontend-development | 0 | Unused |
| ios-development | 4 (iOS commands) | Active |
| ios-development/build | 1 (/ios:simulator) | Active |
| ios-development/development | 2 (/ios:cook, /ios:debug) | Active |
| ios-development/tester | 1 (/ios:test) | Active |
| nextjs | 0 | Unused |
| planning | 0 | Unused |
| research | 0 | Unused |
| shadcn-ui | 0 | Unused |

**Total:** 14 skills
**Active:** 4 (iOS-related)
**Unused:** 10

**Note:** Skills referenced in iOS commands only, not in agent definitions.

---

## 4. Workflow References

### bug-fixing.md
- **Agents:** debugger → fullstack-developer → tester → git-manager
- **Commands:** /debug, /fix:fast, /fix:hard, /test, /git:cm

### feature-development.md
- **Agents:** planner → fullstack-developer → tester → code-reviewer → git-manager
- **Commands:** /plan, /cook, /test, /git:cm

### project-init.md
- **Agents:** fullstack-developer → git-manager
- **Commands:** /bootstrap, /git:cm

**Total:** 3 workflows
**Unique agents:** 6 (planner, fullstack-developer, debugger, tester, code-reviewer, git-manager)
**Unused in workflows:** 5 (docs-manager, performance-analyst, project-manager, researcher, ui-designer)

---

## 5. Agent Overlap Analysis

### Performance-Analyst vs Code-Reviewer
**Overlap:** Both analyze code performance
- **performance-analyst:** Dedicated to optimization, profiling, bundle analysis
- **code-reviewer:** Includes performance review as one aspect
- **Recommendation:** Keep separate, different scopes

### Project-Manager vs Planner
**Overlap:** Both handle planning and architecture
- **project-manager:** Project structure, architecture, dependency management
- **planner:** Feature implementation plans, research coordination
- **Recommendation:** Merge into single "architect" agent

### Docs-Manager vs Planner
**Overlap:** /docs:init uses planner instead of docs-manager
- **Conflict:** Command points to wrong agent
- **Recommendation:** Fix command mapping or merge responsibilities

---

## 6. Rename Impact Analysis

### planner → architect
**Files to update:**
- `.claude/agents/planner.md` → `.claude/agents/architect.md`
- `.claude/commands/core/plan.md` (agent field)
- `.claude/commands/docs/init.md` (agent field)
- `.claude/workflows/feature-development.md` (3 references)
- All rules/docs mentioning "planner"

**Impact:** Medium (4 files + docs)

### fullstack-developer → implementer
**Files to update:**
- `.claude/agents/fullstack-developer.md` → `.claude/agents/implementer.md`
- `.claude/commands/core/bootstrap.md` (agent field)
- `.claude/commands/core/cook.md` (agent field)
- `.claude/commands/fix/fast.md` (agent field)
- `.claude/workflows/bug-fixing.md` (3 references)
- `.claude/workflows/feature-development.md` (2 references)
- `.claude/workflows/project-init.md` (2 references)

**Impact:** High (7 files + workflow references)

### code-reviewer → reviewer
**Files to update:**
- `.claude/agents/code-reviewer.md` → `.claude/agents/reviewer.md`
- `.claude/workflows/feature-development.md` (2 references)

**Impact:** Low (2 files)

### docs-manager → documenter
**Files to update:**
- `.claude/agents/docs-manager.md` → `.claude/agents/documenter.md`
- `.claude/commands/docs/update.md` (agent field)

**Impact:** Low (2 files)

### ui-designer → web/designer
**Files to update:**
- `.claude/agents/ui-designer.md` → `.claude/agents/web/designer.md`
- `.claude/commands/design/fast.md` (agent field)

**Impact:** Low (2 files) + directory restructure

---

## 7. Critical Issues

### 1. Missing ios-developer Agent
- **Severity:** High
- **Impact:** 4 orphaned commands
- **Action:** Create ios-developer agent

### 2. Command-Agent Mismatch
- **Issue:** /docs:init uses "planner" instead of "docs-manager"
- **Severity:** Medium
- **Action:** Update command or consolidate responsibilities

### 3. Unused Skills
- **Issue:** 10 skills defined but never referenced
- **Severity:** Low
- **Action:** Document usage or remove

### 4. Multi-Agent Commands
- **Issue:** /fix:fast uses two agents (debugger, fullstack-developer)
- **Severity:** Low
- **Action:** Define coordination protocol

---

## 8. Recommendations

### High Priority
1. Create missing `ios-developer` agent
2. Fix /docs:init agent mapping
3. Merge project-manager → planner/architect
4. Define multi-agent coordination protocol

### Medium Priority
5. Rename agents per plan (planner→architect, etc.)
6. Update all command mappings
7. Update workflow references
8. Document skill usage patterns

### Low Priority
9. Clean up unused skills
10. Consolidate color schemes (3 purple agents)
11. Add skill references in agent definitions
12. Create skill usage guidelines

---

## 9. Migration Checklist

### Phase 0: Audit (Complete)
- [x] Extract agent frontmatter
- [x] Extract command mappings
- [x] Scan skill references
- [x] Scan workflow references
- [x] Identify overlaps
- [x] Analyze rename impact

### Phase 1: Fix Critical
- [ ] Create ios-developer agent
- [ ] Fix /docs:init mapping
- [ ] Test iOS commands

### Phase 2: Rename
- [ ] Update agent files
- [ ] Update command mappings
- [ ] Update workflow references
- [ ] Update documentation

### Phase 3: Cleanup
- [ ] Remove unused skills
- [ ] Consolidate overlapping agents
- [ ] Document patterns

---

**Total Lines:** 194
**Created by:** Phuong Doan
**Report Type:** Dependency Audit
