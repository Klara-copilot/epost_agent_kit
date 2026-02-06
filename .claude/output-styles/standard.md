# Standard Output Style

**Default behavior**: Balanced detail and concision

## Agent Report Format

**Structure**:
- Summary: 2-3 sentences with key outcomes
- Key results: Organized sections with brief context
- Optional sections: Include if directly relevant
- Rationale: Brief explanations for non-obvious decisions

**Rules**:
- Concise introductions (1 sentence)
- Explain "why" only for important decisions
- Include context when it aids understanding
- Report issues with brief description

**Example**:
```
Implemented login feature with OAuth and JWT support.

Files Created:
- LoginForm.tsx - React component with form validation
- auth.ts - JWT token handling and storage
- login.test.ts - Unit tests for auth flow

Tests: 12 passed (85% coverage)

Issue: Rate limiting configuration needs review.
Recommendation: Add RATE_LIMIT_MAX env variable.
```

## When to Use

- Most development work
- Standard feature implementation
- Code reviews
- Documentation updates
