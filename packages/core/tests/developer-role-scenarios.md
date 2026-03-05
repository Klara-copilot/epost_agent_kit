# Developer Role Scenario Tests

> Behavioral test specification for epost_agent_kit Smart Routing, skill discovery, and agent delegation.
> 40 scenarios across 8 developer roles.

## How to Read This File

Each scenario has:
- **ID** — Unique scenario number
- **Role** — Developer persona
- **Natural Prompt** — What the dev would actually type (no slash commands)
- **Expected Route** — Which command + agent should handle it
- **Expected Skills** — Which skills should be discovered/loaded
- **Variant** — Same task using explicit slash command

---

## iOS Developer (Scenarios 1-5)

### Scenario 1: Add Feature
- **Prompt:** "Add Face ID login to the settings screen"
- **Route:** `/cook` -> `epost-fullstack-developer`
- **Skills:** `ios-development`, `ios-ui-lib`
- **Rationale:** "Add" is a build intent signal word. Platform detected from iOS context (Face ID, settings screen implies .swift files).
- **Variant:** `/cook Add Face ID login to the settings screen`

### Scenario 2: Fix Crash
- **Prompt:** "The app crashes on iPad when rotating"
- **Route:** `/fix` -> `epost-fullstack-developer`
- **Skills:** `ios-development`, `debugging`
- **Rationale:** "crashes" is a fix intent signal. iPad rotation implies iOS platform.
- **Variant:** `/fix The app crashes on iPad when rotating`

### Scenario 3: Run Tests
- **Prompt:** "Run the unit tests for the auth module"
- **Route:** `/test` -> `epost-fullstack-developer`
- **Skills:** `ios-development`
- **Rationale:** "Run...tests" is a test intent. Platform detected from context (iOS project).
- **Variant:** `/test auth module`

### Scenario 4: Plan Feature
- **Prompt:** "Plan a new push notification system"
- **Route:** `/plan` -> `epost-planner`
- **Skills:** `ios-development`, `planning`
- **Rationale:** "Plan" is an explicit plan intent signal.
- **Variant:** `/plan push notification system`

### Scenario 5: A11y Audit
- **Prompt:** "Check accessibility on the onboarding flow"
- **Route:** `/audit-a11y` -> `epost-a11y-specialist`
- **Skills:** `ios-a11y`, `a11y`
- **Rationale:** "accessibility" is an a11y intent signal. Platform detected from context.
- **Variant:** `/audit-a11y onboarding flow`

---

## Android Developer (Scenarios 6-10)

### Scenario 6: Build UI
- **Prompt:** "Build a settings screen with Compose"
- **Route:** `/cook` -> `epost-fullstack-developer`
- **Skills:** `android-development`, `android-ui-lib`
- **Rationale:** "Build" is a build intent. "Compose" triggers android platform detection.
- **Variant:** `/cook settings screen with Compose`

### Scenario 7: Fix Migration
- **Prompt:** "Fix the Room migration crash on update"
- **Route:** `/fix` -> `epost-fullstack-developer`
- **Skills:** `android-development`, `debugging`
- **Rationale:** "Fix" + "crash" is a fix intent. "Room" is an Android-specific keyword.
- **Variant:** `/fix Room migration crash on update`

### Scenario 8: A11y Fix
- **Prompt:** "Add TalkBack support to the checkout flow"
- **Route:** `/fix-a11y` -> `epost-a11y-specialist`
- **Skills:** `android-a11y`, `a11y`
- **Rationale:** "TalkBack" is an Android accessibility signal. "Add...support" for a11y routes to `/fix-a11y`.
- **Variant:** `/fix-a11y TalkBack support on checkout flow`

### Scenario 9: Test UI
- **Prompt:** "Test the payment Compose UI"
- **Route:** `/test` -> `epost-fullstack-developer`
- **Skills:** `android-development`
- **Rationale:** "Test" is test intent. "Compose" triggers android platform.
- **Variant:** `/test payment Compose UI`

### Scenario 10: Plan Architecture
- **Prompt:** "Plan offline-first sync for the mobile app"
- **Route:** `/plan` -> `epost-planner`
- **Skills:** `android-development`, `planning`
- **Rationale:** "Plan" is plan intent. "mobile app" + android context.
- **Variant:** `/plan offline-first sync`

