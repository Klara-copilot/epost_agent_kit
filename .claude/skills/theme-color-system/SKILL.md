---
name: theme-color-system
description: "Use when setting colors on UIView/UILabel/UIButton/CALayer in ios_theme_ui — background, text, border, tint, shadow. Provides ThemeColorPicker API, semantic key enums, ThemeColorScheme pickers."
metadata:
  keywords:
    - color
    - theme
    - uiview
    - uilabel
    - uibutton
    - ios-theme
  triggers:
    - set background color
    - UIView color
    - apply theme color
    - ThemeColorPicker
---

# Theme Color System

Set colors dynamically using `ThemeColorPicker` so views auto-update across 4 theme modes (dark/light/brand-positive/brand-negative). Never use raw `UIColor` directly.

## Quick API — Setting Colors on Views

```swift
// Background
view.setBackgroundColor(picker: ThemeColorPicker(themeKey: .background))

// Text (UILabel, UIButton, UITextView, UITextField)
label.setTextColor(picker: ThemeColorPicker(themeKey: .foreground))

// Border (UIView → delegates to CALayer)
view.setBorderColor(picker: ThemeColorPicker(themeKey: .border))

// Tint (icons, images)
imageView.setTintColor(picker: ThemeColorPicker(themeKey: .foreground))

// Alpha
view.setAlpha(picker: ThemeCGFloatPicker(...))
```

## Convenience Pickers (preferred shorthand)

```swift
ThemeColorScheme.BasePicker.background         // .background
ThemeColorScheme.BasePicker.foreground         // .foreground
ThemeColorScheme.BasePicker.foregroundInverse  // .foregroundInverse
ThemeColorScheme.BasePicker.primary            // .highlightBackground
ThemeColorScheme.BasePicker.onPrimary          // .highlightForeground
ThemeColorScheme.BasePicker.border             // .border
ThemeColorScheme.BasePicker.borderInverse      // .borderInverse
ThemeColorScheme.BasePicker.transluent         // alpha lighten600

ThemeColorScheme.SignalPicker.error / .onError
ThemeColorScheme.AlternatePicker.alternate30 / .alternate50 / .alternate100
```

Typealiases: `ThemeBaseColorPicker`, `ThemeSignalColorPicker`, `ThemeAlternateColorPicker`

## Constructing Pickers

Build from semantic key enums (auto-resolves per theme mode):

```swift
ThemeColorPicker(themeKey: ThemeBaseColorKeyPath)       // 16 keys
ThemeColorPicker(themeKey: ThemeSignalColorKeyPath)     // 8 keys
ThemeColorPicker(themeKey: ThemeAlphaColorKeyPath)      // 60 keys
ThemeColorPicker(themeKey: ThemeComponentColorKeyPath)  // 4 keys
```

For CALayer properties, use `ThemeCGColorPicker(themeKey:)` variant.

## CALayer Colors

```swift
layer.setBorderColor(picker: ThemeCGColorPicker(themeKey: .border))
layer.setShadowColor(picker: ThemeCGColorPicker(themeKey: .shadowMedium))
layer.setBackgroundColor(picker: ThemeCGColorPicker(themeKey: .background))
layer.setStrokeColor(picker: ThemeCGColorPicker(...))
layer.setFillColor(picker: ThemeCGColorPicker(...))
layer.setBorderWidth(picker: ThemeCGFloatPicker(...))
```

## Component ColorScheme Pattern

When creating new components, define a `ThemeColorScheme` extension:

```swift
extension ThemeColorScheme {
    public enum MyComponentPicker {
        public static let bg   = ThemeColorPicker(themeKey: .background)
        public static let text = ThemeColorPicker(themeKey: .foreground)
        public static let border = ThemeCGColorPicker(themeKey: .border)
    }
}
// Usage:
theme_backgroundColor      = ThemeColorScheme.MyComponentPicker.bg
titleLabel.pickerTextColor  = ThemeColorScheme.MyComponentPicker.text
layer.pickerBorderColor     = ThemeColorScheme.MyComponentPicker.border
```

## Rules

1. **Always use `ThemeColorPicker(themeKey:)` or `ThemeColorScheme.*Picker.*`** — never hardcode hex
2. Use `ThemeCGColorPicker` for CALayer properties (border, shadow, stroke, fill)
3. Use `ThemeColorPicker` for UIView/UILabel/UIButton properties
4. Define component-specific pickers as `ThemeColorScheme` extensions
5. Use `.setBackgroundColor(picker:)` / `.setTextColor(picker:)` / `.setBorderColor(picker:)` methods

## Deprecated Pattern (avoid)

```swift
// DEPRECATED — direct property assignment. Use setter methods instead.
view.theme_backgroundColor = picker
label.pickerTextColor = picker
layer.pickerBorderColor = picker
```

## References

- `references/semantic-key-enums.md` — Full enum case listings for all 4 KeyPath types
- `references/color-scheme-pickers.md` — Complete ThemeColorScheme.BasePicker/SignalPicker/AlternatePicker API

## Security

- This skill handles color system APIs within ios_theme_ui only
- Does NOT handle brand data JSON, BrandingService, or theme switching logic
- Never expose internal brand JSON key paths to consumer apps
