---
name: web-analytic-gtm-setup-patterns
description: "GTM initialization patterns for different web frameworks"
user-invocable: false
disable-model-invocation: true
---

# GTM Setup Patterns — Framework Reference

## Core Principle
Initialize GTM **exactly once** at the app root. Never initialize in feature components, page components, or shared UI library code.

Each project uses its own GTM Container ID — store it in environment config, never hardcode in shared library code.

---

## Next.js 14 (App Router)

**Package**: `@next/third-parties/google`

```tsx
// app/[locale]/layout.tsx — root layout only
import { GoogleTagManager } from '@next/third-parties/google';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID!} />
        {children}
      </body>
    </html>
  );
}
```

**env config:**
```bash
# .env.local
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

`@next/third-parties/google` automatically injects:
- GTM `<script>` tag in `<head>`
- GTM `<noscript>` iframe in `<body>`

---

## Next.js 14 (Pages Router)

```tsx
// pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document';
import { GoogleTagManager } from '@next/third-parties/google';

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID!} />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

---

## Vite / React SPA

```html
<!-- index.html — <head> section -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
```

```html
<!-- index.html — immediately after <body> -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
```

---

## Remix

```tsx
// app/root.tsx
import { Scripts } from '@remix-run/react';

export default function App() {
  const gtmId = process.env.GTM_ID;
  return (
    <html>
      <head>
        {gtmId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){...})(window,document,'script','dataLayer','${gtmId}');`
            }}
          />
        )}
      </head>
      <body>
        {gtmId && (
          <noscript>
            <iframe src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0" width="0" style={{ display: 'none', visibility: 'hidden' }} />
          </noscript>
        )}
        <Scripts />
      </body>
    </html>
  );
}
```

---

## Manual dataLayer Push (all frameworks)

When GTM triggers need explicit data alongside DOM attribute detection:

```typescript
// utils/analytics.ts
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

export const pushEvent = (eventName: string, data?: Record<string, unknown>) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...data });
};
```

```tsx
// Usage — only when DOM attribute detection is insufficient
import { pushEvent } from '@/utils/analytics';

const handleSubmit = () => {
  pushEvent('form_submit', { feature: 'my-feature-dialog', step: 'confirm' });
};
```

> **Note**: Explicit `dataLayer.push` is rarely needed. GTM CSS attribute selectors on `theme-ui-label` and `ga-data-group` handle most use cases automatically.
