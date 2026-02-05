# Skills Catalog Analysis

**Created by:** Phuong Doan
**Date:** 2026-02-05
**Purpose:** Comprehensive analysis of all available Claude Code skills

## Executive Summary

Analyzed 37 skill directories containing 39 SKILL.md files from `/Users/ddphuong/.claude/skills/`. The skills cover a broad spectrum of development capabilities including AI/ML, frontend/backend development, mobile, DevOps, documentation, testing, and specialized tools.

**Key Statistics:**
- Total skills: 37+
- Categories: 10 major categories
- Documentation files: 200+ reference documents
- Scripts: 50+ helper scripts

---

## Skill Structure

### Standard Format

Every skill follows the Agent Skills Spec (version 1.0):

```yaml
---
name: skill-name                    # Required: hyphen-case
description: what it does...        # Required: when to use it
license: MIT                        # Optional
version: 1.0.0                     # Optional
allowed-tools:                      # Optional (Claude Code only)
  - Bash
  - Read
---
```

### File Organization

```
skill-name/
├── SKILL.md                 # Required entrypoint
├── references/              # Detailed documentation
│   ├── topic-1.md
│   └── topic-2.md
├── scripts/                 # Helper scripts
│   ├── script.py
│   └── README.md
└── workflows/              # Common workflows
    └── workflow.md
```

---

## Complete Skills Catalog

### 1. AI & Multimodal Processing

#### **ai-multimodal**
- **Description:** Process audio, video, images, documents using Google Gemini API
- **Capabilities:**
  - Audio: Transcription (9.5h), speech analysis, music detection
  - Vision: Image analysis, OCR, object detection, visual Q&A
  - Video: Scene detection, temporal analysis (6h), YouTube URLs
  - Generation: Imagen 4 (images), Veo 3 (8s videos with audio)
- **Models:** Gemini 2.5/3, Imagen 4, Veo 3 (2M token context)
- **Key Scripts:** `gemini_batch_process.py`, `media_optimizer.py`, `document_converter.py`
- **References:** 6 detailed guides (audio, vision, image-gen, video, music)

#### **ai-artist**
- **Description:** Generate creative content using advanced AI prompting techniques
- **Capabilities:** Image prompting, LLM prompting, domain-specific patterns
- **References:** 7 guides (code, data, marketing, writing patterns, reasoning techniques)

---

### 2. Backend Development

#### **backend-development**
- **Description:** Production-ready backend systems with modern technologies
- **Tech Stack:**
  - Languages: Node.js/TypeScript, Python, Go, Rust
  - Frameworks: NestJS, FastAPI, Django, Express, Gin
  - Databases: PostgreSQL, MongoDB, Redis
  - APIs: REST, GraphQL, gRPC
- **Key Topics:**
  - OWASP Top 10 2025 security
  - OAuth 2.1 + JWT authentication
  - Performance optimization (caching, indexing)
  - Microservices architecture
  - Testing strategies (70-20-10 pyramid)
- **References:** 11 comprehensive guides

#### **databases**
- **Description:** PostgreSQL and MongoDB expertise
- **PostgreSQL:**
  - `psql` CLI reference
  - Query optimization
  - Performance tuning
  - Administration
- **MongoDB:**
  - CRUD operations
  - Aggregation pipelines
  - Indexing strategies
  - Atlas cloud deployment
- **References:** 8 detailed guides

---

### 3. Frontend Development

#### **frontend-dev-guidelines**
- **Description:** Modern React/TypeScript development patterns
- **Tech Stack:**
  - React 18+ (Suspense, lazy loading)
  - TypeScript (strict mode)
  - MUI v7 (Material UI)
  - TanStack Query (`useSuspenseQuery`)
  - TanStack Router
- **Key Patterns:**
  - Component organization (`features/` vs `components/`)
  - Data fetching (cache-first with Suspense)
  - File structure (API layer, hooks, helpers)
  - Performance optimization (useMemo, useCallback)
  - No early returns (prevents layout shift)
- **References:** 10 comprehensive guides

#### **frontend-design**
- **Description:** Design extraction from UI screenshots and mockups
- **Capabilities:**
  - Visual analysis and extraction
  - UI-to-code conversion
  - Asset generation
  - Accessibility analysis