---

## Web Developer (Scenarios 11-15)

### Scenario 11: Create Page
- **Prompt:** "Create a dashboard page with data tables"
- **Route:** `/cook` -> `epost-fullstack-developer`
- **Skills:** `web-frontend`, `web-nextjs`, `web-ui-lib`
- **Rationale:** "Create" is a build intent. "dashboard page" implies web/.tsx files.
- **Variant:** `/cook dashboard page with data tables`

### Scenario 12: Fix API Route
- **Prompt:** "The API route returns 500 on POST"
- **Route:** `/fix` -> `epost-fullstack-developer`
- **Skills:** `web-api-routes`, `debugging`
- **Rationale:** "500" error signal triggers fix intent. "API route" detects web platform.
- **Variant:** `/fix API route 500 on POST`

### Scenario 13: Write Tests
- **Prompt:** "Write Playwright tests for login flow"
- **Route:** `/test` -> `epost-fullstack-developer`
- **Skills:** `web-frontend`
- **Rationale:** "Write...tests" is test intent. "Playwright" is a web testing tool.
- **Variant:** `/test Playwright tests for login flow`

### Scenario 14: Document Component
- **Prompt:** "Document the Button component from Figma"
- **Route:** `/docs-component` -> `epost-muji`
- **Skills:** `web-figma`, `web-ui-lib-dev`
- **Rationale:** "Document" is docs intent. "component from Figma" routes to specialized docs:component.
- **Variant:** `/docs-component Button`

### Scenario 15: A11y Fix
- **Prompt:** "Make the nav keyboard accessible"
- **Route:** `/fix-a11y` -> `epost-a11y-specialist`
- **Skills:** `web-a11y`, `a11y`
- **Rationale:** "keyboard accessible" is a web a11y signal.
- **Variant:** `/fix-a11y keyboard navigation on nav`

---

## Backend Developer (Scenarios 16-20)

### Scenario 16: Add Endpoint
- **Prompt:** "Add a REST endpoint for user preferences"
- **Route:** `/cook` -> `epost-fullstack-developer`
- **Skills:** `backend-javaee`, `backend-databases`
- **Rationale:** "Add" is build intent. "REST endpoint" detects backend platform.
- **Variant:** `/cook REST endpoint for user preferences`

### Scenario 17: Fix Query
- **Prompt:** "Fix the Hibernate N+1 query in OrderService"
- **Route:** `/fix` -> `epost-fullstack-developer`
- **Skills:** `backend-javaee`, `debugging`
- **Rationale:** "Fix" is fix intent. "Hibernate" is backend-specific.
- **Variant:** `/fix Hibernate N+1 query in OrderService`

### Scenario 18: Write Tests
- **Prompt:** "Write Arquillian tests for the new endpoint"
- **Route:** `/test` -> `epost-fullstack-developer`
- **Skills:** `backend-javaee`
- **Rationale:** "Write...tests" is test intent. "Arquillian" is backend test framework.
- **Variant:** `/test Arquillian tests for new endpoint`

### Scenario 19: Plan Migration
- **Prompt:** "Plan migration from EJB to CDI"
- **Route:** `/plan` -> `epost-planner`
- **Skills:** `backend-javaee`, `planning`
- **Rationale:** "Plan" is plan intent. "EJB", "CDI" are backend-specific.
- **Variant:** `/plan EJB to CDI migration`

### Scenario 20: Debug Connection
- **Prompt:** "Debug the MongoDB connection pool exhaustion"
- **Route:** `/debug` -> `epost-debugger`
- **Skills:** `backend-databases`, `debugging`
- **Rationale:** "Debug" is debug intent. "MongoDB" triggers backend-databases.
- **Variant:** `/debug MongoDB connection pool exhaustion`

---

## Architect (Scenarios 21-25)

### Scenario 21: Cross-Platform Plan
- **Prompt:** "Plan biometric login for iOS and Android"
- **Route:** `/plan` -> `epost-planner`
- **Skills:** `ios-development`, `android-development`, `planning`
- **Rationale:** "Plan" is plan intent. Multi-platform (iOS + Android) routes to architect.
- **Variant:** `/plan biometric login for iOS and Android`

