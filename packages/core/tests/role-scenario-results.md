# Developer Role Scenario Test Results

> Generated: 2026-02-28
> Validation Script: `packages/core/scripts/validate-role-scenarios.cjs`

## Automated Validation

| Check | Pass | Fail | Skip | Total |
|-------|------|------|------|-------|
| Routing | 40 | 0 | 0 | 40 |
| Skill Discovery | 40 | 0 | 0 | 40 |
| Agent Assignment | 17 | 0 | 23 | 40 |
| **Total** | 97 | 0 | 23 | 120 |

**Note:** 23 agent checks were skipped because those scenarios have no
keyword-discoverable skills (the expected agent cannot be resolved from
skill-index alone — it relies on routing context or agent `skills:` lists).

## Results by Role

### iOS Developer (1-5)

| # | Prompt | Routing | Skills | Agent | Status |
|---|--------|---------|--------|-------|--------|
| 1 | Add Face ID login... | PASS | PASS (gap: ios-ui-lib) | PASS | PASS |
| 2 | The app crashes on iPad... | PASS | PASS | PASS | PASS |
| 3 | Run the unit tests... | PASS | PASS (gap: ios-development) | skip | PASS |
| 4 | Plan a new push notification... | PASS | PASS | PASS | PASS |
| 5 | Check accessibility on... | PASS | PASS (gap: a11y) | skip | PASS |

### Android Developer (6-10)

| # | Prompt | Routing | Skills | Agent | Status |
|---|--------|---------|--------|-------|--------|
| 6 | Build a settings screen... | PASS | PASS | PASS | PASS |
| 7 | Fix the Room migration... | PASS | PASS | PASS | PASS |
| 8 | Add TalkBack support... | PASS | PASS (gap: a11y, android-a11y) | PASS | PASS |
| 9 | Test the payment Compose... | PASS | PASS | PASS | PASS |
| 10 | Plan offline-first sync... | PASS | PASS | PASS | PASS |

### Web Developer (11-15)

| # | Prompt | Routing | Skills | Agent | Status |
|---|--------|---------|--------|-------|--------|
| 11 | Create a dashboard page... | PASS | PASS | PASS | PASS |
| 12 | The API route returns 500... | PASS | PASS | PASS | PASS |
| 13 | Write Playwright tests... | PASS | PASS | PASS | PASS |
| 14 | Document the Button... | PASS | PASS (gap: ui-lib-dev) | PASS | PASS |
| 15 | Make the nav keyboard... | PASS | PASS (gap: a11y, web-a11y) | skip | PASS |

### Backend Developer (16-20)

| # | Prompt | Routing | Skills | Agent | Status |
|---|--------|---------|--------|-------|--------|
| 16 | Add a REST endpoint... | PASS | PASS (gap: backend-javaee, backend-databases) | PASS | PASS |
| 17 | Fix the Hibernate N+1... | PASS | PASS (gap: backend-javaee, debugging) | skip | PASS |
| 18 | Write Arquillian tests... | PASS | PASS (gap: backend-javaee) | skip | PASS |
| 19 | Plan migration from EJB... | PASS | PASS (gap: backend-javaee) | PASS | PASS |
| 20 | Debug the MongoDB... | PASS | PASS (gap: backend-databases) | PASS | PASS |

### Architect (21-25)

| # | Prompt | Routing | Skills | Agent | Status |
|---|--------|---------|--------|-------|--------|
| 21 | Plan biometric login... | PASS | PASS | PASS | PASS |
| 22 | Design the API contract... | PASS | PASS (gap: planning, domain-b2b) | skip | PASS |
| 23 | Create a spec for... | PASS | PASS (gap: planning) | skip | PASS |
| 24 | Write a decision doc... | PASS | PASS (gap: doc-coauthoring) | skip | PASS |
| 25 | Review the monitoring... | PASS | PASS | PASS | PASS |

### A11y Specialist (26-30)

