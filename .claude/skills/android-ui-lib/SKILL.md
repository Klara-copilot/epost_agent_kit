---
name: android-ui-lib
description: (ePost) Provides Android theme Compose component APIs, design tokens, and Material theme mappings. Use when looking up Android theme Compose component APIs, Android design tokens, or Material theme color/typography mappings
user-invocable: false
paths: ["**/*.kt", "**/*.kts"]

metadata:
  keywords:
    - android-ui
    - compose-components
    - design-tokens
    - theme
  agent-affinity:
    - epost-muji
    - epost-fullstack-developer
  platforms:
    - android
  triggers:
    - android component
    - compose token
    - material mapping
    - android design token
  connections:
    enhances: [android-development]
---

# Android Theme Knowledge

## Aspects

| Aspect | File | Purpose |
|--------|------|---------|
| Components | references/components.md | Compose component reference |
| Design System | references/design-system.md | Android-specific token system |
