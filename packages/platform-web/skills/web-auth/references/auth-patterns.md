# Auth Patterns — NextAuth + Keycloak

## NextAuth Configuration

**Location**: `app/api/auth/[...nextauth]/auth-options.ts`

```typescript
import YourOAuthProvider from 'next-auth/providers/...'; // e.g., KeycloakProvider, Auth0Provider

export const Options: NextAuthOptions = {
  providers: [
    YourOAuthProvider({
      clientId: process.env.PROVIDER_CLIENT_ID!,
      clientSecret: process.env.PROVIDER_SECRET!,
      issuer: process.env.PROVIDER_ISSUER,
    }),
  ],
  pages: { signIn: '/login' },
  session: {
    strategy: 'jwt',
    maxAge: 12 * 60 * 60,  // 12 hours
    updateAge: 0,           // prevents automatic refresh
  },
};
```

## Token Refresh Logic

JWT callback handles refresh with two triggers:
- **5-minute buffer** before token expiry
- **30-minute interval** refresh regardless of expiry

```typescript
// TECH-DEBT: moment.js (2.30.1) used here — project standard. 
// Consider migrating to date-fns or native Date when refactoring auth.
function shouldRefreshToken(decodedToken, lastRefreshed): boolean {
  const isTokenExpiring = decodedToken?.exp &&
    moment().isAfter(moment.unix(decodedToken.exp).subtract(5, 'minutes'));
  const shouldRefreshByInterval = lastRefreshed &&
    moment().isAfter(moment.unix(lastRefreshed).add(30, 'minutes'));
  return Boolean(isTokenExpiring || shouldRefreshByInterval);
}
```

## Session Extension

```typescript
export interface ExtendedSession extends DefaultSession {
  accessToken: string;
  refreshToken: string;
  idToken: string;
  organizationId?: string;
  roles?: string[];
  firstName?: string;
  lastName?: string;
  error?: string;
}
```

## Session Access — Full Patterns

### Server Components

```typescript
// utils/session-server.ts
import { getServerSession } from 'next-auth';
import { Options, ExtendedSession } from '../api/auth/[...nextauth]/auth-options';

export async function getServerSessionData(): Promise<ExtendedSession> {
  const session = await getServerSession(Options);
  if (!session) throw new Error('Session not found');
  return session as ExtendedSession;
}
```

### Client Components

```typescript
import { useSession } from 'next-auth/react';

export const useSessionData = () => {
  const session = useSession().data as ExtendedSession;
  return {
    isAuthenticated: !!session?.accessToken,
    roles: session?.roles ?? [],
    organizationId: session?.organizationId,
  };
};
```

### Server Actions / Callers

```typescript
// _services/_actions/auth-session.action.ts
export const getAuthSession = async () => {
  const session: ExtendedSession | null = await getServerSession(Options);
  if (session) {
    return {
      accessToken: session.accessToken,
      userEmail: session.user?.email,
    };
  }
  return null;
};
```

## Feature Flag Implementation

```typescript
// libs/constants.ts
export const FEATURE_FLAGS = {
  MODULE_A_V2: 'app:module-a:v2',
  MODULE_B_V2: 'app:module-b:v2',
} as const;

// service/feature-flag-service.ts
export const isFeatureFlagEnabled = async (
  authToken: string,
  userId: string,
  featureFlag: string,
): Promise<boolean> => {
  // LRU-cached (1h TTL), falls back to API call
};
```
