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
| ALAMOFIRE-002 | Retry policy configured on `Session` via `Interceptor` — not added per-request | medium | `let session = Session(interceptor: Interceptor(retrier: RetryPolicy(retryLimit: 3)))` shared across requests | `.retry(using: RetryPolicy())` added inline on individual `AF.request(…)` call |
| ALAMOFIRE-003 | Request references stored and cancelled in `deinit` — prevent orphaned network calls on VC dismissal | high | `var request: DataRequest?; deinit { request?.cancel() }` in the ViewController or ViewModel | `AF.request(url).responseDecodable { [weak self] … }` fired without storing the `DataRequest` reference |
| ALAMOFIRE-004 | `Session` configured with `ServerTrustManager` for SSL pinning in production — no wildcard or disabled trust | critical | `Session(serverTrustManager: ServerTrustManager(evaluators: ["api.epost.com": PinnedCertificatesTrustEvaluator()]))` | `Session(serverTrustManager: ServerTrustManager(allHostsMustBeEvaluated: false))` — disables certificate validation |
| ALAMOFIRE-005 | Auth token refresh handled via `RequestInterceptor` — no inline retry or manual re-auth logic in response closures | medium | `Interceptor(adapters: [AuthAdapter()], retriers: [AuthRetrier()])` on Session handles 401 → refresh → retry | 401 response handler calls `refreshToken()` then re-fires `AF.request(url)` inline — race conditions, logic duplication |
| ALAMOFIRE-006 | Multipart file uploads use `session.upload(multipartFormData:)` — not encoding binary Data into a JSON/form request body | medium | `session.upload(multipartFormData: { $0.append(fileURL, withName: "file") }, to: url)` | `AF.request(url, method: .post, parameters: ["file": base64EncodedString])` for binary uploads — inefficient, memory-intensive |

---

## Lightweight vs Escalated

| Rule IDs | Lightweight (default) | Escalated only |
|----------|-----------------------|----------------|
| ALAMOFIRE-001, ALAMOFIRE-004 | Yes | — |
| ALAMOFIRE-002, ALAMOFIRE-003, ALAMOFIRE-005, ALAMOFIRE-006 | — | Yes |

**Lightweight**: Run on all files using Alamofire (2 of 6 rules). **Escalated**: Activate on networking-layer PRs or explicit `--deep` flag (4 of 6 rules).

## Extending

Add rules following the pattern `ALAMOFIRE-{NNN}`. Keep severity consistent with cross-cutting rules in `code-review/references/code-review-standards.md`.
