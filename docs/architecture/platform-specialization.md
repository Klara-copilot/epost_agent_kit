# Platform Specialization

## Web Platform (`web/`)

**Technologies**: Next.js, React, TypeScript, Tailwind CSS, shadcn/ui

**Agents**:
- **web/implementer** - Implements features in React/Next.js
  - Component creation (functional, hooks-based)
  - State management (Zustand, Context API)
  - Routing (Next.js App Router)
  - API integration

- **web/tester** - Web testing and QA
  - Unit tests (Vitest)
  - Component tests (Testing Library)
  - E2E tests (Playwright)
  - Performance testing

- **web/designer** - Design system integration
  - shadcn/ui component selection
  - Figma variable implementation
  - Tailwind styling
  - Accessibility (WCAG 2.1 AA)

**Skills**:
- `web/nextjs` - Next.js patterns and best practices
- `web/frontend-development` - React, TypeScript, hooks
- `web/shadcn-ui` - Component library integration
- `web/backend-development` - API routes, middleware

**Command Example**:
```typescript
// /web:cook executes in web/implementer context
const component = await webImplementer.implement({
  task: "Build login form",
  framework: "React",
  pattern: "functional component with hooks"
});
```

## iOS Platform (`ios/`)

**Technologies**: Swift 6, SwiftUI, UIKit, XCTest

**Agents**:
- **ios/implementer** - Swift implementation
  - SwiftUI views and modifiers
  - ViewModels and state management
  - Core Data integration
  - Networking

- **ios/tester** - iOS testing
  - XCTest unit tests
  - XCUITest UI tests
  - Performance profiling

- **ios/simulator** - Simulator management
  - Launch and configure simulators
  - Run apps in simulators
  - Capture crashes and logs
  - Screenshot and video recording

**Skills**:
- `ios/ios-development` - Swift, SwiftUI, best practices
- Shared database skills (Core Data)
- Shared debugging skills

## Android Platform (`android/`)

**Technologies**: Kotlin, Jetpack Compose, Espresso

**Agents**:
- **android/implementer** - Kotlin implementation
  - Compose UI implementation
  - State management (ViewModel, Flow)
  - Data persistence (Room)
  - Networking

- **android/tester** - Android testing
  - JUnit unit tests
  - Espresso UI tests
  - Performance profiling

**Skills**:
- `android/android-development` - Kotlin, Compose, best practices
- Shared database skills (Room, SQL)
- Shared debugging skills

## Shared Skills (All Platforms)

| Skill | Platforms | Purpose |
|-------|-----------|---------|
| `planning` | All | Project planning and roadmapping |
| `research` | All | Multi-source research and validation |
| `debugging` | All | General debugging and troubleshooting |
| `databases` | web, ios, android | Database design and queries (SQL, NoSQL) |
| `docker` | web, ios (ci), android (ci) | Containerization and orchestration |
| `git` | All | Git operations (built into git-manager) |
| `skill-creator` | All | Create new skills (from anthropics) |
| `find-skills` | All | Discover existing skills (from vercel-labs) |

---

**Last Updated**: 2026-02-06
