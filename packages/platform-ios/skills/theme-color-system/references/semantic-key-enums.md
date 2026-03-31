# Semantic Key Enums — Full Case Listings

## ThemeBaseColorKeyPath (16 cases)

| Case | Raw Value | Use |
|------|-----------|-----|
| `.background` | `color-base-background` | View backgrounds |
| `.backgroundInverse` | `color-base-background-inverse` | Inverse backgrounds |
| `.foreground` | `color-base-foreground` | Text, icons |
| `.foregroundInverse` | `color-base-foreground-inverse` | Inverse text |
| `.highlightBackground` | `color-base-highlight-background` | Primary/brand accent bg |
| `.highlightForeground` | `color-base-highlight-foreground` | Primary/brand accent fg |
| `.translucent` | `color-base-translucent` | Semi-transparent overlay |
| `.translucentInverse` | `color-base-translucent-inverse` | Inverse overlay |
| `.border` | `color-base-border` | Borders, strokes |
| `.borderInverse` | `color-base-border-inverse` | Inverse borders |
| `.separator` | `color-base-separator` | List dividers |
| `.separatorInverse` | `color-base-separator-inverse` | Inverse dividers |
| `.blurBackground` | `color-base-blur-background` | Blur effect bg |
| `.shadowSmall` | `color-base-shadow-small` | Small shadow |
| `.shadowMedium` | `color-base-shadow-medium` | Medium shadow |
| `.shadowLarge` | `color-base-shadow-large` | Large shadow |

## ThemeSignalColorKeyPath (8 cases)

| Case | Raw Value |
|------|-----------|
| `.error` | `color-signal-error` |
| `.onError` | `color-signal-on-error` |
| `.info` | `color-signal-info` |
| `.onInfo` | `color-signal-on-info` |
| `.success` | `color-signal-success` |
| `.onSuccess` | `color-signal-on-success` |
| `.warning` | `color-signal-warning` |
| `.onWarning` | `color-signal-on-warning` |

## ThemeComponentColorKeyPath (4 cases)

| Case | Maps To |
|------|---------|
| `.statePressed` | `ThemeAlphaColorKeyPath.alternate100` |
| `.statePressedInverse` | `ThemeAlphaColorKeyPath.alternateInverse100` |
| `.stateFocus` | `ThemeBaseColorKeyPath.foreground` |
| `.stateFocusInverse` | `ThemeBaseColorKeyPath.background` |

## ThemeAlphaColorKeyPath (60 cases)

4 groups x 15 levels each: `00, 30, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 970, 1000`

| Group | Prefix | Example |
|-------|--------|---------|
| **Lighten** | `color-alpha-lighten-` | `.lighten300` |
| **Darken** | `color-alpha-darken-` | `.darken500` |
| **Alternate** | `color-alpha-alternate-` | `.alternate100` |
| **Alternate Inverse** | `color-alpha-alternate-inverse-` | `.alternateInverse50` |

Higher number = more opaque. `00` = fully transparent, `1000` = fully opaque.
