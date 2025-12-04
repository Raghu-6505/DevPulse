#!/bin/sh

echo "Starting services..."

# Start nginx (listens on 8080, Render will map its port to 8080)
echo "Starting nginx on port 8080..."
nginx -g "daemon off;" &
NGINX_PID=$!

# Wait a moment for nginx to start
sleep 2

# Start backend in background with explicit port (not using PORT env var)
echo "Starting backend on port 8000..."
cd /app/backend
BACKEND_PORT=8000 node server.js &
BACKEND_PID=$!

# Start frontend in background with explicit port and hostname
# Next.js standalone should be run from its directory
cd /app/client-standalone

# Verify server.js exists
if [ ! -f server.js ]; then
    echo "ERROR: server.js not found in /app/client-standalone/"
    echo "Contents of /app/client-standalone/:"
    ls -la /app/client-standalone/ | head -20
    exit 1
fi

echo "Starting frontend on port 3000 from /app/client-standalone..."
PORT=3000 HOSTNAME=0.0.0.0 node server.js &
FRONTEND_PID=$!

# Give services a moment to start
sleep 5

# Check if services are running
echo "Checking service health..."
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "ERROR: Backend process is not running!"
    ps aux | grep node
    exit 1
else
    echo "✓ Backend is running (PID: $BACKEND_PID)"
fi

if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    echo "ERROR: Frontend process is not running!"
    echo "Frontend directory contents:"
    ls -la /app/client-standalone/ 2>/dev/null || echo "Directory not found"
    ps aux | grep node
    exit 1
else
    echo "✓ Frontend is running (PID: $FRONTEND_PID)"
fi

# Test if services are listening on their ports
if ! nc -z localhost 8000 2>/dev/null; then
    echo "WARNING: Backend not listening on port 8000"
fi

if ! nc -z localhost 3000 2>/dev/null; then
    echo "WARNING: Frontend not listening on port 3000"
    echo "This might cause 404 errors!"
else
    echo "✓ Frontend is listening on port 3000"
fi

echo "All services started. Nginx routing:"
echo "  - /api/* -> Backend (localhost:8000)"
echo "  - /* -> Frontend (localhost:3000)"

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

