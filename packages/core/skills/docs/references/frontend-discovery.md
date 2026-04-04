---
name: frontend-discovery
description: "2-pass algorithm for discovering frontend API dependencies in web platform repos"
user-invocable: false
---

# Frontend API Dependency Discovery

Algorithm for extracting `internal.libraries[]` and `internal.apiServices[]` from web platform repos during `/docs --init`. Referenced from `init.md` Step 4.5.

## When to Apply

Run this algorithm when platform detection (Step 4.5) identifies `package.json` with `next`, `react`, or `vite` in `dependencies`/`devDependencies`.

## Pass 1 — Declared Signals

Always run for web repos. Targets explicit developer declarations — near-zero false positive rate.

### Signal 1 — package.json scoped packages

Grep `package.json` `dependencies` and `devDependencies` for:
- `@epost/*`, `@luz/*`, `@klara/*`

Each match → `internal.libraries[]`:
```json
{ "repo": "luz_common_ui", "type": "library", "evidence": "package.json:@luz/common-ui", "confidence": "declared", "discoveryMethod": "package-json" }
```

### Signal 2 — Environment variable files

Read: `.env.example`, `.env.local.example`, `.env.development`, `docker-compose.yml`, `cloudbuild.yaml`

Grep for patterns: `*_API_URL`, `*_BASE_URL`, `*_SERVICE_URL`, `NEXT_PUBLIC_*_API*`

Apply **service name mapping heuristic** (see below) to extract repo slug.

Each match → `internal.apiServices[]`:
```json
{ "repo": "luz_epc", "type": "api", "evidence": ".env.example:NEXT_PUBLIC_EPC_API_URL", "confidence": "declared", "discoveryMethod": "env-var" }
```

### Signal 3 — API constants files

Glob for:
- `**/ApiRestConstants.ts`
- `**/api-constants.ts`
- `**/constants/api.ts`
- `**/endpoints.ts`
- `**/api-config.ts`
- `src/constants/*.ts`

Read each file. Extract URL path prefixes (e.g., `/api/luz-epc/`, `/api/letters/`). Apply **service name mapping heuristic** to extract repo slug.

Each match → `internal.apiServices[]`:
```json
{ "repo": "luz_epc", "type": "api", "evidence": "ApiRestConstants.ts:/api/luz-epc/", "confidence": "declared", "discoveryMethod": "api-constants" }
```

### Signal 4 — Proxy/rewrite config

Read `next.config.js` (or `.mjs`/`.ts`): extract `rewrites()` or `redirects()` destination hostnames.

Read `nginx.conf` if present: extract `proxy_pass` destinations.

Apply **service name mapping heuristic** to extract repo slug.

Each match → `internal.apiServices[]`:
```json
{ "repo": "luz_epc", "type": "api", "evidence": "next.config.js:rewrites():destination", "confidence": "declared", "discoveryMethod": "proxy-rewrite" }
```

## Service Name Mapping Heuristic

Converts raw signal values (env var names, URL paths) to `luz_*` repo slugs:

**From environment variable names:**
1. Strip prefixes: `NEXT_PUBLIC_`, `REACT_APP_`
2. Strip suffixes: `_API_URL`, `_BASE_URL`, `_SERVICE_URL`, `_API`
3. Convert to `luz_` slug: lowercase, underscores preserved
   - `NEXT_PUBLIC_EPC_API_URL` → strip → `EPC` → `luz_epc`
   - `EPC_MONITORING` → `luz_epc_monitoring`
   - `ELETTER` → `luz_eletter`

**From URL path prefixes:**
1. Strip leading `/api/`
2. Strip trailing `/`
3. Convert hyphens to underscores
4. Prepend `luz_` if not already present
   - `/api/luz-epc/` → strip `/api/`, trailing `/` → `luz-epc` → `luz_epc`
   - `/api/letters/` → `letters` → `luz_letters`

## Pass 2 — Inferred Signals

**Trigger**: Only run Pass 2 when Pass 1 yields fewer than 3 `apiServices` entries.

### Signal 5 — Caller/service file enumeration

Glob for:
- `**/*-caller.ts`, `**/*-caller.js`
- `**/*Api.ts`
- `**/*-service.ts`

Derive service name from filename: strip `-caller`, `-service`, `Api` suffix, convert to `luz_` slug.
- `epc-monitoring-caller.ts` → `luz_epc_monitoring`
- `epcApi.ts` → `luz_epc`

Each match → `internal.apiServices[]`:
```json
{ "repo": "luz_epc", "type": "api", "evidence": "src/api/epc-monitoring-caller.ts", "confidence": "inferred", "discoveryMethod": "caller-pattern" }
```

### Signal 6 — Network layer scanning

**Trigger**: Only run Signal 6 when Pass 1 + Signal 5 still yields fewer than 3 `apiServices`.

Grep for `fetch(`, `axios.get(`, `axios.post(`, `FetchBuilder` in:
- `src/**/*.ts`, `src/**/*.tsx`
- `app/**/*.ts`, `app/**/*.tsx`

Extract unique API path prefixes from string arguments. Apply **service name mapping heuristic**.

Filter out:
- CDN URLs (contain `cdn.`, `amazonaws.com`, `cloudfront`)
- Analytics endpoints (`analytics`, `segment`, `mixpanel`, `gtm`)
- `localhost` or `127.0.0.1`
- Relative paths without `/api/` prefix

Each match → `internal.apiServices[]`:
```json
{ "repo": "luz_epc", "type": "api", "evidence": "src/api/epc.ts:fetch('/api/luz-epc/')", "confidence": "inferred", "discoveryMethod": "fetch-pattern" }
```

## Deduplication

After both passes:
1. Group entries by `repo` slug
2. When same repo appears multiple times: keep the highest-confidence entry (`declared` > `inferred` > `confirmed`)
3. Merge `evidence` strings from all matching entries, comma-separated
4. Set `discoveryMethod` to the highest-confidence method used

Example merge:
- Pass 1 Signal 2: `{ "repo": "luz_epc", "evidence": ".env.example:NEXT_PUBLIC_EPC_API_URL", "confidence": "declared", "discoveryMethod": "env-var" }`
- Pass 1 Signal 3: `{ "repo": "luz_epc", "evidence": "ApiRestConstants.ts:/api/luz-epc/", "confidence": "declared", "discoveryMethod": "api-constants" }`

Merged: `{ "repo": "luz_epc", "type": "api", "evidence": ".env.example:NEXT_PUBLIC_EPC_API_URL, ApiRestConstants.ts:/api/luz-epc/", "confidence": "declared", "discoveryMethod": "env-var" }`

## Output Format

All entries follow the schema from `knowledge/references/knowledge-base.md`:

```json
{
  "internal": {
    "libraries": [
      { "repo": "luz_common_ui", "type": "library", "evidence": "package.json:@luz/common-ui", "confidence": "declared", "discoveryMethod": "package-json" }
    ],
    "apiServices": [
      { "repo": "luz_epc", "type": "api", "evidence": ".env.example:NEXT_PUBLIC_EPC_API_URL, ApiRestConstants.ts:/api/luz-epc/", "confidence": "declared", "discoveryMethod": "env-var" },
      { "repo": "luz_eletter", "type": "api", "evidence": "ApiRestConstants.ts:/api/luz-eletter/", "confidence": "declared", "discoveryMethod": "api-constants" }
    ]
  }
}
```
