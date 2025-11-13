# @numero/env

Centralized, type-safe environment variable management using T3 Env.

## Features

- ✅ **Type-safe**: Full TypeScript support with autocomplete
- ✅ **Validated**: Environment variables are validated at startup using Zod
- ✅ **Centralized**: Single source of truth for all env vars
- ✅ **No `process.env`**: Import from `@numero/env` instead

## Usage

```typescript
import { env } from "@numero/env";

// All properties are typed and validated
const dbUrl = env.AUTH_DB_URL;
const port = env.PORT;
const nodeEnv = env.NODE_ENV; // "development" | "production" | "test"
```

## Available Environment Variables

### Database URLs
- `AUTH_DB_URL` - Authentication database connection string
- `CHAT_DB_URL` - Chat database connection string

### App Configuration
- `NODE_ENV` - Environment mode (development/production/test)
- `PORT` - Server port (default: "3000")
- `CLIENT_URL` - Client URL for CORS configuration

## Adding New Variables

1. Add the variable to the `server` object in `src/index.ts`:
```typescript
server: {
  MY_NEW_VAR: z.string().min(1),
  // ...
}
```

2. Add it to the root `.env.example` file

3. TypeScript will now enforce its usage throughout the codebase

## Configuration

Set `SKIP_ENV_VALIDATION=true` to skip validation (useful for build processes).
