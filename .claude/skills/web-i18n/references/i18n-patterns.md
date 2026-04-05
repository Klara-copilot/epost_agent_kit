# i18n Patterns — next-intl Configuration

## Full Env Vars (`.env.local`)

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
| `env-config.cjs` | Read + validate `I18N_*` env vars from `.env.local` |
| `sheets-client.cjs` | Google Sheets API auth, read, append, list tabs |
| `key-converter.cjs` | `Namespace::Key` ↔ `{ Namespace: { Key: value } }` |
| `tab-resolver.cjs` | Key namespace → sheet tab name (tabs mode) |
| `validate.cjs` | Detect missing, orphaned, untranslated keys (read-only) |
| `pull.cjs` | Fetch from sheet → write `messages/*.json` (read-only) |
| `push.cjs` | Detect new code keys → append rows with EN pre-filled |
