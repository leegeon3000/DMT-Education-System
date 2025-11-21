#!/bin/bash

# ===================================================================
# DMT EDUCATION SYSTEM - COMPLETE DATABASE SETUP
# ===================================================================
# This script will:
# 1. Create database schema
# 2. Install stored procedures
# 3. Insert sample data
# ===================================================================

set -e  # Exit on error

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BACKEND_DIR="$(dirname "$SCRIPT_DIR")"

echo "======================================================================"
echo "DMT EDUCATION SYSTEM - COMPLETE DATABASE SETUP"
echo "======================================================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Database connection info
DB_SERVER="${DB_SERVER:-localhost}"
DB_NAME="${DB_NAME:-DMT_EDUCATION_SYSTEM}"
DB_USER="${DB_USER:-sa}"
DB_PASSWORD="${DB_PASSWORD:-YourStrong@Passw0rd}"

echo "Configuration:"
echo "  Server: $DB_SERVER"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo ""

# Check if sqlcmd is installed
if ! command -v sqlcmd &> /dev/null; then
    echo -e "${RED}✗ sqlcmd is not installed${NC}"
    echo ""
    echo "Please install SQL Server command-line tools:"
    echo "  brew install mssql-tools"
    echo ""
    exit 1
fi

echo "Step 1: Creating database schema..."
if sqlcmd -S "$DB_SERVER" -U "$DB_USER" -P "$DB_PASSWORD" -d master -i "$BACKEND_DIR/Db_DMT_SQLServer.sql" -o /tmp/db_create.log 2>&1; then
    echo -e "${GREEN}✓ Database schema created${NC}"
else
    echo -e "${YELLOW}⚠ Database may already exist (continuing...)${NC}"
fi
echo ""

echo "Step 2: Installing stored procedures..."
if sqlcmd -S "$DB_SERVER" -U "$DB_USER" -P "$DB_PASSWORD" -d "$DB_NAME" -i "$BACKEND_DIR/Db_DMT_StoredProcedures.sql" -o /tmp/db_procedures.log 2>&1; then
    echo -e "${GREEN}✓ Stored procedures installed${NC}"
else
    echo -e "${RED}✗ Failed to install stored procedures${NC}"
    echo "Check /tmp/db_procedures.log for details"
    exit 1
fi
echo ""

echo "Step 3: Inserting sample data..."
if sqlcmd -S "$DB_SERVER" -U "$DB_USER" -P "$DB_PASSWORD" -d "$DB_NAME" -i "$BACKEND_DIR/Db_DMT_Complete_Sample_Data.sql" -o /tmp/db_sample_data.log 2>&1; then
    echo -e "${GREEN}✓ Sample data inserted${NC}"
else
    echo -e "${RED}✗ Failed to insert sample data${NC}"
    echo "Check /tmp/db_sample_data.log for details"
    exit 1
fi
echo ""

echo "Step 4: Verifying installation..."
RESULT=$(sqlcmd -S "$DB_SERVER" -U "$DB_USER" -P "$DB_PASSWORD" -d "$DB_NAME" -Q "SELECT COUNT(*) as count FROM USERS" -h -1 -W 2>/dev/null | tr -d '[:space:]')

if [ "$RESULT" -gt 0 ]; then
    echo -e "${GREEN}✓ Database verified - Found $RESULT users${NC}"
else
    echo -e "${YELLOW}⚠ No users found in database${NC}"
fi
echo ""

echo "======================================================================"
echo -e "${GREEN}✓ DATABASE SETUP COMPLETE!${NC}"
echo "======================================================================"
echo ""
echo "Test accounts:"
echo "  Admin:   admin@dmt.edu.vn / Admin@123"
echo "  Staff:   staff1@dmt.edu.vn / Staff@123"
echo "  Teacher: teacher.math@dmt.edu.vn / Teacher@123"
echo "  Student: student001@gmail.com / Student@123"
echo ""
echo "Next steps:"
echo "  1. Start backend: cd Backend && npm run dev"
echo "  2. Start frontend: npm run dev"
echo "  3. Login with admin account"
echo ""
