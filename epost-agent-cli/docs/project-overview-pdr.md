# epost-kit CLI - Project Overview & PDR

**Project**: epost-agent-kit Distribution CLI
**Version**: 0.1.0
**Status**: Phase 01 Complete - Project Setup
**Last Updated**: 2026-02-06

## Executive Summary

epost-kit is a **command-line distribution tool** for the epost-agent-kit framework. It enables developers to install and manage multi-IDE agent kits (Claude Code, Cursor, GitHub Copilot) seamlessly.

**Key Achievement**: Complete TypeScript ESM scaffold with build pipeline, test framework, linting, and type safety.

## Vision

Enable single-command installation of AI agent frameworks across multiple IDE platforms with safety, tracking, and rollback capabilities.

## Core Requirements

### Functional Requirements

#### FR-1: CLI Command Routing
- Parse user input via Commander.js
- Route to appropriate command handlers
- Display help and version information

**Acceptance Criteria**:
- `epost-kit --help` displays available commands
- `epost-kit --version` shows version
- Invalid commands show usage error

#### FR-2: Configuration Management
- Load configuration from `.epostrc`, `epost.config.*` files
- Merge with CLI defaults
- Support IDE target selection

**Acceptance Criteria**:
- Load from `.epostrc` (JSON, YAML)
- Load from `epost.config.js` (CommonJS/ESM)
- Respect CLI --target override
- Default to Claude Code if unspecified

#### FR-3: File Operations
- Install framework files safely
- Track installed files via metadata
- Detect user modifications

**Acceptance Criteria**:
- Copy files with checksum verification
- Create .epost-metadata.json
- Flag files that were modified after installation
- Never modify protected files (.git, .env, etc.)

#### FR-4: IDE Support
- Support three target IDEs: Claude Code, Cursor, GitHub Copilot
- Install to correct directories (.claude, .cursor, .github)
- Adapt content for IDE conventions (future)

**Acceptance Criteria**:
- Detect target from --target option
- Map to correct directory
- Load appropriate config format

#### FR-5: GitHub Integration
- Fetch latest release from GitHub
- Download assets
- Check for updates

**Acceptance Criteria**:
- Query GitHub Releases API
- Handle rate limiting
- Provide offline fallback (if cached)

### Non-Functional Requirements

#### NFR-1: Type Safety
- Full TypeScript strict mode
- No `any` types (only `unknown` with guards)
- Explicit return types

**Acceptance Criteria**:
- TypeScript --strict passes
- ESLint reports zero warnings
- vitest coverage >= 80%

#### NFR-2: Error Handling
- Descriptive error messages
- Proper exit codes
- User guidance on recovery

**Acceptance Criteria**:
- ConfigError: Wrong config format
- FileError: Permission/IO issues
- ValidationError: Invalid input

#### NFR-3: Performance
- CLI startup < 1 second
- Configuration load < 100ms
- File operations parallel where possible

**Acceptance Criteria**:
- Measured via `time epost-kit --help`
- No blocking I/O in CLI initialization

#### NFR-4: Security
- Never modify protected files
- Track all file changes
- Validate checksums

**Acceptance Criteria**:
- Protected patterns enforced
- .epost-metadata.json prevents overwrites
- SHA256 validation on updates

#### NFR-5: User Experience
- Clear, colored output (picocolors)
- Progress spinners (ora)
- Interactive prompts (@inquirer/prompts)

**Acceptance Criteria**:
- Installation shows spinner
- Errors shown in red
- Prompts guide user decisions

## Architecture Decisions

### Decision 1: Commander.js for CLI

**Choice**: Commander.js v12 with extra-typings

**Rationale**:
- Industry standard
- Type-safe with extra-typings
- Handles parsing, help, version automatically
- Extensible for future commands

**Alternative Considered**: yargs (more verbose, less type-safe)

### Decision 2: Cosmiconfig for Configuration

**Choice**: cosmiconfig for config discovery

**Rationale**:
- Searches multiple formats (.epostrc, .yaml, .js)
- Respects project boundaries
- Industry standard pattern
- Merges defaults with user config

**Alternative**: Manual JSON parsing (too inflexible)

### Decision 3: Vitest for Testing

**Choice**: Vitest for unit testing

**Rationale**:
- ESM-native (unlike Jest)
- TypeScript first-class support
- Fast (Vite-powered)
- Simple configuration

**Alternative**: Jest (requires ESM workarounds)

### Decision 4: Type-First Approach

**Choice**: Define interfaces first, implement after

**Rationale**:
- Contracts established upfront
- Easier to review and modify
- Better documentation
- Prevents API drift

### Decision 5: Package Structure (Monorepo)

**Choice**: epost-agent-cli as subdirectory in monorepo

**Rationale**:
- Shared dependencies with framework
- Single repository for related projects
- Easier cross-reference updates
- Simplified release coordination

## Success Criteria

### Phase 01 (Completed)
- [x] TypeScript ESM scaffold
- [x] Build pipeline (tsc → dist/)
- [x] Test framework configured (vitest)
- [x] Linting configured (eslint)
- [x] Types & constants defined
- [x] CLI entry point working (--help, --version)
- [x] 80% test coverage framework ready

### Phase 02 (In Progress)
- [ ] Config loader (cosmiconfig)
- [ ] File operations utility
- [ ] GitHub API client
- [ ] Metadata manager
- [ ] Unit test coverage >= 80%

### Phase 03 (Next)
- [ ] Install command
- [ ] List command
- [ ] Update command
- [ ] Create command
- [ ] Command integration tests

