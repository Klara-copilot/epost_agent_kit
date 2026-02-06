# Agents & Roles (19 Total)

## Global Agents (9 agents)

### 1. Orchestrator
**Role**: Top-level router and project manager

**Responsibilities**:
- Route incoming tasks to appropriate global agents
- Detect platform from context (file types, project structure)
- Manage project structure and dependencies
- Coordinate cross-cutting concerns

**Delegates To**: All other global agents

### 2. Architect
**Role**: Design, planning, and technical research

**Responsibilities**:
- Design system architecture
- Create implementation plans
- Research technical approaches
- Propose solutions to complex problems

**Delegates To**: Implementer (if platform-specific decision reached)

### 3. Implementer
**Role**: Feature implementation delegator

**Responsibilities**:
- Coordinate implementation across platforms
- Detect platform from context
- Delegate to platform-specific implementers
- Aggregate results from platform agents

**Delegates To**: web/implementer, ios/implementer, android/implementer

### 4. Reviewer
**Role**: Code review and performance analysis

**Responsibilities**:
- Review code for quality and best practices
- Analyze performance metrics
- Security validation
- Suggest improvements

**Delegates To**: web/tester (for platform-specific review), ios/tester

### 5. Researcher
**Role**: Multi-source research and validation

**Responsibilities**:
- Conduct multi-source research
- Validate technical approaches
- Gather context from documentation
- No platform-specific knowledge (global capability)

**Delegates To**: None (executes directly)

### 6. Debugger
**Role**: Debugging coordination

**Responsibilities**:
- Diagnose issues and bugs
- Coordinate debugging sessions
- Delegate to platform debuggers for runtime issues

**Delegates To**: web/debugger, ios/simulator, android/debugger

### 7. Tester
**Role**: Test orchestration

**Responsibilities**:
- Plan test strategy
- Coordinate test execution
- Aggregate test results
- Delegate to platform testers

**Delegates To**: web/tester, ios/tester, android/tester

### 8. Documenter
**Role**: Cross-platform documentation

**Responsibilities**:
- Generate and maintain documentation
- Create README, API docs, guides
- Ensure consistency across platforms

**Delegates To**: None (executes directly)

### 9. Git-Manager
**Role**: Git operations coordination

**Responsibilities**:
- Manage commits, branches, PRs
- Coordinate version control

**Delegates To**: None (executes directly)

## Specialized Agents (4 agents - Phase 2)

### 10. Designer
**Role**: UI/UX design specialist

**Responsibilities**:
- UI/UX design and component creation
- Accessibility and WCAG compliance
- Design system consistency
- Layout and visual hierarchy

**Delegates To**: web/designer (for implementation)

### 11. Copywriter
**Role**: Content and messaging expert

**Responsibilities**:
- Microcopy and UX text optimization
- Documentation and guides
- Error messages and notifications
- User-facing messaging

### 12. Journal-Writer
**Role**: Session notes and learning capture

**Responsibilities**:
- Document session decisions and learnings
- Create meeting notes and summaries
- Track design decisions and rationale
- Maintain knowledge base

### 13. MCP-Manager
**Role**: Model Context Protocol integration

**Responsibilities**:
- Manage MCP (Model Context Protocol) connections
- Coordinate with external services
- Handle protocol discovery and validation
- Manage context injection and routing

---

**Last Updated**: 2026-02-06
**Version**: v1.1.0 (Phase 2 completion)
