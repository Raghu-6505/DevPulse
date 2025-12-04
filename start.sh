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
# Next.js standalone server.js should be in /app/client/
cd /app/client

# Verify server.js exists
if [ ! -f server.js ]; then
    echo "ERROR: server.js not found in /app/client/"
    echo "Contents of /app/client/:"
    ls -la /app/client/ | head -20
    exit 1
fi

echo "Starting frontend on port 3000..."
PORT=3000 HOSTNAME=0.0.0.0 node server.js &
FRONTEND_PID=$!

# Give services a moment to start
sleep 3

# Check if services are running
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "ERROR: Backend failed to start"
fi
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    echo "ERROR: Frontend failed to start"
fi

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

