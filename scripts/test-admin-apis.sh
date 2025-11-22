#!/bin/bash

# Script to test all Admin API endpoints
# Usage: ./scripts/test-admin-apis.sh

BASE_URL="http://localhost:3001/api"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "======================================"
echo "Testing DMT Admin API Endpoints"
echo "======================================"
echo ""

# Function to test an endpoint
test_endpoint() {
    local name=$1
    local url=$2
    local expected_field=$3
    
    echo -n "Testing $name... "
    
    response=$(curl -s "$BASE_URL$url")
    
    # Check if response contains error
    if echo "$response" | grep -q '"error"'; then
        echo -e "${RED}FAILED${NC}"
        echo "  URL: $BASE_URL$url"
        echo "  Error: $(echo $response | python3 -m json.tool 2>/dev/null || echo $response)"
        return 1
    fi
    
    # Check if expected field exists
    if [ -n "$expected_field" ]; then
        if echo "$response" | grep -q "$expected_field"; then
            echo -e "${GREEN}OK${NC}"
            return 0
        else
            echo -e "${YELLOW}WARNING${NC} - Expected field '$expected_field' not found"
            echo "  Response: $(echo $response | python3 -m json.tool | head -5)"
            return 2
        fi
    else
        echo -e "${GREEN}OK${NC}"
        return 0
    fi
}

# Test counters
total=0
passed=0
failed=0
warnings=0

# 1. Payments API
echo "=== 1. Payments API ==="
test_endpoint "Payments List" "/payments?limit=5" '"success"'
result=$?
total=$((total + 1))
[ $result -eq 0 ] && passed=$((passed + 1))
[ $result -eq 1 ] && failed=$((failed + 1))
[ $result -eq 2 ] && warnings=$((warnings + 1))

test_endpoint "Payments Summary" "/payments/stats/summary" '"totalRevenue"'
result=$?
total=$((total + 1))
[ $result -eq 0 ] && passed=$((passed + 1))
[ $result -eq 1 ] && failed=$((failed + 1))
[ $result -eq 2 ] && warnings=$((warnings + 1))
echo ""

# 2. Finance API
echo "=== 2. Finance Report API ==="
test_endpoint "Finance Summary" "/finance/summary" '"totalRevenue"'
result=$?
total=$((total + 1))
[ $result -eq 0 ] && passed=$((passed + 1))
[ $result -eq 1 ] && failed=$((failed + 1))
[ $result -eq 2 ] && warnings=$((warnings + 1))

test_endpoint "Monthly Revenue" "/finance/monthly-revenue?year=2025" '"month"'
result=$?
total=$((total + 1))
[ $result -eq 0 ] && passed=$((passed + 1))
[ $result -eq 1 ] && failed=$((failed + 1))
[ $result -eq 2 ] && warnings=$((warnings + 1))
echo ""

# 3. Attendance Report API
echo "=== 3. Attendance Report API ==="
test_endpoint "Attendance Reports" "/attendance/reports" '"id"'
result=$?
total=$((total + 1))
[ $result -eq 0 ] && passed=$((passed + 1))
[ $result -eq 1 ] && failed=$((failed + 1))
[ $result -eq 2 ] && warnings=$((warnings + 1))

test_endpoint "Attendance Summary" "/attendance/summary" '"totalSessions"'
result=$?
total=$((total + 1))
[ $result -eq 0 ] && passed=$((passed + 1))
[ $result -eq 1 ] && failed=$((failed + 1))
[ $result -eq 2 ] && warnings=$((warnings + 1))
echo ""

# 4. Analytics API
echo "=== 4. Analytics API ==="
test_endpoint "Analytics Full" "/analytics?time_range=30d" '"userStats"'
result=$?
total=$((total + 1))
[ $result -eq 0 ] && passed=$((passed + 1))
[ $result -eq 1 ] && failed=$((failed + 1))
[ $result -eq 2 ] && warnings=$((warnings + 1))

test_endpoint "Analytics Summary" "/analytics/summary" '"totalUsers"'
result=$?
total=$((total + 1))
[ $result -eq 0 ] && passed=$((passed + 1))
[ $result -eq 1 ] && failed=$((failed + 1))
[ $result -eq 2 ] && warnings=$((warnings + 1))
echo ""

# 5. Performance Report API
echo "=== 5. Performance Report API ==="
test_endpoint "Performance Reports" "/performance/reports" '"id"'
result=$?
total=$((total + 1))
[ $result -eq 0 ] && passed=$((passed + 1))
[ $result -eq 1 ] && failed=$((failed + 1))
[ $result -eq 2 ] && warnings=$((warnings + 1))

test_endpoint "Performance Summary" "/performance/summary" '"averageScore"'
result=$?
total=$((total + 1))
[ $result -eq 0 ] && passed=$((passed + 1))
[ $result -eq 1 ] && failed=$((failed + 1))
[ $result -eq 2 ] && warnings=$((warnings + 1))
echo ""

# 6. Settings API
echo "=== 6. Settings API ==="
test_endpoint "Settings" "/settings" '"general"'
result=$?
total=$((total + 1))
[ $result -eq 0 ] && passed=$((passed + 1))
[ $result -eq 1 ] && failed=$((failed + 1))
[ $result -eq 2 ] && warnings=$((warnings + 1))
echo ""

# Summary
echo "======================================"
echo "Test Summary"
echo "======================================"
echo "Total tests: $total"
echo -e "${GREEN}Passed: $passed${NC}"
[ $warnings -gt 0 ] && echo -e "${YELLOW}Warnings: $warnings${NC}"
[ $failed -gt 0 ] && echo -e "${RED}Failed: $failed${NC}"
echo ""

if [ $failed -eq 0 ]; then
    echo -e "${GREEN}All critical tests passed!${NC}"
    exit 0
else
    echo -e "${RED}Some tests failed. Please check the errors above.${NC}"
    exit 1
fi
