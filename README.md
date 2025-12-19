# Memoria

A full-stack memory card matching game with user authentication and highscore tracking. Built with React, Node.js, Express.js and PostgreSQL.

## Features

- User registration and authentication (JWT-based)
- 4x4 memory card grid game
- Real-time score calculation based on attempts and time
- Highscore leaderboard
- Responsive design with smooth animations

## Quick Start

**Prerequisites:** Docker, Docker Compose, Node.js >=22, npm >=10

1. Install dependencies:
```sh
npm run setup
```

2. Configure environment (default values work for development):
```sh
cp .env.example .env.local
```

3. Start development environment:
```sh
# Start backend and database
docker-compose -f docker-compose-dev.yaml up -d

# Start frontend dev server
npm run dev:frontend
```

Access at http://localhost:5173 (frontend) and http://localhost:3000 (API)

## Local Development

For local development, you can run the backend in Docker while developing the frontend locally:

1. Start the backend and database services:

```sh
docker-compose -f docker-compose-dev.yaml up -d
```

2. Start the frontend development server:

```sh
npm run dev:frontend
```

The application will be available at:
* Frontend: http://localhost:5173 (Vite dev server)
* Backend API: http://localhost:3000
* Database: localhost:5432

To stop the backend services:

```sh
docker-compose -f docker-compose-dev.yaml down
```

## Production Deployment

Start the complete application (frontend, backend, and database) in production:

```sh
docker-compose up --build -d
```

This will spin up:
* PostgreSQL database on port 5432
* Backend API on port 3000
* Frontend on port 8080

Access the application at http://localhost:8080

To stop all services:

```sh
docker-compose down
```

## NPM Scripts

### Development
* `npm run dev:frontend` - Start frontend development server
* `npm run dev:backend` - Start backend development server

### Building
* `npm run build` - Build frontend for production (backend is plain JS and doesn't need building)

### Testing
* `npm run test` - Run tests for both frontend and backend
* `npm run test:frontend` - Run frontend tests only
* `npm run test:backend` - Run backend tests only

### Linting
* `npm run lint` - Lint both frontend and backend
* `npm run lint:frontend` - Lint frontend only
* `npm run lint:backend` - Lint backend only

### Cleanup
* `npm run clean` - Clean build artifacts in both projects

## Project Structure

```
.
├── frontend/                  # React frontend application
├── backend/                   # Node.js backend application
├── docker-compose.yaml        # Production docker configuration
├── docker-compose-dev.yaml    # Development docker configuration (backend only)
├── package.json               # Root package with workspaces configuration
├── .env.example               # Environment variables template
├── .env.local                 # Local environment config (gitignored)
└── .env                       # Production environment config (gitignored)
```
