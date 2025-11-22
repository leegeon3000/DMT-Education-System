#!/bin/bash

# Script to check if both frontend and backend are running
# Usage: ./scripts/check-system.sh

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "======================================"
echo "DMT Education System - Health Check"
echo "======================================"
echo ""

# Check Backend (Port 3001)
echo -n "Backend Server (Port 3001): "
if lsof -ti:3001 > /dev/null 2>&1; then
    echo -e "${GREEN}RUNNING${NC}"
    BACKEND_PID=$(lsof -ti:3001 | head -1)
    echo "  PID: $BACKEND_PID"
    
    # Test backend API
    if curl -s http://localhost:3001/api/analytics/summary > /dev/null 2>&1; then
        echo -e "  API Status: ${GREEN}OK${NC}"
    else
        echo -e "  API Status: ${RED}ERROR${NC}"
    fi
else
    echo -e "${RED}NOT RUNNING${NC}"
    echo "  To start: cd Backend && npm run dev"
fi
echo ""

# Check Frontend (Port 5173)
echo -n "Frontend Server (Port 5173): "
if lsof -ti:5173 > /dev/null 2>&1; then
    echo -e "${GREEN}RUNNING${NC}"
    FRONTEND_PID=$(lsof -ti:5173 | head -1)
    echo "  PID: $FRONTEND_PID"
    echo -e "  URL: ${BLUE}http://localhost:5173${NC}"
else
    echo -e "${RED}NOT RUNNING${NC}"
    echo "  To start: npm run dev"
fi
echo ""

# Check SQL Server (Port 1433)
echo -n "SQL Server (Port 1433): "
if lsof -ti:1433 > /dev/null 2>&1; then
    echo -e "${GREEN}RUNNING${NC}"
    
    # Check if it's Docker container
    if docker ps | grep -q dmt-sqlserver 2>/dev/null; then
        echo "  Container: dmt-sqlserver"
        CONTAINER_STATUS=$(docker inspect -f '{{.State.Status}}' dmt-sqlserver 2>/dev/null)
        echo "  Status: $CONTAINER_STATUS"
    fi
else
    echo -e "${RED}NOT RUNNING${NC}"
    echo "  To start: docker start dmt-sqlserver"
fi
echo ""

# Overall System Status
echo "======================================"
BACKEND_OK=0
FRONTEND_OK=0
DB_OK=0

lsof -ti:3001 > /dev/null 2>&1 && BACKEND_OK=1
lsof -ti:5173 > /dev/null 2>&1 && FRONTEND_OK=1
lsof -ti:1433 > /dev/null 2>&1 && DB_OK=1

TOTAL=$((BACKEND_OK + FRONTEND_OK + DB_OK))

if [ $TOTAL -eq 3 ]; then
    echo -e "${GREEN}✓ All systems operational (3/3)${NC}"
    exit 0
elif [ $TOTAL -eq 2 ]; then
    echo -e "${YELLOW}⚠ Partial system running (2/3)${NC}"
    exit 1
elif [ $TOTAL -eq 1 ]; then
    echo -e "${YELLOW}⚠ Minimal system running (1/3)${NC}"
    exit 1
else
    echo -e "${RED}✗ System not running (0/3)${NC}"
    echo ""
    echo "Quick Start:"
    echo "  1. Start SQL Server: docker start dmt-sqlserver"
    echo "  2. Start Backend: cd Backend && npm run dev"
    echo "  3. Start Frontend: npm run dev"
    exit 1
fi
