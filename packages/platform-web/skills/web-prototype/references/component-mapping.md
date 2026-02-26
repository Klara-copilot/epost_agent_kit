# Component Mapping Guide

## Common HTML -> klara-theme

| HTML/Generic | klara-theme Component | Import |
|-------------|----------------------|--------|
| `<button>` | `Button` | `@luz-next/klara-theme` |
| `<input type="text">` | `Input` | `@luz-next/klara-theme` |
| `<input type="checkbox">` | `Checkbox` | `@luz-next/klara-theme` |
| `<select>` | `Select` | `@luz-next/klara-theme` |
| `<textarea>` | `TextArea` | `@luz-next/klara-theme` |
| `<dialog>` | `Dialog` | `@luz-next/klara-theme` |
| `<table>` | `DataTable` | `@luz-next/klara-theme` |
| `<nav>` tabs | `Tabs` + `TabsList` + `TabsContent` | `@luz-next/klara-theme` |
| `<details>` | `Accordion` | `@luz-next/klara-theme` |
| Toast/notification | `Toast` | `@luz-next/klara-theme` |
| Tooltip | `Tooltip` | `@luz-next/klara-theme` |
| Dropdown menu | `DropdownMenu` | `@luz-next/klara-theme` |
| Breadcrumb | `Breadcrumb` | `@luz-next/klara-theme` |
| Badge | `Badge` | `@luz-next/klara-theme` |
| Avatar | `Avatar` | `@luz-next/klara-theme` |
| Card | `Card` | `@luz-next/klara-theme` |
| Spinner | `Spinner` | `@luz-next/klara-theme` |
| Switch/toggle | `Switch` | `@luz-next/klara-theme` |
| Radio group | `RadioGroup` | `@luz-next/klara-theme` |
| Progress bar | `Progress` | `@luz-next/klara-theme` |
| Separator | `Separator` | `@luz-next/klara-theme` |

## MUI -> klara-theme

| MUI Component | klara-theme Equivalent |
|--------------|----------------------|
| `<MuiButton>` | `<Button styling="primary">` |
| `<TextField>` | `<Input>` |
| `<Select>` | `<Select>` |
| `<Dialog>` | `<Dialog>` |
| `<DataGrid>` | `<DataTable>` |
| `<Tabs>` | `<Tabs>` |
| `<Snackbar>` | `<Toast>` |
| `<Drawer>` | `<Sheet>` |

## Chakra UI -> klara-theme

| Chakra Component | klara-theme Equivalent |
|-----------------|----------------------|
| `<ChakraButton>` | `<Button>` |
| `<Input>` | `<Input>` |
| `<Modal>` | `<Dialog>` |
| `<Table>` | `<DataTable>` |
| `<Toast>` | `<Toast>` |
| `<Stack>` | `<div className="flex gap-100">` |

## shadcn/ui -> klara-theme

Most shadcn components have direct klara-theme equivalents since both wrap Radix UI primitives. Key differences:

| shadcn Pattern | klara-theme Pattern |
|---------------|-------------------|
| `variant="destructive"` | `styling="danger"` |
| `variant="outline"` | `styling="secondary"` |
| `variant="ghost"` | `styling="ghost"` |
| `size="sm"` | `size="small"` |
| `size="lg"` | `size="large"` |
| `className="..."` | Use token classes + `-styles.ts` |

## Prop Mapping Rules

| Generic Prop | klara-theme Prop |
|-------------|-----------------|
| `variant` | `styling` |
| `sz` / `s` | `size` |
| `color` | Use token class instead |
| `disabled` | `disabled` (same) |
| `onClick` | `onClick` (same) |
| `className` | `className` (use token classes) |

## Notes

- Always query RAG for latest component APIs: `query({ query: 'ComponentName props' })`
- All klara-theme components support `theme-ui-label` attribute
- Style customization goes in `-styles.ts` files, not inline
