---
description: Boundaries and guidelines for using Context7 MCP as secondary reasoning aid
alwaysApply: true
---

# Context7 Usage

## Purpose

Rules governing when and how Context7 MCP may be used as a secondary reasoning aid without overriding repository rules.

## Table of Contents

- [Allowed Usage](#allowed-usage) → Lines 10-18
- [Forbidden Usage](#forbidden-usage) → Lines 20-28
- [Conflict Resolution](#conflict-resolution) → Lines 30-38
- [Labeling Requirements](#labeling-requirements) → Lines 40-45

## Related Documents

- [Core User Rules](./core-user-rules.mdc) - Foundational constraints
- [Decision Boundaries](./decision-boundaries.mdc) - Authority limits

## Allowed Usage

**Context7 may be used for:**
- Validating architectural reasoning
- Cross-checking common pitfalls
- Improving clarity or safety of rules
- Understanding library/framework patterns (when aligning with repo rules)
- iOS/Swift best practices validation (when consistent with project patterns)

**Use cases:**
- Verifying rule structure best practices
- Identifying potential ambiguity risks
- Confirming documentation patterns
- Understanding tool integration patterns
- Swift/UIKit pattern validation

## Forbidden Usage

**Context7 must not:**
- Override repository rules
- Introduce new conventions or tooling
- Be treated as default "best practice"
- Replace repository-specific patterns
- Assume external standards apply
- Suggest iOS patterns inconsistent with existing codebase

**Never use Context7 to:**
- Justify breaking repository rules
- Introduce frameworks not in use
- Override explicit project conventions
- Assume external patterns are better
- Suggest SwiftUI when project uses UIKit

## Conflict Resolution

**When Context7 conflicts with repository rules:**
- **Reject Context7** and explain why
- Prioritize repository rules as ground truth
- Document the conflict for transparency
- Propose alternatives aligned with repo rules

**Conflict detection:**
- Compare Context7 suggestions with existing rules
- Identify contradictions explicitly
- Choose repository rules when in doubt
- Explain reasoning to user

## Labeling Requirements

**When Context7 is used:**
- Explicitly label influence as **Context7-informed**
- Explain why it aligns with repository rules
- Show how it complements (not replaces) repo rules
- Maintain repository rules as primary authority

**Labeling format:**
- "Context7-informed: [insight] - aligns with [repo rule] because [reason]"
- Never present Context7 insights as primary authority
- Always ground Context7 usage in repository rules