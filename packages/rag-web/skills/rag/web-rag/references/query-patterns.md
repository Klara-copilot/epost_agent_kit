# Web RAG Query Patterns

## Purpose

Reference guide for common query patterns when using the web RAG system. Includes examples for component discovery, design tokens, implementation patterns, and cross-cutting concerns.

## Component Queries

### Find Component by Functionality

**Goal**: Discover components that match a specific use case

```typescript
// Find input component with validation
query: "input field with validation and error message"
filters: { topic: "ui" }

// Find modal/dialog component
query: "modal dialog with overlay and close button"
filters: { topic: "ui", component: "Dialog" }

// Find data table with sorting
query: "table with column sorting and pagination"
filters: { topic: "ui" }
```

**Expected Results**: Component implementations with matching behavior

### Find Component Variants

**Goal**: See all available variants for a known component

```typescript
// Button variants
query: "Button variants sizes colors"
filters: { component: "Button", file_type: "tsx" }

// Input states
query: "Input component states disabled error focus"
filters: { component: "Input", file_type: "tsx" }

// Card layouts
query: "Card component layout variants horizontal vertical"
filters: { component: "Card" }
```

**Expected Results**: Component API showing variant props

### Find Component Styles

**Goal**: Locate styling implementation for a component

```typescript
// Dialog styles
query: "Dialog modal overlay styles"
filters: { component: "Dialog", file_type: "scss" }

// Button hover states
query: "Button hover active focus styles"
filters: { component: "Button", file_type: "scss" }

// Theme-aware components
query: "component dark mode theme styles"
filters: { file_type: "scss", topic: "design-system" }
```

**Expected Results**: SCSS files with component styles

## Design Token Queries

### Color Tokens

**Goal**: Find color token definitions

```typescript
// Primary brand colors
query: "primary brand color token semantic"
filters: { topic: "design-system", file_type: "scss" }

// Text colors
query: "text color tokens foreground paragraph heading"
filters: { topic: "design-system" }

// Status colors
query: "error success warning info color tokens"
filters: { topic: "design-system", file_type: "scss" }

// Dark mode
query: "dark mode color palette tokens"
filters: { topic: "design-system" }
```

**Expected Results**: Token definitions with semantic naming

### Spacing Tokens

**Goal**: Find spacing scale definitions

```typescript
// Spacing scale
query: "spacing scale gap padding margin"
filters: { topic: "design-system" }

// Layout spacing
query: "container max-width layout spacing"
filters: { topic: "design-system", file_type: "scss" }

// Component spacing
query: "button padding input margin spacing tokens"
filters: { component: "Button", topic: "design-system" }
```

**Expected Results**: Spacing token definitions (xs, sm, md, lg, xl)

### Typography Tokens

**Goal**: Find typography definitions

```typescript
// Font sizes
query: "font size heading body text"
filters: { topic: "design-system" }

// Font weights
query: "font weight bold regular light"
filters: { topic: "design-system", file_type: "scss" }

// Line heights
query: "line height leading typography"
filters: { topic: "design-system" }
```

**Expected Results**: Typography scale and font definitions

### Border Radius Tokens

**Goal**: Find border radius scale

```typescript
query: "border radius rounded corners"
filters: { topic: "design-system", file_type: "scss" }
```

**Expected Results**: Border radius token definitions

## Implementation Pattern Queries

### State Management

**Goal**: Find state management patterns

```typescript
// Redux slice pattern
query: "Redux Toolkit slice pattern for feature"
filters: { topic: "state-management" }

// Context pattern
query: "React Context provider pattern with TypeScript"
filters: { topic: "state-management" }

// Async state
query: "async data loading state management with Redux"
filters: { topic: "state-management" }
```

**Expected Results**: Implementation examples with best practices

### Theme Integration

**Goal**: Find theme usage patterns

```typescript
// ThemeProvider setup
query: "ThemeProvider setup with custom theme"
filters: { topic: "design-system" }

// Using theme tokens
query: "access theme tokens in component"
filters: { topic: "design-system", file_type: "tsx" }

// Dark mode toggle
query: "theme switcher dark mode toggle implementation"
filters: { topic: "design-system", topic: "ui" }
```

**Expected Results**: Theme integration code examples

### API Integration

**Goal**: Find API calling patterns

```typescript
// REST API call
query: "REST API call with error handling and loading state"
filters: { topic: "backend" }

// Server actions
query: "Next.js server action with validation"
filters: { topic: "backend" }

// Error handling
query: "API error handling toast notification pattern"
filters: { topic: "backend" }
```

**Expected Results**: API integration examples

### Form Patterns

