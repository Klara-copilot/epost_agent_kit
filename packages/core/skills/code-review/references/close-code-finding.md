---
name: close-code-finding
description: "Protocol for marking a code finding as resolved in reports/known-findings/code.json"
user-invocable: false
disable-model-invocation: true
---

# Close Code Finding

## When Invoked

User runs `/review --close <id>` or says "close finding \<id\>" / "mark finding \<id\> as resolved".

## Protocol

1. **Load** `reports/known-findings/code.json`
2. **Find** entry with matching `id`
   - Not found → reply "Finding {id} not found in code.json"
   - Already `resolved: true` → reply "Finding {id} already closed on {resolved_date}"
3. **Show** the finding to the user:
   ```
   ID:    {id}
   Rule:  {rule_id} — {title}
   File:  {file_pattern}
   Fix:   {fix_template}
   State: fix_applied={fix_applied}
   ```
4. **Ask**: "Has the fix been applied and verified in this file? (yes / applied-not-verified / no)"
5. **Apply** state transitions:

| User reply | fix_applied | resolved |
|---|---|---|
| "yes" (applied and verified) | `true`, today | `true`, today |
| "applied-not-verified" | `true`, today | unchanged (`false`) |
| "no" | unchanged | unchanged |

6. **Save** updated `code.json`
7. **Confirm**: "Finding {id} ({rule_id}: {title}) → {new state} on {today}."

## State Rules

- `fix_applied: true` = a fix has been deployed; not yet confirmed working
- `resolved: true` = fix applied AND verified working — safe to omit from regression threshold counts
- Closing does NOT delete the entry — regression detection depends on the audit trail

## Bulk Close

If user runs `/review --close-all --rule RULE-ID` or "close all findings for RULE-ID":
1. Load `code.json`, collect all open findings with matching `rule_id`
2. Show list (id, file_pattern, title) — ask for single confirmation
3. On confirm: set all to `resolved: true`, `resolved_date: today`
