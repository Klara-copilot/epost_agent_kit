---
name: ios-ui-lib
description: (ePost) Provides iOS theme SwiftUI component APIs, design tokens, and platform token mappings. Use when looking up iOS theme SwiftUI component APIs, iOS design tokens, or platform-specific color/typography token mappings
user-invocable: false
paths: ["**/*.swift"]

metadata:
  keywords:
    - ios-ui
    - swiftui-components
    - design-tokens
    - theme
  agent-affinity:
    - epost-muji
    - epost-fullstack-developer
  platforms:
    - ios
  triggers:
    - ios component
    - swiftui token
    - theme mapping ios
    - ios design token
  connections:
    enhances: [ios-development]
---

# iOS Theme Knowledge

## Aspects

| Aspect | File | Purpose |
|--------|------|---------|
| Components | references/components.md | SwiftUI component reference |
| Design System | references/design-system.md | iOS-specific token system |
