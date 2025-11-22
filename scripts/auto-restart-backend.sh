#!/bin/bash

# Auto-restart Backend Script
# Monitors backend health and auto-restarts if it crashes

BACKEND_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../Backend" && pwd)"
LOG_FILE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/backend.log"
MAX_RETRIES=3
RETRY_COUNT=0

echo "🔄 Starting auto-restart backend monitor..."
echo "📁 Backend dir: $BACKEND_DIR"
echo "📝 Log file: $LOG_FILE"

while true; do
  # Check if backend is running
  if ! lsof -ti:3001 > /dev/null 2>&1; then
    echo "❌ Backend not running. Attempting restart ($((RETRY_COUNT+1))/$MAX_RETRIES)..."
    
    # Kill any stuck processes
    pkill -f "tsx watch" 2>/dev/null
    sleep 2
    
    # Start backend
    cd "$BACKEND_DIR"
    npm run dev > "$LOG_FILE" 2>&1 &
    BACKEND_PID=$!
    
    echo "🚀 Backend started (PID: $BACKEND_PID)"
    sleep 5
    
    # Check if it started successfully
    if lsof -ti:3001 > /dev/null 2>&1; then
      echo "✅ Backend running on port 3001"
      RETRY_COUNT=0
    else
      RETRY_COUNT=$((RETRY_COUNT+1))
      echo "⚠️ Backend failed to start"
      
      if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
        echo "❌ Max retries reached. Exiting..."
        exit 1
      fi
    fi
  else
    # Check if backend is responsive
    if ! curl -s -m 2 http://localhost:3001/health > /dev/null 2>&1; then
      echo "⚠️ Backend not responsive. Restarting..."
      pkill -f "tsx watch" 2>/dev/null
      sleep 2
    else
      # Backend is healthy
      if [ $RETRY_COUNT -gt 0 ]; then
        echo "✅ Backend recovered"
        RETRY_COUNT=0
      fi
    fi
  fi
  
  sleep 10
done
