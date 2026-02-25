---
name: a11y-headings
description: Heading structure accessibility — semantics heading(), heading hierarchy, TalkBack rotor navigation
---

# Heading Accessibility Rules

## Purpose

Accessibility rules for heading structure and navigation in Jetpack Compose, ensuring TalkBack users can efficiently navigate content using heading navigation.

## Table of Contents

- [Heading Structure](#heading-structure)
- [Heading Levels](#heading-levels)
- [Heading Labels](#heading-labels)
- [Navigation](#navigation)
- [Dynamic Headings](#dynamic-headings)
- [Best Practices](#best-practices)

## Related Documents

- [a11y-core](./a11y-core.md) - Core accessibility principles
- [a11y-forms](./a11y-forms.md) - Form accessibility
- [a11y-focus](./a11y-focus.md) - Focus management

## Heading Structure

### Heading Semantics

**Use `semantics { heading() }` to mark headings:**

```kotlin
// ✅ Heading with semantics
Text(
    text = "Settings",
    style = MaterialTheme.typography.headlineMedium,
    modifier = Modifier.semantics { heading() }
)
// TalkBack reads: "Settings, Heading"

// ✅ Composable extension for convenience
fun Modifier.asHeading(): Modifier = this.semantics { heading() }

Text(
    "Account",
    modifier = Modifier.asHeading()
)
```

### Heading Hierarchy

**Maintain logical hierarchy:**
- Use one main heading (H1-level) per screen
- Use section headings (H2-level) for major areas
- Use subsection headings (H3-level) for nested areas
- Don't skip levels

```kotlin
// ✅ Proper hierarchy
Column {
    // Screen title — H1 equivalent
    Text(
        "User Profile",
        style = MaterialTheme.typography.headlineLarge,
        modifier = Modifier.semantics { heading() }
    )

    // Section — H2 equivalent
    Text(
        "Personal Information",
        style = MaterialTheme.typography.titleLarge,
        modifier = Modifier.semantics { heading() }
    )

    // Subsection — H3 equivalent
    Text(
        "Contact Details",
        style = MaterialTheme.typography.titleMedium,
        modifier = Modifier.semantics { heading() }
    )
}
```

## Heading Levels

### Material 3 Typography as Heading Levels

**Suggested typography → heading level mapping:**

| Typography Style | Heading Level |
|-----------------|--------------|
| `headlineLarge` / `displaySmall` | H1 (one per screen) |
| `headlineMedium` / `titleLarge` | H2 (major sections) |
| `headlineSmall` / `titleMedium` | H3 (subsections) |
| `titleSmall` | H4+ (deeper nesting) |

```kotlin
// ✅ Screen with clear heading hierarchy
@Composable
fun SettingsScreen() {
    LazyColumn {
        item {
            Text(
                "Settings",
                style = MaterialTheme.typography.headlineLarge,
                modifier = Modifier.semantics { heading() }
            )
        }
        item {
            Text(
                "Account",
                style = MaterialTheme.typography.titleLarge,
                modifier = Modifier.semantics { heading() }
            )
        }
        // Account settings items...
        item {
            Text(
                "Privacy",
                style = MaterialTheme.typography.titleLarge,
                modifier = Modifier.semantics { heading() }
            )
        }
        // Privacy settings items...
    }
}
```

## Heading Labels

### Label Guidelines

**Heading label rules:**
- Should be concise and descriptive
- Match visible text — don't add extra contentDescription
- Don't include "heading" in the label itself
- Use sentence case

```kotlin
// ✅ Good heading labels — text matches visible content
Text("Settings", modifier = Modifier.semantics { heading() })
Text("Account Information", modifier = Modifier.semantics { heading() })
Text("Privacy Settings", modifier = Modifier.semantics { heading() })

// ❌ Bad: Don't add explicit contentDescription that conflicts with text
Text(
    "Settings",
    modifier = Modifier.semantics {
        heading()
        contentDescription = "Settings heading" // Redundant and verbose
    }
)
```

### Dynamic Headings

**Update headings when content changes:**

```kotlin
// ✅ Dynamic section heading
@Composable
fun SectionHeader(title: String) {
    Text(
        text = title,
        style = MaterialTheme.typography.titleLarge,
        modifier = Modifier.semantics { heading() }
    )
}

// Usage
SectionHeader(title = currentSection)
```

## Navigation

### TalkBack Heading Navigation

**TalkBack heading navigation:**
- Users swipe with one finger to navigate headings in the TalkBack Rotor
- Headings provide quick content overview
- Essential for long-form content and settings screens

```kotlin
// ✅ Screen with heading navigation
@Composable
fun ProfileScreen() {
    LazyColumn {
        item {
            Text(
                "Profile",
                style = MaterialTheme.typography.headlineLarge,
                modifier = Modifier
                    .padding(16.dp)
                    .semantics { heading() }
            )
        }
        item {
            Text(
                "Personal Info",
                style = MaterialTheme.typography.titleLarge,
                modifier = Modifier
                    .padding(horizontal = 16.dp)
                    .semantics { heading() }
            )
        }
        // Personal info fields...
        item {
            Text(
                "Preferences",
                style = MaterialTheme.typography.titleLarge,
                modifier = Modifier
                    .padding(horizontal = 16.dp)
                    .semantics { heading() }
            )
        }
        // Preference items...
    }
}
```

## Dynamic Headings

### Content Updates

**Update headings when content changes:**

```kotlin
// ✅ Dynamic content with heading
@Composable
fun SearchResults(query: String, resultCount: Int) {
    Column {
        Text(
            "Results for \"$query\" ($resultCount found)",
            style = MaterialTheme.typography.titleLarge,
            modifier = Modifier.semantics {
                heading()
                // liveRegion announces update when count changes
                liveRegion = LiveRegionMode.Polite
            }
        )
        // results...
    }
}
```

### Conditional Headings

**Show/hide headings based on state:**

```kotlin
// ✅ Conditionally shown heading
AnimatedVisibility(visible = hasResults) {
    Text(
        "Search Results",
        modifier = Modifier.semantics { heading() }
    )
}
```

## Best Practices

### Heading Checklist

**Every screen should have:**
- ✅ At least one heading (screen title)
- ✅ Logical heading hierarchy (no skipped levels)
- ✅ `semantics { heading() }` on all visual headings
- ✅ Headings match visible text
- ✅ Consistent typography styles for each heading level

### Common Patterns

**Settings:** H1 for screen title, H2 for sections (Account, Privacy, Notifications). **Forms:** H1 for form title, H2 for form sections.

### Anti-patterns

**Don't:** Use `heading()` for non-heading content, skip heading levels, use more than one H1-equivalent per screen, make decorative text a heading, use headings for interactive elements without also setting a role.

### Best Practices Summary

**Heading Rules:**
- ✅ Use `semantics { heading() }` for all visual headings
- ✅ Maintain logical hierarchy — one main heading per screen
- ✅ Typography style signals heading level consistently
- ✅ Headings match visible text (no need for separate contentDescription)
- ✅ Update headings when dynamic content changes
- ✅ Test with TalkBack heading navigation (rotor → Headings)
- ✅ All heading text is localized
