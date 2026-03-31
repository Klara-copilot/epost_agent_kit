# STRIDE + OWASP Top 10 Reference

## STRIDE Threat Categories

| Threat | Full Name | Primary Target | OWASP Mapping |
|--------|-----------|---------------|---------------|
| S | Spoofing | Authentication | A07 ID & Auth Failures |
| T | Tampering | Integrity | A08 Software & Data Integrity, A03 Injection |
| R | Repudiation | Non-repudiation | A09 Security Logging & Monitoring Failures |
| I | Information Disclosure | Confidentiality | A02 Cryptographic Failures, A01 Broken Access Control |
| D | Denial of Service | Availability | A05 Security Misconfiguration |
| E | Elevation of Privilege | Authorization | A01 Broken Access Control |

## OWASP Top 10 (2021)

| # | Category | STRIDE | Key Patterns |
|---|----------|--------|-------------|
| A01 | Broken Access Control | I, E | Missing auth checks, IDOR, path traversal, JWT tampering |
| A02 | Cryptographic Failures | I | Weak ciphers, plaintext secrets, missing TLS, MD5/SHA1 for passwords |
| A03 | Injection | T | SQL injection, command injection, XSS, LDAP injection, log injection |
| A04 | Insecure Design | S, T, E | Missing threat model, no rate limiting, no security controls by design |
| A05 | Security Misconfiguration | I, D | Default credentials, verbose errors, open S3 buckets, debug mode in prod |
| A06 | Vulnerable & Outdated Components | T, I | Known CVEs in deps, unmaintained libraries, unpatched frameworks |
| A07 | Identification & Auth Failures | S | Weak passwords, missing MFA, session fixation, insecure token storage |
| A08 | Software & Data Integrity | T | Unsigned packages, insecure CI/CD, deserialization flaws |
| A09 | Security Logging & Monitoring | R | Missing audit logs, no alerting, log injection, sensitive data in logs |
| A10 | Server-Side Request Forgery | S, I | Unvalidated URLs, internal network probing, cloud metadata access |

## Quick STRIDE Checklist per Feature Type

### REST API / Web Endpoint
| Check | STRIDE | Priority |
|-------|--------|----------|
| Auth header validated before processing | S | Critical |
| Input validated and sanitized | T | Critical |
| Rate limiting in place | D | High |
| Errors don't leak internal details | I | High |
| Actions logged with user identity | R | Medium |
| Response doesn't include excess data | I | Medium |

### Database / Data Store
| Check | STRIDE | Priority |
|-------|--------|----------|
| Parameterized queries / ORM used | T | Critical |
| Connection credentials not in source | I | Critical |
| Access limited to service account | E | High |
| Sensitive fields encrypted at rest | I | High |
| Audit log for write operations | R | Medium |

### Authentication / Session
| Check | STRIDE | Priority |
|-------|--------|----------|
| Password hashed with bcrypt/argon2 | I | Critical |
| Session tokens cryptographically random | S | Critical |
| Token expiry enforced | S | High |
| Logout invalidates server-side session | S | High |
| CSRF protection on state-changing ops | T | High |
| Secure + HttpOnly cookie flags | I | High |

### File Upload / Processing
| Check | STRIDE | Priority |
|-------|--------|----------|
| MIME type validated (not just extension) | T | Critical |
| File stored outside web root | I | Critical |
| Max size enforced | D | High |
| Filename sanitized (path traversal) | T | High |
| Virus scanning for untrusted files | T | Medium |

## Severity Decision Matrix

| Exploitability | Impact | Severity |
|---------------|--------|----------|
| Remote, unauthenticated | Data breach / system compromise | Critical |
| Remote, authenticated | Privilege escalation / data leak | High |
| Local / requires interaction | Information disclosure | Medium |
| Theoretical / edge case | Minor info leak | Low |
| Best practice deviation | No direct exploit | Info |
