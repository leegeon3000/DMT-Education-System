#!/bin/bash

##############################################################################
# DMT Education System - Start All Services
# Starts both backend and frontend in separate terminal tabs
##############################################################################

BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo ""
echo -e "${CYAN}╔════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║         STARTING DMT EDUCATION SYSTEM                              ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if backend is already running
if lsof -i :3001 > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Backend already running on port 3001${NC}"
    read -p "Kill and restart? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}Stopping backend...${NC}"
        lsof -ti :3001 | xargs kill -9 2>/dev/null
        sleep 2
    else
        echo -e "${GREEN}Keeping existing backend${NC}"
        BACKEND_RUNNING=true
    fi
fi

# Check if frontend is already running
if lsof -i :5173 > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Frontend already running on port 5173${NC}"
    read -p "Kill and restart? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}Stopping frontend...${NC}"
        lsof -ti :5173 | xargs kill -9 2>/dev/null
        sleep 2
    else
        echo -e "${GREEN}Keeping existing frontend${NC}"
        FRONTEND_RUNNING=true
    fi
fi

# Start Backend
if [ "$BACKEND_RUNNING" != true ]; then
    echo -e "\n${BLUE}🚀 Starting Backend...${NC}"
    cd Backend
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}Installing backend dependencies...${NC}"
        npm install
    fi
    
    # Start backend in background
    nohup npm start > ../logs/backend.log 2>&1 &
    BACKEND_PID=$!
    echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID)${NC}"
    echo -e "   Logs: logs/backend.log"
    
    cd ..
    
    # Wait for backend to start
    echo -e "${BLUE}Waiting for backend to be ready...${NC}"
    for i in {1..30}; do
        if curl -s http://localhost:3001/health > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Backend is ready!${NC}"
            break
        fi
        sleep 1
        echo -n "."
    done
    echo ""
fi

# Start Frontend
if [ "$FRONTEND_RUNNING" != true ]; then
    echo -e "\n${BLUE}🚀 Starting Frontend...${NC}"
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}Installing frontend dependencies...${NC}"
        npm install
    fi
    
    # Start frontend in background
    nohup npm start > logs/frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo -e "${GREEN}✅ Frontend started (PID: $FRONTEND_PID)${NC}"
    echo -e "   Logs: logs/frontend.log"
    
    # Wait for frontend to start
    echo -e "${BLUE}Waiting for frontend to be ready...${NC}"
    for i in {1..30}; do
        if curl -s http://localhost:5173 > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Frontend is ready!${NC}"
            break
        fi
        sleep 1
        echo -n "."
    done
    echo ""
fi

# Summary
echo ""
echo -e "${CYAN}════════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ DMT Education System is running!${NC}"
echo ""
echo -e "${BLUE}Services:${NC}"
echo -e "   🔌 Backend:  ${GREEN}http://localhost:3001${NC}"
echo -e "   🌐 Frontend: ${GREEN}http://localhost:5173${NC}"
echo ""
echo -e "${BLUE}Test Accounts:${NC}"
echo -e "   Teacher: teacher.math@dmt.edu.vn / Teacher@123"
echo -e "   Student: student@dmt.edu.vn / Student@123"
echo -e "   Staff:   staff@dmt.edu.vn / Staff@123"
echo -e "   Admin:   admin@dmt.edu.vn / Admin@123"
echo ""
echo -e "${BLUE}Logs:${NC}"
echo -e "   Backend:  tail -f logs/backend.log"
echo -e "   Frontend: tail -f logs/frontend.log"
echo ""
echo -e "${BLUE}Stop Services:${NC}"
echo -e "   ./scripts/stop-all.sh"
echo ""
echo -e "${CYAN}════════════════════════════════════════════════════════════════════${NC}"
echo ""
