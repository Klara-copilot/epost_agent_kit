---
phase: 2
title: "Java/JSF → React/Next.js mental model cheat sheet"
effort: 30m
depends: []
---

# Phase 2: Java→React Cheat Sheet

Create `docs/java-to-react.md` in luz_next. This is a daily reference card they keep open.

## Content to Write

The doc must cover these 8 analogies with code side-by-side:

### 1. Component = Managed Bean + XHTML template merged

| JSF | React |
|-----|-------|
| `@ManagedBean` + `.xhtml` template | Single `.tsx` file (logic + template together) |
| `#{bean.property}` | `{variable}` |
| `<h:outputText value="#{bean.name}"/>` | `<span>{name}</span>` |

### 2. State = Managed Bean field with getter/setter

| JSF | React |
|-----|-------|
| `private String name; + getName()/setName()` | `const [name, setName] = useState("")` |
| `@ViewScoped` (survives navigation) | `useState` in component |
| `@SessionScoped` | Redux store / Redux Persist |
| `@RequestScoped` | Local variable inside render |

### 3. Routing = faces-config.xml navigation rules

| JSF | React/Next.js |
|-----|---------------|
| `faces-config.xml` navigation cases | Folder structure IS the routes |
| `<navigation-case><to-view-id>/list.xhtml</to-view-id>` | Create `app/list/page.tsx` |
| `return "list"` from backing bean | `router.push("/list")` or `<Link href="/list">` |
| URL: `/faces/page.jsf` | URL: `/page` (clean) |

### 4. PrimeFaces component = klara-theme component

| PrimeFaces | klara-theme |
|-----------|-------------|
| `<p:button label="Save" />` | `<Button>Save</Button>` |
| `<p:inputText value="#{bean.name}"/>` | `<Input value={name} onChange={...}/>` |
| `<p:dataTable>` | `<Table>` or custom |
| `<p:dialog>` | `<Modal>` |
| `<p:messages>` | `<Alert>` / toast |
| PrimeFaces CSS theme | klara-theme design tokens (CSS vars) |

### 5. @Inject / EJB = just import

| JSF | React |
|-----|-------|
| `@Inject UserService userService` | `import { userService } from "@/services/user"` |
| `@EJB UserRepository repo` | `import { useUsers } from "@/hooks/useUsers"` |
| Service layer | Same (services/), hooks for async |

### 6. API calls = Server Actions or API Routes

| JSF | Next.js |
|-----|---------|
| `@WebServlet` | `app/api/route.ts` |
| JAX-RS `@GET @Path("/users")` | `export async function GET(req) {...}` in `app/api/users/route.ts` |
| Calling backend from bean | `fetch("/api/users")` in component or server action |
| Lazy loading in `@PostConstruct` | `useEffect(() => { fetchData() }, [])` or server component |

### 7. Lifecycle = Component lifecycle hooks

| JSF | React |
|-----|-------|
| `@PostConstruct` | `useEffect(() => {...}, [])` (empty deps = run once) |
| `@PreDestroy` | `useEffect(() => { return () => cleanup() }, [])` |
| Phase listeners | N/A — React is simpler |
| `f:event type="preRenderView"` | `useEffect` with deps |

### 8. Styling = Tailwind instead of PrimeFaces themes

| JSF | React/Next.js |
|-----|---------------|
| PrimeFaces theme CSS | klara-theme design tokens |
| `style="color: red"` | `className="text-red-500"` (Tailwind) |
| `styleClass="ui-button"` | `className="..."` (Tailwind classes) |
| CSS file per component | Tailwind inline + SCSS modules |

## File to Create

Write this as `docs/java-to-react.md` in `luz_next` project (not in epost_agent_kit).
Keep it practical — side-by-side code, minimal prose.
