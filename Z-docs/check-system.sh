#!/bin/bash

# ============================================================
# DMT EDUCATION SYSTEM - SYSTEM HEALTH CHECK
# ============================================================
# Kiểm tra toàn diện hệ thống trước khi nâng cấp giao diện
# ============================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

# Configuration
API_URL="http://localhost:3000"
FRONTEND_URL="http://localhost:5173"
REPORT_FILE="system-health-report.txt"

# Counters
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNING_CHECKS=0

# ============================================================
# Helper Functions
# ============================================================

print_header() {
    echo ""
    echo -e "${CYAN}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${NC} $1"
    echo -e "${CYAN}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

print_section() {
    echo ""
    echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${MAGENTA}  $1${NC}"
    echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

check_item() {
    local name="$1"
    local result="$2"
    ((TOTAL_CHECKS++))
    
    if [ "$result" == "PASS" ]; then
        echo -e "${GREEN}✅ PASS${NC} - $name"
        ((PASSED_CHECKS++))
        return 0
    elif [ "$result" == "WARNING" ]; then
        echo -e "${YELLOW}⚠️  WARN${NC} - $name"
        ((WARNING_CHECKS++))
        return 1
    else
        echo -e "${RED}❌ FAIL${NC} - $name"
        ((FAILED_CHECKS++))
        return 1
    fi
}

# ============================================================
# System Checks
# ============================================================

check_prerequisites() {
    print_section "Kiểm Tra Prerequisites"
    
    # Check jq
    if command -v jq &> /dev/null; then
        check_item "jq installed" "PASS"
    else
        check_item "jq installed" "FAIL"
    fi
    
    # Check curl
    if command -v curl &> /dev/null; then
        check_item "curl installed" "PASS"
    else
        check_item "curl installed" "FAIL"
    fi
    
    # Check Node.js
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        check_item "Node.js installed ($NODE_VERSION)" "PASS"
    else
        check_item "Node.js installed" "FAIL"
    fi
    
    # Check npm
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        check_item "npm installed ($NPM_VERSION)" "PASS"
    else
        check_item "npm installed" "FAIL"
    fi
}

check_docker_services() {
    print_section "Kiểm Tra Docker Services"
    
    # Check Docker
    if command -v docker &> /dev/null; then
        check_item "Docker installed" "PASS"
        
        # Check SQL Server container
        if docker ps | grep -q "dmt-sqlserver"; then
            check_item "SQL Server container running" "PASS"
        else
            check_item "SQL Server container running" "FAIL"
        fi
    else
        check_item "Docker installed" "FAIL"
    fi
}

check_backend_server() {
    print_section "Kiểm Tra Backend Server"
    
    # Check if backend is running
    if curl -s "$API_URL/health" > /dev/null 2>&1; then
        check_item "Backend server responding" "PASS"
        
        # Get health info
        HEALTH=$(curl -s "$API_URL/health")
        STATUS=$(echo "$HEALTH" | jq -r '.status // "unknown"')
        DB_STATUS=$(echo "$HEALTH" | jq -r '.database // "unknown"')
        VERSION=$(echo "$HEALTH" | jq -r '.version // "unknown"')
        
        if [ "$STATUS" == "ok" ]; then
            check_item "Backend health status: $STATUS" "PASS"
        else
            check_item "Backend health status: $STATUS" "FAIL"
        fi
        
        if [ "$DB_STATUS" == "connected" ]; then
            check_item "Database connection: $DB_STATUS" "PASS"
        else
            check_item "Database connection: $DB_STATUS" "FAIL"
        fi
        
        check_item "Backend version: $VERSION" "PASS"
    else
        check_item "Backend server responding" "FAIL"
        check_item "Backend health status" "FAIL"
        check_item "Database connection" "FAIL"
    fi
}

check_frontend_server() {
    print_section "Kiểm Tra Frontend Server"
    
    # Check if frontend is running
    if curl -s "$FRONTEND_URL" > /dev/null 2>&1; then
        check_item "Frontend server responding" "PASS"
        
        # Check if it's the actual app (not error page)
        if curl -s "$FRONTEND_URL" | grep -q "DMT"; then
            check_item "Frontend app loaded" "PASS"
        else
            check_item "Frontend app loaded" "WARNING"
        fi
    else
        check_item "Frontend server responding" "FAIL"
    fi
}

check_database_tables() {
    print_section "Kiểm Tra Database Tables"
    
    # Check database via backend
    RESPONSE=$(curl -s "$API_URL/health")
    if echo "$RESPONSE" | jq -e '.database == "connected"' > /dev/null 2>&1; then
        check_item "Database accessible via API" "PASS"
        
        # Check if test script exists
        if [ -f "Backend/scripts/test-connection.mjs" ]; then
            check_item "Database test script available" "PASS"
        else
            check_item "Database test script available" "WARNING"
        fi
    else
        check_item "Database accessible via API" "FAIL"
    fi
}

check_api_endpoints() {
    print_section "Kiểm Tra API Endpoints"
    
    # Login to get token
    LOGIN_RESULT=$(curl -s -X POST "$API_URL/auth/login" \
        -H "Content-Type: application/json" \
        -d '{"email":"teststudent@dmt.edu.vn","password":"Student123!"}' 2>/dev/null)
    
    TOKEN=$(echo "$LOGIN_RESULT" | jq -r '.token // empty' 2>/dev/null)
    
    if [ -n "$TOKEN" ]; then
        check_item "Authentication working" "PASS"
        
        # Test Notifications API
        NOTIF=$(curl -s -X GET "$API_URL/notifications/unread-count" \
            -H "Authorization: Bearer $TOKEN" 2>/dev/null)
        if echo "$NOTIF" | jq -e '.success == true' > /dev/null 2>&1; then
            check_item "Notifications API working" "PASS"
        else
            check_item "Notifications API working" "FAIL"
        fi
        
        # Test Statistics API
        STATS=$(curl -s -X GET "$API_URL/statistics/attendance-rate?student_id=1001" \
            -H "Authorization: Bearer $TOKEN" 2>/dev/null)
        if echo "$STATS" | jq -e '.success == true' > /dev/null 2>&1; then
            check_item "Statistics API working" "PASS"
        else
            check_item "Statistics API working" "FAIL"
        fi
        
        # Test Reports API
        REPORT=$(curl -s -X GET "$API_URL/reports/student/1001" \
            -H "Authorization: Bearer $TOKEN" 2>/dev/null)
        if echo "$REPORT" | jq -e '.success == true' > /dev/null 2>&1; then
            check_item "Reports API working" "PASS"
        else
            check_item "Reports API working" "FAIL"
        fi
    else
        check_item "Authentication working" "FAIL"
        check_item "Notifications API working" "FAIL"
        check_item "Statistics API working" "FAIL"
        check_item "Reports API working" "FAIL"
    fi
}

check_frontend_services() {
    print_section "Kiểm Tra Frontend Services"
    
    # Check if service files exist
    SERVICES_DIR="src/services"
    
    EXPECTED_SERVICES=(
        "notifications.ts"
        "statistics.ts"
        "reports.ts"
        "payments.ts"
        "activityLogs.ts"
        "systemSettings.ts"
        "backup.ts"
    )
    
    for service in "${EXPECTED_SERVICES[@]}"; do
        if [ -f "$SERVICES_DIR/$service" ]; then
            check_item "Service exists: $service" "PASS"
        else
            check_item "Service exists: $service" "FAIL"
        fi
    done
}

check_backend_routes() {
    print_section "Kiểm Tra Backend Routes"
    
    ROUTES_DIR="Backend/src/routes"
    
    EXPECTED_ROUTES=(
        "notifications.ts"
        "statistics.ts"
        "activity-logs.ts"
        "system-settings.ts"
        "backup.ts"
        "reports.ts"
    )
    
    for route in "${EXPECTED_ROUTES[@]}"; do
        if [ -f "$ROUTES_DIR/$route" ]; then
            check_item "Route exists: $route" "PASS"
        else
            check_item "Route exists: $route" "FAIL"
        fi
    done
}

check_typescript_compilation() {
    print_section "Kiểm Tra TypeScript Compilation"
    
    # Check frontend
    if [ -f "tsconfig.json" ]; then
        check_item "Frontend tsconfig.json exists" "PASS"
    else
        check_item "Frontend tsconfig.json exists" "FAIL"
    fi
    
    # Check backend
    if [ -f "Backend/tsconfig.json" ]; then
        check_item "Backend tsconfig.json exists" "PASS"
    else
        check_item "Backend tsconfig.json exists" "FAIL"
    fi
}

# ============================================================
# Generate Report
# ============================================================

generate_report() {
    print_section "Generating Report"
    
    {
        echo "============================================"
        echo "  DMT EDUCATION SYSTEM - HEALTH CHECK"
        echo "============================================"
        echo "Date: $(date)"
        echo ""
        echo "SUMMARY:"
        echo "--------"
        echo "Total Checks: $TOTAL_CHECKS"
        echo "Passed: $PASSED_CHECKS"
        echo "Warnings: $WARNING_CHECKS"
        echo "Failed: $FAILED_CHECKS"
        echo ""
        
        PASS_RATE=$(awk "BEGIN {printf \"%.1f\", ($PASSED_CHECKS/$TOTAL_CHECKS)*100}")
        echo "Pass Rate: $PASS_RATE%"
        echo ""
        
        if [ $FAILED_CHECKS -eq 0 ]; then
            echo "STATUS: ✅ SYSTEM HEALTHY"
        elif [ $FAILED_CHECKS -le 3 ]; then
            echo "STATUS: ⚠️  SYSTEM NEEDS ATTENTION"
        else
            echo "STATUS: ❌ SYSTEM HAS ISSUES"
        fi
        echo ""
        echo "============================================"
    } > "$REPORT_FILE"
    
    echo "Report saved to: $REPORT_FILE"
}

# ============================================================
# Main Execution
# ============================================================

main() {
    clear
    echo ""
    echo -e "${CYAN}════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}     DMT EDUCATION SYSTEM - HEALTH CHECK               ${NC}"
    echo -e "${CYAN}════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "Date: ${YELLOW}$(date '+%Y-%m-%d %H:%M:%S')${NC}"
    echo ""
    
    # Run all checks
    check_prerequisites
    check_docker_services
    check_backend_server
    check_frontend_server
    check_database_tables
    check_api_endpoints
    check_frontend_services
    check_backend_routes
    check_typescript_compilation
    
    # Print summary
    print_header "SUMMARY"
    
    PASS_RATE=$(awk "BEGIN {printf \"%.1f\", ($PASSED_CHECKS/$TOTAL_CHECKS)*100}")
    
    echo "Total Checks:  $TOTAL_CHECKS"
    echo -e "Passed:        ${GREEN}$PASSED_CHECKS${NC}"
    echo -e "Warnings:      ${YELLOW}$WARNING_CHECKS${NC}"
    echo -e "Failed:        ${RED}$FAILED_CHECKS${NC}"
    echo ""
    echo "Pass Rate:     $PASS_RATE%"
    echo ""
    
    # Generate report
    generate_report
    
    # Final status
    if [ $FAILED_CHECKS -eq 0 ]; then
        echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
        echo -e "${GREEN}║       ✅ SYSTEM HEALTHY - READY FOR UI UPGRADE        ║${NC}"
        echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
        echo ""
        exit 0
    elif [ $FAILED_CHECKS -le 3 ]; then
        echo -e "${YELLOW}╔════════════════════════════════════════════════════════╗${NC}"
        echo -e "${YELLOW}║    ⚠️  SYSTEM NEEDS ATTENTION - REVIEW FAILURES       ║${NC}"
        echo -e "${YELLOW}╚════════════════════════════════════════════════════════╝${NC}"
        echo ""
        exit 1
    else
        echo -e "${RED}╔════════════════════════════════════════════════════════╗${NC}"
        echo -e "${RED}║      ❌ SYSTEM HAS ISSUES - FIX BEFORE UPGRADE        ║${NC}"
        echo -e "${RED}╚════════════════════════════════════════════════════════╝${NC}"
        echo ""
        exit 1
    fi
}

# Run main function
main
