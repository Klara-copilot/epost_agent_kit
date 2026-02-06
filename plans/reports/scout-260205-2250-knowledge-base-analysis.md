# Knowledge Base Analysis Report

**Scout Report** | 2026-02-05 | 73,000 LOC | 4 files

---

## Overview

The `/knowledge` directory contains reference materials and design system specifications for multi-agent AI workflows and the Vien 2.0 design system. It serves as the **source of truth** (RAG layer) that agents use during planning, implementation, and code generation.

**Total Size**: ~73 KB markdown + 2.3 MB JSON
**Files**: 4 (1 markdown concept guide, 2 Figma architecture docs, 1 large JSON export)
**Purpose**: Knowledge base for agent decision-making and design-to-code workflows

---

## File Inventory

### 1. **Agent Mental Model** (`192 lines, 5.2 KB`)
**Path**: `/knowledge/agent/agent mental model.md`
**Type**: Markdown reference guide

**Content**: Educational 1-page cheat sheet explaining the AI agent ecosystem architecture.

**Sections**:
- AI Ecosystem model: Team + Rules + Memory + Tools + Workflow
- 8 Agent roles with responsibilities (Orchestrator, Retriever, Architect, Implementer, Auditor, Fixer, Documenter)
- Instruction layering model (4 levels of precedence)
- Rules as hard constraints
- Skills as reusable playbooks
- Knowledge & RAG pattern
- Tools & MCPs (Model Context Protocol)
- Workflows as SOPs
- File artifact types
- ADR (Architecture Decision Record) pattern
- 3 golden rules: Follow workflow, use internal knowledge first, never skip audit

**Usage in Project**: 
- Onboarding document for new agents and team members
- Reference for understanding agent role assignments
- Blueprint for workflow orchestration

**Key Insights**:
- Emphasizes structured, rule-based AI behavior vs free-form generation
- Instruction precedence matters: core > project > editor > user request
- RAG pattern prevents hallucination by requiring knowledge lookup before action

---

### 2. **Figma Variables Architecture** (`538 lines, 18 KB`)
**Path**: `/knowledge/figma/vien2/variables-architecture.md`
**Type**: Markdown architecture specification

**Content**: Comprehensive specification of the Vien 2.0 design system's variable structure (1,059 variables across 42 collections).

**Core Philosophy** (5 principles):
1. Design Decisions, Not Design Values — stores decisions, not raw values
2. Change Once, Cascade Everywhere — deep reference chains enable automatic propagation
3. Modes as Dimensions, Not Duplicates — orthogonal composition (reduces 4,802 theoretical combos to 1,059 actual variables, ~78% reduction)
4. Platform Abstraction as Bridge — separates abstract design from concrete code
5. Component Category as Consumer API — layers aggregate decisions into coherent APIs per component

**Architecture Layers**:
- **Layer 0**: External brand libraries (5 libraries, 2,064 remote references, 28.3% of all refs)
- **Layer 1**: Primitives (505 vars, 47.6%) — raw design atoms (grid, colors, typography, opacity, radius, booleans, strings)
- **Layer 2**: Themes & Semantics (63 vars total)
  - Signal (8 vars, 5 modes)
  - Inverse (32 vars, 2 modes)
  - Additional (8 vars, 6 modes)
  - Color Adjustment (15 vars, 2 modes)
- **Layer 3**: Platform & Scaling (central hub)
  - Platform (132 vars, 2 modes: Web/Mobile, 37.9% differentiation rate)
  - Size Scale (90 vars, 7 modes)
  - Typography (30+3+1 vars across line-height, font-weight, border-weight)
  - Responsive (16 vars, 7 breakpoints)
  - Platform Theme (9 vars)
  - Radius Scale (10 vars)
  - Effects, utilities, etc.
- **Layer 4**: Components (consumer API)
  - Component Category (15 vars, 7 modes: Avatar, Badge, CTA, Container, Field, Picker, Toggle, 28 cross-collection deps)
  - Component State (22 vars, 7 states)
  - Component Size (18 vars)
  - Component Position (16 vars)
  - Input Validation (10 vars)
