# ePost Agents Management

Visual management interface for the ePost Agent Kit system, inspired by flora.ai's infinite canvas design.

## Overview

This standalone Next.js application provides a comprehensive UI for managing your agent system with:

- **20 Agents** - Claude Code agents with different models and capabilities  
- **39 Skills** - Reusable agent skills with references and documentation  
- **49 Commands** - Slash commands routing to agents  
- **12 Packages** - Organized collections of agents, skills, and commands  
- **13 Profiles** - Team configurations combining packages  

## Getting Started

```bash
cd ~/Projects/epost-agents-management
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Phase 1: Data Layer ✅ COMPLETE

All foundational data parsing and loading infrastructure is implemented and working:

- TypeScript type definitions for entities and graph structure
- Frontmatter parser for .md files  
- YAML parser for package.yaml and profiles.yaml  
- Entity parsers: Agent, Skill, Command, Package, Profile  
- DataLoader service orchestrating all parsers  
- GraphBuilder creating node/edge graph structure  
- API route `/api/data` for server-side loading  

**Verification**: The home page successfully loads and displays statistics from the epost_agent_kit repository.

## Next: Phase 2 - Basic UI & Canvas

Coming next week: Interactive canvas with react-flow, node visualization, and inventory panels.

---

Built with Claude Code for ePost Agent Kit
