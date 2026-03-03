# Sidecar Generation Workflow (Web)

AI-generated metadata that enriches RAG indexing quality. Sidecars improve search relevance by providing structured context that embeddings alone miss.

## When to Generate

| Trigger | Action |
|---------|--------|
| Created new component | Generate sidecar for the new file |
| Major refactor (renamed, restructured) | Regenerate sidecar for affected files |
| RAG result has `stale_sidecar: true` | Regenerate after completing current task |
| RAG result has placeholder metadata (generic summary, empty topics) | Regenerate with real context |
| Component gained new exports/props | Update sidecar to reflect new API surface |

## When NOT to Generate

- Minor edits (typo fixes, comment changes, formatting)
- Test files (`*.test.tsx`, `*.spec.ts`)
- Config files (`next.config.js`, `tsconfig.json`, `.env`)
- Generated files (build output, type declarations)

## Metadata Fields

```typescript
generate_sidecar({
  file_path: "libs/klara-theme/src/components/Button/Button.tsx",
  metadata: {
    summary: "Primary button component with loading, disabled, and icon variants",
    component_names: ["Button", "ButtonProps", "ButtonGroup"],
    topics: ["ui", "design-system", "interaction"],
    exports: ["Button", "ButtonGroup", "buttonVariants"],
    dependencies: ["@radix-ui/react-slot", "class-variance-authority"],
    design_tokens: ["--button-bg", "--button-text", "--button-radius"],
    hooks_used: ["useButtonContext"]
  }
})
```

### Field Guidelines

| Field | Content | Example |
|-------|---------|---------|
| `summary` | 1-2 sentences, what the file does | "Alert dialog with configurable actions and trap focus" |
| `component_names` | All React components + type exports | `["Dialog", "DialogProps", "DialogTrigger"]` |
| `topics` | 2-4 relevant topic tags | `["ui", "design-system", "overlay"]` |
| `exports` | Named exports from the file | `["Dialog", "useDialog", "dialogVariants"]` |
| `dependencies` | Key external deps (not React/Next) | `["@radix-ui/react-dialog"]` |
| `design_tokens` | CSS custom properties used | `["--dialog-bg", "--dialog-overlay"]` |
| `hooks_used` | Custom hooks consumed | `["useDialogContext", "useFocusTrap"]` |

## Verification

After generating a sidecar, verify it improved results:

```
1. query({ query: "<component name>", top_k: 3 })
2. Check: Is the file in top results?
3. Check: Does score improve over pre-sidecar baseline?
4. Check: Are metadata fields populated (not placeholder)?
```

If results don't improve, review the summary — it may be too generic. Summaries should describe behavior and purpose, not just restate the filename.

## Batch Generation

After large refactors affecting 5+ files, generate sidecars for all affected files. Process in dependency order: shared utilities first, then components that consume them.