| # | Prompt | Routing | Skills | Agent | Status |
|---|--------|---------|--------|-------|--------|
| 26 | Audit the staged changes... | PASS | PASS (gap: a11y) | skip | PASS |
| 27 | Fix the top 3 accessibility... | PASS | PASS (gap: a11y) | skip | PASS |
| 28 | Review keyboard navigation... | PASS | PASS (gap: a11y, web-a11y) | skip | PASS |
| 29 | Close finding #A11Y-042... | PASS | PASS (gap: a11y) | skip | PASS |
| 30 | Check VoiceOver support... | PASS | PASS (gap: a11y, ios-a11y) | skip | PASS |

### Kit Maintainer (31-35)

| # | Prompt | Routing | Skills | Agent | Status |
|---|--------|---------|--------|-------|--------|
| 31 | Create a new skill... | PASS | PASS (gap: kit-skill-development) | skip | PASS |
| 32 | Add a new agent... | PASS | PASS (gap: kit-agents, kit-agent-development) | skip | PASS |
| 33 | Optimize the debugging... | PASS | PASS (gap: kit-skill-development) | skip | PASS |
| 34 | Add a /perf command... | PASS | PASS (gap: kit-commands) | skip | PASS |
| 35 | Which agents handle iOS... | PASS | PASS (gap: kit-agents) | skip | PASS |

### Cross-Role / Edge Cases (36-40)

| # | Prompt | Routing | Skills | Agent | Status |
|---|--------|---------|--------|-------|--------|
| 36 | Hello | PASS | PASS | skip | PASS |
| 37 | How does React server... | PASS | PASS (gap: research) | skip | PASS |
| 38 | Plan and build a login... | PASS | PASS | skip | PASS |
| 39 | commit and push | PASS | PASS | skip | PASS |
| 40 | continue | PASS | PASS | skip | PASS |

## Known Skill-Index Gaps (18 skills)

These skills have empty or insufficient keywords in `skill-index.json`,
making them undiscoverable via keyword matching alone. They are loaded
via agent `skills:` lists or platform detection instead.

| Skill | Affected Scenarios | Recommended Keywords |
|-------|--------------------|---------------------|
| a11y | #5, #8, #15, #26-30 | `a11y`, `accessibility`, `wcag`, `aria`, `screen-reader` |
| android-a11y | #8 | `talkback`, `android-accessibility`, `content-description` |
| backend-databases | #16, #20 | `postgresql`, `mongodb`, `database`, `sql`, `query` |
| backend-javaee | #16-19 | `javaee`, `jakarta`, `jax-rs`, `hibernate`, `ejb`, `cdi` |
| debugging | #17 | (has keywords, but "Hibernate" doesn't match any) |
| doc-coauthoring | #24 | `decision`, `write`, `draft`, `coauthor` |
| domain-b2b | #22 | `smart send` (without hyphen), `monitoring`, `inbox` |
| ios-a11y | #30 | `voiceover`, `ios-accessibility`, `accessibility-label` |
| ios-development | #3 | (has keywords, but generic "tests" prompt has no iOS signal) |
| ios-ui-lib | #1 | `face-id`, `settings`, `ios-ui` |
| kit-agent-development | #32 | `agent-development`, `create agent`, `system prompt` |
| kit-agents | #32, #35 | `agent`, `ecosystem`, `which agent` |
| kit-commands | #34 | `command`, `slash-command`, `/` |
| kit-skill-development | #31, #33 | `skill`, `create skill`, `optimize skill` |
| planning | #22, #23 | `design`, `spec`, `architecture`, `roadmap` |
| research | #37 | `how does`, `compare`, `best practice` |
| web-a11y | #15, #28 | `keyboard`, `aria`, `focus`, `web-accessibility` |
| ui-lib-dev | #14 | `component`, `document component`, `figma pipeline` |

## Action Items

- [ ] Add recommended keywords to the 18 gap skills listed above
- [ ] Re-run `generate-skill-index.cjs` after keyword updates
- [ ] Re-run `validate-role-scenarios.cjs` to confirm improvements
- [ ] Fix malformed JSON strings in skill-index (trailing quotes on triggers/platforms)
