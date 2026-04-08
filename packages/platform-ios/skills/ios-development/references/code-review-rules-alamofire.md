---
name: ios-code-review-rules-alamofire
description: "iOS Alamofire code review rules — ALAMOFIRE category"
user-invocable: false
disable-model-invocation: true
---

# iOS Alamofire Code Review Rules

Alamofire networking code review rules. Loaded by code-review skill when reviewing files that use Alamofire or `GenericAPIHandler`.

**Scope**: Alamofire 5.8.1 — response validation, retry policy, request lifecycle in luz_epost_ios.

---

## ALAMOFIRE: Networking Conventions

**Scope**: All Alamofire usage in luz_epost_ios — `GenericAPIHandler`, `{Feature}Services.swift`, session configuration.

| Rule ID | Rule | Severity | Pass | Fail |
|---------|------|----------|------|------|
| ALAMOFIRE-001 | Response validation before decode — `validate(statusCode: 200..<300)` or equivalent before `responseDecodable` | high | `AF.request(url).validate(statusCode: 200..<300).responseDecodable(of: T.self) { … }` | `AF.request(url).responseDecodable(of: T.self) { … }` without `.validate()` — 4xx/5xx silently decoded as success |
| ALAMOFIRE-002 | Retry policy configured on `Session`, not per-request — use `Interceptor` with `RetryPolicy` | medium | `let session = Session(interceptor: Interceptor(retrier: RetryPolicy(retryLimit: 3)))` shared across requests | `.retry(using: RetryPolicy())` added inline on individual `AF.request(…)` call |
| ALAMOFIRE-003 | Request references stored and cancelled in `deinit` — prevent orphaned network calls on VC dismissal | high | `var request: DataRequest?; deinit { request?.cancel() }` in the ViewController or ViewModel | `AF.request(url).responseDecodable { [weak self] … }` fired without storing the `DataRequest` reference |

---

## Lightweight vs Escalated

| Rule IDs | Lightweight (default) | Escalated only |
|----------|-----------------------|----------------|
| ALAMOFIRE-001 | Yes | — |
| ALAMOFIRE-002–003 | — | Yes |

**Lightweight**: Run on all files using Alamofire (1 of 3 rules). **Escalated**: Activate on networking-layer PRs or explicit `--deep` flag (2 of 3 rules).

## Extending

Add rules following the pattern `ALAMOFIRE-{NNN}`. Keep severity consistent with cross-cutting rules in `code-review/references/code-review-standards.md`.
