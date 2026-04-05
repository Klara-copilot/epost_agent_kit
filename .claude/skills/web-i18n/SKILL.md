---
name: web-i18n
description: (ePost) Configures next-intl, manages translations, and handles locale routing. Use when working with translations, locale routing, next-intl configuration, internationalization patterns, or syncing translations with Google Sheets
user-invocable: true

metadata:
  agent-affinity: [epost-fullstack-developer]
  keywords: [i18n, translation, locale, next-intl, internationalization, google-sheets, sync, pull, push, validate]
  platforms: [web]
  triggers: ["translation", "locale", "i18n", "useTranslations", "getTranslations", "next-intl", "sync translations", "pull translations", "push translations", "missing keys"]
---

# Internationalization — next-intl + Google Sheet Sync

## Flags

| Flag | Behavior |
|------|----------|
| `--pull` | Fetch translated JSON from Sheet's Result tab → write `messages/*.json` |
| `--push` | Detect new keys in code not in Sheet → append rows with EN only |
| `--validate` | Report missing, orphaned, and untranslated keys (exit 1 on missing) |
| `--tab <Name>` | Scope `--validate` / `--push` to a single sheet tab/namespace |
| *(no flag)* | Show status: untranslated count, key drift, last messages dir mtime |

## Execution

Always pass `--cwd` pointing to the app directory containing `.env.local`.

**Detect app dir**: look for `apps/` subdirectory with `I18N_GOOGLE_SHEET_ID` in `.env.local`.

| Invocation | Command |
|------------|---------|
| `/i18n --validate` | `node .claude/skills/web-i18n/scripts/validate.cjs --cwd <app-dir>` |
| `/i18n --push` | two-step flow — see below |
| `/i18n --pull` | `node .claude/skills/web-i18n/scripts/pull.cjs --cwd <app-dir>` |

Pass any extra flags (e.g. `--tab`) through verbatim.

### `--push` Orchestration Flow

**Step 1 — Dry run first:**
```
node .claude/skills/web-i18n/scripts/push.cjs --cwd <app-dir> --dry-run [--tab X]
```

| Exit code | Meaning | Action |
|-----------|---------|--------|
| `0` | Missing keys found | Present list, ask: "Push these N keys?" |
| `1` | Nothing to push | Tell user: "Sheet is up to date." |
| `2` | Config/auth error | Show error, stop |

**Step 2 — If user confirms:**
```
node .claude/skills/web-i18n/scripts/push.cjs --cwd <app-dir> [--tab X]
```

## Sheet Sync References

- `references/pull.md` — `--pull` implementation steps
- `references/push.md` — `--push` implementation steps
- `references/validate.md` — `--validate` implementation steps

### Required Env Vars (`.env.local`)

```bash
I18N_GOOGLE_SHEET_ID=<sheet-id>
I18N_MESSAGES_DIR=<relative-path>
I18N_LOCALES=en,de,fr,it
GOOGLE_SERVICE_ACCOUNT_KEY=<path>    # write ops only (--push)
I18N_SHEET_MODE=tabs                 # "tabs" or "single"
I18N_FALLBACK_SHEET_TAB=Common
```

See `references/i18n-patterns.md` for full env var list and next-intl configuration.

## next-intl Quick Reference

### Translation Usage

| Context | API |
|---------|-----|
| Server Components | `getTranslations('FeatureName')` (async) |
| Client Components | `useTranslations('FeatureName.Dashboard')` |
| Root Layout | `NextIntlClientProvider messages={await getMessages()}` |

### Key Rules

- Import navigation helpers from `navigation.ts` — never `next/link` or `next/navigation`
- Always add translations to ALL locale files
- Use dot notation for nested namespaces: `useTranslations('Feature.Sub')`

See `references/i18n-patterns.md` for full configuration, `i18n.ts`, `navigation.ts`, and namespace structure.

## References

| File | Purpose |
|------|---------|
| `references/i18n-patterns.md` | next-intl config, i18n.ts, navigation.ts, file structure, pluralization |
| `references/pull.md` | Pull script steps |
| `references/push.md` | Push script steps |
| `references/validate.md` | Validate script steps |
