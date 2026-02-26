# Style Migration Guide

## From CSS Modules

```css
/* Before: component.module.css */
.container { padding: 16px; background: #f5f5f5; }
.title { color: #333; font-size: 18px; }
```

```tsx
// After: component.tsx with token classes
<div className="p-200 bg-base-muted">
  <h2 className="text-base-foreground text-lg">Title</h2>
</div>
```

## From Inline Styles

```tsx
// Before
<div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '8px' }}>

// After
<div className="p-200 bg-base-background rounded-200">
```

## From Styled Components

```tsx
// Before
const Container = styled.div`
  padding: 16px;
  background: ${props => props.theme.colors.bg};
  border: 1px solid #e2e8f0;
`;

// After: Use token classes directly
<div className="p-200 bg-base-background border border-base-border">
```

## From Arbitrary Tailwind

```tsx
// Before (arbitrary values)
<div className="bg-[#f8f9fa] p-[18px] text-[#495057] rounded-[6px]">

// After (semantic tokens)
<div className="bg-base-muted p-200 text-base-foreground rounded-200">
```

## klara-theme Style Pattern

For complex component-specific styles, use `-styles.ts` files:

```typescript
// button-group-styles.ts
import { clsx } from 'clsx';

export const buttonGroupStyles = {
  root: clsx('flex gap-100 items-center'),
  primary: clsx('bg-base-primary text-base-primary-foreground'),
  secondary: clsx('bg-base-muted text-base-foreground'),
};
```

```tsx
// ButtonGroup.tsx
import { buttonGroupStyles } from './button-group-styles';

export function ButtonGroup({ variant = 'primary' }) {
  return (
    <div className={buttonGroupStyles.root}>
      <Button className={buttonGroupStyles[variant]}>Action</Button>
    </div>
  );
}
```

## Migration Order

1. Replace hardcoded colors with semantic tokens
2. Replace spacing with numeric scale
3. Replace border-radius with token scale
4. Move complex styles to `-styles.ts` files
5. Remove style imports (CSS modules, styled-components)
6. Verify visual output matches original
