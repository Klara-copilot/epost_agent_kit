# klara-theme: Implement Component

## Trigger
Implementing a klara-theme component or layout from an existing plan.

## Context
Read `libs/klara-theme/CLAUDE.md` for component patterns, naming conventions, design tokens, and Storybook standards.

## Prerequisites
- Verify `libs/klara-theme/` exists in the consuming project (this path is not part of epost_agent_kit itself)
- If path missing, inform user: "klara-theme workflows require a project with libs/klara-theme/ directory"

## Inputs (required)
- `libs/klara-theme/.ai-agents/ui/<feature>/component-inventory.json`
- `libs/klara-theme/.ai-agents/ui/<feature>/variants-mapping.json`
- `libs/klara-theme/.ai-agents/ui/<feature>/tokens-mapping.json`
- `libs/klara-theme/.ai-agents/ui/<feature>/implementation-guidance.json`
- `libs/klara-theme/.ai-agents/ui/<feature>/FigmaExtract_UI.json`

## Steps

### 1. Pre-Implementation Check
- Read all plan artifacts
- Query Web RAG for existing implementations to avoid duplication:
  - `@web-rag-system get_rag_status`
  - `@web-rag-system query_rag "<target> existing implementation" filters={"type":["component","layout"]} top_k=10`
- Review existing component patterns in codebase

### 2. Implement Component
Write code to:
- `libs/klara-theme/src/lib/components/<component-name>/**` (for components)
- `libs/klara-theme/src/lib/layouts/<layout-name>/**` (for layouts)

Follow conventions from `libs/klara-theme/CLAUDE.md`:
- Component development patterns (forwardRef, displayName, etc.)
- Naming and file structure conventions
- Design token usage (no hardcoded values)
- TypeScript strict mode

### 3. Write Storybook Stories
Create `*.stories.tsx` covering:
- **Default** — base render
- **Sizes** — all size variants
- **Variants** — visual variants (primary, secondary, etc.)
- **States** — interactive states (disabled, loading, error, etc.)

Follow Storybook conventions from `libs/klara-theme/CLAUDE.md`.

### 4. Export Component
- Add exports to the component's `index.ts`
- Update `libs/klara-theme/src/index.ts` if needed

### 5. Verify
- Run `nx lint klara-theme`
- Run `nx test klara-theme`
- Run `npm run storybook-theme-build` to verify stories compile
- Fix any issues before completion

## Success Criteria
- Component matches plan artifacts
- All variants implemented per variants-mapping
- Design tokens used (no hardcoded values)
- Stories cover Default/Sizes/Variants/States
- Lint and tests pass
- Storybook builds successfully

## Next Step
Run audit-ui workflow to compare implementation against plan and design.
