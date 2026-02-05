# Debugging Skill

## Purpose
Systematic debugging methodology.

## When Active
User uses /debug, reports errors.

## Expertise

### Systematic Debugging
1. **Understand**: What's the symptom?
2. **Reproduce**: Can you reproduce it?
3. **Isolate**: What's the minimal case?
4. **Analyze**: What's actually happening?
5. **Hypothesize**: What could cause this?
6. **Verify**: Does the fix work?

### Log Analysis
- Parse error messages
- Follow stack traces
- Identify log patterns
- Contextual logging

### Stack Trace Interpretation
- Read top-down
- Identify root cause frame
- Distinguish cause from symptom
- Async stack traces

### Reproduction Strategies
- Minimal reproduction
- Environment matching
- Data setup
- Step reproduction

### Root Cause Analysis
- 5 Whys technique
- Fishbone diagrams
- Timeline analysis
- Code flow tracing

### Fix Validation
- Regression testing
- Edge case testing
- Performance impact
- Side effect analysis

## Patterns

### Debug Logging
```typescript
console.log('[Feature]', { variable, state });
console.debug('[Debug]', value);
console.error('[Error]', error);
```

### Error Boundaries
```typescript
class ErrorBoundary extends Component {
  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }
}
```

### Debug Mode
```typescript
const DEBUG = process.env.DEBUG === 'true';
if (DEBUG) console.debug('Debug info');
```

### Structured Logging
```typescript
logger.info('User action', {
  action: 'login',
  userId: user.id,
  timestamp: Date.now()
});
```

## Common Issues

### TypeScript
- Type mismatches
- Missing type imports
- Any type issues
- Generic constraints

### React
- Stale closures
- Missing dependencies
- Re-render loops
- State timing

### Async
- Race conditions
- Promise rejection
- Missing await
- Callback hell

## Defense-in-Depth Patterns

### Validation Layers
1. Input validation (reject invalid early)
2. Business logic validation (enforce invariants)
3. Output validation (verify results before return)

### Error Handling Strategy
- **Catch**: Only where you can handle meaningfully
- **Transform**: Convert to domain-specific errors
- **Log**: Include context (not just message)
- **Propagate**: Let upstream handle if you can't

### Assertion vs Exception
- Assertions: Programmer errors (should never happen)
- Exceptions: Runtime problems (can happen legitimately)

## Root Cause Tracing

### The 5-Step Method
1. **Observe**: What exactly is wrong?
2. **Question**: Why is this happening?
3. **Hypothesis**: What could cause this?
4. **Isolate**: Test each hypothesis
5. **Verify**: Confirm root cause and fix

### Binary Search for Root Cause
- Cut code/config in half
- Does symptom persist? Keep smaller half, discard larger
- Repeat until isolated to single cause

## Verification Checklist
- [ ] Symptom reproduced consistently
- [ ] Root cause identified and documented
- [ ] Fix applied and tested
- [ ] No new issues introduced
- [ ] Edge cases considered
- [ ] Similar issues checked elsewhere in codebase

## Tools
- Browser DevTools (breakpoints, profiling)
- Node debugger (--inspect)
- Console logging (structured)
- Source maps (correct line numbers)
- Test suite (regression testing)
