# Aurora — AI-Powered Polar Expedition Command Platform

Aurora is an **offline-first polar expedition command platform** created for Smart India Hackathon (SIH). It provides unified situational awareness, dependency tracking, mission impact analysis, and grounded AI decision support for extreme polar operations.

## Architecture & Guiding Principles

1. **Deterministic Operational Core First:** The authoritative operational core (missions, cargo, inventory, personnel, dependency graph, constraints) operates 100% offline without LLM, RAG, agents, or internet connectivity.
2. **Authoritative Backend Persistence:** Global operational state is maintained in a central SQLite relational database.
3. **Client-Side Offline Replica:** Client state is replicated in browser IndexedDB (Dexie.js) for PWA operation when offline.
4. **Advisory AI Boundary:** AI outputs are non-binding recommendations (`Recommendation` objects). State changes require explicit Human Commander approval (`Approve` / `Modify` / `Reject`).

## Getting Started

### Prerequisites

- **Python:** 3.11 or higher
- **Node.js:** 18.0 or higher
- **npm:** 9.0 or higher

### Environment Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Install Backend Dependencies:
   ```bash
   python3 -m pip install -r backend/requirements.txt
   ```

3. Install Frontend Dependencies:
   ```bash
   cd frontend && npm install && cd ..
   ```

### Running the Application

Execute the development startup script to launch both backend and frontend concurrently:

```bash
./scripts/dev_run.sh
```

Or run services individually in separate terminals:

- **Backend API (Terminal 1):**
  ```bash
  uvicorn backend.main:app --reload --port 8000
  ```
  Healthcheck: [http://localhost:8000/health](http://localhost:8000/health)

- **Frontend App (Terminal 2):**
  ```bash
  cd frontend && npm run dev
  ```
  Web App: [http://localhost:5173](http://localhost:5173)

### Running Tests

Run backend unit and integration tests with `pytest`:

```bash
PYTHONPATH=. pytest tests/
```
