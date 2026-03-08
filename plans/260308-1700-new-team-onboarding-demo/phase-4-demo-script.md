---
phase: 4
title: "Live demo script — 40 minutes"
effort: 30m
depends: [1, 2, 3]
---

# Phase 4: Demo Script

Screen share. 40 minutes. 6 Java devs watching.

---

## Minute 0–5: The Hook

**Say:**
> "You've been asked to build React + Next.js. That's fair — it's new.
> But you're not starting blind. This kit gives your Copilot the same
> conventions, patterns, and guardrails that the senior devs use.
> Instead of googling JSF-to-React translations all day, you ask the agent.
> Let me show you what that looks like."

**Show:** a blank Copilot Chat. Type `@`. Nothing interesting yet.

---

## Minute 5–12: Install (live, starting from nothing)

**In terminal, luz_next root:**

```bash
# Show they don't have it yet
ls .github/    # likely no agents dir

# Install the kit CLI (if not already — do this beforehand if risky live)
gh api repos/Klara-copilot/epost-agent-kit-cli/contents/install/install.sh \
  --jq .content | base64 -d | bash

# Init for Copilot
epost-kit init --profile web-fullstack --target vscode
```

**While it runs, explain:**
> "This downloads the agents and skills configured for your project stack —
> Next.js, backend API, B2B domain modules. It puts them in `.github/agents/`
> where Copilot can find them."

**After complete:**
```bash
ls .github/agents/    # show the .agent.md files
```

---

## Minute 12–15: Discovery moment

**Back in VSCode, Copilot Chat. Type `@`.**

Point out each agent appearing. Say:
> "Each of these is a specialist. epost-fullstack-developer implements features.
> epost-debugger fixes errors. epost-planner plans before you code.
> Think of them like senior teammates who know this codebase."

---

## Minute 15–22: "Explain this project to me"

**Type in Copilot Chat:**
```
@epost-researcher I'm a Java JSF/PrimeFaces developer, new to this project.
Give me a tour of luz_next:
1. What is this application?
2. How is the folder structure organized — compare to a Java EE project layout
3. What is klara-theme and how does it compare to PrimeFaces components?
```

**While agent responds:**
> "See how it maps to what you know. App Router folders = your navigation rules.
> klara-theme = your PrimeFaces component library.
> The agent translates because we told it your background."

---

## Minute 22–30: Plan a new module (the real workflow)

**Say:**
> "In your project, you'll be building a new module — the design is still being
> finalized, so let's explore what's already there and plan from scratch."

**Type:**
```
@epost-planner I need to build a new [module name] module in luz_next.
It should: [1-2 sentence description of what it does]
Explore what patterns already exist in the codebase (look at Inbox or Contacts
as reference). Create a step-by-step implementation plan.
```

**Show the plan file it creates in `plans/`.**

> "This is how you start every feature. Plan first. The agent reads the existing
> code, identifies the patterns, and gives you a checklist to follow.
> No more reading the whole codebase to understand conventions."

---

## Minute 30–35: Implement step 1

**Type:**
```
@epost-fullstack-developer Implement phase 1 of the plan at plans/[plan-dir].
Follow the existing patterns in the codebase.
```

**Point out:**
- It reads existing code before writing
- It uses klara-theme components (not raw HTML)
- It follows TypeScript conventions

---

## Minute 35–38: Debug a TypeScript error

**Introduce a deliberate typo or show a real error from the project. Then:**
```
@epost-debugger This error appeared after adding my new component:
[paste error]

File: src/features/[module]/components/[name].tsx
```

**Say:**
> "TypeScript errors look scary at first — JSF errors were server-side and familiar.
> TypeScript errors are client-side and cryptic. Just paste them here."

---

## Minute 38–40: Wrap up

**Hand them two files:**
- `docs/java-to-react.md` — "your mental model map, open this when confused"
- `docs/agents-for-copilot.md` — "your cheat sheet for which agent to ask"

**Say:**
> "Your workflow is: researcher to understand → planner to plan → developer to build → debugger to fix → reviewer to check.
> When you don't know how to do something in React, don't google JSF tutorials.
> Ask the agent with context: 'I know JSF, how do I do X in React?'
> You'll get answers in terms you understand."

---

## Prep checklist (do tonight)

- [ ] `epost-kit init --profile web-fullstack --target vscode` in luz_next — verify works
- [ ] Confirm agents appear in VSCode Copilot Chat `@` picker
- [ ] Write `docs/java-to-react.md` in luz_next (Phase 2 content)
- [ ] Write `docs/agents-for-copilot.md` in luz_next (Phase 3 content)
- [ ] Decide on module name/description for the plan demo (minute 22–30)
- [ ] Have terminal + VSCode side by side ready
- [ ] If live install is risky: pre-install but reset `.github/agents/` so you can show the moment it appears

## Backup plan if install fails live

Pre-install and start from minute 12 (show `.github/agents/` already exists).
Say: "Here's what it looks like after setup — each dev will run this one command on their machine."
