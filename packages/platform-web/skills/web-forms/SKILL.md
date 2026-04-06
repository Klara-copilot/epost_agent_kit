---
name: web-forms
description: (ePost) Implements form validation with React Hook Form + Zod schemas, API error mapping, and accessible error states. Use when building forms, handling form validation, mapping API errors to fields, or implementing Zod schemas
user-invocable: false

metadata:
  agent-affinity:
    - epost-fullstack-developer
    - epost-tester
  keywords:
    - form
    - validation
    - zod
    - react-hook-form
    - rhf
    - error-mapping
    - aria
    - schema
  platforms:
    - web
  triggers:
    - form
    - validation
    - zod
    - react hook form
    - rhf
    - useForm
    - setError
    - field error
---

# Form Validation — React Hook Form + Zod

## Schema Organisation

| Case | Location |
|------|----------|
| Single-use schema | Co-locate in the same file as the component |
| Shared/reused schema | Extract to `schemas/{entity}.schema.ts` |

Always use `z.infer<typeof schema>` for the form type — never define the type manually.

## Rules

- Always use `zodResolver` — never write manual validation functions
- Never use uncontrolled inputs for complex forms
- Every error message: `id` + `aria-describedby` on input + `role="alert"` on error element
- Schema lives close to where it's used — don't centralise prematurely
- Use `z.infer<typeof schema>` for types — never duplicate type definitions manually

See `references/form-patterns.md` for code examples: basic setup, validation timing, API error mapping, and accessible error states.