### Phase 04+ (Future)
- [ ] Multi-target installation
- [ ] Conflict resolution
- [ ] Rollback mechanism
- [ ] Skill marketplace
- [ ] CI/CD pipeline
- [ ] npm package publishing

## Technical Stack

| Component | Technology | Version | Rationale |
|-----------|-----------|---------|-----------|
| CLI Framework | Commander.js | 12.1.0 | Type-safe, extensible |
| Config Discovery | cosmiconfig | 9.0.0 | Multi-format, flexible |
| Interactive Prompts | @inquirer/prompts | 7.2.0 | Modern, accessible |
| Progress Display | ora | 8.1.1 | Lightweight spinners |
| Terminal Colors | picocolors | 1.1.1 | Tiny footprint |
| Validation | zod | 3.24.1 | Runtime schema validation |
| Shell Execution | execa | 9.5.2 | Safe, modern subprocess |
| **Development** |
| Language | TypeScript | 5.7.3 | Type safety, modern syntax |
| Testing | Vitest | 2.1.8 | ESM-native, fast |
| Linting | ESLint | 9.18.0 | Code quality |
| Target Runtime | Node.js | >=18.0.0 | ESM support, modern APIs |

## Implementation Phases

### Phase 01: Project Setup (COMPLETED 2026-02-06)

**Deliverables**:
- TypeScript configuration (strict mode)
- Build pipeline (tsc)
- Test framework (vitest)
- Linting (eslint)
- CLI scaffold (Commander.js)
- Type definitions

**Files Created**: 10 files
**LOC**: ~2,600 tokens
**Status**: Complete ✓

### Phase 02: Core Utilities (Next)

**Deliverables**:
- Config loader (cosmiconfig integration)
- File manager (safe operations)
- GitHub API client (fetch releases)
- Metadata manager (installation tracking)
- Comprehensive unit tests

**Estimated**: 2 weeks
**Priority**: P0 (blocks Phase 03)

### Phase 03: Commands Implementation

**Deliverables**:
- `install` command
- `list` command
- `update` command
- `create` command

**Estimated**: 3 weeks
**Blocks**: Nothing (Phase 04 depends on this)

### Phase 04: Advanced Features

**Deliverables**:
- Multi-target installation
- Conflict resolution UI
- Rollback mechanism
- Skill marketplace search

**Estimated**: 2 weeks
**Priority**: P1 (nice-to-have)

## Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|-----------|
| GitHub API rate limiting | Blocked installations | Medium | Cache releases, offline fallback |
| Large file downloads | Slow on slow networks | Medium | Streaming, progress reporting |
| Protected file conflicts | Data loss | Low | Metadata tracking, user confirmation |
| IDE format changes | CLI breaks | Low | Version pinning, compatibility matrix |
| Node version mismatch | CLI won't run | Low | Clear engine requirement (>=18) |

## Dependencies & Constraints

### External Dependencies
- Node.js >= 18.0.0 (ESM support)
- GitHub API (public, no auth initially)
- File system access

### Internal Dependencies
- epost-agent-kit framework (source of truth)
- GitHub repository (distribution source)

### Build Constraints
- Strict TypeScript mode
- 80% test coverage minimum
- All tests must pass before build
- ESLint must pass before publish

## Release Strategy

### Version Scheme
- Semantic Versioning (MAJOR.MINOR.PATCH)
- Current: 0.1.0 (pre-release)
- 1.0.0 = Phase 03 complete + stability period

### Distribution Channels
1. **npm Registry**
   ```bash
   npm install -g epost-kit
   ```

2. **GitHub Releases**
   - Compiled binaries
   - Checksums (SHA256)

3. **Monorepo**
   ```bash
   npm install -w epost-agent-cli
   npx epost-kit
   ```

## Maintenance & Support

### Documentation
- README.md: Quick start
- docs/codebase-summary.md: Structure
- docs/code-standards.md: Standards
- docs/system-architecture.md: Design
- docs/project-roadmap.md: Timeline

### Testing
- Unit tests: Core logic
- Integration tests: Component interaction
- Manual testing: CLI UX

### Monitoring
- Test coverage (vitest)
- Type checking (TypeScript)
- Linting (ESLint)
- GitHub Actions (CI/CD)

## Key Metrics

| Metric | Target | Status |
|--------|--------|--------|
| Build Time | <10s | ✓ Met |
| CLI Startup | <1s | ✓ Met |
| Test Coverage | >=80% | ✓ Framework ready |
| Type Safety | Strict TS | ✓ Enabled |
| Linting | Zero warnings | ✓ Configured |

## Stakeholders

| Role | Responsibility | Contact |
|------|-----------------|---------|
| Developer | Implementation | Phuong Doan |
| Maintainer | Documentation, releases | Phuong Doan |
| Users | Feedback, issues | GitHub issues |

## Next Actions

1. **Immediate** (This Week)
   - [ ] Mark Phase 01 complete
   - [ ] Begin Phase 02 planning
   - [ ] Set up GitHub CI/CD

2. **Short Term** (Next 2 Weeks)
   - [ ] Implement config loader
   - [ ] Implement file manager
   - [ ] Implement GitHub client
   - [ ] 80% test coverage

3. **Medium Term** (Following 3 Weeks)
   - [ ] Implement commands
   - [ ] Integration tests
   - [ ] Manual testing

---

**Created by**: Phuong Doan
**Last Updated**: 2026-02-06
**Next Review**: After Phase 02 completion
**Status**: Foundation Phase Complete - Ready for Phase 02
