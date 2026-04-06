# Form Patterns

Practical patterns for React Hook Form + Zod + klara-theme in this codebase.

---

## Pattern 1: Basic RHF + Zod Form

Standard setup for any new form.

```typescript
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormField, Input, Button } from '@luz-next/klara-theme';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

type FormData = z.infer<typeof schema>;

export function ContactForm() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const onSubmit = async (data: FormData) => {
    await saveContact(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <FormField
            label="Email"
            error={errors.email?.message}
            aria-describedby={errors.email ? 'email-error' : undefined}
          >
            <Input
              {...field}
              type="email"
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p id="email-error" role="alert" aria-live="polite">
                {errors.email.message}
              </p>
            )}
          </FormField>
        )}
      />

      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <FormField
            label="Name"
            error={errors.name?.message}
          >
            <Input {...field} aria-invalid={!!errors.name} />
          </FormField>
        )}
      />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save'}
      </Button>
    </form>
  );
}
```

**Rules:**
- Always `z.infer<typeof schema>` for the form type — never define manually
- `mode: 'onBlur'` + `reValidateMode: 'onChange'` is the standard timing
- Use `Controller` with klara-theme components (they are controlled inputs)

---

## Pattern 2: API Error Mapping to Fields

Map server-side validation back to specific fields after a failed submit.

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const onSubmit = async (data: FormData) => {
  try {
    await submitToApi(data);
  } catch (error) {
    if (isApiValidationError(error)) {
      // Map each server field error to the corresponding form field
      Object.entries(error.fieldErrors).forEach(([field, message]) => {
        setError(field as keyof FormData, {
          type: 'server',
          message: message as string,
        });
      });
      return;
    }

    // Non-field error — show on a root-level error field
    setError('root', {
      type: 'server',
      message: 'Something went wrong. Please try again.',
    });
  }
};

// In the form JSX — display root-level error
{errors.root && (
  <p role="alert" aria-live="assertive">
    {errors.root.message}
  </p>
)}
```

**Key points:**
- `type: 'server'` distinguishes API errors from client validation errors
- Root errors (`setError('root', ...)`) handle non-field server errors
- `aria-live="assertive"` for root errors (interrupts), `aria-live="polite"` for field errors

---

## Pattern 3: Multi-Step Form

Validate each step independently before advancing.

```typescript
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  address: z.string().min(5),
  city: z.string().min(2),
});

type FormData = z.infer<typeof schema>;

// Fields validated at each step
const STEP_FIELDS: (keyof FormData)[][] = [
  ['email', 'name'],    // step 0
  ['address', 'city'],  // step 1
];

export function MultiStepForm() {
  const [step, setStep] = useState(0);
  const isLastStep = step === STEP_FIELDS.length - 1;

  const { control, handleSubmit, trigger, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  });

  const handleNext = async () => {
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid) setStep((s) => s + 1);
  };

  const onSubmit = async (data: FormData) => {
    await submitAll(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {step === 0 && <StepOne control={control} errors={errors} />}
      {step === 1 && <StepTwo control={control} errors={errors} />}

      <div>
        {step > 0 && (
          <Button type="button" onClick={() => setStep((s) => s - 1)}>
            Back
          </Button>
        )}
        {isLastStep ? (
          <Button type="submit">Submit</Button>
        ) : (
          <Button type="button" onClick={handleNext}>
            Next
          </Button>
        )}
      </div>
    </form>
  );
}
```

**Key points:**
- `trigger(fields)` validates only the fields for the current step — returns `true` if valid
- Single `useForm` instance across all steps — all field values persist in memory
- Navigate back freely; values are preserved

---

## Pattern 4: File Upload Field

File input with size and type validation via Zod.

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  attachment: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, 'File must be under 5 MB')
    .refine((file) => ACCEPTED_TYPES.includes(file.type), 'Only JPEG, PNG, or PDF allowed')
    .optional(),
});

type FormData = z.infer<typeof schema>;

export function UploadForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.attachment) formData.append('attachment', data.attachment);
    await uploadToApi(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="attachment">Attachment</label>
        <input
          id="attachment"
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          aria-describedby={errors.attachment ? 'attachment-error' : undefined}
          aria-invalid={!!errors.attachment}
          onChange={(e) => {
            // RHF register doesn't work well with file inputs — use onChange manually
            const file = e.target.files?.[0];
            // If using Controller, call field.onChange(file)
          }}
        />
        {errors.attachment && (
          <p id="attachment-error" role="alert" aria-live="polite">
            {errors.attachment.message}
          </p>
        )}
      </div>
      <Button type="submit">Upload</Button>
    </form>
  );
}
```

**Note on file inputs with RHF:** File inputs need special handling because `register` binds `value` which browsers block on file inputs. Use `Controller` with `field.onChange(e.target.files?.[0])`, or use `register` and read `watch('attachment')` for display only.

```typescript
// Preferred: Controller for file inputs
<Controller
  name="attachment"
  control={control}
  render={({ field: { onChange, value, ...field } }) => (
    <input
      {...field}
      type="file"
      accept=".jpg,.jpeg,.png,.pdf"
      onChange={(e) => onChange(e.target.files?.[0])}
    />
  )}
/>
```