- **Tech:** AI multimodal tools, Anime.js animations
- **References:** 12 guides (analysis, extraction, technical workflows)

#### **ui-styling**
- **Description:** Tailwind CSS and shadcn/ui component styling
- **Topics:**
  - Tailwind utilities and customization
  - shadcn component library
  - Canvas design system
  - Theming and accessibility
- **References:** 7 styling guides

#### **web-frameworks**
- **Description:** Next.js and Turborepo expertise
- **Next.js:**
  - App Router patterns
  - Server Components
  - Data fetching strategies
  - Performance optimization
- **Turborepo:**
  - Monorepo setup
  - Caching strategies
  - Pipeline configuration
- **References:** 9 framework guides

---

### 4. Mobile Development

#### **mobile-development**
- **Description:** Cross-platform and native mobile development
- **Frameworks:**
  - React Native (121K stars, 35% adoption)
  - Flutter (170K stars, 46% adoption)
  - Swift/SwiftUI (iOS native)
  - Kotlin/Jetpack Compose (Android native)
- **Key Topics:**
  - Mobile-first design principles
  - Performance targets (<2s launch, 60 FPS)
  - Offline-first architecture
  - Platform guidelines (iOS HIG, Material Design 3)
  - Security (OWASP Mobile Top 10)
  - App Store deployment
- **References:** 6 comprehensive guides

---

### 5. DevOps & Cloud

#### **devops**
- **Description:** Cloud infrastructure across Cloudflare, Docker, and GCP
- **Platforms:**
  - **Cloudflare:** Workers, R2, D1, KV, Pages, Durable Objects
  - **Docker:** Containerization, Docker Compose, multi-stage builds
  - **Google Cloud:** Compute Engine, GKE, Cloud Run, App Engine
- **Key Capabilities:**
  - Edge computing (<50ms latency)
  - Serverless functions
  - Container orchestration
  - CI/CD pipelines
  - Cost optimization
- **References:** 11 platform guides
- **Scripts:** Python utilities for deployment automation

#### **chrome-devtools**
- **Description:** Chrome DevTools Protocol and Puppeteer automation
- **Capabilities:**
  - Browser automation
  - Performance profiling
  - CDP domains
- **References:** 3 guides + scripts

---

### 6. Documentation & Research

#### **docs-seeker**
- **Description:** Search technical documentation using llms.txt standard
- **Capabilities:**
  - Topic-specific searches (10-15s)
  - Library documentation discovery
  - GitHub repository analysis
  - Context7.com integration
- **Scripts:** Zero-token execution scripts
  - `detect-topic.js` - Query classification
  - `fetch-docs.js` - Documentation retrieval
  - `analyze-llms-txt.js` - URL categorization
- **References:** 3 workflows + 3 advanced guides

#### **research**
- **Description:** Systematic technical research methodology
- **Process:**
  - Phase 1: Scope definition
  - Phase 2: Multi-source information gathering
  - Phase 3: Analysis and synthesis
  - Phase 4: Report generation
- **Features:**
  - Gemini bash command integration (10min timeout)
  - WebSearch fallback
  - Cross-reference validation
  - Comprehensive markdown reports
- **Max researches:** 5 per task

---

### 7. Planning & Problem Solving

#### **planning**
- **Description:** Create detailed technical implementation plans
- **Responsibilities:**
  - Research & analysis
  - Codebase understanding
  - Solution design
  - Plan organization
  - Task breakdown
- **Principles:** YAGNI, KISS, DRY
- **Plan Structure:**
  ```
  plans/{date}-plan-name/
  ├── research/
  ├── reports/
  ├── scout/
  ├── plan.md
  └── phase-XX-*.md
  ```
- **References:** 5 methodology guides

#### **sequential-thinking**
- **Description:** Structured problem-solving with thought sequences
- **Use Cases:**
  - Complex problem decomposition
  - Adaptive planning with revision
  - Multi-step solutions
  - Hypothesis-driven debugging
- **Features:**
  - Dynamic adjustment (expand/contract/revise/branch)
  - Hypothesis generation and verification
  - Explicit and implicit modes
