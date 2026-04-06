# i18n Patterns — next-intl Configuration

## Configuration

All i18n settings go in `.epost-kit.json` at the project root (committed to git).
Only `GOOGLE_SERVICE_ACCOUNT_KEY` stays in `.env.local` (gitignored).

**`.epost-kit.json` — `i18n` section:**

```json
{
  "i18n": {
    "googleSheetId": "1MYcD7ktAy1tx6bERwgWyp8OR-RIj8YSUNcXPwwiR_QQ",
    "messagesDir": "<relative-path-to-messages-dir>",
    "locales": ["en", "de", "fr", "it"],

    "resultSheetTab": "Result",
    "keySeparator": "::",
    "localeMap": "en:en,de_CH:de,fr_CH:fr,it_CH:it",

    "sheetMode": "tabs",
    "fallbackSheetTab": "Common"
  }
}
```

**Single-tab mode extras** (add to `i18n` object):
```json
{
  "sheetMode": "single",
  "sheetTab": "Sheet1",
  "projectColumn": "PROJECT",
  "projectValue": "my_project"
}
```

**`.env.local`** (gitignored — override for write ops):
```bash
GOOGLE_SERVICE_ACCOUNT_KEY=.secrets/google-sa.json
```

### Field Reference

| Field | Required | Default | Notes |
|-------|----------|---------|-------|
| `googleSheetId` | Yes | — | Google Sheet ID |
| `messagesDir` | Yes | — | Relative path to messages dir |
| `locales` | Yes | — | Array or comma-string |
| `localeMap` | No | — | Sheet column → JSON filename mapping |
| `resultSheetTab` | No | `Result` | Tab containing translated values |
| `keySeparator` | No | `::` | Key namespace separator |
| `sheetMode` | No | `tabs` | `tabs` or `single` |
| `fallbackSheetTab` | No | `Common` | tabs mode: fallback tab |
| `sheetTab` | single mode | — | Tab name for single mode |
| `projectColumn` | single mode | — | Filter column name |
| `projectValue` | single mode | — | Filter value |

## next-intl Configuration

```typescript
// middleware.ts or config file
export const locales = ['en', 'de', 'fr', 'it'];
export const defaultLocale = 'en';
```

## i18n.ts

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

## navigation.ts — Always Import From Here

<!-- next-intl v3.15.0: createSharedPathnamesNavigation is deprecated in favor of createNavigation
     but the project intentionally uses it for shared pathnames routing. Do not migrate without team decision. -->
```typescript
import { createSharedPathnamesNavigation } from 'next-intl/navigation';

export const locales = ['en', 'de', 'fr', 'it'];
export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales });
```

**Import `Link`, `redirect`, `usePathname`, `useRouter` from `navigation.ts`** — NOT `next/link` or `next/navigation`.

## Server Component Usage

```typescript
import { getTranslations } from 'next-intl/server';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations('FeatureName');
  return { title: t('title') + ' - MyApp' };
};
```

## Client Component Usage

```typescript
'use client';
import { useTranslations } from 'next-intl';

export function FeatureCard() {
  const t = useTranslations('FeatureName.Dashboard');
  return <Button label={t('submit')} />;
}
```

## Root Layout — Message Injection

```typescript
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

const messages = await getMessages();
<NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
```

## Translation File Structure

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

## Scripts Reference

| Script | Purpose |
|--------|---------|
| `env-config.cjs` | Read + validate i18n config from `.epost-kit.json` |
| `sheets-client.cjs` | Google Sheets API auth, read, append, list tabs |
| `key-converter.cjs` | `Namespace::Key` ↔ `{ Namespace: { Key: value } }` |
| `tab-resolver.cjs` | Key namespace → sheet tab name (tabs mode) |
| `validate.cjs` | Detect missing, orphaned, untranslated keys (read-only) |
| `pull.cjs` | Fetch from sheet → write `messages/*.json` (read-only) |
| `push.cjs` | Detect new code keys → append rows with EN pre-filled |
