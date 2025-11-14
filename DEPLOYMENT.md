# Deployment Guide

This guide will walk you through deploying the Numero app to Cloudflare.

## Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **Wrangler CLI**: Already installed (`bun add -g wrangler`)
3. **Neon Database**: Sign up at [neon.tech](https://neon.tech) and create two databases (auth and chat)

## Step 1: Authenticate with Cloudflare

```bash
wrangler login
```

## Step 2: Set up Neon Databases

1. Go to [Neon Console](https://console.neon.tech)
2. Create a new project or use an existing one
3. Create two databases:
   - `auth` - for authentication data
   - `chat` - for chat/conversation data
4. Copy the connection strings (they should look like: `postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/dbname`)

## Step 3: Configure Server Environment Variables

Set secrets for the Cloudflare Worker:

```bash
cd apps/server

# Database URLs (use your Neon connection strings)
wrangler secret put AUTH_DB_URL
# Paste: postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/auth

wrangler secret put CHAT_DB_URL
# Paste: postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/chat

# Better Auth Configuration
wrangler secret put BETTER_AUTH_SECRET
# Generate a random secret: openssl rand -base64 32

wrangler secret put BETTER_AUTH_URL
# This will be: https://your-worker-name.your-subdomain.workers.dev/api/auth

wrangler secret put CLIENT_URL
# This will be: https://your-pages-project.pages.dev

# Google OAuth
wrangler secret put GOOGLE_CLIENT_ID
# Paste your Google OAuth client ID

wrangler secret put GOOGLE_CLIENT_SECRET
# Paste your Google OAuth client secret

wrangler secret put GOOGLE_GENERATIVE_AI_API_KEY
# Paste your Google AI API key
```

## Step 4: Deploy the Server (Cloudflare Workers)

```bash
cd apps/server
bun run deploy
```

After deployment, note the Worker URL (e.g., `https://numero-server.your-subdomain.workers.dev`)

## Step 5: Update Google OAuth Redirect URIs

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Edit your OAuth 2.0 Client ID
3. Add to "Authorized redirect URIs":
   ```
   https://numero-server.your-subdomain.workers.dev/api/auth/callback/google
   ```

## Step 6: Deploy the Client (Cloudflare Pages)

### Option A: Deploy via Cloudflare Dashboard (Recommended)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → Pages
2. Click "Create a project"
3. Connect to your Git repository
4. Configure build settings:
   - **Framework preset**: Vite
   - **Build command**: `cd apps/client && bun install && bun run build`
   - **Build output directory**: `apps/client/dist`
   - **Root directory**: `/`
5. Add environment variables:
   - `VITE_API_URL`: `https://numero-server.your-subdomain.workers.dev/api/auth`
   - `VITE_CLIENT_URL`: `https://your-pages-project.pages.dev`
6. Click "Save and Deploy"

### Option B: Deploy via Wrangler CLI

```bash
cd apps/client

# Build the client
bun run build

# Deploy to Pages
wrangler pages deploy dist --project-name=numero-client
```

## Step 7: Update Environment Variables

After both deployments, you need to update the URLs:

### Update Worker Secrets:

```bash
cd apps/server

# Update CLIENT_URL with your Pages URL
wrangler secret put CLIENT_URL
# Paste: https://numero-client.pages.dev

# Update BETTER_AUTH_URL with your Worker URL
wrangler secret put BETTER_AUTH_URL
# Paste: https://numero-server.your-subdomain.workers.dev/api/auth
```

### Update Pages Environment Variables:

1. Go to Cloudflare Dashboard → Pages → Your Project → Settings → Environment Variables
2. Update:
   - `VITE_API_URL`: `https://numero-server.your-subdomain.workers.dev/api/auth`
   - `VITE_CLIENT_URL`: `https://numero-client.pages.dev`
3. Redeploy the Pages project

## Step 8: Run Database Migrations

You'll need to run your Drizzle migrations against the Neon databases:

```bash
# Make sure your local .env has the Neon connection strings
cd packages/auth-db
bun run db:push  # or your migration command

cd packages/chat-db
bun run db:push  # or your migration command
```

## Troubleshooting

### Database Connection Issues

- Make sure your Neon connection strings are correct
- Verify the database names match (auth/chat)
- Check that Neon project is not suspended (free tier)

### CORS Errors

- Ensure `CLIENT_URL` in Worker secrets matches your Pages URL exactly (no trailing slash)
- Check that `BETTER_AUTH_URL` is set correctly

### OAuth Redirect Issues

- Verify Google OAuth redirect URI includes the full path: `/api/auth/callback/google`
- Make sure redirect URIs use HTTPS in production

### Build Failures

- Check that all workspace dependencies are properly installed
- Verify Node.js compatibility in wrangler.toml

## Monitoring

- **Worker Logs**: `wrangler tail` or check Cloudflare Dashboard → Workers → Logs
- **Pages Logs**: Cloudflare Dashboard → Pages → Your Project → Deployments
- **Analytics**: Cloudflare Dashboard → Analytics

## Custom Domain (Optional)

### For Pages:
1. Go to Pages → Your Project → Custom domains
2. Add your domain
3. Update DNS records as instructed

### For Worker:
1. Go to Workers → Your Worker → Settings → Triggers
2. Add a custom domain route

---

## Quick Commands Reference

```bash
# Deploy server
cd apps/server && bun run deploy

# Deploy client (after building)
cd apps/client && bun run build && wrangler pages deploy dist --project-name=numero-client

# View Worker logs
cd apps/server && wrangler tail

# List secrets
cd apps/server && wrangler secret list
```
