# Memoria - Cloudflare Workers Presentation Guide

---

## Live Demo Presentation (~10 minutes)

#### Demo Flow

**1. Architecture Overview (1 min)**

Show the architecture diagram:

```
┌─────────────────┐
│   AWS S3        │
│  (Frontend)     │  ← User Browser
│  React + Vite   │     http://memory-frontend-s3.s3-website-us-east-1.amazonaws.com/
└────────┬────────┘
         │
         │ HTTPS API Calls
         │ (REST)
         │
┌────────▼────────┐
│ Cloudflare      │
│   Workers       │  ← https://memoria-api.mkaltenr.workers.dev
│  (Backend API)  │
│   Hono + JWT    │
└────────┬────────┘
         │
         │ SQL Queries
         │
┌────────▼────────┐
│ Cloudflare D1   │
│   (Database)    │
│    SQLite       │
└─────────────────┘
```

**Key Points:**

- Frontend: AWS S3 (static hosting)
- Backend: Cloudflare Workers (serverless API)
- Database: Cloudflare D1 (serverless SQLite)
- Multi-cloud architecture (AWS + Cloudflare)

---

**2. Code Walkthrough (2 min)**

Show key files:

**`workers/src/index.js`** - Main entry point

```javascript
import { Hono } from 'hono';

const app = new Hono();

// Routes
app.route('/api/auth', authRoutes);
app.route('/api/highscores', highscoreRoutes);

export default app;
```

**`workers/src/controllers/authController.js`** - JWT authentication

```javascript
export const login = async (c) => {
  const { email, password } = await c.req.json();

  // Verify password with bcrypt
  const isValid = await bcrypt.compare(password, user.password_hash);

  // Generate JWT token
  const token = await new SignJWT({ userId, username })
    .setExpirationTime('7d')
    .sign(secret);

  return c.json({ token, user });
};
```

**`workers/src/config/database.js`** - D1 database wrapper

```javascript
export class Database {
  async queryFirst(sql, params = []) {
    return await this.db.prepare(sql).bind(...params).first();
  }
}
```

**Highlight:**

- Modern JavaScript (ES modules)
- Web Crypto API for JWT (Workers-compatible)
- D1 API for database queries
- Clean separation of concerns

---

**3. Backend Deployment (3 min)**

**Step 1: Show wrangler.toml**

```toml
name = "memoria-api"
compatibility_flags = ["nodejs_compat"]

[[d1_databases]]
binding = "DB"
database_name = "memoria-db"
```

**Step 2: Run migration**

```bash
cd workers
npm run migrate:prod
```

Output:

```
Executed 5 queries in 2.53ms
Database ready!
```

**Step 3: Deploy to Cloudflare**

```bash
npm run deploy
```

**Step 4: Test the API**

```bash
curl https://memoria-api.mkaltenr.workers.dev/api/highscores
```

---

**4. Frontend Deployment to S3 (2 min)**

**Step 1: Build frontend**

```bash
cd frontend
npm run build
```

**Step 2: Deploy to S3**

Upload the files using the AWS Web Console.

---

**5. Live Application Demo (2 min)**

**Open the deployed website and demonstrate:**

1. **Register a new user**
   - Show form validation
   - Username, email, password requirements
   - JWT token returned

2. **Login**
   - Show authentication
   - Token stored in localStorage

3. **Play the game**
   - Demonstrate the memory game
   - Show score calculation

4. **Submit high score**
   - Authenticated API request
   - JWT token sent in Authorization header
   - Score saved to D1 database

5. **View leaderboard**
   - Public API endpoint
   - Shows top 10 scores
   - Real-time data from D1

**Show Developer Tools (F12):**

- Network tab: API requests to Cloudflare Workers
- Console: No errors
- Application: JWT token in localStorage

---

**6. Q&A Preparation**

**Expected Questions & Answers:**

**Q: How much does it cost?**
A: Workers free tier: 100,000 requests/day. D1 free tier: 5M reads/month. For this demo: $0.

**Q: How fast is it?**
A: Workers have ~0ms cold start (already running). Response time: 5-20ms typically.

**Q: Can it scale?**
A: Yes, automatically. Cloudflare's network handles millions of requests/sec globally.

**Q: What about databases?**
A: D1 is serverless SQLite, replicated globally. For larger scale, use external databases.

**Q: Why use Workers instead of traditional hosting?**
A:

- No server management
- Global distribution automatically
- Pay only for usage
- Better for spiky traffic

**Q: What are the limitations?**
A:

- CPU time: 50ms per request (free tier)
- Memory: 128 MB
- No file system (use Workers KV or R2)
- No native C++ modules (use WASM)

---

## Key Talking Points

### Why This Architecture?

1. **Separation of Concerns**
   - Frontend (presentation) on S3
   - Backend (logic) on Workers
   - Database (storage) on D1

2. **Cost Optimization**
   - S3: Cheap static hosting
   - Workers: Pay per request, not uptime
   - D1: Serverless database

3. **Performance**
   - S3: Fast static file delivery
   - Workers: Global edge network (275+ locations)
   - D1: SQLite performance with global replication

4. **Scalability**
   - All components auto-scale
   - No server management
   - Global distribution

5. **Developer Experience**
   - Modern JavaScript
   - Git-based deployment
   - Fast iteration cycles

### Technical Highlights

1. **JWT Authentication**
   - Stateless (perfect for serverless)
   - Secure with bcrypt password hashing
   - 7-day token expiration

2. **Database Abstraction**
   - Clean API over D1
   - Parameter binding for security
   - Error handling

3. **CORS Configuration**
   - Allows cross-origin requests
   - Configurable per environment
   - Essential for multi-cloud

4. **RESTful API Design**
   - Clear endpoint structure
   - HTTP status codes
   - JSON responses

---

## Post-Presentation

### Resources of the Demo

- GitHub repository: https://github.com/KaltMax/Memory/
- Cloudflare Workers Docs: https://developers.cloudflare.com/workers/
- D1 Documentation: https://developers.cloudflare.com/d1/
- Your deployed demo: http://memory-frontend-s3.s3-website-us-east-1.amazonaws.com/

### What needs to be changed for production?

1. **Add CloudFront CDN** to S3 for better performance
2. **Custom domain** instead of S3/Workers URLs
3. **Environment-specific CORS** (not wildcard '*')
4. **Rate limiting** on API endpoints
5. **Monitoring and alerting** (Cloudflare Analytics)
6. **CI/CD pipeline** (GitHub Actions)
7. **Automated testing** in deployment
8. **Error tracking** (Sentry, etc.)
9. **Database backups** and migration strategy
10. **API versioning** (/v1/, /v2/)
