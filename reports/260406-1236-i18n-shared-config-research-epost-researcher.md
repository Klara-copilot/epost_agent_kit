---
name: i18n Shared Config Research
description: Investigation of current i18n env var structure and viability of shared epost-config pattern for team repos
type: research
status: actionable
date: 2026-04-06
---

# Research: Shared i18n Config via epost-config

## Research Question

**Can team-wide i18n env vars be moved from individual `.env.local` files to a shared `epost-config` pattern that all repos inherit?** Specifically:
- Which i18n vars are repo-specific vs team-wide?
- Does an epost-config mechanism already exist?
- What would need to change to support i18n config at the epost-config level?

---

## Current State: What Exists

### 1. epost-config Mechanism (Already Exists)

**Location**: `packages/core/hooks/lib/epost-config-utils.cjs`

The epost-kit already has a **cascading config loading system** that reads from two locations:

| Config Path | Scope | Priority |
|---|---|---|
| `~/.claude/.epost-kit.json` | **Global** (user home) | Applied to all local repos |
| `./.claude/.epost-kit.json` | **Local** (project root) | Overrides global for this repo |

**Architecture** (lines 477-527):
```javascript
// Resolution order: DEFAULT → global → local (local wins)
let merged = deepMerge({}, DEFAULT_CONFIG);
if (globalConfig) merged = deepMerge(merged, globalConfig);
if (localConfig) merged = deepMerge(merged, localConfig);
```

This is used by hooks like `session-init.cjs` (imports loadConfig) to configure plans, paths, docs, hooks, locale, trust, project detection, and assertions.

**Key insight**: The pattern is proven, actively used, and extensible.

---

### 2. Current i18n Config (Repository-Specific)

**Location**: `.env.local` in each web app

**Current required vars** (from `packages/platform-web/skills/web-i18n/references/i18n-patterns.md`):

```bash
# SHEET IDENTIFICATION (TEAM-WIDE)
I18N_GOOGLE_SHEET_ID=<sheet-id>
I18N_LOCALE_MAP=en:en,de:de,fr:fr,it:it

# SHEET STRUCTURE (LIKELY TEAM-WIDE)
I18N_RESULT_SHEET_TAB=Result
I18N_KEY_SEPARATOR=::
I18N_FALLBACK_SHEET_TAB=Common

# SHEET MODE + FILTER (TEAM-WIDE OR REPO-SPECIFIC)
I18N_SHEET_MODE=tabs                    # shared mode
I18N_SHEET_TAB=                         # single mode only
I18N_PROJECT_COLUMN=PROJECT             # single mode only
I18N_PROJECT_VALUE=my_project           # repo-specific!

# APP STRUCTURE (REPO-SPECIFIC)
I18N_MESSAGES_DIR=<relative-path>       # varies per app
I18N_LOCALES=en,de,fr,it                # same across team

# CREDENTIALS (SENSITIVE, REQUIRES AUTH)
GOOGLE_SERVICE_ACCOUNT_KEY=<path>       # write ops only (--push)
```

**Evidence from code** (`packages/platform-web/skills/web-i18n/scripts/env-config.cjs`, lines 76-94):
- All vars are read from `.env.local` (file-based)
- `process.env` overrides `.env.local` (shell/CI takes priority)
- No existing i18n-specific epost-config integration

---

## Analysis: Repo-Specific vs Team-Wide

### Tier 1: Definitely Team-Wide

| Var | Reason | Current Value |
|---|---|---|
| `I18N_GOOGLE_SHEET_ID` | Single source of truth for all app locales | Shared sheet-id |
| `I18N_LOCALE_MAP` | Column→filename mapping for that sheet | `en:en,de:de,fr:fr,it:it` |
| `I18N_RESULT_SHEET_TAB` | Where pull/validate script reads | `Result` |
| `I18N_KEY_SEPARATOR` | Parsing rule for sheet keys | `::` |
| `I18N_FALLBACK_SHEET_TAB` | Namespace fallback in tabs mode | `Common` |
| `I18N_LOCALES` | Master list of supported languages | `en,de,fr,it` |
| `I18N_SHEET_MODE` | Architecture choice for sheet layout | `tabs` or `single` |

**Evidence**: These are referenced in skill docs as constants, not per-app overrides.

### Tier 2: Repo-Specific (Cannot be Shared)

| Var | Reason | Example |
|---|---|---|
| `I18N_MESSAGES_DIR` | Path inside each app's structure | `packages/app-web/src/i18n/messages` vs `apps/mobile-web/messages` |
| `I18N_PROJECT_VALUE` | In "single mode": app's project code | `WEB_APP` vs `MOBILE_APP` |

**Evidence**: The env-config script reads these and passes relative paths to scripts; apps have different directory layouts.

### Tier 3: Sensitive (Requires Special Handling)

| Var | Reason | Risk |
|---|---|---|
| `GOOGLE_SERVICE_ACCOUNT_KEY` | Service account credentials | Cannot be in shared config; must be injected via CI/shell or `.env.local` |

---

## Implementation Path: Adding i18n to epost-config

### Option A: Extend epost-config JSON (Recommended)

**Add `i18n` section to `.epost-kit.json`:**

