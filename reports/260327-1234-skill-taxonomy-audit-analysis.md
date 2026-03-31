# Skill Taxonomy Audit

**Date**: 2026-03-27
**Agent**: orchestrator
**Status**: complete

## Findings

### 40 skills exist, but CATEGORY_MAP has 55 entries

**20 stale entries** (skills deleted in rationalization, still in map):
`web-prototype`, `web-rag`, `ios-development`, `ios-ui-lib`, `ios-rag`, `android-development`, `android-ui-lib`, `problem-solving`, `sequential-thinking`, `repomix`, `doc-coauthoring`, `auto-improvement`, `data-store`, `scout`, `bootstrap`, `convert`, `simulator`, `epost`, `infra-cloud`, `infra-docker`

**7 stale kit entries** (consolidated to single `kit` skill):
`kit-agents`, `kit-agent-development`, `kit-skill-development`, `kit-hooks`, `kit-cli`, `kit-verify`

**4 missing entries** (exist on disk, not in map):
`clean-code`, `tdd`, `domain-b2c`, `web-a11y` (fallback to "uncategorized")

### CONNECTION_MAP equally stale

13 references to deleted skills: `web-rag`, `ios-rag`, `problem-solving`, `sequential-thinking`, `repomix`, `doc-coauthoring`, `auto-improvement`, `data-store`, `scout`

Missing connections for: `clean-code` → enhances `code-review`, `tdd` → enhances `test`, `launchpad` → enhances `cook`

### Current categories are unbalanced

| Category | Count | Problem |
|----------|-------|---------|
| development-tools | 16 | Grab-bag — mixes workflow commands with journal |
| analysis-reasoning | 14 | Mixes core rules, knowledge, reasoning, orchestration |
| frontend-web | 9 | Fine but has stale entries |
| kit-authoring | 7 | Mostly deleted skills |
| design-system | 4 | OK |
| accessibility | 4 | Missing web-a11y |
| mobile-development | 5 | Mostly deleted |
| infrastructure | 2 | Both deleted |
| backend-development | 2 | OK |
| business-domains | 1 | Missing domain-b2c |

## Proposed Taxonomy (9 categories, 40 skills)

| Category | Skills | Count |
|----------|--------|-------|
| **workflow** | cook, fix, debug, plan, test, review, audit, docs, git, get-started, launchpad, research | 12 |
| **quality** | core, code-review, clean-code, tdd, error-recovery | 5 |
| **knowledge** | knowledge-retrieval, knowledge-capture, journal, docs-seeker, skill-discovery, subagent-driven-development | 6 |
| **web** | web-frontend, web-nextjs, web-api-routes, web-auth, web-i18n, web-modules, web-testing, web-ui-lib | 8 |
| **accessibility** | a11y, ios-a11y, android-a11y, web-a11y | 4 |
| **design** | figma, design-tokens, ui-lib-dev | 3 |
| **backend** | backend-javaee, backend-databases | 2 |
| **domain** | domain-b2b, domain-b2c | 2 |
| **kit** | kit (single consolidated skill) | 1 |

**Total**: 43 slots, 40 unique skills (3 skills removed from stale entries)

### Category definitions

- **workflow**: User-invocable action skills — commands the user triggers directly
- **quality**: Background discipline skills — always-on code standards and practices
- **knowledge**: Retrieval, capture, discovery — information management layer
- **web**: Web platform specifics — React, Next.js, APIs, auth, i18n, testing
- **accessibility**: WCAG compliance — cross-platform base + platform specializations
- **design**: Design system pipeline — Figma, tokens, component libraries
- **backend**: Backend platform — Jakarta EE, databases
- **domain**: Business domain knowledge — B2B modules, B2C patterns
- **kit**: Kit authoring tools — skill/agent/hook development

## Connection Graph (cleaned)

```
extends:
  ios-a11y → a11y
  android-a11y → a11y
  web-a11y → a11y

enhances:
  web-nextjs → web-frontend
  web-api-routes → web-frontend
  web-modules → web-frontend
  backend-databases → backend-javaee
  ui-lib-dev → figma (requires)
  design-tokens → figma (requires)
  knowledge-capture → knowledge-retrieval (requires)
  docs-seeker → research
  knowledge-retrieval → research, plan
  subagent-driven-development → plan
  error-recovery → debug
  debug → fix
  test → code-review
  audit → review
  cook → plan
  clean-code → code-review
  tdd → test
  launchpad → cook
```
