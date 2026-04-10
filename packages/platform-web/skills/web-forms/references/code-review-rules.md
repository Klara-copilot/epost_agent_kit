---
name: web-forms-code-review-rules
description: "React Hook Form + Zod form validation code review rules — FORM category"
user-invocable: false
disable-model-invocation: true
---

# Web Forms Code Review Rules

**Scope**: React Hook Form + Zod schema forms in ePost web app — validation setup, error handling, API error mapping.

---

## FORM: Form Validation

**Activation gate**: Apply when reviewing files that use `useForm`, `zodResolver`, or contain form submission logic.

| Rule ID | Rule | Severity | Pass | Fail |
|---------|------|----------|------|------|
| FORM-001 | Always use `zodResolver` — no manual validation logic in submit handlers | high | `resolver: zodResolver(schema)` in `useForm` config | `onSubmit` contains manual field checks: `if (!email.includes('@'))` |
| FORM-002 | Form type inferred via `z.infer<typeof schema>` — never defined manually | medium | `type FormData = z.infer<typeof schema>` | Separate `interface FormData` or `type FormData` that duplicates schema fields |
| FORM-003 | Standard validation timing: `mode: 'onBlur'` + `reValidateMode: 'onChange'` | low | Both options present in `useForm` config | `mode: 'onChange'` only (spams validation on every keystroke), or no `mode` (defers all errors until submit) |
| FORM-004 | API errors mapped to form fields via `setError` — not stored in separate `useState` | medium | `setError('email', { type: 'server', message: err.message })` after failed submit | `const [apiError, setApiError] = useState('')` displayed outside form field context |
| FORM-005 | Every error element has: `id` attribute, matching `aria-describedby` on input, and `role="alert"` | high | `<p id="email-error" role="alert">{errors.email.message}</p>` + `aria-describedby="email-error"` on input | Error `<p>` with no `id`; input missing `aria-describedby`; missing `role="alert"` |

---

## Lightweight vs Escalated

| Rule IDs | Lightweight (default) | Escalated only |
|----------|-----------------------|----------------|
| FORM-001, FORM-005 | Yes | — |
| FORM-002–004 | — | Yes |

**Lightweight**: Run on all files using `useForm` or form submission handlers. **Escalated**: Activate on new form implementations or full form component PRs.
