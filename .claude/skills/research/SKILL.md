---
name: research
description: Multi-source information gathering and validation with cross-referencing
keywords: [research, investigation, documentation, sources, validation, best-practices]
platforms: [all]
triggers: ["/research", "research", "best practices", "how to"]
agent-affinity: [epost-researcher, epost-architect]
user-invocable: false
context: fork
agent: Explore
---

# Research Skill

## Purpose
Multi-source information gathering and validation.

## When Active
User asks for research, best practices, comparison.

## Expertise

### Source Evaluation
- Check documentation currency
- Verify author credibility
- Cross-reference claims
- Identify outdated info

### Information Synthesis
- Combine multiple sources
- Identify consensus views
- Note conflicting opinions
- Extract key patterns

### Cross-Validation
- Verify across sources
- Check official docs first
- Test code examples
- Community validation

### Documentation Navigation
- Finding relevant sections
- Understanding API references
- Following linked guides
- Reading examples

### Code Example Discovery
- GitHub repos
- CodeSandbox demos
- Official examples
- Stack Overflow snippets

### Trend Analysis
- Recent developments
- Deprecation notices
- New best practices
- Community direction

## Research Process

1. **Define**: What are we researching?
2. **Search**: Multiple sources (docs, blogs, repos)
3. **Evaluate**: Source credibility and recency
4. **Synthesize**: Combine findings
5. **Validate**: Cross-check across sources
6. **Document**: Organized findings

## Source Priority

1. Official documentation (highest)
2. Official examples/tutorials
3. Well-known community resources
4. GitHub repositories with activity
5. Stack Overflow (for specific issues)

## Output Format

```markdown
# Research: [Topic]

## Summary
[2-3 sentence overview]

## Key Findings
- [Finding 1]
- [Finding 2]

## Sources
- [Source 1](url) - [key takeaway]
- [Source 2](url) - [key takeaway]

## Recommendations
[Based on research]

## Caveats
[Any limitations or concerns]
```

## Advanced Techniques

### Query Fan-Out
- Ask multiple related questions in parallel
- "What is X?" + "How to use X?" + "Best practices for X?"
- Reduces total research time

### Source Validation
- Cross-reference claims across 3+ sources
- Check if multiple sources cite same research
- Look for contradictions and note them
- Verify dates (prefer sources <2 years old)

### Technology Trend Identification
- Check GitHub stars and recent activity
- Review recent changelog/updates
- Look at community sentiment in forums
- Note if project is actively maintained
- Watch for deprecation notices

### Code Example Validation
- Test examples in isolated environment
- Verify version matches your target
- Check example handles error cases
- Look for performance implications

## Research Output Template

```markdown
# Research: [Topic]

## Question
[What you were researching]

## Summary
[2-3 sentence overview]

## Key Findings
- [Finding 1] - sources: [Source A, Source B]
- [Finding 2] - sources: [Source C]

## Sources Reviewed
- [Source 1](url) - [Date] - [key takeaway]
- [Source 2](url) - [Date] - [key takeaway]

## Recommendations
[Based on research and cross-validation]

## Confidence Level
[High/Medium/Low] - based on source consistency

## Caveats
[Limitations, version-specific info, or conflicting opinions]
```

## Best Practices
- Prioritize official docs
- Check publication dates (prefer <2 years)
- Verify code examples work
- Note version-specific info clearly
- Cite sources with URLs and dates
- Cross-validate findings
- Document contradictions
- Track confidence level per finding
