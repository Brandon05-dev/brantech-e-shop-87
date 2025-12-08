#!/bin/bash

echo "🚀 Starting Brantech E-Shop..."
echo ""

# Start MongoDB if not running
if ! pgrep -x "mongod" > /dev/null; then
    echo "🔧 Starting MongoDB..."
    sudo systemctl start mongod
    sleep 2
fi

# Start backend in background
echo "🔧 Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start frontend
echo "🔧 Starting frontend server..."
cd frontend
npm run dev

# Cleanup on exit
trap "kill $BACKEND_PID" EXIT
