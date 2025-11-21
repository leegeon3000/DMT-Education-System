#!/bin/bash

# DMT Education System - Development Startup Script
# This script starts both Backend and Frontend servers

echo "🚀 DMT Education System - Starting Development Environment"
echo "============================================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if SQL Server is running
echo -e "\n${BLUE}[1/4]${NC} Checking SQL Server..."
if ! docker ps | grep -q dmt-sqlserver; then
    echo -e "${YELLOW}⚠️  SQL Server container not running. Starting...${NC}"
    docker start dmt-sqlserver
    echo -e "${BLUE}⏳ Waiting for SQL Server to initialize (15 seconds)...${NC}"
    sleep 15
    echo -e "${GREEN}✅ SQL Server started${NC}"
else
    echo -e "${GREEN}✅ SQL Server is running${NC}"
fi

# Kill existing processes
echo -e "\n${BLUE}[2/4]${NC} Cleaning up existing processes..."
pkill -f "tsx watch" 2>/dev/null && echo -e "${GREEN}   Stopped old backend${NC}"
pkill -f "vite" 2>/dev/null && echo -e "${GREEN}   Stopped old frontend${NC}"
sleep 2

# Start Backend
echo -e "\n${BLUE}[3/4]${NC} Starting Backend Server..."
cd Backend
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..
echo -e "${GREEN}✅ Backend starting (PID: $BACKEND_PID)${NC}"
echo -e "${BLUE}   Log file: backend.log${NC}"
sleep 5

# Check if backend started successfully
if ps -p $BACKEND_PID > /dev/null; then
    echo -e "${GREEN}   Backend process is running${NC}"
else
    echo -e "${RED}❌ Backend failed to start. Check backend.log for errors${NC}"
    exit 1
fi

# Start Frontend
echo -e "\n${BLUE}[4/4]${NC} Starting Frontend Server..."
npm start > frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✅ Frontend starting (PID: $FRONTEND_PID)${NC}"
echo -e "${BLUE}   Log file: frontend.log${NC}"
sleep 3

# Display status
echo -e "\n${GREEN}============================================================${NC}"
echo -e "${GREEN}🎉 Development environment started successfully!${NC}"
echo -e "${GREEN}============================================================${NC}"
echo ""
echo -e "${BLUE}📊 Services:${NC}"
echo -e "   🗄️  SQL Server:  ${GREEN}Running${NC} (Docker container: dmt-sqlserver)"
echo -e "   ⚙️  Backend:     ${GREEN}http://localhost:3001${NC} (PID: $BACKEND_PID)"
echo -e "   🌐 Frontend:    ${GREEN}http://localhost:5173${NC} (PID: $FRONTEND_PID)"
echo ""
echo -e "${BLUE}📝 Logs:${NC}"
echo -e "   Backend:  ${YELLOW}tail -f backend.log${NC}"
echo -e "   Frontend: ${YELLOW}tail -f frontend.log${NC}"
echo ""
echo -e "${BLUE}🔐 Demo Accounts:${NC}"
echo -e "   Admin:     ${GREEN}admin@dmt.edu.vn${NC}    / password"
echo -e "   Teacher:   ${GREEN}teacher@dmt.edu.vn${NC}  / teacher123"
echo -e "   Student:   ${GREEN}student@dmt.edu.vn${NC}  / student123"
echo -e "   Parent:    ${GREEN}parent@dmt.edu.vn${NC}   / parent123"
echo ""
echo -e "${BLUE}🛑 To stop servers:${NC}"
echo -e "   ${YELLOW}./stop-dev.sh${NC} or ${YELLOW}pkill -f 'tsx watch|vite'${NC}"
echo ""
echo -e "${GREEN} Open your browser at: http://localhost:5173${NC}"
echo ""
