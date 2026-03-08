# Index Protocol

Defines how agents maintain the three project index files: `docs/index.json`, `plans/index.json`, and `reports/index.json`.

**Rule**: Every agent that produces a persistent artifact (plan, report, doc) MUST update the relevant index before finishing.

---

## 1. `docs/index.json` — Knowledge Base Registry

Maintained by: `epost-docs-manager`, `epost-fullstack-developer`, `epost-debugger`, `epost-planner`

Schema defined in `knowledge-retrieval/references/knowledge-base.md`. Key fields:

```json
{
  "schemaVersion": "1.0.0",
  "updatedAt": "YYYY-MM-DD",
  "entries": [{
    "id": "ADR-0001",
    "title": "Short title",
    "category": "decision | architecture | pattern | convention | feature | finding",
    "status": "accepted | current",
    "audience": ["agent", "human"],
    "path": "docs/decisions/ADR-0001-title.md",
    "tags": ["tag1"],
    "agentHint": "check before choosing X or doing Y",
    "related": []
  }]
}
```

**Update rule**: Append entry after writing the doc file. Update `updatedAt`.

---

## 2. `plans/index.json` — Plans Registry

Maintained by: `epost-planner`, `epost-project-manager`

```json
{
  "schemaVersion": "1.0.0",
  "updatedAt": "YYYY-MM-DD",
  "entries": [{
    "id": "260307-1409-slug",
    "title": "Short plan title",
    "status": "draft | active | completed | archived",
    "path": "plans/260307-1409-slug/plan.md",
    "created": "YYYY-MM-DD",
    "updated": "YYYY-MM-DD",
    "platforms": ["web | ios | android | backend | kit | all"],
    "effort": "Xh"
  }]
}
```

`plans/README.md` is the human-readable board — updated automatically by lifecycle scripts (`set-active-plan.cjs`, `complete-plan.cjs`, `archive-plan.cjs`). Do NOT manually edit it.

**Update rule**: Append entry after creating a plan directory. Update `updated` + `status` on lifecycle changes.

---

## 3. `reports/index.json` — Reports Registry

Maintained by: `epost-code-reviewer`, `epost-muji`, `epost-a11y-specialist`, `epost-researcher`, `epost-planner`, `epost-tester`

```json
{
  "schemaVersion": "1.0.0",
  "updatedAt": "YYYY-MM-DD",
  "entries": [{
    "id": "code-reviewer-260307-1409-my-feature-code-review",
    "type": "code-review | ui-audit | a11y-audit | research | plan | test",
    "agent": "epost-code-reviewer",
    "title": "Code Review: My Feature",
    "verdict": "APPROVE | FIX-AND-RESUBMIT | REDESIGN | ACTIONABLE | READY | PASS | FAIL",
    "files": {
      "agent": "reports/code-reviewer-260307-1409-my-feature-code-review.json",
      "human": "reports/code-reviewer-260307-1409-my-feature-code-review.md"
    },
    "plan": "plans/260307-1409-slug/plan.md",
    "created": "YYYY-MM-DD HH:mm"
  }]
}
```

**Dual-file rule**: Every report produces two files — `agent` (JSON, structured) and `human` (Markdown, readable). Both paths go in `files`. If a report type only produces one file, use the same path for both.

**Update rule**: Append entry after writing both report files. Update `updatedAt`. Create `reports/index.json` if absent.

---

## Agent Responsibility Matrix

| Agent | Updates docs/ | Updates plans/ | Updates reports/ |
|-------|--------------|----------------|-----------------|
| `epost-planner` | — | `index.json` | `index.json` (plan report) |
| `epost-researcher` | — | — | `index.json` |
| `epost-code-reviewer` | — | — | `index.json` |
| `epost-muji` | — | — | `index.json` |
| `epost-a11y-specialist` | — | — | `index.json` |
| `epost-tester` | — | — | `index.json` |
| `epost-fullstack-developer` | `index.json` (knowledge capture) | — | — |
| `epost-debugger` | `index.json` (findings) | — | `index.json` |
| `epost-docs-manager` | `index.json` | — | — |

---

## Bootstrap (First Run)

If `reports/index.json` does not exist, create it:

```json
{
  "schemaVersion": "1.0.0",
  "updatedAt": "YYYY-MM-DD",
  "entries": []
}
```

If `plans/index.json` does not exist, create it with the same shape (replace `entries` content).
