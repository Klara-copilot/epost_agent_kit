---
name: web-auth
description: (ePost) Configures NextAuth + Keycloak authentication, session management, and feature flags. Use when working with authentication, sessions, OAuth providers, feature flags, or provider nesting
user-invocable: false
paths: ["**/auth-options.ts", "**/[...nextauth]/**", "**/session*.ts", "**/middleware.ts"]

metadata:
  agent-affinity: [epost-fullstack-developer]
  keywords: [auth, session, oauth, nextauth, feature-flag, jwt]
  platforms: [web]
  triggers: ["session", "auth", "oauth", "login", "feature flag", "provider"]
---

# Authentication — NextAuth + OAuth Provider Patterns

## Purpose

Authentication, session management, and feature flag patterns. Uses NextAuth v4 with your OAuth provider (e.g., Keycloak, Auth0, Azure AD).

## Auth Setup Summary

**Config location**: `app/api/auth/[...nextauth]/auth-options.ts`

Key settings:
- `strategy: 'jwt'`, `maxAge: 12h`, `updateAge: 0` (prevents auto-refresh)
- Token refresh: 5-minute buffer before expiry OR 30-minute interval, whichever triggers first
- Extend `DefaultSession` with `accessToken`, `refreshToken`, `idToken`, plus project fields (`organizationId`, `roles`, `error`)

See `references/auth-patterns.md` for full NextAuth config, token refresh logic, and Keycloak setup.

## Session Access Patterns

| Context | API |
|---------|-----|
| Server Components | `getServerSession(Options)` via `utils/session-server.ts` |
| Client Components | `useSession()` from `next-auth/react` |
| Server Actions / Callers | `getAuthSession()` action in `_services/_actions/auth-session.action.ts` |

Always use your extended session type — never raw `DefaultSession`.

## Provider Nesting Order

```
<ReduxProvider>              {/* Global Redux + PersistGate */}
  <AuthProvider>             {/* SessionProvider (refetchInterval=300) + SessionHandler */}
    <NextIntlClientProvider>
      {children}
    </NextIntlClientProvider>
  </AuthProvider>
</ReduxProvider>
```

## Feature Flags

Define flags as typed constants in `libs/constants.ts` (`FEATURE_FLAGS`). Check via `isFeatureFlagEnabled(authToken, userId, featureFlag)` — LRU-cached with 1h TTL. Feature flags are checked in middleware for route-level guards (see `web-nextjs`).

## Rules

- Always use your extended session type — never raw `DefaultSession`
- Use the correct session access pattern for the context (server/client/action)
- Feature flags are LRU-cached — don't worry about repeated calls
- Token refresh happens automatically in JWT callback — don't manually refresh

## References

- `references/auth-patterns.md` — NextAuth config, Keycloak setup, token refresh, session extension, middleware patterns
