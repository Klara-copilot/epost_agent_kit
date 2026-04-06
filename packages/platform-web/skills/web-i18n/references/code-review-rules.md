---
name: web-i18n-code-review-rules
description: "ePost next-intl i18n code review rules — I18N category"
user-invocable: false
disable-model-invocation: true
---

# Web i18n Code Review Rules

ePost-specific internationalization rules. Loaded by code-review skill when reviewing components or pages with user-facing strings.

**Scope**: next-intl usage, locale completeness, navigation imports, namespace conventions in ePost web app.

---

## I18N: Internationalization

**Scope**: All user-facing strings and navigation in ePost Next.js app using next-intl.

| Rule ID | Rule | Severity | Pass | Fail |
|---------|------|----------|------|------|
| I18N-001 | No hardcoded user-facing strings — all text via `useTranslations` / `getTranslations` | high | `const t = useTranslations('Inbox'); return <h1>{t('title')}</h1>` | `<h1>Inbox</h1>` or `<Button>Submit</Button>` with literal string |
| I18N-002 | Import navigation utilities from `@/navigation` — never from `next/link` or `next/navigation` directly | high | `import { Link, useRouter } from '@/navigation'` | `import Link from 'next/link'` or `import { useRouter } from 'next/navigation'` |
| I18N-003 | New translation keys added to ALL locale files simultaneously — not just `en` | high | PR adds key to `en.json`, `fr.json`, and all other supported locales | PR adds key only to `en.json`; other locales show missing-key fallback |
| I18N-004 | Use dot notation for nested namespaces: `useTranslations('Feature.Sub')` | medium | `useTranslations('Inbox.Compose')` for nested translation scope | Flat key: `useTranslations('InboxCompose')` when nesting exists in JSON |
| I18N-005 | Server Components use `getTranslations` (async), Client Components use `useTranslations` (sync hook) | medium | `const t = await getTranslations('Page')` in async Server Component | `useTranslations` called inside async Server Component (hook context mismatch) |

---

## Lightweight vs Escalated

| Rule IDs | Lightweight (default) | Escalated only |
|----------|-----------------------|----------------|
| I18N-001–003 | Yes | — |
| I18N-004–005 | — | Yes |

**Lightweight**: Run on all component and page files. **Escalated**: Activate on i18n config changes or new locale additions.

## Extending

Add rules following the ID pattern: `I18N-{NNN}`. Keep severity scale consistent with cross-cutting rules.
