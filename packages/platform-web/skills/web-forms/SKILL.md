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

## Basic Setup

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

type FormData = z.infer<typeof schema>;

export function MyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });
}
```

## Schema Organisation

| Case | Location |
|------|----------|
| Single-use schema | Co-locate in the same file as the component |
| Shared/reused schema | Extract to `schemas/{entity}.schema.ts` |

Always use `z.infer<typeof schema>` for the form type — never define the type manually.

## Validation Timing

```typescript
useForm<FormData>({
  resolver: zodResolver(schema),
  mode: 'onBlur',          // validate on blur during initial fill
  reValidateMode: 'onChange', // switch to onChange after first submit
});
```

Show all errors on submit.

## API Error → Field Mapping

```typescript
const onSubmit = async (data: FormData) => {
  const result = await submitAction(data);
  if (result.error) {
    Object.entries(result.error.fieldErrors ?? {}).forEach(([field, message]) => {
      setError(field as keyof FormData, { message });
    });
    return;
  }
};
```

## Accessible Error States

Every error message needs three things: an `id`, `aria-describedby` on the input, and `role="alert"`.

```tsx
<div>
  <input
    {...register('email')}
    aria-describedby={errors.email ? 'email-error' : undefined}
    aria-invalid={!!errors.email}
  />
  {errors.email && (
    <p id="email-error" role="alert" aria-live="polite">
      {errors.email.message}
    </p>
  )}
</div>
```

## Rules

- Always use `zodResolver` — never write manual validation functions
- Never use uncontrolled inputs for complex forms
- Every error message: `id` + `aria-describedby` on input + `role="alert"` on error element
- Schema lives close to where it's used — don't centralise prematurely
- Use `z.infer<typeof schema>` for types — never duplicate type definitions manually
