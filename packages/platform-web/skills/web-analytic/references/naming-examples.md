---
name: web-analytic-naming-examples
description: "ga-data-group and theme-ui-label naming examples by feature type"
user-invocable: false
disable-model-invocation: true
---

# Naming Examples — GA/GTM Attributes

## `theme-ui-label` — UI Library Components

Format: `kebab-case` of the component name, no suffix.

| Component name | Value |
|---------------|-------|
| `Button` | `button` |
| `ButtonIcon` | `button-icon` |
| `ButtonBar` | `button-bar` |
| `ButtonGroup` | `button-group` |
| `Dialog` | `dialog` |
| `DataTable` | `data-table` |
| `DatePicker` | `date-picker` |
| `FilterButton` | `filter-button` |
| `FilterBar` | `filter-bar` |
| `FloatingActionBar` | `floating-action-bar` |
| `NotificationBadge` | `notification-badge` |
| `SegmentedControl` | `segmented-control` |
| `ContextMenu` | `context-menu` |
| `ColorPicker` | `color-picker` |
| `FileUploadArea` | `file-upload-area` |
| `ProgressBar` | `progress-bar` |
| `ScrollPanel` | `scroll-panel` |

---

## `ga-data-group` — App Feature Boundaries

Format: `[feature-name]-[ui-type]` in `kebab-case`.

### UI type suffixes

| Boundary component | Suffix to use |
|-------------------|---------------|
| `<Dialog` | `-dialog` |
| `<RightSidebar` | `-sidebar` |
| `<MenuSidebar` | `-sidebar` |
| `<BottomBar` | `-bar` or `-panel` |
| Route `page.tsx` | `-content` or `-page` |
| Layout wrapper | `-content` or `-layout` |

### Examples by feature domain

**Inbox / Mail:**
| Feature | Value |
|---------|-------|
| Mail composer dialog | `mail-composer-dialog` |
| Email detail sidebar | `email-detail-sidebar` |
| Mail list page | `mail-list-content` |
| Draft delete confirmation | `draft-delete-dialog` |

**Communities / Chat:**
| Feature | Value |
|---------|-------|
| Chat settings sidebar | `chat-setting-sidebar` |
| Invitation dialog | `invitation-dialog` |
| Channel creation dialog | `channel-create-dialog` |
| Chat content layout | `communication-chat-content` |

**Document / Upload:**
| Feature | Value |
|---------|-------|
| Upload dialog | `upload-dialog` |
| File preview sidebar | `file-preview-sidebar` |
| Document detail page | `document-detail-content` |

**Settings / Organization:**
| Feature | Value |
|---------|-------|
| Team members page | `team-members-content` |
| Location settings page | `location-settings-content` |
| Profile edit dialog | `profile-edit-dialog` |

**Common patterns:**
| Feature | Value |
|---------|-------|
| Error dialog | `error-dialog` |
| Confirm delete dialog | `confirm-delete-dialog` |
| Contact view sidebar | `contact-view-sidebar` |
| Create contact dialog | `create-contact-dialog` |

---

## Naming Anti-Patterns

| ❌ Wrong | ✅ Correct | Rule violated |
|---------|-----------|--------------|
| `uploadDialog` | `upload-dialog` | camelCase |
| `upload_dialog` | `upload-dialog` | underscore |
| `Upload-Dialog` | `upload-dialog` | uppercase |
| `dialog-upload` | `upload-dialog` | wrong order (type first) |
| `upload` | `upload-dialog` | missing ui-type |
| `myFeatureMailComposerDialog` | `mail-composer-dialog` | too verbose, skip feature prefix if obvious |
| `dlg1` | `confirm-delete-dialog` | not self-documenting |

---

## How to Derive a New Value

1. Identify the feature name from the file path:
   ```
   app/[locale]/(auth)/[FEATURE]/_components/[FILE].tsx
                         ↑ use this
   ```

2. Identify the ui-type from the boundary component used:
   ```
   imports Dialog → -dialog
   imports RightSidebar → -sidebar
   page.tsx → -content
   ```

3. Combine: `[feature]-[ui-type]`
   ```
   communities + dialog = communities-invite-dialog
   monitoring  + sidebar = monitoring-detail-sidebar
   ```

4. **Confirm with Data/Marketing team before deploying** — they need to wire GTM triggers to match.
