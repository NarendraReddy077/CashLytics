#!/bin/bash

# CashLytics Deployment Script for Railway
# This script determines whether to start the Backend or Frontend based on the SERVICE_TYPE env var.

if [ "$SERVICE_TYPE" == "backend" ]; then
    echo "🚀 Starting CashLytics Backend (FastAPI)..."
    cd backend
    # Install dependencies if not already handled by build step
    pip install -r requirements.txt
    # Run uvicorn on the port provided by Railway
    uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}

elif [ "$SERVICE_TYPE" == "frontend" ]; then
    echo "🚀 Starting CashLytics Frontend (React)..."
    cd frontend
    # Install dependencies
    npm install
    # Build the production assets
    npm run build
    # Serve the static files using 'serve'
    # Railway provides the PORT env var
    npx serve -s dist -p ${PORT:-5173}

else
    echo "⚠️ SERVICE_TYPE environment variable not set or invalid."
    echo "Falling back to Backend..."
    cd backend
    pip install -r requirements.txt
    uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
fi
