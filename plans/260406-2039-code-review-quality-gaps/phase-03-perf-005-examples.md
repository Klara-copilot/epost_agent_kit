---
phase: 3
title: "Strengthen PERF-005 examples for bundle size awareness"
effort: 1h
depends: []
---

# Phase 3: PERF-005 Bundle Size Awareness

## Context

- Plan: [plan.md](./plan.md)
- Target file: `packages/platform-web/skills/web-frontend/references/code-review-rules.md`
- Related: Gap #3 (bundle size delta) — deferred, this phase improves existing rule coverage

## Overview

Gap #3 (actual bundle size delta check) is deferred — requires external tooling (`next/bundle-analyzer`, CI integration). Instead, strengthen PERF-005 and PERF-006 pass/fail examples to catch the most common bundle size regressions via rule-based review.

## Requirements

### Update PERF-005

Current rule: "Large library imports use named or path imports, not full barrel imports"

Expand pass/fail examples to cover more real-world cases:

```markdown
| PERF-005 | Large library imports use named/path imports, not full barrel — flag imports adding >20KB to initial bundle | medium | `import debounce from 'lodash/debounce'`; `import { format } from 'date-fns/format'` | `import _ from 'lodash'` (70KB); `import * as datefns from 'date-fns'` (35KB); `import moment from 'moment'` (67KB when date-fns suffices) |
```

### Update PERF-006

Current rule: "Heavy modules loaded lazily where applicable"

Add concrete size thresholds and examples:

```markdown
| PERF-006 | Modules >30KB loaded lazily when not needed on initial render — React.lazy + Suspense or dynamic import() | low | `const Chart = React.lazy(() => import('recharts'))` for chart widget only shown on dashboard tab | Top-level `import { LineChart } from 'recharts'` (45KB) on a page where chart is behind a tab; `import 'highlight.js'` (180KB) for optional code preview |
```

### Add Bundle Size Deferral Note

Add a comment block at the end of the PERF section:

```markdown
<!-- Bundle size delta check (PERF-007) deferred.
     Threshold for implementing: when CI pipeline reports bundle size per-PR,
     or when a PR demonstrably adds >50KB to initial bundle despite PERF-005/006.
     Current coverage: PERF-005 (import patterns) + PERF-006 (lazy loading) catch
     the most common regressions without external tooling. -->
```

## Files to Change

- `packages/platform-web/skills/web-frontend/references/code-review-rules.md` — update PERF-005 + PERF-006 rows, add deferral comment

## TODO

- [ ] Update PERF-005 pass/fail with concrete KB sizes and more library examples
- [ ] Update PERF-006 pass/fail with 30KB threshold and real-world cases
- [ ] Add HTML comment documenting PERF-007 deferral conditions
- [ ] Verify file stays under 110 lines

## Success Criteria

- PERF-005 mentions concrete sizes (lodash 70KB, moment 67KB, date-fns 35KB)
- PERF-006 has a clear threshold (30KB) for when lazy loading is expected
- Deferral note documents when to revisit gap #3
- No changes to PERF-001 through PERF-004
