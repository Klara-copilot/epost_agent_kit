# Platform Debug Patterns

Platform-specific debugging tools, log locations, and error patterns.

---

## Web / TypeScript / React

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

### Debug Mode Flag
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

### Common Issues
- **TypeScript**: Type mismatches, missing type imports, `any` type issues, generic constraints
- **React**: Stale closures, missing useEffect dependencies, re-render loops, state timing
- **Async**: Race conditions, Promise rejection, missing `await`, callback hell

### Tools
- Browser DevTools (breakpoints, profiling)
- Node debugger (`--inspect`)
- Source maps (correct line numbers)
- Test suite (regression testing)

---

## iOS / Swift

### Log Locations
- Xcode console (run target → Output panel)
- `~/Library/Logs/DiagnosticReports/` — crash logs
- `xcrun simctl spawn booted log stream --predicate 'process == "YourApp"'`

### Debug Tools
- Xcode Instruments (memory, CPU, network)
- `po` command in LLDB console
- `lldb` — set breakpoints, inspect variables
- `xcrun simctl diagnose` — simulator diagnostics

### Common Patterns
- Memory leaks → Instruments → Leaks template
- UI layout issues → Debug View Hierarchy in Xcode
- Network → Charles Proxy or built-in Network Link Conditioner

---

## Android / Kotlin

### Log Locations
- `adb logcat` — real-time device logs
- `adb logcat -s TAG` — filter by tag
- `adb bugreport` — full device report

### Debug Tools
- Android Studio Profiler (CPU, memory, network)
- `adb shell` — device shell access
- Logcat filters (level, tag, package)
- `adb logcat *:E` — errors only

### Common Patterns
- ANR (App Not Responding) → check main thread blocking
- Crash → inspect `FATAL EXCEPTION` in logcat
- Memory → Android Studio Memory Profiler

---

## Backend / Java / Jakarta EE

### Log Locations
- WildFly: `$JBOSS_HOME/standalone/log/server.log`
- Maven test output: `target/surefire-reports/`
- `./mvnw test -pl {module} | grep -E 'ERROR|FAILED'`

### Debug Tools
- `./mvnw test -Dtest=ClassName#methodName` — single test
- Remote debugging: `-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005`
- SonarQube reports for static analysis

### Common Patterns
- CDI injection failure → check `@ApplicationScoped` / `@RequestScoped` scope mismatches
- JPA LazyInitializationException → session closed before lazy load
- WildFly deployment failure → check `server.log` for `WFLYCTL` error codes

---

## State Machine Tracing (All Platforms)

When debugging **state-related bugs** (unexpected transitions, stuck states, race conditions):

1. **Draw the ACTUAL state machine** from code — read every `if/switch/state=` and extract what ACTUALLY happens
2. **Draw the EXPECTED state machine** from requirements or docs
3. **Overlay and diff** — mismatches reveal the bug:
   - Missing transitions (no path from state A to B)
   - Unguarded transitions (state changes without preconditions)
   - Dead states (reachable but no exit — component gets "stuck")
   - Race conditions (two transitions competing for same state)

```
ACTUAL:   [LOADING] ──(timeout)──▸ [LOADING]     ← stuck! no error path
EXPECTED: [LOADING] ──(timeout)──▸ [ERROR] ──(retry)──▸ [LOADING]
MISSING:  timeout → ERROR transition
```

Applies to: React `useState`/`useReducer`, iOS view lifecycle, Android Compose state, async/Promise chains, WebSocket connections.

See `plan/references/state-machine-guide.md` for notation and common patterns.

---

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

---

## Root Cause Analysis Techniques

- **5 Whys**: Ask "why did this happen?" 5 times to trace to origin
- **Bisection**: Use `git bisect` to find the commit that introduced the issue
- **Inversion**: Ask "what would have to be true for this NOT to happen?" — reveals hidden assumptions

---

## Fix Validation Checklist

- [ ] Symptom reproduced consistently
- [ ] Root cause identified and documented
- [ ] Fix applied and tested
- [ ] No new issues introduced
- [ ] Edge cases considered
- [ ] Similar issues checked elsewhere in codebase
