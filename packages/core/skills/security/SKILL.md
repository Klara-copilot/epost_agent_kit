---
name: security
description: "(ePost) Use when user says \"audit security\", \"review for vulnerabilities\", \"check STRIDE threats\", or \"scan for OWASP Top 10\" — runs security analysis on a codebase or feature"
user-invocable: true
tier: core
metadata:
  agent-affinity: [epost-code-reviewer]
  triggers: ["security audit", "check vulnerabilities", "scan for secrets", "OWASP", "STRIDE", "CVE", "pentest", "security review"]
  keywords: [security, STRIDE, OWASP, vulnerabilities, secrets, injection, audit, CVE, dependencies]
  platforms: [all]
  connections:
    enhances: [code-review]
---

# Security Audit Skill

Structured security analysis using STRIDE threat modeling + OWASP Top 10 classification.

## Flags

| Flag | Behavior |
|------|----------|
| `--fix` | Auto-fix mode — applies patches iteratively, verifies after each |
| `--scope <glob>` | Limit analysis to specific files/dirs |
| `--deps-only` | Dependency audit only (skip code analysis) |
| `--secrets-only` | Secret detection only |
| `--scan` | Pre-commit security scan (secrets, injection, unsafe patterns) — see `references/scan.md` |

## Workflow

### Step 1 — Scope Analysis

Identify the attack surface before analyzing anything:

| Surface | What to Find |
|---------|-------------|
| Entry points | HTTP endpoints, CLI args, file inputs, webhooks, message queues |
| Auth boundaries | Authentication gates, session checks, token validation |
| Data flows | User input → storage, storage → output, inter-service calls |
| Trust boundaries | Where data crosses privilege levels |

### Step 2 — STRIDE Analysis

For each item in scope, evaluate all 6 threat categories. See `references/stride-owasp.md` for the full table.

| Threat | Question to Ask |
|--------|----------------|
| **S**poofing | Can an attacker impersonate a legitimate user or service? |
| **T**ampering | Can data be modified in transit or at rest without detection? |
| **R**epudiation | Can a user deny performing an action (no audit trail)? |
| **I**nformation Disclosure | Can sensitive data leak to unauthorized parties? |
| **D**oS | Can availability be degraded or denied? |
| **E**levation of Privilege | Can a lower-privileged actor gain higher access? |

### Step 3 — OWASP Top 10 Mapping

Classify each finding against OWASP Top 10. See `references/stride-owasp.md` for mapping table.

Quick reference:

| # | Category |
|---|----------|
| A01 | Broken Access Control |
| A02 | Cryptographic Failures |
| A03 | Injection |
| A04 | Insecure Design |
| A05 | Security Misconfiguration |
| A06 | Vulnerable & Outdated Components |
| A07 | ID & Auth Failures |
| A08 | Software & Data Integrity Failures |
| A09 | Security Logging & Monitoring Failures |
| A10 | Server-Side Request Forgery |

### Step 4 — Dependency Audit

Run platform-appropriate tool:

| Platform | Command |
|----------|---------|
| Node.js | `npm audit --audit-level=moderate` |
| Maven | `mvn dependency:check -DfailBuildOnCVSS=7` |
| Manual | Check known CVE databases for pinned versions |

Flag all HIGH/CRITICAL CVEs. MODERATE = warn.

### Step 5 — Secret Detection

Scan for hardcoded credentials:

**Patterns to detect:**
- API keys: `sk-`, `pk_`, `AIza`, `AKIA` prefixes
- Generic secrets: `password =`, `secret =`, `token =` in non-test code
- Private keys: `-----BEGIN`, `-----BEGIN RSA`
- Connection strings with embedded credentials

**Output rule:** Redact detected secrets — show first 4 + last 2 characters only: `sk-pr...xy`

**Safe exceptions:** Test fixtures, `.env.example`, mock/stub values, documentation examples.

### Step 6 — Severity Ranking

Assign severity to each finding. See `references/severity-rubric.md` for full definitions.

| Severity | Action Required |
|----------|----------------|
| Critical | Block — fix before any deployment |
| High | Fix within 24h |
| Medium | Fix within sprint |
| Low | Fix when convenient |
| Info | Informational, no action required |

### Step 7 — Report

Structure the output as:

```
## Security Audit Report

### Summary
- Critical: N | High: N | Medium: N | Low: N | Info: N

### Findings

#### [SEVERITY] Finding Title
- File: path/to/file.ts:line
- STRIDE category: [S/T/R/I/D/E]
- OWASP: A0X — Category Name
- Description: What the issue is
- Remediation: Specific fix steps
```

## References

- `references/stride-owasp.md` — Full STRIDE + OWASP mapping table
- `references/severity-rubric.md` — Severity level definitions
