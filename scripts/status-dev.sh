#!/bin/bash

# DMT Education System - Check Development Environment Status

echo "📊 DMT Education System - Status Check"
echo "======================================"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check SQL Server
echo -e "\n${BLUE}1. SQL Server Container:${NC}"
if docker ps | grep -q dmt-sqlserver; then
    echo -e "   ${GREEN}✅ Running${NC}"
    echo -e "   Container: dmt-sqlserver"
    echo -e "   Port: 1433"
else
    echo -e "   ${RED}❌ Not running${NC}"
    echo -e "   ${YELLOW}Start with: docker start dmt-sqlserver${NC}"
fi

# Check Backend
echo -e "\n${BLUE}2. Backend Server:${NC}"
if ps aux | grep -v grep | grep -q "tsx watch"; then
    BACKEND_PID=$(ps aux | grep -v grep | grep "tsx watch" | awk '{print $2}' | head -1)
    echo -e "   ${GREEN}✅ Running${NC} (PID: $BACKEND_PID)"
    
    # Test backend connection
    if curl -s http://localhost:3000/health > /dev/null 2>&1; then
        echo -e "   ${GREEN}✅ Responding at http://localhost:3000${NC}"
    else
        echo -e "   ${YELLOW}⚠️  Process running but not responding${NC}"
    fi
else
    echo -e "   ${RED}❌ Not running${NC}"
    echo -e "   ${YELLOW}Check logs: tail -f backend.log${NC}"
fi

# Check Frontend
echo -e "\n${BLUE}3. Frontend Server:${NC}"
if ps aux | grep -v grep | grep -q "vite"; then
    FRONTEND_PID=$(ps aux | grep -v grep | grep "vite" | awk '{print $2}' | head -1)
    echo -e "   ${GREEN}✅ Running${NC} (PID: $FRONTEND_PID)"
    
    # Test frontend connection
    if curl -s http://localhost:5173 > /dev/null 2>&1; then
        echo -e "   ${GREEN}✅ Responding at http://localhost:5173${NC}"
    else
        echo -e "   ${YELLOW}⚠️  Process running but not responding${NC}"
    fi
else
    echo -e "   ${RED}❌ Not running${NC}"
    echo -e "   ${YELLOW}Check logs: tail -f frontend.log${NC}"
fi

# Port status
echo -e "\n${BLUE}4. Port Status:${NC}"
if lsof -i :3000 > /dev/null 2>&1; then
    echo -e "   Port 3000 (Backend):  ${GREEN}✅ In use${NC}"
else
    echo -e "   Port 3000 (Backend):  ${RED}❌ Not in use${NC}"
fi

if lsof -i :5173 > /dev/null 2>&1; then
    echo -e "   Port 5173 (Frontend): ${GREEN}✅ In use${NC}"
else
    echo -e "   Port 5173 (Frontend): ${RED}❌ Not in use${NC}"
fi

echo -e "\n${BLUE}======================================"
echo -e "Commands:${NC}"
echo -e "  Start:  ${GREEN}./start-dev.sh${NC}"
echo -e "  Stop:   ${RED}./stop-dev.sh${NC}"
echo -e "  Status: ${BLUE}./status-dev.sh${NC}"
echo ""
