# Prototype Analysis Checklist

## Step 1: Framework Detection

| Check | How to Detect |
|-------|---------------|
| React | `package.json` has `react` dependency, `.jsx/.tsx` files |
| Vue | `package.json` has `vue`, `.vue` files |
| Angular | `angular.json`, `.component.ts` files |
| Plain HTML | `.html` files with no framework deps |
| Next.js | `next.config.js/ts`, `app/` or `pages/` directory |

## Step 2: Component Inventory

For each component found:
- [ ] Component name and file path
- [ ] Props interface (or equivalent)
- [ ] Children/slot patterns
- [ ] State management used (local, context, store)
- [ ] Event handlers and callbacks
- [ ] CSS/styling approach

## Step 3: Style System Detection

| Style System | Indicators |
|-------------|-----------|
| Tailwind CSS | `tailwind.config`, utility classes in markup |
| CSS Modules | `*.module.css/scss` files |
| Styled Components | `styled.div`, `css` template literals |
| Inline Styles | `style={{}}` in JSX |
| SCSS/CSS | `.scss/.css` files imported in components |
| Emotion | `@emotion/styled`, `css` prop |

## Step 4: Data Source Analysis

- [ ] Mock/hardcoded data (in-component, JSON files)
- [ ] REST API calls (fetch, axios)
- [ ] GraphQL queries
- [ ] Local storage/session storage
- [ ] Third-party services

## Step 5: Routing Analysis

- [ ] Client-side routing (React Router, etc.)
- [ ] File-based routing (Next.js, Nuxt)
- [ ] No routing (single page)
- [ ] Route parameters and dynamic segments

## Step 6: Dependency Audit

- [ ] UI libraries (MUI, Ant Design, Chakra, etc.)
- [ ] Form libraries (React Hook Form, Formik)
- [ ] State management (Redux, Zustand, Jotai, MobX)
- [ ] Utility libraries (lodash, date-fns, dayjs)
- [ ] Animation libraries (framer-motion, react-spring)

## Output Format

```markdown
## Prototype Analysis: {name}

**Framework**: {framework} {version}
**Style System**: {system}
**Components**: {count}
**Data Sources**: {mock | api | mixed}
**Routing**: {type}

### Component Map
| # | Component | klara-theme Equivalent | Notes |
|---|-----------|----------------------|-------|

### Unmapped Components
{Components needing custom implementation}

### Dependencies to Replace
| Current | luz_next Equivalent |
|---------|-------------------|

### Estimated Effort
{Small / Medium / Large}
```