**Goal**: Find form implementation patterns

```typescript
// React Hook Form
query: "form validation with React Hook Form"
filters: { topic: "ui" }

// Complex forms
query: "multi-step form with validation and state"
filters: { topic: "ui" }

// Form components
query: "reusable form input components with error display"
filters: { topic: "ui" }
```

**Expected Results**: Form implementation examples

## Advanced Filter Combinations

### Component + Implementation

**Goal**: Find specific implementation details

```typescript
// Accessible dialog
query: "accessible dialog with focus trap and ARIA"
filters: { component: "Dialog", file_type: "tsx" }

// Responsive button
query: "Button responsive sizing mobile desktop"
filters: { component: "Button" }

// Animated dropdown
query: "Dropdown animation transition timing"
filters: { component: "Dropdown" }
```

**Expected Results**: Implementation with specific features

### Cross-Component Patterns

**Goal**: Find patterns that span multiple components

```typescript
// Form composition
query: "composition pattern between form and input components"
filters: { topic: "ui" }

// Layout patterns
query: "flex grid layout patterns container wrapper"
filters: { topic: "ui" }

// Navigation patterns
query: "navigation menu sidebar header pattern"
filters: { topic: "ui" }
```

**Expected Results**: Multi-component integration patterns

### Performance Patterns

**Goal**: Find optimization patterns

```typescript
// Lazy loading
query: "lazy loading components code splitting"
filters: { topic: "ui" }

// Memoization
query: "React memo useMemo optimization pattern"
filters: { topic: "ui" }

// Virtualization
query: "virtual list large dataset rendering"
filters: { topic: "ui" }
```

**Expected Results**: Performance optimization examples

## Query Tips

### Natural Language Works Best

**Good**:
- "button with loading spinner"
- "form validation error messages"
- "dark mode color tokens"

**Less Effective**:
- "btn loading"
- "validate form err"
- "dark clr"

### Use Filters to Narrow Results

**Broad Query + Filters**:
```typescript
query: "color tokens"  // broad
filters: { topic: "design-system", file_type: "scss" }  // specific
```

**Better than**:
```typescript
query: "scss design system color tokens semantic naming"  // too specific
filters: {}
```

### Iterate from General to Specific

**Step 1**: Start general
```typescript
query: "button component"
```

**Step 2**: Add file type
```typescript
query: "button component"
filters: { file_type: "tsx" }
```

**Step 3**: Add component filter
```typescript
query: "button variants sizes"
filters: { component: "Button", file_type: "tsx" }
```

### Check Relevance Scores

| Score | Interpretation |
|-------|----------------|
| 0.7-1.0 | Excellent match |
| 0.5-0.7 | Good match |
| 0.3-0.5 | Partial match |
| < 0.3 | Poor match, rephrase query |

## Common Use Cases

### Before Implementing a Feature

```typescript
// 1. Find existing similar components
query: "user profile card avatar name email"
filters: { topic: "ui" }

// 2. Find design tokens
query: "card border shadow spacing tokens"
filters: { topic: "design-system" }

// 3. Find state patterns
query: "user data loading state management"
filters: { topic: "state-management" }
```

### Maintaining Consistency

```typescript
// Find existing pattern
query: "error notification toast pattern"
filters: { topic: "ui" }

// Follow same approach in new code
```

### Debugging Styling Issues

```typescript
// Find token definitions
query: "button disabled state color opacity"
filters: { component: "Button", file_type: "scss" }

// Compare with implementation
```

### Onboarding

```typescript
// Learn component library
query: "button component overview"
filters: { component: "Button" }

// Learn design system
query: "design tokens color spacing typography"
filters: { topic: "design-system" }

// Learn patterns
query: "common patterns best practices"
filters: { topic: "ui" }
```

## Query Expansion

The RAG system automatically expands queries with:

- **Synonyms**: "btn" → "button"
- **Component variants**: "Dialog" → ["Dialog", "Modal", "Popup"]
- **Related terms**: "color" → ["color", "palette", "theme"]

You don't need to include all variants in your query.

## Troubleshooting

### No Results

**Try**:
1. Remove filters one at a time
2. Simplify query to single concept
3. Check spelling
4. Use synonyms

### Too Many Results

**Try**:
1. Add component filter
2. Add file_type filter
3. Make query more specific
4. Reduce top_k parameter

### Irrelevant Results

**Try**:
1. Rephrase query with different words
2. Add topic filter
3. Include must-have terms
4. Check if content exists in codebase

## Related Documents

- `SKILL.md` — Main web RAG skill documentation
- Server API: `http://localhost:2636/docs`
- Indexed codebase: `luz_next` repository
