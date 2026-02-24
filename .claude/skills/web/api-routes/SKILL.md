---
name: web/api-routes
description: Next.js API routes and Node.js backend patterns for the web monorepo
keywords: [api, rest, node, express, server, endpoints, validation, route]
platforms: [web]
triggers: ["route.ts", "api/", "server action", "endpoint"]
agent-affinity: [epost-web-developer, epost-implementer]
user-invocable: false
---

# Web API Routes Skill

## Purpose
Next.js API route handlers and Node.js backend patterns for the web monorepo.

## When Active
User works on API routes, server actions, or web backend endpoints.

## Expertise

### REST API Design
- Resource naming (nouns, plural)
- HTTP method semantics
- Status codes (2xx, 3xx, 4xx, 5xx)
- Pagination patterns

### Error Handling
- Custom error classes
- Error middleware
- Consistent error responses
- Error logging

### Validation
- Zod schemas
- Request validation middleware
- Response validation
- Type-safe validation

### Authentication
- JWT tokens
- Session-based auth
- OAuth integration
- API key validation

### Middleware
- Request logging
- Rate limiting
- CORS configuration
- Body parsing

### Database Integration
- Connection pooling
- Transaction management
- Query builders
- ORM patterns

### API Documentation
- OpenAPI/Swagger specs
- JSDoc comments
- Type definitions
- Example requests/responses

## Patterns

### Route Handler
```typescript
app.post('/api/resource',
  validateBody(schema),
  authenticate,
  async (req, res) => {
    try {
      const result = await handler(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);
```

### Custom Error
```typescript
class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}
```

### Validation Schema
```typescript
import { z } from 'zod';

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
```

## Dependencies
- Node.js 20+ / Bun
- Fastify / Express / Hono
- Zod (validation)
- Prisma / Drizzle (ORM)
