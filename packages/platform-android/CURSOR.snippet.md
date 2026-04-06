## Android Platform

**Stack**: Kotlin · Jetpack Compose · MVVM · Hilt DI · Room · Retrofit · Gradle (Kotlin DSL)

This rule auto-applies when editing `.kt`, `.kts`, `.gradle.kts` files.

### Agent Routing

| Intent | Chat command |
|--------|-------------|
| Build / implement / add screen | `@epost-fullstack-developer [task]` |
| Fix / debug / crash | `@epost-debugger [error]` |
| Plan new flow / design approach | `@epost-planner [topic]` |
| Review staged .kt changes | `@epost-code-reviewer Review staged .kt changes` |
| Accessibility / TalkBack | `@epost-a11y-specialist [issue]` |
| Compose component / design system | `@epost-muji [component]` |

### Conventions

- Compose-first UI — no XML layouts for new screens
- MVVM: ViewModel + StateFlow, no LiveData in new code
- Hilt for all DI — no manual injection
- Room for local persistence, Retrofit for network
- `@TestInstallIn` for Hilt test modules

### Context Rules

- `.cursor/rules/platform-android.mdc` auto-applies for `.kt`/`.kts` files
- `.cursor/rules/platform-android.mdc` contains Android-specific patterns and conventions
- Cursor's Task tool may not work — delegate via chat, not programmatic dispatch
