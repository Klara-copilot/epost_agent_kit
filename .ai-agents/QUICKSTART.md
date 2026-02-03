# AI Agents Quick Start

## Overview

This repository uses AI agents to enforce accessibility standards during iOS development. Agents are available in Cursor and GitHub Copilot.

## Available Agents

### @accessibilities-architect
**Purpose:** Real-time accessibility guidance during development  
**Usage:** `@accessibilities-architect [your question or code]`  
**When to use:** Writing new Swift code, creating UI components

### @accessibilities-auditor
**Purpose:** Batch auditing for CI/CD and pre-commit checks  
**Usage:** `@accessibilities-auditor [audit this code]`  
**When to use:** Before committing, in PR reviews

### @accessibilities-fixer
**Purpose:** Surgical fixes for specific findings  
**Usage:** `@accessibilities-fixer [fix finding ID 3]`  
**When to use:** Fixing known accessibility issues

## Quick Examples

### In Cursor
```
@accessibilities-architect Review this button for accessibility
```

### In GitHub Copilot
```
@accessibilities-architect Please review this button implementation for accessibility
```

## Knowledge Base

Agents read from:
- **Accessibility Rules**: `.ai-agents/rules/accessibility/` - WCAG 2.1 AA rules (8 files)
- **General Rules**: `.ai-agents/rules/` - Universal rules (5 files at root)
- **Prompts**: `.ai-agents/prompts/accessibility/` - Reusable templates (8 files)
- **Analysis**: `.ai-agents/analysis/accessibility/` - Historical findings
- **Known Issues**: `.agent-knowledge/epost-known-findings.json` (65 findings)