- **References:** 5 guides (patterns, examples, advanced techniques)

#### **brainstorming**
- **Description:** Creative ideation and problem exploration

#### **problem-solving**
- **Description:** Advanced problem-solving techniques
- **Techniques:**
  - Meta-pattern recognition
  - Collision-zone thinking
  - Inversion exercise
  - Scale game
  - Simplification cascades
  - Attribution analysis
- **References:** 7 thinking frameworks

---

### 8. Code Quality & Testing

#### **code-review**
- **Description:** Code review practices with technical rigor
- **Three Practices:**
  1. **Receiving feedback:** Technical evaluation, no performative agreement
  2. **Requesting reviews:** Systematic `code-reviewer` subagent
  3. **Verification gates:** Evidence before completion claims
- **Core Principle:** YAGNI, KISS, DRY - honest, brutal, concise
- **References:** 3 protocol guides

#### **debugging**
- **Description:** Systematic debugging framework
- **Core Principle:** NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST
- **Four Techniques:**
  1. Systematic debugging (4 phases)
  2. Root cause tracing (backward call stack)
  3. Defense-in-depth (multi-layer validation)
  4. Verification (evidence before claims)
- **Scripts:** `find-polluter.sh` for test pollution
- **References:** 4 debugging guides

---

### 9. Authentication & Security

#### **better-auth**
- **Description:** Modern authentication with Better Auth library
- **Features:**
  - Email/password authentication
  - OAuth providers integration
  - Database integration
  - Advanced features (2FA, sessions)
- **References:** 5 implementation guides

#### **payment-integration**
- **Description:** Payment gateway integration
- **Providers:**
  - **Polar:** Benefits, checkouts, products, subscriptions, webhooks, SDK
  - **SePay:** Vietnamese payment gateway, QR codes, webhooks
- **References:** 12 integration guides

---

### 10. Specialized Tools

#### **media-processing**
- **Description:** FFmpeg and ImageMagick processing
- **Capabilities:**
  - Video encoding, filters, streaming
  - Image editing and batch processing
  - Background removal (rmbg)
  - Format compatibility
- **References:** 8 processing guides
- **Scripts:** Automation scripts

#### **mermaidjs-v11**
- **Description:** Mermaid.js diagram generation
- **Diagram Types:** Flowchart, sequence, class, state, ER, Gantt, etc.
- **References:** 5 guides (types, config, CLI, integration, examples)

#### **threejs**
- **Description:** Three.js 3D graphics and WebGPU
- **Topics:** Loaders, textures, cameras, lights, animations, materials, physics, VR
- **References:** 16 comprehensive guides

#### **repomix**
- **Description:** Repository packaging for AI context
- **Features:** Configuration patterns, usage workflows
- **References:** 2 guides + scripts

#### **mcp-builder**
- **Description:** Build Model Context Protocol (MCP) servers
- **Platforms:** Node.js and Python
- **References:** 4 guides (best practices, evaluation)

#### **mcp-management**
- **Description:** Manage MCP server configuration
- **Topics:** Configuration, Gemini CLI integration, protocol specs
- **References:** 3 management guides

---

### 11. Document Processing

#### **docx**
- **Description:** Word document creation and editing
- **Capabilities:** Tracked changes, comments, formatting, text extraction
- **References:** OOXML spec, docx.js library

#### **pdf**
- **Description:** PDF manipulation toolkit
- **Capabilities:** Text/table extraction, creation, merging, splitting, forms
- **References:** PDF spec, forms handling

#### **pptx**
- **Description:** PowerPoint presentation handling
- **Capabilities:** Layouts, templates, charts, automation
- **References:** OOXML spec, html2pptx

#### **xlsx**
- **Description:** Excel spreadsheet processing
- **Capabilities:** Formulas, formatting, data analysis, visualization

---

### 12. Context Engineering

#### **context-engineering**
- **Description:** Master context engineering for AI agent systems
- **Core Principles:**
  1. Context quality > quantity
  2. Attention is finite (U-shaped curve)
  3. Progressive disclosure
  4. Isolation prevents degradation
  5. Measure before optimizing
