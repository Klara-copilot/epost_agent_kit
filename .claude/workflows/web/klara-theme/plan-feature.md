# klara-theme: Plan Feature

## Trigger
Planning a new klara-theme UI feature (component, layout, or pattern).

## Context
Read `libs/klara-theme/CLAUDE.md` for component patterns, design tokens, and conventions.

## Prerequisites
- Verify `libs/klara-theme/` exists in the consuming project (this path is not part of epost_agent_kit itself)
- If path missing, inform user: "klara-theme workflows require a project with libs/klara-theme/ directory"

## Inputs (required)
- `libs/klara-theme/.ai-agents/ui/<feature>/requirements.md`
- `libs/klara-theme/.ai-agents/ui/<feature>/figma_refs.md`
- `libs/klara-theme/.ai-agents/ui/<feature>/repo_context.md`
- `libs/klara-theme/.ai-agents/ui/<feature>/FigmaExtract_UI.json`

## Steps

### 1. Gather Context
- Read all input files for the feature
- Query Web RAG for existing implementations:
  - `@web-rag-system get_rag_status`
  - `@web-rag-system query_rag "<component> props and variants" filters={"type":["component","utility"]} top_k=10`
- Check existing components in `libs/klara-theme/src/lib/components/` for reuse opportunities

### 2. Produce Plan Artifacts
Write 6 JSON files to `libs/klara-theme/.ai-agents/ui/<feature>/`:

| File | Purpose |
|------|---------|
| `component-inventory.json` | All components needed, existing vs new |
| `variants-mapping.json` | Figma variants → React props mapping |
| `tokens-mapping.json` | Design tokens for spacing, color, typography |
| `integration-guidance.json` | How feature integrates with existing code |
| `implementation-guidance.json` | Technical implementation details |
| `implementation-order.json` | Ordered list of implementation steps |

### 3. Validate Plan
- Reuse-first: do not create new components if a close equivalent exists
- Tokens: no hardcoded values unless explicitly approved
- Storybook: plan Default/Sizes/Variants/States story reachability
- Verify all referenced tokens exist in the design token system

## Success Criteria
- All 6 plan artifacts written
- No unnecessary new components (reuse existing)
- All design tokens mapped (no hardcoded values)
- Storybook coverage planned for all variants
- Implementation order reflects dependency chain

## Next Step
Run implement-component workflow with the plan artifacts.
