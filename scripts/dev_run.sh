#!/usr/bin/env bash
set -e

echo "=================================================="
echo "Starting Aurora Polar Expedition Command Platform"
echo "=================================================="

cleanup() {
  echo ""
  echo "Shutting down Aurora services..."
  kill $(jobs -p) 2>/dev/null || true
  exit 0
}

trap cleanup SIGINT SIGTERM EXIT

if [ -d "backend/venv" ]; then
  echo "Activating Python virtual environment..."
  source backend/venv/bin/activate
fi

echo "Starting FastAPI Backend Service on port 8000..."
(cd backend && uvicorn main:app --host 0.0.0.0 --port 8000 --reload) &

echo "Starting React/Vite Frontend Service on port 5173..."
(cd frontend && npm run dev) &

echo "=================================================="
echo "Aurora Services Booting:"
echo "  - Backend API:  http://localhost:8000/health"
echo "  - Frontend App: http://localhost:5173"
echo "Press Ctrl+C to stop all services."
echo "=================================================="

wait
