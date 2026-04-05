# Security Scan Mode (`--scan`)

Fast, pre-commit security scanner. Checks staged files by default. Use before committing or as a CI gate.

## Modes

| Mode | Scope |
|------|-------|
| Default | Staged files only (`git diff --cached --name-only`) |
| `--all` | Full codebase scan |
| `--json` | Machine-readable output for CI |

## Detection Patterns

### Secrets (Critical — Block)

Scan for hardcoded credentials in source files:

| Pattern | Examples |
|---------|---------|
| API key prefixes | `sk-`, `pk_live_`, `pk_test_`, `AIza`, `AKIA`, `xoxb-`, `ghp_` |
| Assignment patterns | `password =`, `secret =`, `api_key =`, `private_key =` in non-test code |
| Private key blocks | `-----BEGIN RSA PRIVATE KEY-----`, `-----BEGIN PRIVATE KEY-----` |
| Connection strings | `postgresql://user:pass@`, `mongodb://user:pass@`, `redis://:pass@` |
| Generic tokens | `Bearer [A-Za-z0-9+/]{40,}`, long hex strings assigned to `token`/`key` |

**Output rule:** Never print secrets in full. Redact to first 4 + last 2 chars: `sk-pr...ab`

**Safe exceptions (skip these):**
- Files: `*.test.*`, `*.spec.*`, `*.example`, `*.sample`, `*.mock.*`
- Patterns: `process.env.`, `System.getenv(`, `os.environ[`, `${...}`, `<your-key-here>`, `TODO:`, placeholder values

### Injection (High — Warn or Block)

| Pattern | Language | Severity |
|---------|---------|----------|
| String-concatenated SQL | JS/TS/Java | Block |
| `exec(`, `execSync(`, `spawn(` with user input | JS/TS | Block |
| `Runtime.getRuntime().exec(` with user input | Java | Block |
| `innerHTML =` with user-provided data | JS/TS | High |
| `document.write(` | JS/TS | High |
| Unescaped template in SQL ORM | all | High |

### Unsafe Randomness (Medium — Warn)

| Pattern | Issue |
|---------|-------|
| `Math.random()` in auth/token context | Not cryptographically secure |
| `new Random()` for security tokens in Java | Predictable |
| `random.randint` in session/key generation (Python) | Not crypto-safe |

**Safe context:** Math.random() for UI animations, ordering, non-security randomness.

### Dangerous Functions (Medium — Warn)

| Pattern | Risk |
|---------|------|
| `eval(` | Code injection |
| `new Function(` | Code injection |
| `setTimeout(string,` | Code injection |
| `setInterval(string,` | Code injection |
| `__import__(` with user data | Python code injection |

### Path Traversal (High — Warn)

| Pattern | Risk |
|---------|------|
| `../` in user-controlled path | File system escape |
| `path.join(userInput,` without sanitization | Traversal |
| `fs.readFile(req.params.` | Direct file access |
| `Files.readString(Paths.get(userInput` | Java traversal |

## Output Format

### Text Output (default)

```
Security Scan — {N} files checked

BLOCK (N):
  path/to/file.ts:42 — Hardcoded API key detected: sk-pr...ab

WARN (N):
  path/to/file.ts:87 — Math.random() used in token generation
  path/to/file.ts:103 — eval() usage detected

PASS: No issues found in N files

Result: BLOCK | WARN | PASS
```

### JSON Output (`--json`)

```json
{
  "result": "BLOCK",
  "files_checked": 5,
  "findings": [
    {
      "severity": "BLOCK",
      "file": "src/auth/token.ts",
      "line": 42,
      "type": "hardcoded-secret",
      "message": "Hardcoded API key detected",
      "redacted": "sk-pr...ab"
    }
  ]
}
```

## Result Levels

| Level | Meaning | Suggested Action |
|-------|---------|-----------------|
| BLOCK | Critical finding — secret or confirmed injection | Do not commit; fix before proceeding |
| WARN | Suspicious pattern — may be false positive | Review and acknowledge or fix |
| PASS | No findings | Safe to commit |

## False Positive Handling

When a finding is a confirmed false positive:
1. Add inline suppression comment: `// security-scan: ignore - reason`
2. Or annotate in Java: `// security-scan: ignore - test fixture`
3. Do not suppress BLOCK-level findings without explicit justification
