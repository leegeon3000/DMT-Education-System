#!/bin/bash

##############################################################################
# DMT Education System - Summary Status Check
# Quick overview of system integration status
##############################################################################

BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo ""
echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║          DMT EDUCATION SYSTEM - STATUS SUMMARY                     ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""

# Check Backend
echo -e "${CYAN}🔌 BACKEND STATUS${NC}"
if lsof -i :3001 > /dev/null 2>&1; then
    echo -e "   ${GREEN}✅ Backend running on port 3001${NC}"
else
    echo -e "   ${RED}❌ Backend not running${NC}"
    echo -e "   ${YELLOW}   → Start: cd Backend && npm start${NC}"
fi

# Check Frontend
echo -e "\n${CYAN}🌐 FRONTEND STATUS${NC}"
if lsof -i :5173 > /dev/null 2>&1; then
    echo -e "   ${GREEN}✅ Frontend running on port 5173${NC}"
else
    echo -e "   ${RED}❌ Frontend not running${NC}"
    echo -e "   ${YELLOW}   → Start: npm start${NC}"
fi

# Check Database
echo -e "\n${CYAN}🗄️  DATABASE STATUS${NC}"
if command -v sqlcmd &> /dev/null; then
    echo -e "   ${GREEN}✅ SQL Server tools installed${NC}"
else
    echo -e "   ${YELLOW}⚠️  sqlcmd not installed (optional)${NC}"
fi

# Integration Summary
echo -e "\n${CYAN}📊 INTEGRATION STATUS${NC}"
echo -e "   ${GREEN}Teacher Module: 67% integrated${NC}"
echo -e "   ${YELLOW}Student Module: 50% integrated${NC}"
echo -e "   ${RED}Staff Module:   15% integrated${NC}"
echo -e "   ${RED}Admin Module:    6% integrated${NC}"
echo -e "   ${YELLOW}Overall:        28% integrated${NC}"

# Quick Actions
echo -e "\n${CYAN}🚀 QUICK ACTIONS${NC}"
echo -e "   ${BLUE}1. Full mock data scan:${NC}     node scripts/scan-mock-data.mjs"
echo -e "   ${BLUE}2. Test teacher API:${NC}        cd Backend && node scripts/quick-test.mjs"
echo -e "   ${BLUE}3. View detailed report:${NC}    cat MOCK_DATA_REPORT.md"
echo -e "   ${BLUE}4. Start development:${NC}       ./start-dev.sh"

# Test Accounts
echo -e "\n${CYAN}👤 TEST ACCOUNTS${NC}"
echo -e "   ${BLUE}Teacher:${NC}  teacher.math@dmt.edu.vn / Teacher@123"
echo -e "   ${BLUE}Student:${NC}  student@dmt.edu.vn / Student@123"
echo -e "   ${BLUE}Staff:${NC}    staff@dmt.edu.vn / Staff@123"
echo -e "   ${BLUE}Admin:${NC}    admin@dmt.edu.vn / Admin@123"

echo ""
echo "════════════════════════════════════════════════════════════════════"
echo ""
