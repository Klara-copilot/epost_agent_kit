# Knowledge Base Index

**Quick Reference** | 73,000 LOC across 4 files | Last updated: 2026-02-05

## Files at a Glance

| File | Size | Lines | Purpose | Format |
|------|------|-------|---------|--------|
| Agent Mental Model | 5.2 KB | 192 | Conceptual guide to AI agent ecosystems | Markdown |
| Figma Variables Architecture | 18 KB | 538 | Design system specification (1,059 vars, 42 collections) | Markdown |
| Inconsistencies & Improvements | 14 KB | 398 | Audit report + 14 recommendations | Markdown |
| Figma Variables Export | 2.3 MB | 71,872 | Machine-readable JSON (source of truth) | JSON |

## Key Numbers

- **1,059** design variables across **42** Figma collections
- **11** hops maximum reference chain depth
- **28.3%** of references point to external brand libraries
- **78%** variable reduction through orthogonal modes (4,802 theoretical combos → 1,059 actual)
- **14** improvement recommendations (5 architecture, 5 naming, 4 tooling)
- **8** named inconsistencies identified

## Critical Issues (Prioritized)

### HIGH
- **"FIeld" Typo** (24 vars) — Breaks pattern matching in code generators

### MEDIUM
- Mixed separator usage (~460 vars) — Dots and dashes inconsistent
- Double-space in ┈ prefix (4 collections) — Breaks string matching

### LOW
- "Info 2" naming (inverts hierarchy)
- 6 single-variable collections (collection overhead)

## Architectural Insights

**Layers**:
1. **Primitives** — 505 raw atoms (47.6% of system)
2. **Themes** — 63 semantic tokens (Signal, Inverse, Additional, Color Adjustment)
3. **Platform** — 132 central hub tokens (Web/Mobile, 37.9% differentiated)
4. **Components** — Consumer API (15-22 vars per category)
5. **Sub-system** — 23 ┈-prefixed variant/content/mode collections

**Key Patterns**:
- Design Decisions, not values (encoded as variable references)
- Change Once, Cascade Everywhere (via deep chains)
- Orthogonal Mode Composition (no combinatorial explosion)
- Platform as Central Hub (20 collections depend on it)

## When to Use Each File

| Agent/Role | Primary | Secondary |
|-----------|---------|-----------|
| **Orchestrator** | Agent Mental Model | - |
| **Architect** | Variables Architecture + Inconsistencies | JSON (reference) |
| **Implementer** | JSON Export (chains, values) | Variables Architecture (context) |
| **Auditor** | Inconsistencies Report | JSON (data validation) |
| **Retriever** | All (search source) | - |
| **Code Generator Tool** | JSON Export (chain resolution) | Variables Architecture (design intent) |

## Unresolved Questions (For Team)

1. Target max chain depth: 7, 9, or 11 hops?
2. External library version control strategy?
3. Fix inconsistencies retroactively or prospectively?
4. Keep 82 identical Platform Web/Mobile vars (uniform API) or remove (clear signal)?
5. Should ┈ Inverse and ┈ Size Scale be re-numbered?

---

**Full analysis**: See `scout-260205-2250-knowledge-base-analysis.md`
