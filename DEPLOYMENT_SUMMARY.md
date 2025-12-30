# Memoria - Deployment Summary

## Live URLs

### Frontend (AWS S3)
**URL**: http://memory-frontend-s3.s3-website-us-east-1.amazonaws.com/

**Hosting**: AWS S3 Static Website Hosting
**Region**: us-east-1 (N. Virginia)
**Bucket**: memory-frontend-s3

### Backend (Cloudflare Workers)
**API URL**: https://memoria-api.mkaltenr.workers.dev

**Endpoints**:
- `GET /` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Token verification (protected)
- `GET /api/highscores` - Get top 10 highscores (public)
- `POST /api/highscores` - Submit highscore (protected)

### Database (Cloudflare D1)
**Database**: memoria-db (SQLite)
**Region**: EEUR (Eastern Europe - Warsaw)
**Tables**: users, highscores

---

## Architecture

```
┌─────────────────────────────────────────┐
│         User's Browser                   │
└──────────────┬──────────────────────────┘
               │
               │ HTTP
               ▼
┌─────────────────────────────────────────┐
│   AWS S3 Static Website Hosting         │
│   memory-frontend-s3                    │
│   Region: us-east-1                     │
│                                         │
│   - React Frontend                      │
│   - Vite Build                          │
└──────────────┬──────────────────────────┘
               │
               │ HTTPS API Calls
               │ (REST)
               ▼
┌─────────────────────────────────────────┐
│   Cloudflare Workers                    │
│   memoria-api.mkaltenr.workers.dev      │
│                                         │
│   - Hono Framework                      │
│   - JWT Authentication (jose)           │
│   - bcrypt Password Hashing             │
│   - CORS Enabled                        │
└──────────────┬──────────────────────────┘
               │
               │ SQL Queries
               ▼
┌─────────────────────────────────────────┐
│   Cloudflare D1 Database                │
│   memoria-db                            │
│   Region: EEUR (Warsaw)                 │
│                                         │
│   - SQLite Database                     │
│   - Global Replication                  │
│   - Tables: users, highscores           │
└─────────────────────────────────────────┘
```

---

## Deployment Details

### Frontend (S3)
- **Framework**: React 19.1.0
- **Build Tool**: Vite 6.4.1
- **Files**:
  - index.html
  - assets/index-*.js
  - assets/index-*.css
  - Card images (PNG)
- **Configuration**:
  - Public read access enabled
  - Static website hosting enabled
  - Index document: index.html

### Backend (Workers)
- **Framework**: Hono 4.0.0
- **Runtime**: Cloudflare Workers (V8 isolates)
- **Compatibility**: nodejs_compat
- **Dependencies**:
  - jose ^5.2.0 (JWT)
  - bcryptjs ^2.4.3 (Password hashing)
  - hono ^4.0.0 (Framework)

### Database (D1)
- **Type**: SQLite (serverless)
- **Schema**:
  - users: id, username, email, password_hash, created_at
  - highscores: id, name, score, user_id, created_at
- **Indexes**:
  - idx_users_username
  - idx_users_email
  - idx_highscores_user_id

---

## Security Features

**JWT Authentication**
- 7-day token expiration
- HS256 algorithm
- Secure token generation using Web Crypto API

**Password Security**
- bcrypt hashing
- Minimum requirements:
  - 8+ characters
  - 1 uppercase letter
  - 1 lowercase letter
  - 1 digit

**Input Validation**
- Username: 3-50 alphanumeric + underscore
- Email: Valid email format
- Score: Number validation

**CORS Configuration**
- Enabled for cross-origin requests
- Configurable per environment

**SQL Injection Protection**
- Parameterized queries
- D1 prepared statements

---

## Testing the Deployment

### Test Script

```bash
# Health check
curl http://memory-frontend-s3.s3-website-us-east-1.amazonaws.com/

# Backend API health
curl https://memoria-api.mkaltenr.workers.dev/

# Get highscores
curl https://memoria-api.mkaltenr.workers.dev/api/highscores

# Register user
curl -X POST https://memoria-api.mkaltenr.workers.dev/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","email":"demo@example.com","password":"Demo1234"}'

# Login
curl -X POST https://memoria-api.mkaltenr.workers.dev/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"Demo1234"}'
```

---

## Maintenance

### Update Frontend

```bash
cd frontend
npm run build
aws s3 sync dist/ s3://memory-frontend-s3 --delete --acl public-read
```

Or use the deployment script:
```bash
./deploy-s3.sh
```

### Update Backend

```bash
cd workers
npm run deploy
```

### View Logs

```bash
cd workers
npx wrangler tail
```

### Query Database

```bash
# List all users
npx wrangler d1 execute memoria-db --remote \
  --command "SELECT id, username, email FROM users"

# List highscores
npx wrangler d1 execute memoria-db --remote \
  --command "SELECT * FROM highscores ORDER BY score DESC LIMIT 10"
```

---

## Documentation

- **Workers Backend**: `workers/README.md`
- **S3 Deployment**: `frontend/S3_DEPLOYMENT.md`
- **API Configuration**: `frontend/API_SETUP.md`
- **Presentation Guide**: `PRESENTATION_GUIDE.md`

---

## Key Points to Highlight

1. **Multi-Cloud Architecture**
   - Frontend: AWS S3
   - Backend: Cloudflare Workers
   - Database: Cloudflare D1
   - Shows real-world cloud integration

2. **Serverless Benefits**
   - No server management
   - Auto-scaling
   - Pay-per-use pricing
   - Global distribution

3. **Modern Development Practices**
   - Git-based deployment
   - Environment-based configuration
   - RESTful API design
   - JWT authentication

4. **Performance**
   - Edge computing (Workers)
   - Global CDN distribution
   - Low latency (<20ms API responses)
   - Fast cold starts (~0ms)

### Demo Flow (15 minutes)

1. **Theory** (5 min): What are Cloudflare Workers?
2. **Architecture** (1 min): Show the diagram above
3. **Code Walkthrough** (2 min): Show key files
4. **Deployment** (2 min): Show deployment process
5. **Live Demo** (3 min): Play the game
6. **DevTools** (1 min): Show network requests
7. **Q&A** (1 min)

---

## What Was Achieved

- Fully functional memory game
- User authentication with JWT
- Persistent highscore leaderboard
- Multi-cloud deployment (AWS + Cloudflare)
- Production-ready architecture
- Secure password hashing
- Global distribution
- Automated deployment scripts
- Comprehensive documentation
- Cost-effective (<$5/month)

---

## Monitoring

- **Cloudflare Dashboard**: https://dash.cloudflare.com/
  - View Workers analytics
  - Monitor D1 database
  - Check error rates
  - View request logs

- **AWS Console**: https://s3.console.aws.amazon.com/
  - Monitor S3 storage
  - View access logs
  - Check bandwidth usage
