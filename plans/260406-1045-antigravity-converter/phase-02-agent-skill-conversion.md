---
phase: 2
title: "Agent + Skill Conversion + Platform Rules"
effort: 3h
depends: [1]
---

## Context

- Plan: [plan.md](plan.md)
- CLI repo: `epost-agent-kit-cli/`
- Existing adapter: `src/domains/installation/antigravity-adapter.ts` (from phase 1)
- JetBrains short-circuit pattern: `src/commands/init.ts` → `runJetBrainsInit()`
- Agent source: `.claude/agents/*.md` (Claude Code format)
- Skill source: `.claude/skills/*/SKILL.md`

## ⚠️ Research Correction Context

Initial research incorrectly said Antigravity has no agent definitions. **Verified correct:**
- `.antigravity/agents/*.yaml` — YAML agent definitions (name, description, role, model, tools, readonly)
- `skills/*/SKILL.md` — Skills ARE invocable via `/` slash commands (Markdown-only, no YAML frontmatter)
- `.agent/rules/{platform}.md` — Platform-scoped rules supplements

## Requirements

### 2a. Agent Conversion: `.claude/agents/*.md` → `.antigravity/agents/*.yaml`

Add `transformAgent()` implementation in `AntigravityAdapter`:

```typescript
transformAgent(source: string, filename: string): { path: string; content: string } | null {
  const frontmatter = parseFrontmatter(source);
  const body = extractBody(source);

  const yaml: Record<string, unknown> = {
    name: frontmatter.name ?? filename.replace('.md', ''),
    description: frontmatter.description ?? '',
    role: body.split('\n').slice(0, 3).join(' ').trim(), // first 3 lines as role
  };

  // model mapping
  const modelMap: Record<string, string> = {
    haiku: 'claude-haiku-4-5',
    sonnet: 'claude-sonnet-4-6',
    opus: 'claude-opus-4-6',
  };
  if (frontmatter.model) {
    yaml.model = modelMap[frontmatter.model] ?? frontmatter.model;
  }

  // permissionMode → readonly
  if (frontmatter.permissionMode === 'plan') {
    yaml.readonly = true;
  }

  // disallowedTools → restrict tools
  if (frontmatter.disallowedTools) {
    yaml.restrictedTools = frontmatter.disallowedTools.split(',').map((t: string) => t.trim());
  }

  const yamlContent = stringifyYaml(yaml);
  return {
    path: `.antigravity/agents/${filename.replace('.md', '.yaml')}`,
    content: yamlContent,
  };
}
```

**YAML format reference** (from verified docs):
```yaml
name: epost-fullstack-developer
description: Build and implement features across web, iOS, Android, and backend
role: |
  You are a full-stack developer specializing in epost platform...
model: claude-sonnet-4-6
readonly: false
```

### 2b. Skill Conversion: `.claude/skills/*/SKILL.md` → `skills/*/SKILL.md`

Add `transformSkill()` implementation — strip YAML frontmatter, keep body:

```typescript
transformSkill(source: string, skillName: string): { path: string; content: string } {
  const body = extractBody(source);  // strip everything between --- delimiters
  const firstLine = body.trim().split('\n')[0];
  const title = firstLine.startsWith('#') ? firstLine : `# ${skillName}`;

  return {
    path: `skills/${skillName}/SKILL.md`,
    content: `${title}\n\n${body.trim()}`,
  };
}
```

### 2c. Platform Rules: `.agent/rules/{platform}.md`

Generate platform-scoped rules from CURSOR.snippet.md content (same source as Cursor split-rules):

```typescript
generatePlatformRules(snippets: PackageSnippet[]): Array<{ path: string; content: string }> {
  const platformMap: Record<string, { glob: string; packagePrefix: string }> = {
    web:     { glob: '**/*.{ts,tsx,scss,css}', packagePrefix: 'platform-web' },
    ios:     { glob: '**/*.swift',             packagePrefix: 'platform-ios' },
    android: { glob: '**/*.kt',                packagePrefix: 'platform-android' },
    backend: { glob: '**/*.java',              packagePrefix: 'platform-backend' },
  };

  return Object.entries(platformMap).map(([platform, config]) => {
    const snippet = snippets.find(s => s.packageName.startsWith(config.packagePrefix));
    return {
      path: `.agent/rules/${platform}.md`,
      content: snippet?.cursorSnippet ?? snippet?.claudeSnippet ?? '',
    };
  }).filter(r => r.content);
}
```

### 2d. Wire into `runAntigravityInit()` in `init.ts`

Expand the short-circuit block to:
1. Read agent source files from `.claude/agents/`
2. Call `adapter.transformAgent()` for each → write to `.antigravity/agents/`
3. Read skill source files from `.claude/skills/*/SKILL.md`
4. Call `adapter.transformSkill()` for each → write to `skills/*/SKILL.md`
5. Call `adapter.generatePlatformRules()` → write `.agent/rules/*.md`
6. Generate `GEMINI.md` + `AGENTS.md` (from phase 1)

## File Ownership

| File | Action |
|------|--------|
| `src/domains/installation/antigravity-adapter.ts` | MODIFY — add `transformAgent()`, `transformSkill()`, `generatePlatformRules()` |
| `src/commands/init.ts` | MODIFY — expand `runAntigravityInit()` |

## TODO

- [ ] Read `antigravity-adapter.ts` (from phase 1)
- [ ] Add `transformAgent()` — parse frontmatter, emit YAML
- [ ] Add `transformSkill()` — strip YAML frontmatter, keep body
- [ ] Add `generatePlatformRules()` — platform rules from cursor snippets
- [ ] Read `init.ts` — find `runAntigravityInit()`
- [ ] Expand to write agent YAMLs, skill Markdowns, platform rules
- [ ] Run `npm test` — must pass
- [ ] Run `npx tsc --noEmit` — must be clean

## Success Criteria

- `.antigravity/agents/epost-fullstack-developer.yaml` exists with `name`, `description`, `model`, `role`
- `skills/web-frontend/SKILL.md` exists as Markdown-only (no `---` frontmatter block)
- `.agent/rules/web.md` exists with web platform conventions
- No `.claude/` path references in any generated file
- All 301+ tests pass
