# Memoria Highscore API - Cloudflare Workers

A serverless backend for the Memoria game built on Cloudflare Workers with D1 (SQLite) database.

## Features

- **Serverless Architecture**: Runs on Cloudflare's global edge network
- **D1 Database**: SQLite-based database with automatic replication
- **JWT Authentication**: Secure user authentication with `jose` library
- **Password Hashing**: bcrypt password hashing with `bcryptjs`
- **RESTful API**: Clean API endpoints for authentication and highscores
- **CORS Enabled**: Configured for cross-origin requests
- **Tested**: Full test suite with Vitest

## Tech Stack

- **Runtime**: Cloudflare Workers
- **Framework**: Hono (Express-like for Workers)
- **Database**: Cloudflare D1 (SQLite)
- **Authentication**: JWT with jose library
- **Password Hashing**: bcryptjs
- **Testing**: Vitest with miniflare

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Cloudflare Account](https://dash.cloudflare.com/sign-up)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

## Installation

### 1. Install Dependencies

```bash
cd workers
npm install
```

### 2. Authenticate with Cloudflare

```bash
wrangler login
```

This will open a browser window to authenticate with your Cloudflare account.

### 3. Create D1 Database

```bash
wrangler d1 create memoria-db
```

**Important**: Copy the `database_id` from the output and update `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "memoria-db"
database_id = "your-database-id-here"  # Replace this
```

### 4. Run Database Migration

**For local development:**
```bash
npm run migrate:local
```

**For production:**
```bash
npm run migrate:prod
```

This creates the `users` and `highscores` tables with appropriate indexes.

## Local Development

### 1. Configure Environment Variables

The `.dev.vars` file contains local development secrets:

```env
JWT_SECRET=dev-secret-key-change-in-production-use-a-long-random-string
```

**Important**: Change this to a secure random string for production.

### 2. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:8787`

## Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## Deployment

### 1. Set Production Secrets

```bash
wrangler secret put JWT_SECRET
```

Enter a strong, random secret when prompted. You can generate one with:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 2. Update CORS Configuration (Optional)

For production, update `wrangler.toml` to restrict CORS to your frontend domain:

```toml
[env.production]
CORS_ORIGIN = "https://your-frontend-domain.com"
```

Then update `src/index.js` CORS middleware to use the environment variable:

```javascript
app.use('*', cors({
  origin: (c) => c.env.CORS_ORIGIN || '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));
```

### 3. Run Production Migration

```bash
npm run migrate:prod
```

This creates the database schema in your production D1 database.

### 4. Deploy to Cloudflare Workers

```bash
npm run deploy
```

Your API will be deployed to: `https://memoria-api.your-subdomain.workers.dev`

### 5. Verify Deployment

Test the deployed API:

```bash
curl https://memoria-api.your-subdomain.workers.dev/
```

## API Endpoints

### Authentication

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login user |
| GET | `/api/auth/verify` | Yes | Verify JWT token |

### Highscores

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/highscores` | No | Get top 10 highscores |
| POST | `/api/highscores` | Yes | Add new highscore |

## Validation Rules

### Username
- 3-50 characters
- Alphanumeric characters and underscores only
- Must be unique

### Email
- Valid email format
- Must be unique

### Password
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one digit

### Score
- Must be a number

## Database Schema

### Users Table

| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| username | TEXT | UNIQUE NOT NULL |
| email | TEXT | UNIQUE NOT NULL |
| password_hash | TEXT | NOT NULL |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |

**Indexes:**
- `idx_users_username` on `username`
- `idx_users_email` on `email`

### Highscores Table

| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| name | TEXT | NOT NULL |
| score | INTEGER | NOT NULL |
| user_id | INTEGER | FOREIGN KEY → users(id) ON DELETE CASCADE |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |

**Indexes:**
- `idx_highscores_user_id` on `user_id`

## Environment Variables

### Local Development (.dev.vars)

```env
JWT_SECRET=your-secret-key
```

### Production (via wrangler secret)

```bash
wrangler secret put JWT_SECRET
```

### Wrangler Configuration (wrangler.toml)

```toml
JWT_EXPIRATION = "7d"
CORS_ORIGIN = "*"
```

## Project Structure

```
workers/
├── src/
│   ├── index.js                 # Main Hono app entry point
│   ├── config/
│   │   └── database.js          # D1 database abstraction layer
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   └── highscoreController.js # Highscore logic
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT verification middleware
│   └── routes/
│       ├── authRoutes.js        # Auth route definitions
│       └── highscoreRoutes.js   # Highscore route definitions
├── test/
│   ├── server.test.js           # Server tests
│   ├── highscoreController.test.js # Controller tests
│   └── highscoreRoutes.test.js  # Route tests
├── migrations/
│   └── 0001_initial_schema.sql  # Database schema migration
├── wrangler.toml                # Cloudflare Workers config
├── package.json                 # Dependencies and scripts
├── vitest.config.js             # Test configuration
└── .dev.vars                    # Local development secrets
```

## Useful Commands

```bash
# Development
npm run dev              # Start local dev server
npm test                 # Run tests
npm run test:watch       # Run tests in watch mode

# Database
npm run migrate:local    # Run migrations locally
npm run migrate:prod     # Run migrations in production
wrangler d1 execute memoria-db --local --command "SELECT * FROM users"  # Query local DB
wrangler d1 execute memoria-db --command "SELECT * FROM users"          # Query prod DB

# Deployment
npm run deploy           # Deploy to production
wrangler tail            # View live logs
wrangler dev             # Start local development

# Secrets
wrangler secret put JWT_SECRET       # Set production secret
wrangler secret list                 # List all secrets
wrangler secret delete JWT_SECRET    # Delete a secret