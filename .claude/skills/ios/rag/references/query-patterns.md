# iOS RAG Query Patterns

## Purpose

Reference guide for iOS-specific query patterns using the RAG system. Covers Swift code, SwiftUI/UIKit components, theme tokens, and cross-project pattern discovery.

## SwiftUI View Queries

### Find View by Functionality

**Goal**: Discover SwiftUI views matching specific behavior

```typescript
// Custom button with haptic
query: "custom button with haptic feedback and animation"
filters: { topic: "ui", file_type: "swift" }

// Modal sheet
query: "modal sheet with dismiss gesture"
filters: { topic: "ui" }

// List with pull-to-refresh
query: "list with pull to refresh and async loading"
filters: { topic: "ui" }
```

**Expected Results**: SwiftUI view implementations

### Find View Modifiers

**Goal**: Locate custom or applied view modifiers

```typescript
// Custom modifier
query: "custom view modifier for rounded corners and shadow"
filters: { topic: "ui", file_type: "swift" }

// Accessibility modifier
query: "accessibility label hint trait modifiers"
filters: { topic: "ui" }

// Animation modifier
query: "animation transition timing curve"
filters: { topic: "ui" }
```

**Expected Results**: ViewModifier implementations or usage

### Find View Composition

**Goal**: See how views are composed together

```typescript
// Card composition
query: "card view with image title description button"
filters: { topic: "ui" }

// Form composition
query: "form with multiple input fields validation"
filters: { topic: "ui" }

// Navigation structure
query: "navigation stack with detail view and toolbar"
filters: { topic: "ui" }
```

**Expected Results**: Composed view examples

## UIKit Component Queries

### Table View Patterns

**Goal**: Find UIKit table view implementations

```typescript
// Custom cell
query: "table view cell with async image loading"
filters: { topic: "ui", file_type: "swift" }

// Section headers
query: "table view section header custom design"
filters: { topic: "ui" }

// Swipe actions
query: "table view swipe actions delete edit"
filters: { topic: "ui" }
```

**Expected Results**: UITableView delegate/dataSource patterns

### Collection View Patterns

**Goal**: Find UICollectionView layouts

```typescript
// Grid layout
query: "collection view grid layout with spacing"
filters: { topic: "ui", file_type: "swift" }

// Compositional layout
query: "compositional layout horizontal scrolling sections"
filters: { topic: "ui" }

// Custom cell
query: "collection view cell with image and label"
filters: { topic: "ui" }
```

**Expected Results**: UICollectionView layout implementations

### Custom Controls

**Goal**: Find custom UIKit controls

```typescript
// Custom button
query: "custom UIButton subclass with loading indicator"
filters: { topic: "ui", file_type: "swift" }

// Custom text field
query: "text field with floating label and validation"
filters: { topic: "ui" }

// Slider control
query: "custom slider with min max labels"
filters: { topic: "ui" }
```

**Expected Results**: UIControl subclass implementations

## Theme Token Queries

### Color Tokens

**Goal**: Find color token definitions

```typescript
// Primary colors
query: "primary brand color token semantic"
filters: { project: "luz_theme_ui", topic: "theme" }

// Text colors
query: "text color tokens foreground label"
filters: { project: "luz_theme_ui", topic: "theme" }

// Status colors
query: "error success warning color tokens"
filters: { project: "luz_theme_ui", topic: "theme" }

// Dark mode
query: "dark mode color palette adaptive colors"
filters: { project: "luz_theme_ui", topic: "theme" }
```

**Expected Results**: Color token definitions (Color extension, asset catalog)

### Typography Tokens

**Goal**: Find font and text style definitions

```typescript
// Font definitions
query: "font family size weight definitions"
filters: { project: "luz_theme_ui", topic: "theme" }

// Text styles
query: "heading body caption text styles"
filters: { project: "luz_theme_ui", topic: "theme" }

// Dynamic type
query: "dynamic type scaling text style"
filters: { project: "luz_theme_ui", topic: "theme" }
```

**Expected Results**: Font and text style definitions

### Spacing Tokens

**Goal**: Find spacing scale definitions

