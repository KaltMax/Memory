# Frontend API Configuration

The frontend has been updated to work with the new Cloudflare Workers backend.

## Configuration

### Environment Variables

The frontend uses Vite environment variables to configure the API endpoint.

**For Local Development:**

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:8787
```

**For Production:**

Update the `.env` file with your deployed Workers URL:

```env
VITE_API_URL=https://memoria-api.your-subdomain.workers.dev
```

### How It Works

#### Development Mode

When running `npm run dev`, the frontend:
1. Uses the Vite dev server (default: http://localhost:5173)
2. Proxies all `/api/*` requests to `http://localhost:8787` (Workers dev server)
3. This avoids CORS issues during local development

**Setup for Local Development:**

1. Start the Workers backend:
   ```bash
   cd workers
   npm run dev  # Runs on http://localhost:8787
   ```

2. In a new terminal, start the frontend:
   ```bash
   cd frontend
   npm run dev  # Runs on http://localhost:5173
   ```

3. Open http://localhost:5173 in your browser

#### Production Mode

When building for production (`npm run build`):
- The built frontend makes direct requests to the API URL specified in `VITE_API_URL`
- If `VITE_API_URL` is not set, it uses relative URLs (same-origin)

**Production Build:**

```bash
# Set your production Workers URL
echo "VITE_API_URL=https://memoria-api.your-subdomain.workers.dev" > .env

# Build the frontend
npm run build

# The dist/ folder is ready to deploy
```

## API Endpoints

The frontend connects to these endpoints:

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token

### Highscores
- `GET /api/highscores` - Get top 10 highscores
- `POST /api/highscores` - Add new highscore (requires auth)