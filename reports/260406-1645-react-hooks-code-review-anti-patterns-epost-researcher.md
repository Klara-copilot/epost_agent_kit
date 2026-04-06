---
title: "Research: React Hooks Anti-Patterns for Code Review Rules"
description: Categorized hooks anti-patterns causing real production bugs — severity-mapped for review rule authoring
type: research
status: ACTIONABLE
date: 2026-04-06
researcher: epost-researcher
scope: React hooks — violations, stale closures, derived state, custom hook design
---

## Executive Summary

Analyzed 8 critical React hooks anti-patterns that escape basic linting and cause real production bugs. Focus is on patterns beyond rule violations (which ESLint catches) and style preferences. These are design-level mistakes: missing dependencies, stale closures, hook cascades, and improper custom hook design.

**Verdict**: ACTIONABLE — ready for code review rule authoring as HOOKS-001..008.

## Research Methodology

**Sources consulted** (authority-first):
- React.dev official documentation (hooks rules, effects, custom hooks)
- Context7 React compiler test suites (real dependency validation cases)
- Production bug case studies (stale closures, race conditions, derived state)
- ESLint plugin exhaustive-deps design principles

**Scope**: Production-relevant bugs only — excluded style opinions, naming preferences, cosmetic refactoring.

---

## Anti-Patterns & Rules (HOOKS-001..008)

### HOOKS-001: Missing useEffect Dependencies (Stale Closures)

**Severity**: CRITICAL

**Why it's bad**: Captured variables freeze in time. Effects read outdated state/props. Causes silent bugs where logic runs but operates on stale data. Very hard to debug — tests may pass while production fails.

**Production impact**:
- Event handlers execute with wrong context
- Intervals/timeouts log/process outdated values
- API calls made with stale parameters
- Child components receive frozen callbacks

