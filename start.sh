#!/bin/sh

# Start nginx
nginx

# Start backend in background
cd /app/backend
node server.js &

# Start frontend in background
cd /app/client
node server.js &

# Wait for all processes
wait

