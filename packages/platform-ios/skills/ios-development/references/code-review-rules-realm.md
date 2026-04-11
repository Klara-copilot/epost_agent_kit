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
| REALM-004 | Realm encryption key read from Keychain — never hardcoded in source | critical | `let config = Realm.Configuration(encryptionKey: KeychainHelper.realmEncryptionKey())` | `Realm.Configuration(encryptionKey: "my-secret-key".data(using: .utf8)!)` — key in source control, exposed in git history |
| REALM-005 | Schema migration block provided in `Realm.Configuration` whenever `schemaVersion` is incremented | high | `config.migrationBlock = { migration, oldVersion in if oldVersion < 2 { … } }` alongside `schemaVersion = 2` | `schemaVersion` bumped to new value with no `migrationBlock` — app crashes on launch with existing data |
| REALM-006 | Realm notification token stored as instance property — never as a local variable | high | `self.token = results.observe { [weak self] changes in … }` on the object owning the subscription | `let token = results.observe { … }` as a local variable — token deallocated immediately, no change notifications fire |

---

## Lightweight vs Escalated

| Rule IDs | Lightweight (default) | Escalated only |
|----------|-----------------------|----------------|
| REALM-001, REALM-002, REALM-004, REALM-006 | Yes | — |
| REALM-003, REALM-005 | — | Yes |

**Lightweight**: Run on all files importing RealmSwift (4 of 6 rules). **Escalated**: Activate on large data-layer PRs or explicit `--deep` flag (2 of 6 rules).

## Extending

Add rules following the pattern `REALM-{NNN}`. Keep severity consistent with cross-cutting rules in `code-review/references/code-review-standards.md`.
