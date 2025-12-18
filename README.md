# Memoria

A full-stack memory application with a React frontend and Node.js backend.

## Table of Contents

* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Environment Configuration](#environment-configuration)
* [Local Development](#local-development)
* [Production Deployment](#production-deployment)
* [NPM Scripts](#npm-scripts)
* [Project Structure](#project-structure)

## Prerequisites

* Docker Engine >=v20.10.24
* Docker Compose >=v2.17.2
* Node.js >=v22.14.0
* npm >=v10.0.0

## Installation

Install dependencies for both frontend and backend:

```sh
npm run setup
```

## Environment Configuration

The application uses environment files for configuration:

- `.env.example` - Template file with all required environment variables
- `.env.local` - Local development configuration (create this file)
- `.env` - Production configuration (create this file)

**Setup for local development:**

1. Copy the example file:

```sh
cp .env.example .env.local
```

2. The default values work with Docker. If you need to change them, update `.env.local`:

```
DB_HOST=db              # Use "db" for Docker, "localhost" if running backend without Docker
DB_PORT=5432
DB_USER=user
DB_PASSWORD=password
DB_NAME=memoria
NODE_ENV=development
```

**Setup for production:**

1. Copy the example file:

```sh
cp .env.example .env
```

2. Update `.env` with your production credentials (never commit this file). Keep `DB_HOST=db` when using Docker.

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
