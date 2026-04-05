# Fan-In Tour Construction

## Purpose

Build a dependency-ordered learning tour from the structural scan's `importMap`. Teaches foundational modules before feature leaves.

## Input

`importMap` from structural scan: `{ "filepath": inboundCount }`.

## Step 1 — Tier Assignment

Sort modules by `inboundCount` descending. Assign tiers:

| Tier | inboundCount | Role |
|------|-------------|------|
| Tier 1 | ≥ 5 | Foundations — imported by many, understand first |
| Tier 2 | 2–4 | Shared utilities — depended on by features |
| Tier 3 | 0–1 | Features / leaves — end of learning path |

### Within Each Tier

- Entry points first (files matching entry point paths from scan)
- Then sort by `inboundCount` descending within the tier

## Step 2 — Build Tour Steps

Tour order: Tier 1 → Tier 2 → Tier 3. Limit to 5–15 steps total.

For each step:

```json
{
  "order": 1,
  "tier": 1,
  "file": "src/store/index.ts",
  "role": "State management foundation",
  "whyFirst": "12 modules import this — understanding state shape unlocks all feature code",
  "complexity": "moderate"
}
```

**Quality gates:**
- 5–15 steps total (prune low-value Tier 3 entries if over limit)
- No duplicate files
- Sequential ordering enforced (order = 1, 2, 3...)
- Every step must have a non-empty `whyFirst` explanation

## Step 3 — Output Format

Present as a numbered list in onboarding report:

```markdown
## Codebase Tour (dependency order)

**Tier 1 — Foundations** (read these first)
1. `src/app/layout.tsx` — Root layout, bootstraps all providers. Read first: wires Redux + Auth.
2. `src/store/index.ts` — Redux store. Read second: state shape governs all components.
3. `src/lib/utils.ts` — Shared helpers. Read third: used in 18 files, recognized everywhere.

**Tier 2 — Shared Utilities**
4. `src/hooks/useAuth.ts` — Auth state hook. Used by 3 feature modules.
5. `src/components/ui/Button.tsx` — Base component. Extended by every feature screen.

**Tier 3 — Features** (explore after foundations)
6. `src/app/(routes)/dashboard/page.tsx` — Dashboard feature entry.
7. `src/app/(routes)/settings/page.tsx` — Settings feature entry.
```

## Lightweight Approximation

If full import graph construction is too expensive, use this fallback:

```
1. Read package.json → identify main entry file
2. For top 20 files by line count: run grep count of how many files import each
3. Sort by grep count descending
4. Present top 5 as "core files", next 5 as "utilities", rest as "features"
```

This captures 80% of the benefit. Prefer full import map when available.

## Cross-Reference

See `references/structural-scan-protocol.md` for the `importMap` input this consumes.
