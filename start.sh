#!/bin/sh

echo "Starting services..."

# Start nginx (listens on 8080, Render will map its port to 8080)
echo "Starting nginx on port 8080..."

# Test nginx configuration first
if ! nginx -t 2>&1; then
    echo "ERROR: Nginx configuration test failed!"
    echo "Nginx config:"
    cat /etc/nginx/nginx.conf
    exit 1
fi

nginx -g "daemon off;" &
NGINX_PID=$!

# Wait a moment for nginx to start and verify it's running
sleep 2
if ! kill -0 $NGINX_PID 2>/dev/null; then
    echo "ERROR: Nginx failed to start!"
    exit 1
else
    echo "✓ Nginx is running (PID: $NGINX_PID)"
fi

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

# Give services more time to fully start (especially Next.js which takes longer)
echo "Waiting for services to fully start..."
sleep 8

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

# Test if services are listening on their ports (with retries)
echo "Checking port availability..."
for i in 1 2 3; do
    if nc -z localhost 8000 2>/dev/null; then
        echo "✓ Backend is listening on port 8000"
        break
    elif [ $i -eq 3 ]; then
        echo "WARNING: Backend not listening on port 8000 (may still be starting)"
    else
        sleep 2
    fi
done

for i in 1 2 3; do
    if nc -z localhost 3000 2>/dev/null; then
        echo "✓ Frontend is listening on port 3000"
        break
    elif [ $i -eq 3 ]; then
        echo "WARNING: Frontend not listening on port 3000 (may still be starting)"
    else
        sleep 2
    fi
done

# Verify nginx is listening on 8080
if nc -z localhost 8080 2>/dev/null; then
    echo "✓ Nginx is listening on port 8080 (this is the port Render should use)"
else
    echo "ERROR: Nginx not listening on port 8080!"
    exit 1
fi

echo ""
echo "=========================================="
echo "All services started successfully!"
echo "=========================================="
echo "Nginx routing (port 8080):"
echo "  - /api/* -> Backend (localhost:8000)"
echo "  - /* -> Frontend (localhost:3000)"
echo ""
echo "IMPORTANT: Render should use port 8080"
echo "Set PORT=8080 in Render environment variables"
echo "=========================================="

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

