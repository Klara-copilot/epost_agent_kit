# Skill Evaluation & Iteration

## Overview

After creating or modifying a skill, use this eval/iterate loop to verify quality and improve effectiveness. Adapted from the anthropic skill-creator methodology.

## The Eval Loop

```
Draft skill → Test with prompts → Evaluate output → Iterate → Expand test set
```

### Step 1: Draft Test Prompts

Create 2-3 realistic test prompts — things a real user would actually say:

```json
{
  "skill_name": "my-skill",
  "evals": [
    {
      "id": 1,
      "prompt": "Realistic user prompt that should trigger the skill",
      "expected_output": "Description of what good output looks like"
    }
  ]
}
```

**Good test prompts** are:
- Concrete and specific (file paths, names, context)
- Various lengths and formality levels
- Include edge cases, not just happy paths
- Mix casual speech with technical requests

### Step 2: Run Test Invocations

For each test prompt, invoke the skill and capture output:

1. Start a Claude Code session with the skill available
2. Type the test prompt
3. Observe: Did the skill trigger? Was the output correct?
4. Save the transcript for analysis

### Step 3: Evaluate Quality

**Qualitative checks:**
- Did the skill trigger on the expected prompts?
- Was the output format correct?
- Were instructions followed accurately?
- Was the output helpful and non-obvious?

**Quantitative checks (if applicable):**
- File output matches expected structure
- Required sections present
- Token usage reasonable (not bloated)

### Step 4: Iterate

Based on evaluation:
1. **Strengthen triggers** — add specific phrases to description
2. **Fix output** — clarify instructions in SKILL.md body
3. **Move content** — if SKILL.md is bloated, extract to references/
4. **Add examples** — if Claude struggles with format
5. **Bundle scripts** — if same code is rewritten repeatedly

### Step 5: Expand and Retest

After initial fixes:
- Add 2-3 more test prompts covering edge cases
- Test near-miss prompts (similar but shouldn't trigger)
- Verify progressive disclosure works (references load when needed)

## Quality Checklist

### Frontmatter

- [ ] `name:` present and lowercase-hyphens
- [ ] `description:` uses third person ("This skill should be used when...")
- [ ] `description:` includes 3+ specific trigger phrases
- [ ] No `version:` field (not valid Claude Code frontmatter)
- [ ] Other fields valid (user-invocable, context, agent, etc.)

### SKILL.md Body

- [ ] Under 2,000 words (ideally 1,500)
- [ ] Uses imperative/infinitive form (not "you should")
- [ ] References bundled resources clearly
- [ ] Core workflow is clear and actionable
- [ ] No duplicated content between SKILL.md and references/

### Progressive Disclosure

- [ ] SKILL.md has core essentials only
- [ ] Detailed patterns in references/
- [ ] Working examples in examples/ or references/
- [ ] Scripts in scripts/ if repetitive code exists
- [ ] All resources referenced from SKILL.md

### Triggering

- [ ] Triggers on expected user phrases
- [ ] Does NOT trigger on similar but unrelated phrases
- [ ] Description is "pushy" enough (skills tend to undertrigger)
- [ ] Trigger phrases cover casual and formal requests

### Token Budget

- [ ] Metadata (name + description): ~100 words
- [ ] SKILL.md body: <5,000 words loaded on trigger
- [ ] References: loaded only on demand
- [ ] Scripts: executed without loading into context

## Common Iteration Fixes

| Problem | Fix |
|---------|-----|
| Skill doesn't trigger | Add more specific phrases to description |
| Triggers on wrong prompts | Narrow description, add "should NOT be used for..." |
| Output too verbose | Add concision instructions, specify format |
| Missing edge cases | Add handling to SKILL.md or reference file |
| Same code rewritten each time | Bundle as script in scripts/ |
| SKILL.md too long | Move detailed content to references/ |
| Claude ignores instructions | Use imperative form, explain WHY not just WHAT |

## Description Optimization

The description is the primary trigger mechanism. To optimize:

1. **Include concrete phrases**: "create X", "configure Y", "debug Z"
2. **Be slightly pushy**: Skills tend to undertrigger, so be generous
3. **Cover synonyms**: "hook" + "automation" + "event handler"
4. **Include context cues**: "mentions PreToolUse" or "working with settings.json"
5. **Test edge cases**: prompts that share keywords but need different skills
