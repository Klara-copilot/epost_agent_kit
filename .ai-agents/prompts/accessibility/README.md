# Accessibility Prompts

Reusable prompts for accessibility agents (@architect, @auditor, @fixer) to help with iOS accessibility improvements. These prompts are optimized using Context7-informed best practices for clarity, specificity, and actionable output.

## Usage

Copy and paste these prompts into Cursor chat when working on specific accessibility tasks. The appropriate agent will be invoked automatically based on the `@agent` tag.

**How to use:**
1. Open the Swift file(s) you're working on in Cursor
2. Copy the relevant prompt from `.ai-agents/prompts/accessibility/`
3. Replace placeholders (e.g., `{FINDING_ID}`, `{N}`) with actual values
4. Paste into Cursor chat with agent prefix: `@accessibilities-architect`, `@accessibilities-auditor`, or `@accessibilities-fixer`
5. Review the suggested code changes or audit results

## Prompts by Agent

### @architect - Real-Time Development Prompts

These prompts help during active development to ensure accessibility is built in from the start.

#### Button Accessibility
**File:** `button-accessibility-prompt.txt`  
**When to use:** Creating or editing buttons in a view controller

**Key features:**
- Scans for all `UIButton` instances
- Checks against a11y-buttons.mdc rules
- Provides patch-style code edits
- Includes before/after examples

#### Heading Accessibility
**File:** `heading-accessibility-prompt.txt`  
**When to use:** Working with titles and headings

**Key features:**
- Identifies all visual headings
- Determines appropriate heading levels (H1-H6)
- Provides exact code for `.header` trait
- Maintains logical hierarchy

#### Modal Dialog Accessibility
**File:** `modal-dialog-accessibility-prompt.txt`  
**When to use:** Implementing modal dialogs or popups

**Key features:**
- Ensures focus management
- Sets `accessibilityViewIsModal`
- Handles focus return on dismissal
- Includes announcement patterns

### @auditor - Batch Audit Prompts

These prompts run accessibility audits on code changes, typically used in CI/CD or pre-commit checks.

#### Git Diff Audit
**File:** `audit-git-diff-prompt.txt`  
**When to use:** Before committing or creating a PR to check for new violations

**Key features:**
- Audits all Swift files changed in current Git diff
- Matches violations against known findings
- Returns JSON report with violation details
- Determines if PR should be blocked

**Output:** JSON with `total_violations`, `critical`, `violations[]`, `should_block_pr`

### @fixer - Batch Fix Prompts

These prompts apply surgical fixes to specific accessibility findings.

#### Fix Specific Finding
**File:** `fix-specific-finding-prompt.txt`  
**When to use:** Fixing a single known finding by ID

**Usage:** Replace `{FINDING_ID}` with the actual ID (e.g., "3")

**Key features:**
- Loads finding from epost-known-findings.json
- Locates code using file_pattern and code_pattern
- Applies appropriate fix_template
- Returns unified diff for manual review

**Output:** JSON with `finding_id`, `file`, `status`, `diff`, `explanation`

#### Batch Fix Top N Findings
**File:** `fix-batch-top-n-prompt.txt`  
**When to use:** Fixing multiple high-priority findings at once

**Usage:** Replace `{N}` with number of findings (e.g., "5" for top 5)

**Key features:**
- Processes top N findings with priority = 1
- Skips already fixed findings
- Generates diffs for all findings
- Returns array of fix results

**Output:** JSON array with one object per finding

### Rulebook Maintenance Prompts

These prompts help maintain and evolve the accessibility rulebook over time.

#### Refine Rules After Audit
**File:** `evolve-refine-rules-prompt.txt`  
**When to use:** After running an audit to identify gaps in rule coverage and improve rule clarity

**Key features:**
- Analyzes audit JSON report for recurring violation patterns
- Identifies gaps in existing rule files
- Proposes specific markdown additions/modifications
- Maintains rule file conciseness and structure

**Output:** Structured markdown analysis with proposed rule improvements

**Usage:** Paste audit JSON report in context, then use this prompt to get rule refinement suggestions

## Naming Pattern

Prompts follow a clear naming pattern:
- `*-accessibility-prompt.txt` - @architect prompts (real-time development)
- `audit-*-prompt.txt` - @auditor prompts (batch audits)
- `fix-*-prompt.txt` - @fixer prompts (batch fixes)
- `evolve-*-prompt.txt` - Rulebook maintenance prompts (iterative improvement)

## Related Files

- **Accessibility rules**: `.ai-agents/rules/accessibility/a11y-*.md`
- **Known findings**: `.agent-knowledge/epost-known-findings.json`
- **Agent configs**: `.cursor/agents.json` (use `@accessibilities-architect`, `@accessibilities-auditor`, `@accessibilities-fixer`)

