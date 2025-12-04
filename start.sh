#!/bin/sh

# Start nginx (listens on 8080, Render will map its port to 8080)
nginx -g "daemon off;" &
NGINX_PID=$!

# Wait a moment for nginx to start
sleep 2

# Start backend in background with explicit port (not using PORT env var)
cd /app/backend
BACKEND_PORT=8000 node server.js &
BACKEND_PID=$!

# Start frontend in background with explicit port
cd /app/client
PORT=3000 node server.js &
FRONTEND_PID=$!

# Function to handle shutdown
cleanup() {
    echo "Shutting down services..."
    kill $BACKEND_PID $FRONTEND_PID $NGINX_PID 2>/dev/null
    exit 0
}

# Trap signals
trap cleanup SIGTERM SIGINT

# Wait for all background processes
wait