- **Sub-system** (┈-prefixed, 23 collections): Variants, Content, Mode, Scale, Surface

**Reference Chain Architecture**:
- **Max depth**: 11 hops (component → variant → surface → platform-theme → platform → inverse → primitives → brand-sets → brands-groups → brand-group-1 → brand-settings)
- **Depth distribution**: 54% shallow (1-2), 29% semantic (3-4), 15% component (5-7), 2% deep (8-11)
- **Dependency hubs** (most depended on):
  - 1. Primitives (32 dependents)
  - 1. Base Colors external (20)
  - 9. Platform (20)
  - 3. Brand Sets external (19)
  - 2. Brand Settings external (17)

**Multi-Mode Composition** (eliminates combinatorial explosion):
- 2 platforms × 7 sizes × 7 states × 7 categories × 7 breakpoints = 4,802 theoretical combinations
- Actual: 1,059 variables (78% reduction through orthogonal modes)

**Variable Types**:
- FLOAT: 642 (60.6%) — sizes, spacing, opacity, line-height, font-size
- COLOR: 339 (32.0%) — all colors
- BOOLEAN: 48 (4.5%) — toggles, flags
- STRING: 30 (2.8%) — font families, text

**Naming Conventions**:
- Pattern: `{domain}.{category}.{variant}.{property}`
- Separators: `.` for hierarchy, `-` for compound words, `/` for namespaces
- Examples: `color.signal.default.background`, `typography.font-size.body.1`

**Usage in Project**:
- Figma-to-code pipeline specifications
- Design token generation
- Component props mapping
- Multi-brand support documentation (swapping `brandsettings.post.*` rethemes entire system)

**Key Insights**:
- Platform layer is architectural hub (central routing point)
- External library coupling (28.3% remote refs) requires careful version control
- Orthogonal modes prevent variable explosion while maintaining flexibility
- Deep chains enable "change once, cascade everywhere" but add debugging complexity

---

### 3. **Inconsistencies & Improvements Analysis** (`398 lines, 14 KB`)
**Path**: `/knowledge/figma/vien2/2026.02.03/inconsistencies-improvements.md`
**Type**: Markdown audit report (dated 2026-02-03)

**Content**: Detailed analysis of structural complexities, naming inconsistencies, and improvement recommendations.

**6 Structural Complexities**:
1. **C1. Chain Depth** (11 hops max) — Debugging difficulty, performance risk, cognitive load
2. **C2. Mode Explosion** (200+ distinct modes) — 4,802 theoretical combinations, tooling risk
3. **C3. Primitives Dominance** (505/1,059 = 47.6%) — Flat namespace, refactoring impact, search friction
4. **C4. Hub Concentration** (Platform 132 vars, 82 identical) — Single point of structural dependency
5. **C5. External Library Coupling** (28.3% remote refs) — Not version-controlled, independent updates risk
6. **C6. Redundant Platform Variables** (82 identical Web/Mobile) — Inflates count, reduces signal clarity

