# Phase 01: RAG API Endpoint

## Context Links
- Parent plan: [plan.md](./plan.md)
- Web RAG routes: `epost_web_theme_rag/src/api/routes/`
- iOS RAG routes: `epost_ios_rag/src/api/routes/`
- Query expansion module: `src/core/query_expansion.py` (both projects)

## Overview
**Date**: 2026-03-04
**Priority**: P1
**Description**: Add `GET /api/rag/expansions` endpoint to both RAG servers, returning the loaded query_expansions.yaml data as JSON
**Implementation Status**: Completed 2026-03-04

## Key Insights
- `QueryExpander` singleton already loads `config/query_expansions.yaml` into `self.component_mappings` (dict) and `self.synonyms` (dict of lists)
- Both projects share identical `query_expansion.py` structure with `get_query_expander()` singleton
- Existing pattern: routes import from `src.core.*` — follow same pattern

## Requirements
### Functional
- `GET /api/rag/expansions` returns JSON: `{"component_mappings": {...}, "synonyms": {...}, "platform": "web"|"ios"}`
- Optional `?format=markdown` param returns the data formatted as markdown tables (for skill consumption)
- Returns 503 if query expansion is disabled

### Non-Functional
- Cached response (data only changes on server restart)
- < 50ms response time

## Architecture
```
GET /api/rag/expansions
  -> query_expansion.get_query_expander()
  -> return { component_mappings, synonyms, platform, counts }
```

## Related Code Files
### Create (EXCLUSIVE)
- `epost_web_theme_rag/src/api/routes/expansions.py` — New route [OWNED]
- `epost_ios_rag/src/api/routes/expansions.py` — New route [OWNED]

### Modify (EXCLUSIVE)
- `epost_web_theme_rag/src/api/main.py` — Register new route [OWNED]
- `epost_ios_rag/src/api/main.py` — Register new route [OWNED]

### Read-Only
- `src/core/query_expansion.py` — Import `get_query_expander`
- `config/query_expansions.yaml` — Source data

## Implementation Steps

1. Create `src/api/routes/expansions.py` in web RAG:
```python
from fastapi import APIRouter, Query
from src.core.query_expansion import get_query_expander
from src.utils.config import config

router = APIRouter()

@router.get("/api/rag/expansions")
async def get_expansions(format: str = Query("json", enum=["json", "markdown"])):
    if not config.QUERY_EXPANSION_ENABLED:
        return {"error": "Query expansion disabled", "status": 503}

    expander = get_query_expander()
    data = {
        "platform": "web",
        "component_mappings": expander.component_mappings,
        "synonyms": expander.synonyms,
        "counts": {
            "component_mappings": len(expander.component_mappings),
            "synonym_groups": len(expander.synonyms),
        }
    }

    if format == "markdown":
        data["markdown"] = _to_markdown(expander)

    return data
```

2. Copy to iOS RAG with `"platform": "ios"`

3. Register route in `src/api/main.py` for both:
```python
from src.api.routes.expansions import router as expansions_router
app.include_router(expansions_router)
```

## Todo List
- [x] Create `expansions.py` route in web RAG
- [x] Create `expansions.py` route in iOS RAG
- [x] Register routes in both `main.py`
- [ ] Test endpoint manually: `curl localhost:2636/api/rag/expansions`
- [ ] Test endpoint manually: `curl localhost:2637/api/rag/expansions`

## Success Criteria
- Both endpoints return valid JSON with component_mappings + synonyms
- Response matches data from `config/query_expansions.yaml`
- < 50ms response time (data already in memory)

## Risk Assessment
**Risks**: None significant — additive endpoint, no changes to existing routes
**Mitigation**: Route is read-only, no mutation

## Security Considerations
- Read-only, no auth needed (local server only)
- No sensitive data exposed

## Next Steps
After completion:
1. Proceed to Phase 02 — add MCP tool that calls this endpoint