**Pass example**:
```typescript
function ChatRoom({ roomId, serverUrl }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // ✅ roomId and serverUrl in dependency array
    const connection = createConnection({ roomId, serverUrl });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

**Fail example**:
```typescript
function ChatRoom({ roomId, serverUrl }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // 🔴 Missing roomId and serverUrl — effect captures stale values
    // If props change, effect doesn't re-run. Connection uses old values.
    const connection = createConnection({ roomId, serverUrl });
    connection.connect();
  }, []); // Missing deps!
}
```

**Rule wording**:
> All variables from component scope used in useEffect must appear in dependency array. Trust eslint-plugin-react-hooks exhaustive-deps. Never suppress with eslint-disable-next-line — restructure code instead.

---

### HOOKS-002: Conditional Hook Calls (Render Order Violations)

**Severity**: CRITICAL

**Why it's bad**: React tracks hook order by position in component function. If a hook runs conditionally, it may skip on some renders. All subsequent hooks shift in order, breaking React's internal mapping. Runtime crashes or undefined behavior.

**Production impact**:
- "Rendered more hooks than previous render" error
- State gets wired to wrong hooks
- useEffect cleanup functions don't run
- Complete component failure

**Pass example**:
```typescript
function Form({ name }) {
  // ✅ All hooks unconditional, always at top level
  const [formData, setFormData] = useState('');
  
  useEffect(() => {
    // Condition INSIDE the hook, not outside
    if (name) {
      localStorage.setItem('lastVisitor', name);
    }
  }, [name]);
}
```

**Fail example**:
```typescript
function Form({ name }) {
  // 🔴 Hook inside condition — skipped if name is empty
  if (name !== '') {
    useEffect(() => {
      localStorage.setItem('lastVisitor', name);
    }, [name]);
  }
  
  // 🔴 Hook after early return
  if (!isValid) return null;
  useState('defaultValue'); // Never runs
}
```

**Rule wording**:
> Hooks must be called at top level, outside conditions, loops, and early returns. Put conditions INSIDE hooks, not around them. Use eslint-plugin-react-hooks to enforce.

---

### HOOKS-003: Derived State Anti-Pattern (useState + useEffect Synchronization)

**Severity**: HIGH

**Why it's bad**: Computing a value from props/state via setState + useEffect triggers extra renders. Component renders with stale derived value, then effect runs, then re-renders with correct value. Cascading renders. Performance degradation. Can hide race conditions.

**Production impact**:
- Unnecessary re-renders (2–3 render passes instead of 1)
- Page visible flash with stale data
- Performance regression on derived state chains
- useEffect runs too often when not needed

**Pass example**:
```typescript
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  
  // ✅ Compute directly in render — no extra renders
  const visibleTodos = getFilteredTodos(todos, filter);
  
  return <>{visibleTodos.map(todo => <TodoItem key={todo.id} todo={todo} />)}</>;
}
```

**Fail example**:
```typescript
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  
  // 🔴 Redundant state + useEffect = extra renders
  const [visibleTodos, setVisibleTodos] = useState([]);
  
  useEffect(() => {
    // Effect runs after render → updates state → triggers re-render
    // Component renders twice: once with stale [], once with correct data
    setVisibleTodos(getFilteredTodos(todos, filter));
  }, [todos, filter]);
  
  return <>{visibleTodos.map(...)}</>;
}
```

**Rule wording**:
> Don't store derived values in useState if they can be computed from existing state/props. Remove the useState + useEffect pair and compute directly in render (or useMemo if expensive). Derived state triggers unnecessary renders.

---

### HOOKS-004: Missing useEffect Cleanup (Memory Leaks & Race Conditions)

**Severity**: HIGH

**Why it's bad**: Effects that subscribe to events, timers, or async operations without cleanup persist across unmounts. Memory leaks. Ghost listeners. Race conditions when same effect re-runs with stale subscription still active.

**Production impact**:
- Memory leaks (listeners never removed)
- Data from unmounted component updates state
- "setState on unmounted component" warnings
- Race conditions with async fetches

**Pass example**:
```typescript
function ChatRoom({ roomId }) {
  useEffect(() => {
    // ✅ Subscribe and return cleanup
    const connection = createConnection({ roomId });
    connection.connect();
    
    return () => {
      // Cleanup runs before next effect or unmount
      connection.disconnect();
    };
  }, [roomId]);
}
```

**Fail example**:
```typescript
function ChatRoom({ roomId }) {
  useEffect(() => {
    // 🔴 No cleanup — subscription persists
    const connection = createConnection({ roomId });
    connection.connect();
    
    // If roomId changes, old connection still active. New one created.
    // Memory leak if component unmounts.
  }, [roomId]);
}
```

**Race condition variant**:
```typescript
useEffect(() => {
  let ignore = false;
  
  fetch(`/api/user/${id}`).then(data => {
    // 🔴 No cleanup — if id changes before fetch resolves,
    // this setUser still runs, overwriting newer data
    setUser(data);
  });
}, [id]);
```

**Corrected**:
```typescript
useEffect(() => {
  let ignore = false;
  
  fetch(`/api/user/${id}`).then(data => {
    if (!ignore) setUser(data); // Only update if still current
  });
  
  return () => { ignore = true; }; // Cleanup prevents race
}, [id]);
```

**Rule wording**:
> Always return a cleanup function from effects that subscribe to external systems, set timers, or make async requests. Cleanup runs before the next effect or component unmount. Without it: memory leaks, race conditions, and stale data updates.

---

### HOOKS-005: useCallback/useMemo Missing Dependencies

**Severity**: HIGH

**Why it's bad**: Same as HOOKS-001 but for memoization hooks. Callbacks capture stale values. Memoized computations run with outdated input. Parent receives the same reference when dependency changed, breaking child optimization.

**Production impact**:
- Child components re-render when they shouldn't (useCallback ref didn't change)
- Callbacks operate on stale state (event handler uses old count)
- useCallback dependency array defeats its own purpose
- Performance optimization becomes a bug vector

**Pass example**:
```typescript
function Counter({ step }) {
  const [count, setCount] = useState(0);
  
  // ✅ step in dependency array
  const increment = useCallback(() => {
    setCount(c => c + step);
  }, [step]);
  
  return <button onClick={increment}>{count}</button>;
}
```

**Fail example**:
```typescript
function Counter({ step }) {
  const [count, setCount] = useState(0);
  
  // 🔴 Missing step — callback captures initial step = 1
  // If step prop changes to 5, callback still increments by 1
  const increment = useCallback(() => {
    setCount(c => c + step);
  }, []);
  
  return <button onClick={increment}>{count}</button>;
}
```

**useMemo variant**:
```typescript
// 🔴 Missing dependency — if items changes, computed still uses old items
const expensiveValue = useMemo(
  () => expensiveComputation(items),
  [] // Missing items!
);
```

**Rule wording**:
> useCallback and useMemo dependency arrays must include all reactive values. Missing dependencies cause stale closures and negate the memoization benefit. Trust exhaustive-deps linting.

---

### HOOKS-006: Inline Objects/Arrays as Dependencies (Infinite Loops)

**Severity**: MEDIUM

**Why it's bad**: Objects/arrays created in render are new on every render (`{} !== {}`). If used as dependencies, effect re-runs every render, creating infinite loops.

**Production impact**:
- Infinite effect loops consuming CPU/network
- Browser slowdown/crash
- API call spam (if effect fetches data)
- Impossible to debug without understanding object identity

**Pass example**:
```typescript
function Posts({ userId }) {
  const [posts, setPosts] = useState([]);
  
  // ✅ Hoist static config
  const apiConfig = { userId, limit: 10 };
  
  useEffect(() => {
    fetchPosts(apiConfig);
  }, [apiConfig]); // Static object — won't change
}
```

**Fail example**:
```typescript
function Posts({ userId }) {
  const [posts, setPosts] = useState([]);
  
  // 🔴 New object created on every render
  useEffect(() => {
    fetchPosts({ userId, limit: 10 }); // {} !== {} 
  }, [{ userId, limit: 10 }]); // Effect re-runs every render → infinite loop
}
```

**Fix: useMemo**:
```typescript
const config = useMemo(() => ({ userId, limit: 10 }), [userId]);
useEffect(() => {
  fetchPosts(config);
}, [config]);
```

**Fix: Destructure primitives**:
```typescript
// If only using .userId from props, depend on userId directly
useEffect(() => {
  fetchPosts({ userId, limit: 10 });
}, [userId]); // Primitive — safe
```

**Rule wording**:
> Never create objects/arrays inline in dependency arrays. Hoist static values to module scope, wrap dynamic values in useMemo, or destructure to primitives. Every new object reference triggers re-execution.

---

### HOOKS-007: Custom Hooks Doing Too Much (Scope Creep & Hidden Dependencies)

**Severity**: MEDIUM

**Why it's bad**: Custom hooks that combine unrelated logic hide complexity. Hard to test. Dependencies cascade across multiple levels. Data flow becomes implicit. Violates single-responsibility principle.

**Production impact**:
- Difficult to debug (logic scattered across hook layers)
- Performance regressions hard to trace
- Re-render cascades from nested effects
- Test setup complexity explodes
- Reusability drops (hook too specific)

**Pass example**:
```typescript
// ✅ Single responsibility — just manages form state
function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);
  
  const handleChange = (e) => {
    setValues(v => ({ ...v, [e.target.name]: e.target.value }));
  };
  
  return { values, handleChange };
}

