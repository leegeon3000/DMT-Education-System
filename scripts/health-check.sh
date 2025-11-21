#!/bin/bash

# System Health Check Script
# Comprehensive check of all services

YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}   DMT EDUCATION SYSTEM - HEALTH CHECK${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

ERRORS=0

# 1. Check SQL Server
echo -e "${YELLOW}[1/5]${NC} Checking SQL Server..."
if docker ps | grep -q dmt-sqlserver; then
    echo -e "${GREEN}  ✓ SQL Server running${NC}"
else
    echo -e "${RED}  ✗ SQL Server NOT running${NC}"
    ERRORS=$((ERRORS+1))
    echo -e "${YELLOW}    Fix: docker start dmt-sqlserver${NC}"
fi

# 2. Check Backend Port
echo -e "\n${YELLOW}[2/5]${NC} Checking Backend (Port 3001)..."
if lsof -ti:3001 > /dev/null 2>&1; then
    echo -e "${GREEN}  ✓ Backend process running${NC}"
    
    # Check health endpoint
    if curl -s -m 3 http://localhost:3001/health > /dev/null 2>&1; then
        HEALTH=$(curl -s -m 3 http://localhost:3001/health)
        echo -e "${GREEN}  ✓ Backend responding${NC}"
        echo -e "${BLUE}    Response: $HEALTH${NC}"
    else
        echo -e "${RED}  ✗ Backend NOT responding (timeout/error)${NC}"
        ERRORS=$((ERRORS+1))
        echo -e "${YELLOW}    Fix: pkill -f 'tsx watch' && cd Backend && npm run dev &${NC}"
    fi
else
    echo -e "${RED}  ✗ Backend NOT running${NC}"
    ERRORS=$((ERRORS+1))
    echo -e "${YELLOW}    Fix: cd Backend && npm run dev &${NC}"
fi

# 3. Check Frontend Port
echo -e "\n${YELLOW}[3/5]${NC} Checking Frontend (Port 5173)..."
if lsof -ti:5173 > /dev/null 2>&1; then
    echo -e "${GREEN}  ✓ Frontend running${NC}"
else
    echo -e "${RED}  ✗ Frontend NOT running${NC}"
    ERRORS=$((ERRORS+1))
    echo -e "${YELLOW}    Fix: npm start &${NC}"
fi

# 4. Check Environment Files
echo -e "\n${YELLOW}[4/5]${NC} Checking Environment Configuration..."
if [ -f ".env" ]; then
    echo -e "${GREEN}  ✓ Frontend .env exists${NC}"
else
    echo -e "${RED}  ✗ Frontend .env missing${NC}"
    ERRORS=$((ERRORS+1))
fi

if [ -f "Backend/.env" ]; then
    echo -e "${GREEN}  ✓ Backend .env exists${NC}"
    
    # Check critical env vars
    if grep -q "GMAIL_USER=" Backend/.env && grep -q "GMAIL_APP_PASSWORD=" Backend/.env; then
        echo -e "${GREEN}  ✓ Email configuration found${NC}"
    else
        echo -e "${YELLOW}  ⚠ Email not configured${NC}"
    fi
else
    echo -e "${RED}  ✗ Backend .env missing${NC}"
    ERRORS=$((ERRORS+1))
fi

# 5. Check Node Modules
echo -e "\n${YELLOW}[5/5]${NC} Checking Dependencies..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}  ✓ Frontend node_modules installed${NC}"
else
    echo -e "${RED}  ✗ Frontend dependencies missing${NC}"
    ERRORS=$((ERRORS+1))
    echo -e "${YELLOW}    Fix: npm install${NC}"
fi

if [ -d "Backend/node_modules" ]; then
    echo -e "${GREEN}  ✓ Backend node_modules installed${NC}"
else
    echo -e "${RED}  ✗ Backend dependencies missing${NC}"
    ERRORS=$((ERRORS+1))
    echo -e "${YELLOW}    Fix: cd Backend && npm install${NC}"
fi

# Summary
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ All systems operational!${NC}"
    echo -e "\n${BLUE}📊 Access Points:${NC}"
    echo -e "   Frontend: ${GREEN}http://localhost:5173${NC}"
    echo -e "   Backend:  ${GREEN}http://localhost:3001${NC}"
    echo -e "   Health:   ${GREEN}http://localhost:3001/health${NC}"
else
    echo -e "${RED}❌ Found $ERRORS issue(s). Please fix them before proceeding.${NC}"
    echo -e "\n${YELLOW}Quick fix: Run ./scripts/start-dev.sh${NC}"
    exit 1
fi
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
