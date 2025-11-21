#!/bin/bash

# DMT Education System - Stop Development Servers

echo "🛑 Stopping DMT Education System Development Environment"
echo "=========================================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Stop Backend
echo -e "\n${BLUE}[1/2]${NC} Stopping Backend Server..."
if pkill -f "tsx watch"; then
    echo -e "${GREEN}✅ Backend stopped${NC}"
else
    echo -e "${BLUE}ℹ️  No backend process found${NC}"
fi

# Stop Frontend
echo -e "\n${BLUE}[2/2]${NC} Stopping Frontend Server..."
if pkill -f "vite"; then
    echo -e "${GREEN}✅ Frontend stopped${NC}"
else
    echo -e "${BLUE}ℹ️  No frontend process found${NC}"
fi

echo -e "\n${GREEN}============================================================${NC}"
echo -e "${GREEN} All development servers stopped${NC}"
echo -e "${GREEN}============================================================${NC}"
echo ""
echo -e "${BLUE}💡 Tip: SQL Server container is still running.${NC}"
echo -e "   To stop it: ${BLUE}docker stop dmt-sqlserver${NC}"
echo ""
