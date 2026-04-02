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
| `--push` | Detect new keys in code not in Sheet → append rows with EN only (other locales empty for translators) |
| `--validate` | Report missing, orphaned, and untranslated keys (exit 1 on missing) |
| `--tab <Name>` | Scope `--validate` / `--push` to a single sheet tab/namespace (e.g. `--tab Monitoring`) |
| *(no flag)* | Show status: untranslated count, key drift, last messages dir mtime |

## Execution

When this skill is invoked with a flag, run the corresponding script. Always pass `--cwd` pointing to the app directory that contains `.env.local` and the source code.

**Detect app dir**: look for the directory under `apps/` that contains `.env.local` with `I18N_GOOGLE_SHEET_ID` set (e.g. `apps/luz-epost`).

| Invocation | Command |
|------------|---------|
| `/i18n --validate` | `node .claude/skills/web-i18n/scripts/validate.cjs --cwd <app-dir>` |
| `/i18n --validate --tab Monitoring` | `node .claude/skills/web-i18n/scripts/validate.cjs --cwd <app-dir> --tab Monitoring` |
| `/i18n --push` | two-step flow — see `--push` orchestration below |
| `/i18n --push --tab Monitoring` | two-step flow with `--tab Monitoring` |
| `/i18n --pull` | `node .claude/skills/web-i18n/scripts/pull.cjs --cwd <app-dir>` |
| `/i18n --pull --tab Monitoring` | `node .claude/skills/web-i18n/scripts/pull.cjs --cwd <app-dir> --tab Monitoring` |

Pass any extra flags (e.g. `--tab`) through verbatim to the script.

### `--push` Orchestration Flow

Never run `push.cjs` directly. Always use this two-step flow:

**Step 1 — Detect (always first):**
```
node .claude/skills/web-i18n/scripts/push.cjs --cwd <app-dir> --dry-run [--tab X]
```

**Step 2 — Interpret exit code:**

| Exit code | Meaning | Action |
|-----------|---------|--------|
| `0` | Missing keys found — dry-run output shows them | Present list to user, ask: "Push these N keys?" |
| `1` | Nothing to push | Tell user: "Sheet is up to date. Add translation keys in code first, then run `/i18n --push` again." |
| `2` | Config/auth error | Show error, stop |

**Step 3 — If user confirms:**
```
node .claude/skills/web-i18n/scripts/push.cjs --cwd <app-dir> [--tab X]
```

**Step 3 — If user declines:** Do nothing. Keys stay in code only.

## Sheet Sync Workflows

See references for detailed step-by-step workflows:
- `references/pull.md` — `--pull` implementation steps
- `references/push.md` — `--push` implementation steps
- `references/validate.md` — `--validate` implementation steps

### Env Vars (read from project's `.env.local`)

```bash
# Required
I18N_GOOGLE_SHEET_ID=<sheet-id>
I18N_MESSAGES_DIR=<relative-path-to-messages-dir>
I18N_LOCALES=en,de,fr,it

# Write ops only (--push)
GOOGLE_SERVICE_ACCOUNT_KEY=<path-to-service-account-json>

# Sheet structure
I18N_RESULT_SHEET_TAB=Result
I18N_KEY_SEPARATOR=::
I18N_LOCALE_MAP=en:en,de:de,fr:fr,it:it   # Sheet column header → JSON filename

# Sheet mode (choose one)
I18N_SHEET_MODE=tabs                        # "tabs" or "single"
I18N_FALLBACK_SHEET_TAB=Common             # tabs mode: fallback tab
# I18N_SHEET_TAB=Sheet1                    # single mode: tab name
# I18N_PROJECT_COLUMN=PROJECT              # single mode: filter column
# I18N_PROJECT_VALUE=my_project            # single mode: filter value
```

### Scripts

| Script | Purpose |
|--------|---------|
| `env-config.cjs` | Read + validate `I18N_*` env vars from `.env.local` |
| `sheets-client.cjs` | Google Sheets API auth, read, append, list tabs |
| `key-converter.cjs` | `Namespace::Key` ↔ `{ Namespace: { Key: value } }` |
| `tab-resolver.cjs` | Key namespace → sheet tab name (tabs mode) |
| `validate.cjs` | Detect missing, orphaned, and untranslated keys (read-only, no auth needed) |
| `pull.cjs` | Fetch translations from sheet source tabs → write `messages/*.json` (read-only, no auth needed) |
| `push.cjs` | Detect new code keys not in sheet → append rows with EN pre-filled (requires `GOOGLE_SERVICE_ACCOUNT_KEY`) |

---

## next-intl Patterns

### Configuration

```typescript
export const locales = ['en', ...]; // supported locales
export const defaultLocale = 'en';
```

### i18n.ts

```typescript
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from './middleware';

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) notFound();
  return {
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
```

### navigation.ts — ALWAYS Import From Here

```typescript
import { createSharedPathnamesNavigation } from 'next-intl/navigation';
export const locales = ['en', ...];
export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales });
```

**Import `Link`, `redirect`, `usePathname`, `useRouter` from `navigation.ts`** — NOT `next/link` or `next/navigation`.

## Translation Usage

### Server Components

```typescript
import { getTranslations } from 'next-intl/server';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations('FeatureName');
  return { title: t('title') + ' - MyApp' };
};
```

### Client Components

```typescript
'use client';
import { useTranslations } from 'next-intl';

export function FeatureCard() {
  const t = useTranslations('FeatureName.Dashboard');
  return <Button label={t('submit')} />;
}
```

### Message Injection (Root Layout)

```typescript
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
const messages = await getMessages();
<NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
```

## Translation Files

```
messages/
├── en.json
├── de.json
└── ...
```

### Namespace Structure

```json
{
  "FeatureName": {
    "title": "Feature Name",
    "Table": { "recipient": "Recipient" },
    "Button": { "submit": "Submit" }
  }
}
```

## Rules

- Import navigation helpers from `navigation.ts` — never `next/link` or `next/navigation`
- Always add translations to ALL locale files
- Use `getTranslations` in Server Components, `useTranslations` in Client Components
- Use dot notation for nested namespace access: `useTranslations('Feature.Sub')`