### Scenario 22: Deep API Design
- **Prompt:** "Design the API contract for Smart Send v2"
- **Route:** `/plan-deep` -> `epost-planner`
- **Skills:** `backend-javaee`, `domain-b2b`, `planning`
- **Rationale:** "Design" is plan intent. "Smart Send" is a B2B domain module. Complex design warrants deep plan.
- **Variant:** `/plan-deep API contract for Smart Send v2`

### Scenario 23: Parallel Multi-Platform
- **Prompt:** "Create a spec for real-time notifications across all platforms"
- **Route:** `/plan-parallel` -> `epost-planner`
- **Skills:** `web-frontend`, `ios-development`, `android-development`, `planning`
- **Rationale:** "spec" is plan intent. "across all platforms" triggers parallel plan.
- **Variant:** `/plan-parallel real-time notifications`

### Scenario 24: Decision Doc
- **Prompt:** "Write a decision doc for state management"
- **Route:** doc-coauthoring workflow -> `epost-planner`
- **Skills:** `doc-coauthoring`
- **Rationale:** "decision doc" maps to doc-coauthoring skill triggers.
- **Variant:** (No direct command — uses doc-coauthoring skill)

### Scenario 25: Review Architecture
- **Prompt:** "Review the monitoring module architecture"
- **Route:** `/review-code` -> `epost-code-reviewer`
- **Skills:** `domain-b2b`, `code-review`
- **Rationale:** "Review" is review intent. "monitoring module" is a B2B domain module.
- **Variant:** `/review-code monitoring module architecture`

---

## A11y Specialist (Scenarios 26-30)

### Scenario 26: Audit Staged
- **Prompt:** "Audit the staged changes for a11y issues"
- **Route:** `/audit-a11y` -> `epost-a11y-specialist`
- **Skills:** `a11y` + platform-specific a11y (auto-detected from staged files)
- **Rationale:** "Audit" + "a11y" direct match. Platform auto-detected from staged file extensions.
- **Variant:** `/audit-a11y`

### Scenario 27: Fix Top N
- **Prompt:** "Fix the top 3 accessibility findings"
- **Route:** `/fix-a11y 3` -> `epost-a11y-specialist`
- **Skills:** `a11y` + platform-specific a11y
- **Rationale:** "Fix" + "accessibility findings" routes to fix:a11y. "top 3" passes as argument.
- **Variant:** `/fix-a11y 3`

### Scenario 28: Review Keyboard
- **Prompt:** "Review keyboard navigation across the app"
- **Route:** `/review-a11y` -> `epost-a11y-specialist`
- **Skills:** `web-a11y`, `a11y`
- **Rationale:** "Review" + "keyboard navigation" is web a11y review intent.
- **Variant:** `/review-a11y keyboard navigation`

### Scenario 29: Close Finding
- **Prompt:** "Close finding #A11Y-042 as resolved"
- **Route:** `/audit-close-a11y #A11Y-042` -> `epost-a11y-specialist`
- **Skills:** `a11y`
- **Rationale:** "Close finding" + ID pattern routes to audit-close command.
- **Variant:** `/audit-close-a11y #A11Y-042`

### Scenario 30: VoiceOver Check
- **Prompt:** "Check VoiceOver support on the profile screen"
- **Route:** `/review-a11y` -> `epost-a11y-specialist`
- **Skills:** `ios-a11y`, `a11y`
- **Rationale:** "Check" + "VoiceOver" routes to a11y review. VoiceOver is iOS-specific.
- **Variant:** `/review-a11y VoiceOver on profile screen`

---

## Kit Maintainer (Scenarios 31-35)

### Scenario 31: Create Skill
- **Prompt:** "Create a new skill for GraphQL patterns"
- **Route:** `/kit-add-skill` -> `epost-kit-designer`
- **Skills:** `kit-skill-development`
- **Rationale:** "Create...skill" directly maps to kit:add-skill command.
- **Variant:** `/kit-add-skill GraphQL patterns`

