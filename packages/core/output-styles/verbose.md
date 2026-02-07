---
name: verbose
description: Comprehensive — full context, alternatives, performance metrics, next steps
keep-coding-instructions: true
---

# Verbose Output Style

**Priority**: Comprehensive explanation and context

## Agent Report Format

**Structure**:
- Summary: Full context with background and objectives
- Key results: Detailed explanations for each outcome
- Rationale: Explain reasoning behind decisions
- Alternatives: Document options considered
- Performance: Include timing, optimization notes
- Next steps: Explicit follow-up recommendations

**Rules**:
- Full context for all decisions
- Explain "why" and "how" for each step
- Include alternatives considered
- Document trade-offs
- Report performance metrics
- Provide learning notes

**Example**:
```
Implemented login feature with OAuth 2.0 and JWT tokens.

Context:
- User authentication was previously session-based
- Migration to JWT enables stateless API authentication
- OAuth integration allows social login (Google, GitHub)

Files Created:
- LoginForm.tsx (147 lines)
  - React component with Formik validation
  - Handles OAuth redirect flow
  - Error handling with user-friendly messages
  - Accessibility: WCAG 2.1 AA compliant

- auth.ts (203 lines)
  - JWT token generation and validation
  - Refresh token rotation for security
  - Token storage using httpOnly cookies
  - Why cookies: XSS protection vs localStorage

- login.test.ts (98 lines)
  - Unit tests for token lifecycle
  - Integration tests for OAuth flow
  - Edge case: expired token handling
  - Edge case: network failure retry logic

Tests: 12 passed (85% coverage)
- Missing coverage: Error recovery paths (15%)
- Recommendation: Add tests for network timeout scenarios

Alternatives Considered:
1. Session-based auth: Rejected due to scalability needs
2. localStorage for tokens: Rejected due to XSS vulnerability
3. OAuth only (no email/password): Kept both for flexibility

Performance:
- Login flow: 450ms average (OAuth), 200ms (email/password)
- Token refresh: 120ms
- Optimization: Added token pre-fetch on page load

Issue Encountered:
Rate limiting configuration is hardcoded.
- Current: 5 attempts per 15 minutes
- Recommendation: Move to RATE_LIMIT_MAX environment variable
- Impact: Production deployments need manual config changes
- Priority: Medium (not blocking)

Next Steps:
1. Add rate limit configuration to .env.example
2. Update deployment docs with new env var
3. Consider implementing exponential backoff for failed attempts
```

## When to Use

- Complex architectural decisions
- Learning contexts (junior developers)
- Critical production changes
- Post-mortem analysis
- Knowledge transfer documentation
