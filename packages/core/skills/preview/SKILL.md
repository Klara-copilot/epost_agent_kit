---
name: preview
description: "(ePost) Generates visual explanations — Mermaid diagrams, ASCII art, and HTML interactive pages. Use when user wants a diagram, visual explanation, ASCII art, or HTML preview of a concept, flow, or architecture."
user-invocable: true
metadata:
  category: knowledge
  agent-affinity:
    - epost-planner
    - epost-docs-manager
    - epost-researcher
  connections:
    enhances:
      - docs
      - plan
  keywords:
    - diagram
    - architecture
    - flowchart
    - sequence
    - mermaid
    - ER
    - ERD
    - state machine
    - Gantt
    - visual
    - chart
    - graph
  triggers:
    - /preview
    - visualize this
    - draw a diagram
    - show me a flowchart
---

# Mermaid Diagrams

Always wrap output in ` ```mermaid ` code block. Claude renders these inline.

---

## Flags

| Flag | Behavior |
|------|----------|
| *(none)* | Generate Mermaid diagram (current behavior) |
| `--explain <topic>` | ASCII art + Mermaid + prose visual explanation |
| `--ascii <topic>` | Terminal ASCII diagram only (no Mermaid) |
| `--html <topic>` | Self-contained HTML file with diagram + explanation, opens in browser |

## Dispatch

- No flag → generate Mermaid diagram per diagram type selection below
- `--explain` → load `references/explain-mode.md`
- `--ascii` → load `references/ascii-mode.md`
- `--html` → load `references/html-mode.md`

---

## Diagram Type Selection

| Type | When to use | Opening line |
|------|------------|--------------|
| Flowchart | Process flows, decision trees, logic branches | `flowchart TD` |
| Sequence | API calls, event flows, auth handshakes, message passing | `sequenceDiagram` |
| ER | Database schemas, data models, entity relationships | `erDiagram` |
| Class | OOP structure, type hierarchies, interface contracts | `classDiagram` |
| State | Lifecycle models, state machines, status transitions | `stateDiagram-v2` |
| Gantt | Project timelines, phase planning, milestone tracking | `gantt` |
| Architecture | System topology, service mesh, infra layout (v11) | `architecture-beta` |
| User Journey | UX flows, onboarding, step-by-step user paths | `journey` |

---

## Architecture Diagram (v11 — use for system topology)

```mermaid
architecture-beta
  group api(cloud)[API Layer]
    service auth(server)[Auth Service] in api
    service gateway(server)[API Gateway] in api

  group data(database)[Data Layer]
    service db(database)[PostgreSQL] in data
    service cache(server)[Redis] in data

  auth:R --> L:gateway
  gateway:R --> L:db
  gateway:B --> T:cache
```

**Rules:**
- Use `architecture-beta` — NOT `architecture` (old syntax)
- Arrow direction: `service1:R --> L:service2` (right-of-1 connects to left-of-2)
- Icons: `server`, `database`, `cloud`, `disk`, `internet`
- Groups use `group id(icon)[Label]`

---

## Sequence Diagram (for auth/API flows)

```mermaid
sequenceDiagram
  participant Client
  participant Gateway
  participant Auth
  participant Service

  Client->>Gateway: POST /api/resource
  Gateway->>Auth: Validate token
  Auth-->>Gateway: 200 OK + claims
  Gateway->>Service: Forward + claims
  Service-->>Client: 200 + data
```

**Arrow types:**
- `->>` solid (request/action)
- `-->>` dashed (response/return)
- `-x` with X at end (async, no response expected)

---

## Flowchart (for process/decision trees)

```mermaid
flowchart TD
  A[Start] --> B{Check plan exists?}
  B -- Yes --> C[Load plan]
  B -- No --> D[Run /plan first]
  C --> E[Begin implementation]
  D --> E
```

**Direction:** `TD` top-down, `LR` left-right, `RL` right-left, `BT` bottom-top

---

## ER Diagram (for data models)

```mermaid
erDiagram
  USER {
    uuid id PK
    string email
    string name
  }
  POST {
    uuid id PK
    uuid userId FK
    string title
    text content
  }
  USER ||--o{ POST : "writes"
```

---

## State Diagram (for lifecycle/status)

```mermaid
stateDiagram-v2
  [*] --> Draft
  Draft --> Active: publish
  Active --> Archived: archive
  Active --> Draft: unpublish
  Archived --> [*]
```

---

## Common Errors to Avoid

| Error | Fix |
|-------|-----|
| Labels with spaces crash | Wrap in quotes: `A["My Label"]` |
| `architecture` not rendering | Use `architecture-beta` |
| Arrow direction wrong | Check: `A:R --> L:B` means A's right connects to B's left |
| Sequence arrows broken | Use `->>` not `->` |
| Too many nodes → illegible | Split into 2 diagrams at natural boundary |

**Size rule:** >15 nodes → split. Diagrams should fit on one screen.