**8 Named Inconsistencies**:
1. **I1. "FIeld" Typo** (24 vars) — Capital I instead of lowercase; breaks pattern matching
2. **I2. Double-Space After ┈** (4 collections) — Tree-related collections use `┈  ` instead of `┈ `
3. **I3. Mixed Separators** (~460 vars) — Dots and dashes used inconsistently (dots only, dashes in compounds, mixed)
4. **I4. Content/ Spacing** — Inconsistent slash spacing around `/` in collection names
5. **I5. Numbered vs ┈ Distinction** — `┈ Inverse` and `┈ Size Scale` are system-level but prefixed as sub-systems
6. **I6. Single-Variable Collections** (6 collections) — `7. Border Weight`, `┈ Content / Text`, etc. create overhead
7. **I7. Repeated Collections in Chains** (210 vars) — Same collection appears multiple times in reference chains
8. **I8. "Info 2" Naming** — Inverts visual hierarchy (2 usually means weaker, here it's just variant)

**14 Improvement Recommendations**:

*Architecture (5)*:
- **A1**: Flatten deep chains (target: max 7 hops) — collapse Brand Sets → Brands Groups → Brands Group 1 → Brand Settings tail
- **A2**: Split Primitives into 7 sub-collections by domain (Color, Typography, Grid, Opacity, Boolean, String, Radius)
- **A3**: Consolidate 6 single-variable collections
- **A4**: Formalize naming scheme as spec (separators, prefixes, segments)
- **A5**: Reduce redundant Platform modes (82 identical vars)

*Naming (5)*:
- **N1**: Fix "FIeld" typo (HIGH priority)
- **N2**: Normalize ┈ spacing (MEDIUM)
- **N3**: Rename "Info 2" to "Info Alt" (LOW)
- **N4**: Standardize separator usage across ~460 vars (MEDIUM, high impact)
- **N5**: Re-prefix system-level ┈ collections (LOW)

*Tooling (4)*:
- **T1**: Chain Depth Linting — warn when chains exceed 7 hops
- **T2**: Duplicate Detection — identify identical values, chains, unused variables
- **T3**: Version Tracking — add metadata, diff tracking, audit trails
- **T4**: Dependency Graph Visualization — interactive D3/Mermaid/Graphviz graph

**Additional Issues**:
- Mode names with spaces/parentheses cause code generation issues
- Overlapping collection purposes (Base Colors vs Primitives, Signal vs Additional)

**Structural Health Summary**:
- **CLEAN**: Null/empty values, orphaned references, mode consistency, type/scope alignment
- **POOR**: Naming consistency (typos, mixed separators, spacing)
- **EXCESSIVE**: Chain depth (max 11)
- **UNCLEAR**: Collection organization (numbered vs ┈ not documented)
- **IMBALANCED**: Size distribution (Primitives dominates, 6 single-var collections)

**Usage in Project**:
- Input for refactoring prioritization
- Specification for code generator robustness
- Design system governance
- Tooling requirements

**Key Insights**:
- Most issues are **naming/consistency** (fixable, HIGH ROI)
- **Chain depth** is architectural debt (impacts new developer onboarding)
- **External library coupling** is a process issue (version control strategy needed)
- System is **structurally sound** but needs formal specifications and tooling

---

### 4. **Figma Variables Export (JSON)** (`71,872 lines, 2.3 MB`)
**Path**: `/knowledge/figma/vien2/figma-variables.json`
**Type**: Machine-readable JSON export (complete Figma API dump)

**Structure** (42 top-level collection objects):

Each collection contains:
- `collectionId` — Figma internal ID
- `collectionName` — human-readable name
- `defaultMode` — fallback mode ID
- `modes` — array of mode definitions (each with `id` and `name`)
- `variables` — array of variable objects

**Variable Object Schema**:
```json
{
  "id": "VariableID:...",
  "name": "color.signal.default.background",
  "type": "COLOR|FLOAT|BOOLEAN|STRING",
  "modes": {
    "{modeId}": {
      "mode": "Web|Mobile|...",
      "value": {
        "$collectionName": "2. Signal",
        "$value": "{strong.background}",
        "$chain": [
          {
            "collectionName": "2. Signal",
            "variableName": "strong.background"
          },
          {...}, // up to 11 hops
          {
            "collectionName": "2. Brand Settings",
            "variableName": "brandsystem.brandsettings.post.colors.additionals.purple",
            "isRemote": true,
            "libraryName": "2. Brand Settings",
            "libraryKey": "91ea938957643db79e7b07b48db781768efc126d"
          }
        ]
      }
    }
  }
}
```

**Key Features**:
- **Full chain resolution**: Every variable includes its complete reference chain (critical for code generation)
- **Remote library tracking**: `isRemote`, `libraryName`, `libraryKey` fields for external references
- **Mode composition**: Each variable can have different values per mode
- **Type safety**: Explicit type field enables validation

**Collections Represented** (42 total):
- 19 numbered system collections (1-19 core, some skipped)
- 5 external brand libraries (Base Colors, Brand Settings, Brand Sets, Brands Groups, Brands Group 1)
- 23 ┈-prefixed sub-system collections (Variants, Content, Modes, Scales, Surfaces)

**Data Quality**:
- **Size**: 2.3 MB uncompressed (efficient for daily exports)
- **Completeness**: All 1,059 variables with full chain metadata
- **Validity**: All references resolve (no orphaned links)

**Usage in Project**:
- Input for code generators (design tokens → code constants)
- Design system documentation generation
- Figma-to-code pipeline source
- Change tracking (diffs between exports)
- Multi-brand theming (swapping Brand Settings)

**Processing Requirements**:
- Must resolve up to 11-hop chains
- Must handle remote library references (fetch external definitions)
- Must compose orthogonal modes correctly
- Must validate circular-looking chains don't cause infinite loops

**Key Insights**:
- JSON structure is **well-normalized** (no redundant data)
- Chain depth metadata enables intelligent code generation
- Remote refs need **external library resolution** at export time
- Orthogonal modes require sophisticated composition logic in code gen

---

## Integration Points

### With Agent Workflows

1. **Retriever Agent**: Searches `agent mental model.md` to answer "How do agents work?"
2. **Architect Agent**: References both Figma docs to design token → code mapping strategies
3. **Implementer Agent**: Uses JSON export directly for code generation targets
4. **Auditor Agent**: Checks inconsistencies doc to validate against known issues
5. **Documenter Agent**: Generates design system docs from metadata + analysis

### With CI/CD & Tooling

- **Chain Depth Linting**: Pre-commit hook validates no variable chain exceeds 7 hops
- **Figma Sync**: Auto-exports JSON daily, detects changes via metadata diff
- **Code Generator**: Ingests JSON, resolves chains, produces design token constants
- **Design System Site**: Renders variables doc + dependency graph from JSON

---

## Content Categorization

| Category | Files | Purpose | Owner |
|----------|-------|---------|-------|
| **Conceptual** | agent mental model.md | AI ecosystem education | Agent systems |
| **Architectural** | variables-architecture.md | Design system design | Design system |
| **Audit/Governance** | inconsistencies-improvements.md | Quality & refactoring roadmap | Design system + tooling |
| **Operational** | figma-variables.json | Source of truth for code gen | Figma + CI/CD |

---

## Notable Patterns

1. **Layered Architecture** — 4-layer + sub-system model scales from atoms (Primitives) to components (Category)
2. **Orthogonal Modes** — Avoids combinatorial explosion by composing dimensions independently
3. **Deep Reference Chains** — Enables cascade behavior ("change once, propagate everywhere")
4. **External Library Coupling** — Supports multi-brand theming but requires careful versioning
5. **Cognitive Load** — 11-hop chains, 1,059 variables, 42 collections = significant onboarding complexity

---

## Unresolved Questions

1. **Chain Depth Trade-offs**: What is the acceptable max depth (7, 9, 11)? Trade-off between cascade granularity and debugging complexity?
2. **Version Tracking**: How are breaking changes in external brand libraries detected and communicated?
3. **Code Generator Robustness**: How does the code gen handle circular-looking chains (same collection multiple times) without infinite loops?
4. **Naming Formalization**: Will inconsistencies be fixed retroactively or prospectively?
5. **Collection Organization**: Should ┈ Inverse and ┈ Size Scale be re-numbered to reflect system-level role?
6. **Platform Identical Vars**: Should the 82 identical Web/Mobile variables be kept (uniform API) or removed (clearer signal)?

---

## Recommendations for Agents

**When using this knowledge base**:

1. **Before designing new tokens**: Read `variables-architecture.md` (Layers 1-4 model)
2. **When debugging token issues**: Check `inconsistencies-improvements.md` (known issues)
3. **For code generation**: Use `figma-variables.json` directly (chain metadata is the source of truth)
4. **When onboarding new team members**: Start with `agent mental model.md` (conceptual foundation)
5. **For governance**: Track improvements roadmap from `inconsistencies-improvements.md` (A1-A5, N1-N5, T1-T4)