// Caller handles validation, submission separately
function LoginForm() {
  const form = useForm({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation logic here
    // Submit logic here
  };
}
```

**Fail example**:
```typescript
// 🔴 Does too much — form state + validation + submission + analytics + toast
function useLoginForm(onSuccess) {
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Effect 1: validate on change
    validateForm(values).then(setErrors);
  }, [values]);
  
  useEffect(() => {
    // Effect 2: analytics on error
    if (Object.keys(errors).length > 0) {
      track('form_validation_failed');
    }
  }, [errors]);
  
  const handleSubmit = async () => {
    setLoading(true);
    // Effect 3 would be hidden too...
    try {
      await submitForm(values);
      toast.success('Logged in');
      onSuccess();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return { values, errors, loading, handleSubmit };
}
```

**Rule wording**:
> Custom hooks should do one thing. If a hook has 3+ useEffect/useState or combines unrelated logic (form + validation + submission + analytics), split it. Hooks should be simple enough to understand in isolation.

---

### HOOKS-008: Suppressing exhaustive-deps Linter Warnings

**Severity**: CRITICAL

**Why it's bad**: The exhaustive-deps rule exists for a reason — it catches stale closures. Suppressing it with `eslint-disable-next-line` means you've decided to ignore the safety check. Almost always indicates a design bug that should be fixed instead.

**Production impact**:
- Stale closures go undetected
- Bug manifests in production, not in tests
- Future maintainers inherit hidden bugs
- Regression risk when refactoring

**Pass example**:
```typescript
function ChatRoom({ roomId, serverUrl }) {
  useEffect(() => {
    const connection = createConnection({ roomId, serverUrl });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // Proper dependencies — no suppression needed
}
```

**Fail example**:
```typescript
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  
  useEffect(() => {
    logVisit(url, items.length);
    // 🔴 Suppressing the warning instead of fixing it
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]); // Missing: items.length, items
}
```

**Correct fix**:
```typescript
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length; // Extract to variable
  
  useEffect(() => {
    logVisit(url, numberOfItems);
  }, [url, numberOfItems]); // Add the dependency
}
```

**Alternative fix (useEffectEvent, React 19+)**:
```typescript
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  
  const logVisitEvent = useEffectEvent(() => {
    logVisit(url, items.length); // Access non-reactive values without deps
  });
  
  useEffect(() => {
    logVisitEvent();
  }, [url]); // Only url is reactive
}
```

**Rule wording**:
> Never suppress exhaustive-deps warnings. Restructure your code instead. Options: add the dependency, extract to useEffectEvent, use a ref, or split the effect. Suppression hides real bugs.

---

## Severity Breakdown

| Severity | Rules | Impact |
|----------|-------|--------|
| **CRITICAL** | HOOKS-001, HOOKS-002, HOOKS-008 | Causes crashes, silent data corruption, memory leaks |
| **HIGH** | HOOKS-003, HOOKS-004, HOOKS-005 | Performance regression, race conditions, stale state |
| **MEDIUM** | HOOKS-006, HOOKS-007 | Design issues, maintainability, debugging difficulty |

---

## Patterns Not Covered (Already in STATE-* / REDUX-* rules)

- useState with complex initial state (use useReducer)
- Syncing multiple useState calls (use useReducer)
- Redux dispatch patterns (REDUX-001..006)
- N+1 loop rendering (PERF-003)
- Missing error states (STATE-001..002)

---

## Sources

- [React.dev — Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks)
- [React.dev — useEffect](https://react.dev/reference/react/useEffect)
- [React.dev — You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [React.dev — Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [ESLint plugin react-hooks — exhaustive-deps](https://react.dev/reference/eslint-plugin-react-hooks/exhaustive-deps)
- [ESLint plugin react-hooks — set-state-in-effect](https://react.dev/reference/eslint-plugin-react-hooks/lints/set-state-in-effect)
- [Max Rozen — Fixing Race Conditions in React with useEffect](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect)
- [Oneuptime Blog — Fix Stale Closure Issues](https://oneuptime.com/blog/post/2026-01-24-fix-stale-closure-issues-react-hooks/view)
- [Medium — Why React Hooks Can't Be Called Conditionally](https://medium.com/@juliofeferman/why-why-react-hooks-cant-be-called-conditionally-3cda145c3dd4)

---

## Unresolved Questions

- Should HOOKS rules auto-flag suppressed warnings (eslint-disable-next-line) in pre-commit?
- How to detect HOOKS-007 violations programmatically (custom hook size/complexity metrics)?
- Should rule HOOKS-003 have exceptions for very cheap computations (e.g., filter 5 items)?

## Next Steps

Ready to author HOOKS-001..008 code review rules. Recommend cross-linking to:
- STATE-001..004 (state machine design)
- PERF-003..004 (render loops, memoization)
- Web platform skill `web-frontend` (React patterns)