### Scenario 32: Add Agent
- **Prompt:** "Add a new agent for performance testing"
- **Route:** `/kit-add-agent` -> `epost-kit-designer`
- **Skills:** `kit-agents`, `kit-agent-development`
- **Rationale:** "Add...agent" directly maps to kit:add-agent command.
- **Variant:** `/kit-add-agent performance testing`

### Scenario 33: Optimize Skill
- **Prompt:** "Optimize the debugging skill"
- **Route:** `/kit-optimize-skill` -> `epost-kit-designer`
- **Skills:** `kit-skill-development`
- **Rationale:** "Optimize...skill" directly maps to kit:optimize-skill command.
- **Variant:** `/kit-optimize-skill debugging`

### Scenario 34: Add Command
- **Prompt:** "Add a /perf command for benchmarking"
- **Route:** `/kit-add-command` -> `epost-kit-designer`
- **Skills:** `kit-commands`
- **Rationale:** "Add a /... command" directly maps to kit:add-command.
- **Variant:** `/kit-add-command perf`

### Scenario 35: Kit Question
- **Prompt:** "Which agents handle iOS tasks?"
- **Route:** `epost-project-manager` (direct response)
- **Skills:** `kit-agents`
- **Rationale:** Kit question pattern ("which agent...") routes to epost-project-manager.
- **Variant:** (No command — handled by orchestrator agent)

---

## Cross-Role / Edge Cases (Scenarios 36-40)

### Scenario 36: Greeting
- **Prompt:** "Hello"
- **Route:** Direct response (no routing)
- **Skills:** (none)
- **Rationale:** Conversational prompt — no dev task detected.
- **Variant:** N/A

### Scenario 37: External Tech Question
- **Prompt:** "How does React server components work?"
- **Route:** `epost-researcher` (direct)
- **Skills:** `docs-seeker`, `research`
- **Rationale:** External tech question pattern ("how does X work").
- **Variant:** N/A

### Scenario 38: Multi-Intent
- **Prompt:** "Plan and build a login page"
- **Route:** `epost-project-manager` (multi-intent)
- **Skills:** `web-frontend`, `planning`
- **Rationale:** "Plan and build" contains two intent signals. Multi-intent routes to orchestrator.
- **Variant:** N/A (orchestrator decomposes into `/plan` then `/cook`)

### Scenario 39: Git Operations
- **Prompt:** "commit and push"
- **Route:** `/git-commit` + `/git-push`
- **Skills:** (none)
- **Rationale:** "commit" and "push" are git intent signals.
- **Variant:** `/git-push` (includes commit step)

### Scenario 40: Continue with Active Plan
- **Prompt:** "continue"
- **Route:** `/cook` (context boost from active plan)
- **Skills:** Per-plan platform skills
- **Rationale:** "continue" with active plan file triggers context boost rule -> build intent.
- **Variant:** `/cook` (with active plan)

---

## Summary Matrix

| Role | Scenarios | Commands Tested | Agents Tested |
|------|-----------|----------------|---------------|
| iOS Developer | 1-5 | /cook, /fix, /test, /plan, /audit-a11y | epost-fullstack-developer, epost-planner, epost-a11y-specialist |
| Android Developer | 6-10 | /cook, /fix, /fix-a11y, /test, /plan | epost-fullstack-developer, epost-a11y-specialist, epost-planner |
| Web Developer | 11-15 | /cook, /fix, /test, /docs-component, /fix-a11y | epost-fullstack-developer, epost-muji, epost-a11y-specialist |
| Backend Developer | 16-20 | /cook, /fix, /test, /plan, /debug | epost-fullstack-developer, epost-planner, epost-debugger |
| Architect | 21-25 | /plan, /plan-deep, /plan-parallel, /review-code | epost-planner, epost-code-reviewer |
| A11y Specialist | 26-30 | /audit-a11y, /fix-a11y, /review-a11y, /audit-close-a11y | epost-a11y-specialist |
| Kit Maintainer | 31-35 | /kit-add-skill, /kit-add-agent, /kit-optimize-skill, /kit-add-command | epost-kit-designer, epost-project-manager |
| Cross-Role | 36-40 | /git-commit, /git-push, /cook | epost-researcher, epost-project-manager |
