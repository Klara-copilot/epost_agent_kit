---
name: checklist-web
description: Web (React/Next.js + klara-theme) audit checklist for UI component code review
last-verified: 2026-03-04
---

# Audit Checklist — Web (React / klara-theme)

> Staleness warning: Verify token APIs against klara-theme source or web-rag before citing specific values.

## Tokens

### WEB-TOKEN-001: No hardcoded colors
- **Severity**: critical
- **Bad**: `style={{ color: '#1A73E8' }}` or `className="text-[#1A73E8]"`
- **Good**: Use CSS vars: `var(--epost-color-primary)` or klara-theme token class
- **Why**: Hardcoded colors break dark mode, brand overrides, and accessibility contrast tokens. Use the 3-layer token system (primitives → themes → components).

### WEB-TOKEN-002: No hardcoded spacing/sizing
- **Severity**: high
- **Bad**: `h-[123px]`, `p-[13px]`, `margin: '13px'`
- **Good**: Tailwind spacing scale (`p-4`, `h-12`) or theme spacing tokens
- **Why**: Arbitrary values create visual inconsistency and can't be scaled across breakpoints.

### WEB-TOKEN-003: No hardcoded typography
- **Severity**: high
- **Bad**: `fontSize: '14px'`, `fontWeight: 600` inline
- **Good**: Tailwind typography classes or klara-theme typography tokens
- **Why**: Typography scales must be controlled by the design system for consistency.

### WEB-TOKEN-004: Use cn() for className composition
- **Severity**: medium
- **Bad**: `` className={`base-class ${variant === 'primary' ? 'text-blue' : 'text-gray'}`} ``
- **Good**: `className={cn('base-class', variant === 'primary' && 'text-primary', className)}`
- **Why**: `cn()` (clsx + tailwind-merge) handles class conflicts and ensures composability.

---

## Patterns

### WEB-PAT-001: Use forwardRef + displayName
- **Severity**: high
- **Bad**: `export const Button = (props) => ...`
- **Good**: `export const Button = forwardRef<HTMLButtonElement, ButtonProps>((...) => ...); Button.displayName = 'Button'`
- **Why**: forwardRef enables ref access from consumers (required for focus management). displayName appears in React DevTools.

### WEB-PAT-002: Props interface exported, no default exports
- **Severity**: medium
- **Bad**: `export default Button` / props interface not exported
- **Good**: `export type ButtonProps = {...}; export const Button = ...`
- **Why**: Named exports enable tree-shaking. Exported prop types let consumers extend the component.

### WEB-PAT-003: className prop passed through
- **Severity**: medium
- **Bad**: Component ignores `className` prop
- **Good**: `className={cn(baseStyles, className)}` — consumer can extend styles
- **Why**: Composition over configuration. Consumers need to add context-specific margins.

### WEB-PAT-004: No klara-theme source file modifications
- **Severity**: critical
- **Check**: No edits to files inside `libs/klara-theme/` source — use composition/props only
- **Why**: The shared library must remain untouched. Direct modifications break all consumers on the next release.

### WEB-PAT-005: No reinventing existing components
- **Severity**: high
- **Check**: Verify the component doesn't duplicate logic already in the Common library (Button, Input, Card, etc.)
- **Good**: Import and extend existing component; use `asChild` or render props for variants
- **Why**: Duplication creates maintenance burden and diverging behavior over time.

---

## Performance

### WEB-PERF-001: No inline object/function creation in render
- **Severity**: medium
- **Bad**: `<Component style={{ padding: 16 }} onClick={() => handler(id)} />`
- **Good**: Define outside render or use `useMemo`/`useCallback`
- **Why**: New references on every render cause unnecessary child re-renders.

### WEB-PERF-002: Memoization only where measured
- **Severity**: low
- **Note**: Premature `useMemo`/`useCallback` adds complexity without benefit. Only use when profiling shows a problem.

### WEB-PERF-003: No unnecessary state
- **Severity**: medium
- **Bad**: State that can be derived from props
- **Good**: Compute derived values inline or with `useMemo`
- **Why**: Extra state means extra re-renders and sync bugs.

---

## Security

### WEB-SEC-001: No dangerouslySetInnerHTML without sanitization
- **Severity**: critical
- **Bad**: `dangerouslySetInnerHTML={{ __html: userContent }}`
- **Good**: Sanitize with DOMPurify first, or render as text
- **Why**: Direct HTML injection is an XSS vector.

### WEB-SEC-002: No hardcoded secrets or URLs
- **Severity**: critical
- **Bad**: API keys, tokens, or environment-specific URLs in component source
- **Good**: Use environment variables; inject via props or config

### WEB-SEC-003: Safe string interpolation
- **Severity**: high
- **Bad**: Dynamic `href` built from user input without validation
- **Good**: Validate URL schema (`https://` only), use `rel="noopener noreferrer"` on external links

---

## Accessibility

### WEB-A11Y-001: Interactive elements have accessible labels
- **Severity**: high
- **Bad**: `<button><svg /></button>` — icon-only button with no label
- **Good**: `<button aria-label="Close dialog"><CloseIcon /></button>`

### WEB-A11Y-002: Keyboard navigation works
- **Severity**: high
- **Check**: All interactive elements reachable via Tab; Enter/Space activate buttons; Escape closes modals
- **Bad**: Custom div click handler with no keyboard equivalent

### WEB-A11Y-003: Focus management in overlays
- **Severity**: high
- **Check**: Dialogs/drawers trap focus; focus returns to trigger on close

### WEB-A11Y-004: Color contrast via tokens
- **Severity**: medium
- **Note**: If using system tokens, contrast is already handled. Flag only if hardcoded colors are used (caught by WEB-TOKEN-001).

---

## Testing

### WEB-TEST-001: Tests exist
- **Severity**: high
- **Check**: `.test.tsx` or `.spec.tsx` file alongside component

### WEB-TEST-002: Tests cover all variants and states
- **Severity**: medium
- **Check**: Tests for each variant prop, loading state, disabled state, error state

### WEB-TEST-003: Tests check behavior, not internals
- **Severity**: medium
- **Bad**: `expect(component.state.isOpen).toBe(true)`
- **Good**: `expect(screen.getByRole('dialog')).toBeVisible()`
- **Why**: Implementation tests break on refactors; behavior tests stay valid.

### WEB-TEST-004: Stories for visual verification
- **Severity**: low
- **Check**: Storybook story covers all variants (if Storybook is in use)
