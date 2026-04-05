# Launchpad Workflow — Execution Details

## Step 2 — Build

Apply `craft-principles.md` throughout.

### Drama Through Contrast
- **Scale**: Hero 6rem, body 1rem — dramatic jumps, not gradual steps
- **Color**: One element demands attention, everything else supports
- **Pace**: Dense sections → breathing room → fast reveals → slow moments
- **Motion**: Static elements make animated elements matter

### Sections as Chapters
- **Hero**: The promise. What world are we entering?
- **Problem/Stakes**: Why does this matter?
- **Solution**: How does this change things?
- **Proof**: Why should I believe you?
- **Action**: What do I do now?

### Typography
```jsx
// Hero — massive, commanding
className="text-[clamp(3rem,8vw,6rem)] font-display font-black tracking-tight leading-[0.9]"
// Display — section headers
className="text-[clamp(2rem,5vw,4rem)] font-display font-bold tracking-tight"
// Body — readable, comfortable
className="text-lg md:text-xl text-ink-muted leading-relaxed max-w-2xl"
```

### Brand Tokens (Tailwind config)
```js
colors: {
  brand: { DEFAULT: 'var(--brand)', dark: 'var(--brand-dark)', light: 'var(--brand-light)' },
  surface: { DEFAULT: 'var(--surface)', alt: 'var(--surface-alt)' },
  ink: { DEFAULT: 'var(--ink)', muted: 'var(--ink-muted)' },
  accent: 'var(--accent)',
}
```

### Spacing (Generous)
```
Section padding:    py-24 md:py-32 lg:py-40
Between elements:   space-y-6 to space-y-12
Container:          max-w-7xl mx-auto px-6
```

## Avoid

- Purple-to-blue gradients (clearest sign of AI-generated)
- Floating blobs and abstract shapes
- Inter/Roboto for headlines (no personality)
- Centered everything (no tension)
- Feature grids with generic icons
- "Clean and modern" (means nothing)
- Multiple competing CTAs
- Same section rhythm (predictable = forgettable)
- Bright saturated neon colors (prefer sophisticated, muted tones)
