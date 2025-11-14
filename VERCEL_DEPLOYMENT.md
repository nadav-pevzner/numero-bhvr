# Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI**: Install globally
   ```bash
   bun add -g vercel
   ```
3. **Neon Database**: Two databases set up at [neon.tech](https://neon.tech)

## Step 1: Set up Neon Databases

1. Go to [Neon Console](https://console.neon.tech)
2. Create/use a project
3. Create two databases:
   - `auth` - for authentication
   - `chat` - for conversations
4. Get connection strings (format: `postgresql://user:password@ep-xxx.region.neon.tech/dbname`)

## Step 2: Run Database Migrations

```bash
# Set your Neon connection strings in apps/server/.env
cd /Users/nadav/numero-projects/hono-react-better-auth

# Run migrations for auth database
cd packages/auth-db
# Add your migration command here (e.g., bun run db:push or drizzle-kit push)

# Run migrations for chat database
cd ../chat-db
# Add your migration command here
```

## Step 3: Deploy the Server

```bash
cd /Users/nadav/numero-projects/hono-react-better-auth/apps/server

# Login to Vercel
vercel login

# Deploy
vercel
```

Follow the prompts:
- **Set up and deploy**: Y
- **Which scope**: Select your account
- **Link to existing project**: N
- **Project name**: numero-server (or your choice)
- **Directory**: `./`
- **Override settings**: N

After deployment, note the production URL (e.g., `https://numero-server.vercel.app`)

### Set Environment Variables

In the Vercel dashboard or CLI:

```bash
# Via CLI
vercel env add AUTH_DB_URL
# Paste your Neon auth database URL

vercel env add CHAT_DB_URL
# Paste your Neon chat database URL

vercel env add BETTER_AUTH_SECRET
# Generate: openssl rand -base64 32

vercel env add BETTER_AUTH_URL
# Format: https://your-server-url.vercel.app/api/auth

vercel env add CLIENT_URL
# You'll update this after deploying the client

vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
vercel env add GOOGLE_GENERATIVE_AI_API_KEY
vercel env add NODE_ENV production

# Redeploy to apply env vars
vercel --prod
```

## Step 4: Update Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Edit your OAuth 2.0 Client ID
3. Add to "Authorized redirect URIs":
   ```
   https://your-server-url.vercel.app/api/auth/callback/google
   ```

## Step 5: Deploy the Client

```bash
cd /Users/nadav/numero-projects/hono-react-better-auth/apps/client

# Build first to test
bun run build

# Deploy to Vercel
vercel
```

Follow the prompts:
- **Project name**: numero-client (or your choice)
- **Build command**: `bun run build`
- **Output directory**: `dist`

After deployment, note the client URL (e.g., `https://numero-client.vercel.app`)

### Set Client Environment Variables

```bash
# Via Vercel dashboard or CLI
vercel env add VITE_API_URL
# Value: https://your-server-url.vercel.app/api/auth

vercel env add VITE_CLIENT_URL
# Value: https://numero-client.vercel.app

# Redeploy
vercel --prod
```

## Step 6: Update Server Environment

Now update the server's `CLIENT_URL`:

```bash
cd ../server

# Update CLIENT_URL in Vercel dashboard to your actual client URL
# Or via CLI:
vercel env rm CLIENT_URL production
vercel env add CLIENT_URL production
# Enter: https://numero-client.vercel.app

# Redeploy server
vercel --prod
```

## Step 7: Verify Deployment

1. Visit your client URL
2. Try signing in with Google
3. Check that authentication works
4. Test creating conversations and questions

## Troubleshooting

### Build Failures

If you get dependency errors:
```bash
# Make sure all dependencies are installed
cd /Users/nadav/numero-projects/hono-react-better-auth
bun install
```

### Database Connection Issues

- Verify Neon connection strings are correct
- Check that databases (`auth` and `chat`) exist
- Ensure migrations have been run

### CORS Errors

- Make sure `CLIENT_URL` in server matches your client domain exactly
- No trailing slashes
- Must be HTTPS in production

### OAuth Redirect Issues

- Verify Google OAuth redirect URI is `https://your-server-url.vercel.app/api/auth/callback/google`
- Check that `BETTER_AUTH_URL` is set correctly

## Useful Commands

```bash
# View deployment logs
vercel logs

# List all deployments
vercel list

# Remove a deployment
vercel remove [deployment-url]

# View environment variables
vercel env ls

# Pull environment variables to local
vercel env pull
```

## Custom Domains (Optional)

### For Server:
1. Go to Vercel Dashboard → Your Server Project → Settings → Domains
2. Add your domain (e.g., `api.yourdomain.com`)
3. Update DNS as instructed
4. Update all references to the server URL

### For Client:
1. Go to Vercel Dashboard → Your Client Project → Settings → Domains
2. Add your domain (e.g., `yourdomain.com`)
3. Update DNS as instructed
4. Update CLIENT_URL environment variable

## Monitoring

- View logs: Vercel Dashboard → Your Project → Deployments → Click deployment
- Analytics: Vercel Dashboard → Analytics
- Performance: Vercel Dashboard → Speed Insights

---

## Quick Reference

Server URL format: `https://numero-server.vercel.app/api/auth`
Client URL format: `https://numero-client.vercel.app`

Remember to update both after initial deployment with correct URLs!
