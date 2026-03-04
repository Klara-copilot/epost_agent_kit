# AI Mental Model – 1-Page Cheat Sheet

> **Think of the AI system as a small engineering team that follows rules, uses company knowledge, and works step by step.**

---

## The core idea (remember this)

**AI Ecosystem = Team + Rules + Memory + Tools + Workflow**

If you understand this line, you understand the whole system.

---

## 1. Agents = the AI “team”

Agents are **specialized roles**, not one all-knowing AI.

| Agent            | What it does                                       |
| ---------------- | -------------------------------------------------- |
| **Orchestrator** | Decides _who works next_ and enforces the workflow |
| **Retriever**    | Finds internal knowledge (docs, code, rules)       |
| **Architect**    | Creates the plan and design contracts              |
| **Implementer**  | Writes code and tests                              |
| **Auditor**      | Reviews quality (tokens, a11y, boundaries)         |
| **Fixer**        | Applies small, safe fixes                          |
| **Documenter**   | Updates docs, Storybook, changelog                 |

**Rule:**  
One agent = one responsibility.

---

## 2. Instructions = how agents behave

Instructions tell agents **how to act**.

### Instruction layers (from strongest to weakest)

1. **Core instructions** – global rules (always apply)
2. **Project instructions** – repo-specific conventions
3. **Editor / IDE instructions** – tool constraints
4. **User request** – the task you ask for

> Instructions prevent AI from “making things up”.

---

## 3. Rules = hard constraints (non-negotiable)

Rules are **must-follow policies**.

Examples:

- No hardcoded colors (use tokens)
- Accessibility required
- Do not break module boundaries
- No secrets or PII

Rules are checked by **Auditor agents** and **CI**.

---

## 4. Skills = reusable playbooks

Skills are **how-to recipes** that agents reuse.

Examples:

- “Map Figma variants → component props”
- “Accessibility audit checklist”
- “Storybook story template”
- “Safe legacy refactor”

Skills make AI consistent and faster.

---

## 5. Knowledge & RAG = AI memory

**Knowledge = your internal source of truth**

- Docs
- Design system
- Tokens
- Code
- ADRs (architecture decisions)
- Examples

**RAG** means:

> The AI searches this knowledge **before acting**.

This avoids hallucination and inconsistency.

---

## 6. Tools & MCPs = what agents are allowed to do

Tools are **capabilities**, such as:

- read code
- write code
- run tests
- query docs
- read Figma files

**MCP** standardizes tool access.

Important rule:

> Not every agent has the same permissions.

Examples:

- Auditor → read-only
- Implementer → full write
- Fixer → limited write

---

## 7. Workflows = step-by-step process

Workflows are **Standard Operating Procedures (SOPs)**.

### Example: UI Feature Workflow

1. Orchestrator routes task
2. Retriever gathers context
3. Architect writes plan
4. Implementer codes
5. Auditor checks rules
6. Fixer patches issues
7. Documenter updates docs

> Workflow makes AI output predictable and safe.

---

## 8. Files & artifacts (what gets produced)

| File type    | Purpose                            |
| ------------ | ---------------------------------- |
| **Markdown** | Human-readable docs, rules, ADRs   |
| **YAML**     | Workflow configuration             |
| **JSON**     | Machine-readable contracts & state |
| **Code**     | Actual implementation              |

---

## 9. ADR (Architecture Decision Record)

**ADR = “Why did we decide this?”**

An ADR records:

- the decision
- the reason
- rejected alternatives

ADRs help **humans and AI** understand intent later.

---

## 10. One real example (simple)

**Task:** “Add clear icon to input field”

- Retriever finds existing input docs + tokens
- Architect defines behavior and props
- Implementer writes code
- Auditor checks accessibility + tokens
- Fixer patches issues
- Documenter updates docs

**Result:** clean, safe, consistent change.

---

## 3 golden rules for beginners

If you remember nothing else, remember these:

1. **Follow the workflow**
2. **Use internal knowledge first (RAG)**
3. **Never skip audit checks**

---

## One-sentence summary

> **This AI system turns AI from a chatbot into a structured engineering team that follows rules, uses company knowledge, and works step by step.**