- **Key Metrics:**
  - Token warning: 70%, trigger optimization: 80%
  - Compaction target: 50-70% reduction
  - Cache hit target: 70%+
- **Four-Bucket Strategy:** Write, Select, Compress, Isolate
- **References:** 9 comprehensive guides
- **Scripts:** Context analyzer, compression evaluator

---

### 13. E-commerce & Integrations

#### **shopify**
- **Description:** Shopify app development and themes
- **Topics:** App development, extensions, theme customization
- **References:** 3 Shopify guides

---

### 14. Meta Skills

#### **skill-creator**
- **Description:** Guide for creating effective Claude skills

#### **template-skill**
- **Description:** Basic template for new skills

---

## Key Features Across Skills

### Common Patterns

1. **Progressive Disclosure:**
   - Quick Start sections
   - Reference navigation tables
   - Load-on-demand detailed guides

2. **Script Automation:**
   - Python utilities (AI, media, deployment)
   - Node.js tools (docs, detection)
   - Bash helpers (testing, optimization)

3. **Best Practices:**
   - YAGNI, KISS, DRY principles
   - Security-first approach (OWASP guidelines)
   - Performance optimization
   - Testing strategies

4. **Documentation Structure:**
   - Executive summaries
   - When-to-use guidance
   - Quick reference tables
   - Complete examples
   - Decision matrices

### Tool Integration

Many skills integrate with external tools:
- **Gemini API:** ai-multimodal, research
- **Context7:** docs-seeker
- **GitHub:** research, docs-seeker
- **Cloud Providers:** devops
- **Package Managers:** npm, pip, brew

---

## Usage Recommendations

### For Development Tasks

| Task Type | Primary Skills | Supporting Skills |
|-----------|----------------|-------------------|
| Backend API | backend-development, databases | debugging, code-review |
| Frontend UI | frontend-dev-guidelines, ui-styling | frontend-design |
| Mobile App | mobile-development | devops, debugging |
| Infrastructure | devops | context-engineering |
| Research | research, docs-seeker | sequential-thinking |
| Planning | planning | problem-solving, brainstorming |
| Code Quality | code-review, debugging | sequential-thinking |

### For Learning

1. Start with **template-skill** to understand structure
2. Study **agent_skills_spec.md** for formal specification
3. Review **README.md** for ecosystem overview
4. Explore category-specific skills based on domain

### For Project Development

Recommended workflow:
1. **Planning:** planning, research, docs-seeker
2. **Implementation:** Domain-specific skills (backend, frontend, mobile)
3. **Quality:** code-review, debugging
4. **Deployment:** devops
5. **Documentation:** Skill patterns for documenting solutions

---

## Advanced Capabilities

### Multi-Agent Coordination

Referenced in:
- **context-engineering:** Multi-agent patterns, coordination
- **planning:** Researcher agents, scout agents
- **code-review:** code-reviewer subagent

### Context Optimization

- **context-engineering:** Token management, compaction, caching
- **Sequential-thinking:** Thought sequences for complex problems
- **docs-seeker:** Zero-token scripts for efficiency

### Quality Assurance

- **debugging:** 4-technique systematic approach
- **code-review:** Evidence-based verification gates
- **testing:** Across backend, frontend, mobile skills

---

## Unresolved Questions

1. How do Axiom skills (37 iOS-specific skills) integrate with general skills?
2. What is the relationship between document-skills and main skills?
3. Are there dependencies between skills that should be documented?
4. How to handle version conflicts across skill dependencies?
5. What are the token costs for loading multiple large skills simultaneously?

---

## Resources

- **Skills Repository:** `/Users/ddphuong/.claude/skills/`
- **Agent Skills Spec:** Version 1.0 (2025-10-16)
- **Total Documentation Files:** 200+ markdown files
- **Total Scripts:** 50+ helper scripts
- **Support Articles:**
  - What are skills: https://support.claude.com/en/articles/12512176
  - Using skills: https://support.claude.com/en/articles/12512180
  - Creating skills: https://support.claude.com/en/articles/12512198
  - Engineering blog: https://anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills

---

**Report Status:** Complete analysis of 37 skill directories
**Next Steps:** Consider creating skill dependency map and integration patterns guide
