## Android Platform

**Stack**: Kotlin · Jetpack Compose · MVVM · Hilt DI · Room · Retrofit · Gradle (Kotlin DSL)

### Agent Routing

| Task | Agent |
|------|-------|
| Add screen / implement feature / wire API | `@epost-fullstack-developer` |
| Fix crash / debug error / broken behavior | `@epost-debugger` |
| Plan new flow / design approach | `@epost-planner` |
| Review Kotlin changes before commit | `@epost-code-reviewer` |
| Add tests / validate coverage | `@epost-tester` |
| Accessibility / TalkBack / WCAG | `@epost-a11y-specialist` |
| Design system / Compose component | `@epost-muji` |

### Conventions

- Compose-first UI — no XML layouts for new screens
- MVVM: ViewModel + StateFlow, no LiveData in new code
- Hilt for all DI — no manual injection
- Room for local persistence, Retrofit for network
- Use `@TestInstallIn` for Hilt test modules

### Starter Prompts

- `@epost-fullstack-developer Implement [feature] for the Android platform.`
- `@epost-debugger Fix this Kotlin/Compose crash: [paste error]`
- `@epost-code-reviewer Review the staged .kt changes.`
- `@epost-tester Add Compose UI tests for [screen].`
- `@epost-a11y-specialist Audit TalkBack support in [screen].`
