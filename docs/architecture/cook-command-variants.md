# Cook Command Variants (Phase 1 - v1.1.0)

## Overview

The `/cook` command uses a **splash router pattern** that analyzes task complexity and routes to the appropriate implementation strategy. This enables optimal execution strategies for different types of implementation tasks.

**Router Flow**:
```
/cook [description]
    ↓
Router analyzes:
  - Scope (keywords: "build", "refactor", "optimize")
  - Complexity (lines of code, module count)
  - Parallelization potential (multi-component features)
    ↓
Routes to:
  - /cook → Standard implementation with context analysis
  - /cook:auto → AI-driven approach selection
  - /cook:auto:fast → Fast implementation (cache-aware, minimal research)
  - /cook:auto:parallel → Parallel multi-module implementation
```

## Cook Variants

### Standard Cook (/cook)

Default implementation strategy with comprehensive context analysis.

**Use Cases**:
- Standard feature implementation
- Bug fixes with moderate complexity
- Well-understood patterns from existing code

**Features**:
- Full context analysis
- Comprehensive error handling
- Documentation included
- Integration verification

**Output**: Implementation files with explanations

**Example**:
```
User: /cook Build user profile page with form validation
  ↓ Analyzes task scope and codebase
  ↓ Implements component with hooks
  ↓ Adds tests and documentation
```

### Auto Cook (/cook:auto)

AI-driven approach that automatically selects optimal strategy.

**Use Cases**:
- When best approach is unclear
- Multiple viable implementations possible
- Auto-optimization needed

**Features**:
- Analyzes task and recommends approach
- Evaluates codebase patterns
- Selects optimal implementation method
- Validates approach before executing

**Output**: Optimized implementation based on AI analysis

**Example**:
```
User: /cook:auto Implement authentication flow
  ↓ Analyzes existing auth patterns
  ↓ Recommends OAuth + JWT approach
  ↓ Implements with middleware
```

### Fast Auto Cook (/cook:auto:fast)

Optimized for speed with caching and minimal research.

**Use Cases**:
- Simple implementations
- Time-sensitive tasks
- Well-established patterns

**Optimizations**:
- Uses codebase cache
- Minimal research phase
- Quick decision making
- Reuses template patterns

**Performance**: 50-70% faster than standard cook

**Example**:
```
User: /cook:auto:fast Add button component
  ↓ Loads from cache (shadcn/ui button variant)
  ↓ Customizes for project
  ↓ Returns in seconds
```

### Parallel Auto Cook (/cook:auto:parallel)

For multi-module features with independent subsystems.

**Use Cases**:
- Database + API + UI implementation
- Multi-component features
- Tasks parallelizable across agents

**Features**:
- File ownership tracking (no conflicts)
- Dependency graph execution batches
- Parallel agent coordination
- Conflict detection and resolution

**Execution Model**:
```
Batch 1:  Database Schema ──┐
          API Endpoints ────┤─→ UI Components
                             ↓
Batch 2:  Integration Tests (depends on Batch 1)
```

**Performance**: Significant speedup for multi-module tasks (2-3x faster)

**Example**:
```
User: /cook:auto:parallel Build blog feature with posts and comments
  ↓ Splits into: DB schema, API endpoints, UI components
  ↓ Executes in parallel (Batch 1)
  ↓ Runs integration tests (Batch 2)
  ↓ Completes feature in ~50% of time
```

## Implementation Routing Logic

```
Analyze task → Determine variant:

"Build X component"
  ├─ Scope: small (< 100 LOC)
  ├─ Complexity: low
  └─ Route: /cook:auto:fast ✓

"Implement auth system"
  ├─ Scope: large (300+ LOC)
  ├─ Complexity: high
  └─ Route: /cook:auto ✓

"Add user, posts, comments"
  ├─ Scope: very large (1000+ LOC)
  ├─ Complexity: very high
  ├─ Modules: 3+ independent
  └─ Route: /cook:auto:parallel ✓

"Refactor existing code"
  ├─ Scope: unknown
  ├─ Complexity: depends on refactor type
  └─ Route: /cook (comprehensive analysis) ✓
```

---

**Last Updated**: 2026-02-06
**Status**: v1.1.0 Phase 1 Complete
