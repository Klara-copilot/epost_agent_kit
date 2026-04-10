---
name: web-auth-code-review-rules
description: "ePost NextAuth + Keycloak code review rules — AUTH category"
user-invocable: false
disable-model-invocation: true
---

# Web Auth Code Review Rules

**Scope**: NextAuth session access, Keycloak JWT, provider nesting, feature flags, route protection in ePost web apps.

---

## AUTH: Authentication & Session

**Scope**: Session access, token handling, feature flags, route protection in ePost Next.js app.

| Rule ID | Rule | Severity | Pass | Fail |
|---------|------|----------|------|------|
| AUTH-001 | Use extended session type — never raw `DefaultSession` | high | `import type { Session } from '@/types/auth'` (extended type) | `session: DefaultSession` or relying on unextended NextAuth types |
| AUTH-002 | Correct session API per context: `getServerSession` (Server Component), `useSession` (Client Component), `getAuthSession` (Server Actions) | high | `const session = await getServerSession(authOptions)` in a Server Component | `useSession()` called inside a Server Component or API route |
| AUTH-003 | Provider nesting order: Redux → Auth → NextIntl | high | `<ReduxProvider><AuthProvider><NextIntlProvider>` | NextIntl wrapping Auth, or Auth inside Redux |
| AUTH-004 | Feature flags checked via `isFeatureFlagEnabled()` — never manual JWT claim parsing | medium | `isFeatureFlagEnabled(session, 'feature_x')` | `session.user.token.claims.features.includes('feature_x')` |
| AUTH-005 | No manual token refresh logic — JWT callback in `authOptions` handles it automatically | medium | No `refreshAccessToken` calls in components or actions | Component manually calling refresh endpoint when 401 received |
| AUTH-006 | Protected routes have auth guard in middleware (`middleware.ts`) — not only in component render | high | Route listed in middleware matcher; component is secondary guard only | Component redirects on missing session but no middleware protection exists |

---

## Lightweight vs Escalated

| Rule IDs | Lightweight (default) | Escalated only |
|----------|-----------------------|----------------|
| AUTH-001–003, AUTH-006 | Yes | — |
| AUTH-004–005 | — | Yes |

**Lightweight**: Run on all files using session or auth imports. **Escalated**: Activate on auth flow changes or explicit `--deep` flag.
