# Memoria

Memoria is a small browser-based Memory card game. It features a React frontend for interactive gameplay and a Node.js/Express backend API connected to a PostgreSQL database to manage a persistent highscore list. Players can enjoy the challenge and see how their scores rank against others.

## Features

- Classic Memory card matching gameplay.
- Player name entry at the start of the game.
- Score calculation based on game performance (e.g., time, turns).
- Persistent highscore list.
- Display of player's rank after completing a game.

## Project Architecture

### Frontend
The frontend handles gameplay logic, UI rendering, score tracking, and user interaction directly in the browser. Users can start a new game and view the highscore list.

Upon starting a game, the player is prompted to enter a name. Once the game is successfully completed, the frontend:

- Sends the final score to the backend,
- Retrieves the updated highscore list, and
- Displays the list with the current player's rank and score highlighted.

The frontend is built with modern tooling, such as:

- **React** – UI library for interactive components
- **Vite** – Fast bundler and dev server
- **ESLint** – Linting and code quality checks
- **Jest** – Unit testing framework
- **Docker** – Containerized deployment setup using Nginx for static file hosting

### Backend

The backend is a lightweight API server that stores and returns the highscore list.

- **Express.js** – Minimalist Node.js server
- **ESLint** – Static code analysis
- **Jest** + Supertest – API unit/integration tests
- **Docker** – Containerized backend environment

The backend provides REST endpoints to:

- Fetch the current highscore list **(GET /api/highscores)**
- Submit a new score **(POST /api/highscores)**

### Database

– **PostgreSQL** – Stores the highscore data.

## Getting Started

### Prerequisites

*   [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed.


### Running Locally with Docker Compose

1.  **Build and start the containers (first time):**
  ```bash
  docker compose up --build -d
  ```
2.  **Start the containers (subsequent times):**
  ```bash
  docker compose up -d
  ```
3.  **Stop the containers:**
  ```bash
  docker compose down
  ```
Once running, the services will be available at:
- **Frontend:** [http://localhost:8080/](http://localhost:8080/)
- **Backend API:** [http://localhost:3000/](http://localhost:3000/)
- **Database:** Accessible internally by the backend (Port 5432)

## Testing and Linting

To ensure code quality and functionality, you can run linting and testing scripts within each service's directory (`frontend/` or `backend/`).

Navigate to the desired directory (e.g., `cd backend`) and run:

-   **Linting:**
  ```bash
  npm run lint
  ```
  This command uses ESLint to check the code for style issues and potential errors based on the configured rules.

-   **Testing:**
  ```bash
  npm run test
  ```
  This command executes the test suite using Jest. Test results (including JUnit reports) are typically generated in a `test-results` directory within the respective service folder. Coverage reports might also be generated in a `reports/coverage` directory.
