---
name: knowledge/klara-theme/components
description: "klara-theme component catalog and API reference"
---

# klara-theme Components

## Architecture

klara-theme is a React component library built on:
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **CSS Variables** for theming tokens
- **Storybook** for documentation and visual testing

## Component Categories

### Layout
- `Container` — Max-width content wrapper with responsive padding
- `Grid` / `Stack` — Flexbox-based layout primitives
- `Spacer` — Controlled spacing between elements

### Navigation
- `Navbar` — App header with navigation links
- `Sidebar` — Collapsible side navigation
- `Tabs` — Tab-based content switching
- `Breadcrumb` — Hierarchical navigation trail

### Forms
- `Input` — Text input with validation states
- `Select` — Dropdown selector
- `Checkbox` / `Radio` — Toggle inputs
- `DatePicker` — Date selection
- `FormField` — Label + input + error wrapper

### Data Display
- `Table` — Sortable, filterable data table
- `Card` — Content container with header/body/footer
- `Badge` — Status indicators
- `Avatar` — User profile images
- `Tag` — Categorization labels

### Feedback
- `Alert` — Contextual messages (info, success, warning, error)
- `Toast` — Temporary notification popups
- `Modal` — Dialog overlays
- `Tooltip` — Hover information

### Actions
- `Button` — Primary action trigger with variants
- `IconButton` — Icon-only button
- `DropdownMenu` — Action menu

## Usage Pattern

```tsx
import { Button, Card, Input } from '@epost/klara-theme';

function MyComponent() {
  return (
    <Card>
      <Card.Header>Title</Card.Header>
      <Card.Body>
        <Input label="Name" placeholder="Enter name" />
        <Button variant="primary">Submit</Button>
      </Card.Body>
    </Card>
  );
}
```

## Notes

- All components support `className` prop for custom styling
- Components follow WAI-ARIA patterns for accessibility
- Use the `variant` prop for visual variations (primary, secondary, outline, ghost)
- Theme tokens are available via CSS custom properties
