#!/bin/bash

# Script to start backend with proper environment setup
# Usage: ./scripts/start-backend.sh

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BACKEND_DIR="$(dirname "$SCRIPT_DIR")"

echo "Starting DMT Education Backend"
echo "=================================="
echo ""

# Check if .env.local exists
if [ ! -f "$BACKEND_DIR/.env.local" ]; then
    echo "Error: .env.local file not found"
    echo "Please create .env.local file with database configuration"
    exit 1
fi

# Load environment variables
export $(cat "$BACKEND_DIR/.env.local" | grep -v '^#' | xargs)

echo "Configuration:"
echo "   Database: $DB_DATABASE"
echo "   Server: $DB_SERVER:$DB_PORT"
echo "   User: $DB_USER"
echo ""

# Check if database exists
echo "🔍 Checking database connection..."
node "$SCRIPT_DIR/test-connection.mjs" || {
    echo ""
    echo "Database connection failed!"
    echo ""
    echo "💡 Quick fix options:"
    echo "   1. Run: node scripts/create-database.mjs"
    echo "   2. Check if SQL Server container is running: docker ps"
    echo "   3. Start SQL Server: docker start dmt-sqlserver"
    echo ""
    exit 1
}

echo ""
echo "Database connection successful"
echo ""

# Kill any existing process on port 3001
echo "🧹 Cleaning up old processes..."
lsof -ti:$PORT 2>/dev/null | xargs kill -9 2>/dev/null || true
sleep 1

# Start the backend
echo "🎬 Starting backend server..."
echo ""
cd "$BACKEND_DIR"

if [ "$1" == "--dev" ] || [ "$1" == "-d" ]; then
    echo "📝 Running in development mode with watch..."
    npx tsx watch src/server.ts
else
    echo "🏃 Running in production mode..."
    npm run build && npm start
fi