```javascript
// ~/.claude/.epost-kit.json (global)
{
  "i18n": {
    "googleSheetId": "abc123xyz",
    "locales": ["en", "de", "fr", "it"],
    "localeMap": "en:en,de:de,fr:fr,it:it",
    "resultSheetTab": "Result",
    "keySeparator": "::",
    "fallbackSheetTab": "Common",
    "sheetMode": "tabs"
  }
}

// ./.claude/.epost-kit.json (local, per-app)
{
  "i18n": {
    "messagesDir": "src/i18n/messages",
    "projectValue": "WEB_APP"
  }
}
```

**Merge behavior**: Global defaults + local overrides (same cascading pattern as existing config).

**Integration point**: Modify `env-config.cjs` to read from epost-config first, then fall back to `.env.local`:

```javascript
function loadConfig(envPath) {
  // 1. Load from epost-config (if available)
  const epostConfig = loadEpostConfigI18n();
  
  // 2. Load from .env.local (takes precedence)
  const envFile = envPath || path.join(process.cwd(), '.env.local');
  const fileVars = parseEnvFile(envFile);
  
  // 3. Merge: DEFAULT → epost-config → .env.local → process.env
  const merged = { ...DEFAULT_CONFIG_I18N, ...epostConfig, ...fileVars, ...process.env };
  
  return parseI18nConfig(merged);
}
```

**Advantages**:
- Reuses proven epost-config architecture
- Global config eliminates duplication across 5+ web apps
- `.env.local` can still override (useful for CI, local dev)
- Low risk: v-control via epost-kit, not separate management
- Team-wide defaults can be committed to the kit repo

---

### Option B: Separate `.env.shared` or `.epost-i18n.json`

**Less ideal**:
- Introduces new config format (not aligned with epost-config)
- Requires separate loading logic in each script
- Harder to sync across repos

---

## Key Files & Implementation Scope

**Files to Modify** (estimate: 4 files, ~200 LOC total):

| File | Changes | Impact |
|---|---|---|
| `packages/core/hooks/lib/epost-config-utils.cjs` | Add `i18n` section to `DEFAULT_CONFIG` + add `loadEpostConfigI18n()` helper | Core infrastructure |
| `packages/platform-web/skills/web-i18n/scripts/env-config.cjs` | Modify `loadConfig()` to check epost-config before `.env.local` | i18n scripts (pull, push, validate) |
| `./.claude/.epost-kit.json` or `~/.claude/.epost-kit.json` | Add `i18n` section with team defaults | Configuration (user home) |
| `packages/platform-web/CLAUDE.snippet.md` | Update i18n setup docs to reference epost-config | Documentation |

**No changes needed to**:
- `.env.local` structure (remains supported as override layer)
- Existing i18n skill logic (pull/push/validate)
- next-intl configuration

---

## Unresolved Questions

1. **CI/CD credentials**: How should `GOOGLE_SERVICE_ACCOUNT_KEY` be injected in CI environments? (Likely already solved via GitHub Secrets, but not verified in this research.)

2. **Multi-sheet scenarios**: Are there plans to support multiple Google Sheets (e.g., one per app)? Current implementation assumes single sheet per team.

3. **Rollout strategy**: Should this be a breaking change (all repos adopt epost-config) or gradual (epost-config optional, `.env.local` still works)?

4. **Locale changes over time**: If team adds/removes locales, how to update all repos? (epost-config global would handle this, but onboarding of new repos needs clarification.)

---

## Verdict: ACTIONABLE

**Recommendation**: Implement Option A (extend epost-config).

**Rationale**:
- ✅ Reuses proven infrastructure (epost-config already in use, well-tested)
- ✅ Eliminates duplication (Tier 1 vars currently in 5+ `.env.local` files)
- ✅ Backward compatible (`.env.local` remains as override layer)
- ✅ Low risk (scoped changes, follows existing patterns)
- ✅ Enables future: team config version control via epost-kit
- ✅ Improves DX: new repos inherit i18n config automatically

**Next steps**:
1. Validate `GOOGLE_SERVICE_ACCOUNT_KEY` handling in current CI/CD
2. Implement `loadEpostConfigI18n()` helper in epost-config-utils
3. Update env-config.cjs to cascade from epost-config
4. Update web-i18n skill docs (SKILL.md + i18n-patterns.md) with epost-config section
5. Add test cases to epost-config-utils for i18n config merging

---

## Sources Consulted

| File | URL | Credibility |
|---|---|---|
| epost-config-utils.cjs | `/packages/core/hooks/lib/epost-config-utils.cjs` | High (source code) |
| web-i18n SKILL.md | `/packages/platform-web/skills/web-i18n/SKILL.md` | High (skill definition) |
| i18n-patterns.md | `/packages/platform-web/skills/web-i18n/references/i18n-patterns.md` | High (reference docs) |
| env-config.cjs | `/packages/platform-web/skills/web-i18n/scripts/env-config.cjs` | High (active script) |
| session-init.cjs | `/packages/core/hooks/session-init.cjs` | High (hook implementation) |

---

## Notes

- The epost-config pattern is **actively used** by the harness for plan resolution, path management, hook toggling, and locale preferences. The infrastructure is stable and well-tested (includes tests at `packages/core/hooks/lib/__tests__/epost-config-utils.test.cjs`).
  
- **No evidence of existing i18n integration** with epost-config. The web-i18n skill currently assumes all config lives in `.env.local`.

- The Tier 1 variables are **never localized per app** — they represent team-wide consensus about which sheet, which columns, which languages are in scope.