```typescript
// Spacing scale
query: "spacing scale padding margin layout"
filters: { project: "luz_theme_ui", topic: "theme" }

// Component spacing
query: "button padding input spacing tokens"
filters: { topic: "theme" }
```

**Expected Results**: Spacing constant definitions

### Shadow and Effects

**Goal**: Find shadow and visual effect definitions

```typescript
// Shadow styles
query: "shadow elevation depth definitions"
filters: { project: "luz_theme_ui", topic: "theme" }

// Border radius
query: "corner radius rounded definitions"
filters: { project: "luz_theme_ui", topic: "theme" }
```

**Expected Results**: Visual effect token definitions

## State Management Queries

### SwiftUI State

**Goal**: Find state management patterns

```typescript
// @State property
query: "@State property wrapper local view state"
filters: { topic: "state-management" }

// @Binding usage
query: "@Binding property wrapper parent child communication"
filters: { topic: "state-management" }

// ObservableObject
query: "ObservableObject @Published property ViewModel"
filters: { topic: "state-management" }

// @StateObject vs @ObservedObject
query: "StateObject ObservedObject lifecycle ownership"
filters: { topic: "state-management" }
```

**Expected Results**: State management implementation examples

### Combine Framework

**Goal**: Find Combine reactive patterns

```typescript
// Publisher pattern
query: "Combine publisher sink subscription"
filters: { topic: "state-management" }

// Subject usage
query: "PassthroughSubject CurrentValueSubject pattern"
filters: { topic: "state-management" }
```

**Expected Results**: Combine code examples

## Networking Queries

### Async/Await Patterns

**Goal**: Find modern async networking code

```typescript
// Async fetch
query: "async await URLSession data task error handling"
filters: { topic: "networking" }

// Async sequence
query: "async sequence stream API response"
filters: { topic: "networking" }

// Task cancellation
query: "async task cancellation timeout"
filters: { topic: "networking" }
```

**Expected Results**: Async/await networking implementations

### API Client Patterns

**Goal**: Find API layer implementations

```typescript
// REST client
query: "REST API client protocol URLSession"
filters: { topic: "networking" }

// Request builder
query: "API request builder query parameters headers"
filters: { topic: "networking" }

// Response parsing
query: "JSON decoding Codable API response"
filters: { topic: "networking" }
```

**Expected Results**: API client architecture

## Protocol and Extension Queries

### Protocol Definitions

**Goal**: Find protocol declarations and conformance

```typescript
// Protocol definition
query: "networking protocol with async methods"
filters: { file_type: "swift" }

// Protocol extension
query: "protocol extension default implementation"
filters: { file_type: "swift" }

// Delegate pattern
query: "delegate protocol callback pattern"
filters: { file_type: "swift" }
```

**Expected Results**: Protocol code examples

### Swift Extensions

**Goal**: Find extension implementations

```typescript
// String extension
query: "String extension validation email format"
filters: { file_type: "swift" }

// Color extension
query: "Color extension hex initializer"
filters: { file_type: "swift" }

// View extension
query: "View extension helper modifier methods"
filters: { file_type: "swift" }
```

**Expected Results**: Extension definitions

## Cross-Project Queries

### Theme Token Usage

**Goal**: See how theme tokens are used across projects

```typescript
// Find token definition
const tokenDef = await query({
  query: "primary brand color token",
  filters: { project: "luz_theme_ui" }
});

// Find usage across all projects
const tokenUsage = await query({
  query: "using primary color token in views",
  enforce_scope: false,
  top_k: 10
});
```

**Expected Results**: Definition + usage examples

### Shared Patterns

**Goal**: Find pattern consistency across projects

```typescript
// Error handling pattern
query: "error handling alert presentation pattern"
enforce_scope: false

// Loading state pattern
query: "loading indicator during async operation"
enforce_scope: false

// Navigation pattern
query: "navigation coordinator router pattern"
enforce_scope: false
```

**Expected Results**: Pattern usage across luz_epost_ios, luz_ios_designui, luz_theme_ui

### Design System Component Usage

**Goal**: See how design system components are consumed

```typescript
// Find design system component
const component = await query({
  query: "custom button component",
  filters: { project: "luz_ios_designui" }
});

// Find app usage
const usage = await query({
  query: "custom button usage in app screens",
  filters: { project: "luz_epost_ios" }
});
```

