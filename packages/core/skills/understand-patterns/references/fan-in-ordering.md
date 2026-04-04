# Fan-In Ordering

## Problem

Presenting codebase analysis in arbitrary or alphabetical order forces readers to encounter complex, highly-depended-upon files before understanding simpler foundations. Learning paths become confusing.

## Pattern

Use graph topology (fan-in metrics) to determine pedagogically optimal ordering.

**Fan-In** = number of other nodes that import/depend on a node.
High fan-in → widely used → foundational → should appear early in learning paths.

**BFS Traversal from Entry Points:**
1. Identify entry points (files with high fan-out, named `index`, `main`, `app`, etc.)
2. Run BFS from each entry point
3. Map BFS depth to instructional role:
   - Depth 0: "What is this project?" (overview, README-level)
   - Depth 1: "How does it start?" (entry points + direct dependencies)
   - Depth 2+: Feature exploration, infrastructure, deployment

**Fan-In Ranking (per UA):**
1. Score each node by import count across the codebase
2. Rank descending (highest fan-in = most foundational)
3. Use ranking to sequence discovery: present high fan-in nodes first

## ePost Application

```
// get-started: Step 3 — Present Insights
Current: presents directory structure (alphabetical, no topology)
Enhanced: scan importMap if available, rank by fan-in, present high-fan-in files first

// docs --scan: discovery ordering  
Current: processes files in glob order
Enhanced: rank by fan-in → document highly-imported files first → better KB coverage

// knowledge retrieval (future)
Sort search results by fan-in rank — surface foundational concepts before edge cases
```

## Simplified ePost Implementation

Full BFS + import graph computation requires UA's tooling. Lightweight approximation:

```
1. Read package.json or entry-point config → identify main entry files
2. For each discovered file: count grep hits (how many other files import it)
3. Sort by import count descending
4. Present top 10 as "core files", remainder as "peripheral"
```

This approximation captures 80% of the benefit without full graph construction.

## Tour Step Structure (from UA)

```json
{
  "order": 1,
  "title": "Project Overview",
  "description": "What this is and why it exists",
  "nodeIds": ["file:src/index.ts"],
  "languageLesson": null
}
```

Quality gates: 5–15 steps total, no empty steps, sequential ordering enforced.

## When to Use

- Onboarding flows where order of presentation matters
- Discovery reports that will be read top-to-bottom
- KB generation — document foundational modules before leaf modules
- Any "tour" or "guide" output where pedagogical sequencing adds value

## When to Skip

- Search results (relevance, not topology, drives ordering)
- Debugging (follow the stack trace, not fan-in rank)
- Single-file analysis (no ordering needed)
