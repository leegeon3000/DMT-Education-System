#!/bin/bash

##############################################################################
# DMT Education System - Stop All Services
# Stops both backend and frontend servers
##############################################################################

BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo ""
echo -e "${CYAN}╔════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║         STOPPING DMT EDUCATION SYSTEM                              ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Stop Backend (port 3001)
if lsof -i :3001 > /dev/null 2>&1; then
    echo -e "${BLUE}🛑 Stopping Backend (port 3001)...${NC}"
    lsof -ti :3001 | xargs kill -9 2>/dev/null
    echo -e "${GREEN}✅ Backend stopped${NC}"
else
    echo -e "${YELLOW}⚠️  Backend not running${NC}"
fi

# Stop Frontend (port 5173)
if lsof -i :5173 > /dev/null 2>&1; then
    echo -e "\n${BLUE}🛑 Stopping Frontend (port 5173)...${NC}"
    lsof -ti :5173 | xargs kill -9 2>/dev/null
    echo -e "${GREEN}✅ Frontend stopped${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend not running${NC}"
fi

# Stop any remaining node processes related to the project
echo -e "\n${BLUE}Checking for related processes...${NC}"
pkill -f "vite" 2>/dev/null && echo -e "${GREEN}✅ Stopped Vite processes${NC}"
pkill -f "tsx.*server" 2>/dev/null && echo -e "${GREEN}✅ Stopped backend processes${NC}"

echo ""
echo -e "${CYAN}════════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ All services stopped${NC}"
echo ""
echo -e "${BLUE}To start again:${NC} ./scripts/start-all.sh"
echo ""