**Expected Results**: Component definition + app integration

## Advanced Patterns

### Combine Project + Topic

**Goal**: Precise filtering for specific needs

```typescript
// Theme colors in design system
query: "button colors states"
filters: {
  project: "luz_ios_designui",
  topic: "theme",
  file_type: "swift"
}

// Networking in main app
query: "API client authentication"
filters: {
  project: "luz_epost_ios",
  topic: "networking"
}
```

**Expected Results**: Highly targeted results

### Performance Patterns

**Goal**: Find optimization techniques

```typescript
// Lazy loading
query: "lazy loading images async await"
filters: { topic: "ui" }

// List optimization
query: "List ForEach performance optimization"
filters: { topic: "ui" }

// Memory management
query: "weak self closure memory leak prevention"
filters: { file_type: "swift" }
```

**Expected Results**: Performance optimization code

### Accessibility Patterns

**Goal**: Find accessibility implementations

```typescript
// VoiceOver support
query: "accessibility label value traits VoiceOver"
filters: { topic: "ui" }

// Dynamic type
query: "dynamic type font scaling accessibility"
filters: { topic: "ui" }

// Color contrast
query: "high contrast colors accessibility"
filters: { project: "luz_theme_ui", topic: "theme" }
```

**Expected Results**: Accessible implementation examples

## Query Tips

### Use Swift Terminology

**Good**:
- "view modifier"
- "property wrapper"
- "protocol extension"
- "async await"

**Less Effective**:
- "component decorator"
- "annotation"
- "interface default"
- "promise"

### Project-Specific Queries

**Theme Tokens**: Always filter by luz_theme_ui
```typescript
filters: { project: "luz_theme_ui" }
```

**App Features**: Filter by luz_epost_ios
```typescript
filters: { project: "luz_epost_ios" }
```

**Design System**: Filter by luz_ios_designui
```typescript
filters: { project: "luz_ios_designui" }
```

### Iterate with enforce_scope

**Step 1**: Find in single project (faster)
```typescript
enforce_scope: true  // default
filters: { project: "luz_theme_ui" }
```

**Step 2**: Find usage across all projects
```typescript
enforce_scope: false
```

## Common Use Cases

### Before Implementing a View

```typescript
// 1. Find existing similar view
query: "user profile view with avatar and details"
filters: { topic: "ui" }

// 2. Find theme tokens
query: "profile view colors spacing tokens"
filters: { project: "luz_theme_ui" }

// 3. Find state pattern
query: "user data loading state management"
filters: { topic: "state-management" }
```

### Maintaining Design System Consistency

```typescript
// Find design system component
query: "button component from design system"
filters: { project: "luz_ios_designui" }

// Check app usage
query: "button usage in app"
filters: { project: "luz_epost_ios" }

// Ensure consistency
```

### Debugging Styling Issues

```typescript
// Find theme definition
query: "button background color token"
filters: { project: "luz_theme_ui" }

// Find component usage
query: "button styling implementation"
filters: { project: "luz_ios_designui" }

// Compare expected vs actual
```

### Learning Codebase

```typescript
// Explore main app structure
query: "app navigation structure"
filters: { project: "luz_epost_ios" }

// Learn design system
query: "design system components overview"
filters: { project: "luz_ios_designui" }

// Understand theme
query: "theme tokens color typography spacing"
filters: { project: "luz_theme_ui" }
```

## Troubleshooting

### No Results in Single Project

**Try**:
```typescript
// Expand to all projects
enforce_scope: false
```

### Mixed Results from Multiple Projects

**Try**:
```typescript
// Focus on single project
filters: { project: "luz_epost_ios" }
enforce_scope: true
```

### Irrelevant Results

**Try**:
1. Use Swift-specific terms
2. Add topic filter
3. Add file_type: "swift"
4. Make query more specific

## Related Documents

- `SKILL.md` — Main iOS RAG skill documentation
- Server API: `http://localhost:2637/docs`
- Indexed projects:
  - `luz_epost_ios` — Main iOS app
  - `luz_ios_designui` — Design system library
  - `luz_theme_ui` — Theme token library
