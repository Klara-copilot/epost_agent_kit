# Component Mapping Guide

## Common HTML -> klara-theme

| HTML/Generic | klara-theme Component | Import |
|-------------|----------------------|--------|
| `<button>` | `Button` | your design system package |
| `<input type="text">` | `Input` | your design system package |
| `<input type="checkbox">` | `Checkbox` | your design system package |
| `<select>` | `Select` | your design system package |
| `<textarea>` | `TextArea` | your design system package |
| `<dialog>` | `Dialog` | your design system package |
| `<table>` | `DataTable` | your design system package |
| `<nav>` tabs | `Tabs` + `TabsList` + `TabsContent` | your design system package |
| `<details>` | `Accordion` | your design system package |
| Toast/notification | `Toast` | your design system package |
| Tooltip | `Tooltip` | your design system package |
| Dropdown menu | `DropdownMenu` | your design system package |
| Breadcrumb | `Breadcrumb` | your design system package |
| Badge | `Badge` | your design system package |
| Avatar | `Avatar` | your design system package |
| Card | `Card` | your design system package |
| Spinner | `Spinner` | your design system package |
| Switch/toggle | `Switch` | your design system package |
| Radio group | `RadioGroup` | your design system package |
| Progress bar | `Progress` | your design system package |
| Separator | `Separator` | your design system package |

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
