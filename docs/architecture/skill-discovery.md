# Skill Discovery System (Phase 4 - v1.1.0)

## Overview

The skill discovery system enables automated skill indexing, metadata-driven activation, and intelligent skill recommendations. This allows agents to automatically discover and load relevant skills based on task context.

## Architecture

**Skill Index** (`skill-index.json`):
```json
{
  "skills": [
    {
      "name": "web/nextjs",
      "description": "Next.js patterns and best practices",
      "platform": "web",
      "category": "framework",
      "tags": ["react", "server-components", "routing"],
      "difficulty": "intermediate",
      "prerequisites": ["web/frontend-development"],
      "created": "2026-02-06",
      "version": "1.0.0"
    }
  ],
  "categories": ["framework", "testing", "design", "deployment"],
  "platforms": ["web", "ios", "android", "shared"],
  "lastGenerated": "2026-02-06T12:00:00Z"
}
```

## Discovery Methods

### 1. Metadata-Based Discovery

- Index scanned on startup
- Skills organized by category, platform, difficulty
- Tag-based filtering and matching
- Dependency resolution and prerequisite checking

**Example Query**:
```
Find skills matching: "React testing"
  ├─ Platform: web
  ├─ Category: testing
  ├─ Tags: [react, testing]
  └─ Result: web/frontend-development, testing-library-patterns
```

### 2. Context-Driven Activation

- Task analysis triggers skill recommendations
- Agents auto-load prerequisites
- Dependency resolution and circular detection
- Relevance scoring for optimal selection

**Example Flow**:
```
Task: "Build React component with tests"
  ↓
Analyze context (keywords, file types)
  ├─ Detected: React, .test.ts files, Vitest
  ↓
Query skill index
  ├─ web/frontend-development (match: React)
  ├─ testing-library (match: tests)
  └─ vitest-config (match: Vitest)
  ↓
Load skills with dependencies
  └─ Automatically loads prerequisites
```

### 3. Performance Optimization

- Lazy loading: Skills loaded on-demand
- Caching: Index cached in memory
- Heuristics: Common skills pre-loaded
- Background indexing: Updates in background

**Caching Strategy**:
- Index cached for 1 hour
- Skill content cached on first load
- Background refresh every 30 minutes
- Manual refresh with `npx skills --refresh`

## Integration Points

### Agent Skill Loading

```
Agent receives task
  ↓
Analyzes task context (keywords, platform, complexity)
  ↓
Queries skill index (find matching skills)
  ↓
Loads skills with dependencies
  ↓
Executes task with skill context
```

### CLI Integration

- `/find-skills [query]` - Search skills by name/description
- `npx skills list` - Display all available skills
- `npx skills add <skill>` - Install specific skill
- `npx skills --refresh` - Force index regeneration
- Hook integration: Auto-activates skills based on project type

## Skill Metadata Schema

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Skill identifier (e.g., `web/nextjs`) |
| `description` | string | One-line skill description |
| `platform` | string | Target platform (web, ios, android, shared) |
| `category` | string | Skill category (framework, testing, design, etc.) |
| `tags` | string[] | Searchable tags |
| `difficulty` | string | difficulty level (beginner, intermediate, advanced) |
| `prerequisites` | string[] | Required skills |
| `created` | ISO8601 | Creation timestamp |
| `version` | semver | Skill version |

## Generation

**Script**: `.claude/scripts/generate-skill-index.cjs`

```bash
node .claude/scripts/generate-skill-index.cjs [--output ./skill-index.json]
```

**Process**:
1. Scan `.claude/skills/` directory
2. Parse skill frontmatter and metadata
3. Extract tags, categories, dependencies
4. Build skill-index.json
5. Validate against schema
6. Cache index in memory

---

**Last Updated**: 2026-02-06
**Status**: v1.1.0 Phase 4 Complete
