# ThemeColorScheme Convenience Pickers — Full API

## ThemeColorScheme.BasePicker

| Property | Type | Maps To |
|----------|------|---------|
| `.background` | `ThemeColorPicker` | `.background` |
| `.backgroundCGColor` | `ThemeCGColorPicker` | `.background` |
| `.foreground` | `ThemeColorPicker` | `.foreground` |
| `.foregroundCGColor` | `ThemeCGColorPicker` | `.foreground` |
| `.foregroundInverse` | `ThemeColorPicker` | `.foregroundInverse` |
| `.foregroundInverseCGColor` | `ThemeCGColorPicker` | `.foregroundInverse` |
| `.primary` | `ThemeColorPicker` | `.highlightBackground` |
| `.primaryCGColor` | `ThemeCGColorPicker` | `.highlightBackground` |
| `.onPrimary` | `ThemeColorPicker` | `.highlightForeground` |
| `.onPrimaryCGColor` | `ThemeCGColorPicker` | `.highlightForeground` |
| `.border` | `ThemeColorPicker` | `.border` |
| `.borderInverse` | `ThemeColorPicker` | `.borderInverse` |
| `.borderCGColor` | `ThemeCGColorPicker` | `.border` |
| `.borderInverseCGColor` | `ThemeCGColorPicker` | `.borderInverse` |
| `.separator` | `ThemeColorPicker` | `.border` |
| `.separatorInverse` | `ThemeColorPicker` | `.borderInverse` |
| `.transluent` | `ThemeColorPicker` | `ThemeAlphaColorKeyPath.lighten600` |
| `.transluentCGColor` | `ThemeCGColorPicker` | `ThemeAlphaColorKeyPath.lighten600` |
| `.transluentInverse` | `ThemeColorPicker` | `ThemeAlphaColorKeyPath.alternate50` |
| `.transluentInverseCGColor` | `ThemeCGColorPicker` | `ThemeAlphaColorKeyPath.alternate50` |

## ThemeColorScheme.SignalPicker

| Property | Type | Maps To |
|----------|------|---------|
| `.error` | `ThemeColorPicker` | `.error` |
| `.errorCGColor` | `ThemeCGColorPicker` | `.error` |
| `.onError` | `ThemeColorPicker` | `.onError` |
| `.onErrorCGColor` | `ThemeCGColorPicker` | `.onError` |

## ThemeColorScheme.AlternatePicker

| Property | Type | Maps To |
|----------|------|---------|
| `.alternate30` | `ThemeColorPicker` | `ThemeAlphaColorKeyPath.alternate30` |
| `.alternate50` | `ThemeColorPicker` | `ThemeAlphaColorKeyPath.alternate50` |
| `.alternate100` | `ThemeColorPicker` | `ThemeAlphaColorKeyPath.alternate100` |

## ThemePicker Static Shortcuts

| Property | Equivalent |
|----------|------------|
| `.background` | `ThemeColorScheme.BasePicker.background` |
| `.foreground` | `ThemeColorScheme.BasePicker.foreground` |
| `.shadowSmall` | `ThemeColorPicker(themeKey: .shadowSmall)` |
| `.shadowMedium` | `ThemeColorPicker(themeKey: .shadowMedium)` |
| `.shadowLarge` | `ThemeColorPicker(themeKey: .shadowLarge)` |

## Typealiases

```swift
ThemeBaseColorPicker      = ThemeColorScheme.BasePicker
ThemeSignalColorPicker    = ThemeColorScheme.SignalPicker
ThemeAlternateColorPicker = ThemeColorScheme.AlternatePicker
```

## Clear Constants

```swift
ThemeColorPicker.clear    // "#00000000" all 4 modes
ThemeCGColorPicker.clear  // "#00000000" all 4 modes
ThemeColorScheme.clear    // same
```
