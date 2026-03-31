# epost-planner: Kit Rationalization Plan

**Date**: 2026-03-19
**Agent**: epost-planner
**Plan**: plans/260319-0538-kit-rationalization/
**Status**: READY

---

## Executive Summary

Synthesized findings from two research reports (260318-1940 native-tools-vs-custom-kit, 260318-1951 cursor-copilot-validation) into actionable 4-phase consolidation plan. Preserves all workflows, folder structure, and domain knowledge while cutting kit complexity by ~35%.

## Plan Details

| Metric | Before | After |
|--------|--------|-------|
| Agents | 15 | 10-11 |
| Skills | 66 | ~50 |
| Hooks | 14 | 9-10 |
| Workflows | 7 | 7 (unchanged) |
| Domain skills | 40+ | 40+ (unchanged) |

### Phase Breakdown

| # | Phase | Effort | Approach |
|---|-------|--------|----------|
| 1 | Delete 4 redundant agents | 2h | brainstormer, mcp-manager, journal-writer, kit-designer |
| 2 | Slim 5 remaining agents | 4h | Remove generic content, keep domain-specific routing |
| 3 | Prune 21 skills (12 delete, 9 merge) | 4h | Remove reasoning/analysis, consolidate kit-* into kit/ |
| 4 | Remove 4 hooks | 2h | context-reminder, post-index-reminder, session-metrics, lesson-capture |

### What Stays Untouched
- All a11y skills (4)
- All design-system skills (5)
- All platform-* skills (web 7, ios 3, android 2, backend 2)
- All domain skills (2)
- Orchestration protocol (core, skill-discovery, knowledge-retrieval)
- Workflow skills (plan, cook, fix, audit, debug, test, review, git, docs)
- Safety hooks (build-gate, privacy-block, scout-block)
- Folder structure (packages/, .claude/, plans/, reports/)

## Verdict

**READY**

## Unresolved Questions

1. Should epost-project-manager be deleted entirely or just slimmed? (Currently: slim)
2. Are web-prototype and web-rag actively used enough to justify keeping as standalone?
3. Does the existing PLAN-0041 (skill-consolidation) overlap with Phase 3? May need to archive one.
