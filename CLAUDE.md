# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

epost_agent_kit — a comprehensive multi-platform agent kit framework under the Klara-copilot GitHub organization.

**Current Capabilities**:
- **15 Agents**: 9 global agents (orchestrator, architect, implementer, reviewer, researcher, debugger, tester, documenter, git-manager) + 6 specialized agents (scout, brainstormer, database-admin, web-developer, ios-developer, android-developer)
- **17 Skills**: Core skills including code-review, sequential-thinking, docs-seeker, problem-solving, repomix, and platform-specific skills (android-development, ios-development, backend-development, frontend-development, nextjs)
- **Multi-Platform Support**: Distributes across Claude Code, Cursor, and GitHub Copilot
- **Parent-Child Delegation**: Global agents orchestrate; platform agents execute

**Key Features**:
- Task routing and project management via orchestrator
- Architecture design and planning coordination
- Multi-platform implementation delegation
- Comprehensive code review and security analysis
- Root cause debugging with codebase search
- Test orchestration and execution
- Documentation management and generation

## Repository

- **Remote**: git@github.com:Klara-copilot/epost_agent_kit.git
- **Primary branch**: master
- **Documentation**: See `/docs` directory for architecture, roadmap, and standards
