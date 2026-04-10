---
name: ios-code-review-rules-realm
description: "iOS RealmSwift code review rules — REALM category"
user-invocable: false
disable-model-invocation: true
---

# iOS Realm Code Review Rules

RealmSwift persistence code review rules. Loaded by code-review skill when reviewing files that import `RealmSwift`.

**Scope**: RealmSwift 10.47 — threading, write transactions, live collections.

---

## REALM: RealmSwift Persistence

**Scope**: All RealmSwift usage in luz_epost_ios — object access, mutations, query results.

| Rule ID | Rule | Severity | Pass | Fail |
|---------|------|----------|------|------|
| REALM-001 | Realm objects accessed only on the thread they were created — no cross-thread Realm object passing | critical | `DispatchQueue.main.async { let realm = try! Realm(); let item = realm.object(ofType: Item.self, forPrimaryKey: id) }` | `let item = realm.object(…)` fetched on background queue then passed to main queue closure |
| REALM-002 | Realm mutations inside `realm.write {}` transaction — never mutate managed objects outside write block | critical | `try! realm.write { item.status = "sent" }` | `item.status = "sent"` called directly on a managed Realm object outside a write block |
| REALM-003 | Realm `Results` used as live collections — do not `Array(results)` unless explicitly needed for snapshot | medium | `let results: Results<Item> = realm.objects(Item.self).filter(…)` | `let items = Array(realm.objects(Item.self))` without a comment explaining why a snapshot is needed |

---

## Lightweight vs Escalated

| Rule IDs | Lightweight (default) | Escalated only |
|----------|-----------------------|----------------|
| REALM-001–002 | Yes | — |
| REALM-003 | — | Yes |

**Lightweight**: Run on all files importing RealmSwift (2 of 3 rules). **Escalated**: Activate on large data-layer PRs or explicit `--deep` flag (1 of 3 rules).

## Extending

Add rules following the pattern `REALM-{NNN}`. Keep severity consistent with cross-cutting rules in `code-review/references/code-review-standards.md`.
