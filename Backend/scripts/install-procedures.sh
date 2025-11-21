#!/bin/bash

# =================================================================
# Script cài đặt Stored Procedures, Functions, Triggers
# DMT Education System - Database Logic Layer
# =================================================================

set -e  # Exit on error

echo "🎓 DMT Education System - Database Procedures Installation"
echo "=========================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
CONTAINER_NAME="dmt-sqlserver"
SA_PASSWORD="Password123!"
DATABASE_NAME="dmt_education_system"

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BACKEND_DIR="$(dirname "$SCRIPT_DIR")"

# Files to install
PROCEDURES_FILE="${BACKEND_DIR}/Db_DMT_StoredProcedures.sql"
TEST_FILE="${BACKEND_DIR}/Test_StoredProcedures.sql"

# Check if Docker container is running
echo "🔍 Checking SQL Server container..."
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo -e "${RED}SQL Server container '${CONTAINER_NAME}' is not running!${NC}"
    echo ""
    echo "Please start the container first:"
    echo "  docker start ${CONTAINER_NAME}"
    echo ""
    echo "Or run the setup script:"
    echo "  ./setup-sqlserver.sh"
    exit 1
fi

echo -e "${GREEN}SQL Server container is running${NC}"

# Check if database exists
echo ""
echo "🔍 Checking database: ${DATABASE_NAME}..."
DB_EXISTS=$(docker exec ${CONTAINER_NAME} /opt/mssql-tools18/bin/sqlcmd \
    -S localhost -U sa -P "${SA_PASSWORD}" -C -h -1 \
    -Q "SET NOCOUNT ON; SELECT COUNT(*) FROM sys.databases WHERE name = '${DATABASE_NAME}'" \
    2>/dev/null | tr -d ' ' | tail -1)

if [ -z "$DB_EXISTS" ] || [ "$DB_EXISTS" = "0" ]; then
    echo -e "${RED}Database '${DATABASE_NAME}' does not exist!${NC}"
    echo ""
    echo "Please create the database first:"
    echo "  ./setup-sqlserver.sh"
    exit 1
fi

echo -e "${GREEN}Database exists${NC}"

# Install Stored Procedures, Functions, Triggers
echo ""
echo "📦 Installing Stored Procedures, Functions, and Triggers..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ ! -f "$PROCEDURES_FILE" ]; then
    echo -e "${RED}Procedures file not found: ${PROCEDURES_FILE}${NC}"
    exit 1
fi

# Copy SQL file to container
echo -e "${BLUE}→ Copying SQL file to container...${NC}"
docker cp "$PROCEDURES_FILE" ${CONTAINER_NAME}:/tmp/procedures.sql

# Execute SQL file
echo -e "${BLUE}→ Executing SQL script...${NC}"
docker exec -it ${CONTAINER_NAME} /opt/mssql-tools18/bin/sqlcmd \
    -S localhost -U sa -P "${SA_PASSWORD}" -C \
    -d ${DATABASE_NAME} -i /tmp/procedures.sql

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Procedures, Functions, and Triggers installed successfully!${NC}"
else
    echo -e "${RED}Failed to install procedures${NC}"
    exit 1
fi

# Verify installation
echo ""
echo "🔍 Verifying installation..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Count procedures
PROC_COUNT=$(docker exec ${CONTAINER_NAME} /opt/mssql-tools18/bin/sqlcmd \
    -S localhost -U sa -P "${SA_PASSWORD}" -C -d ${DATABASE_NAME} -h -1 \
    -Q "SET NOCOUNT ON; SELECT COUNT(*) FROM sys.procedures WHERE name LIKE 'sp_%'" \
    2>/dev/null | tr -d ' ' | tail -1)

# Count functions
FUNC_COUNT=$(docker exec ${CONTAINER_NAME} /opt/mssql-tools18/bin/sqlcmd \
    -S localhost -U sa -P "${SA_PASSWORD}" -C -d ${DATABASE_NAME} -h -1 \
    -Q "SET NOCOUNT ON; SELECT COUNT(*) FROM sys.objects WHERE type = 'FN' AND name LIKE 'fn_%'" \
    2>/dev/null | tr -d ' ' | tail -1)

# Count triggers
TRIG_COUNT=$(docker exec ${CONTAINER_NAME} /opt/mssql-tools18/bin/sqlcmd \
    -S localhost -U sa -P "${SA_PASSWORD}" -C -d ${DATABASE_NAME} -h -1 \
    -Q "SET NOCOUNT ON; SELECT COUNT(*) FROM sys.triggers WHERE name LIKE 'trg_%'" \
    2>/dev/null | tr -d ' ' | tail -1)

echo -e "${GREEN}Stored Procedures:${NC} $PROC_COUNT"
echo -e "${GREEN}Functions:${NC} $FUNC_COUNT"
echo -e "${GREEN}Triggers:${NC} $TRIG_COUNT"

# List installed procedures
echo ""
echo "Installed Stored Procedures:"
docker exec ${CONTAINER_NAME} /opt/mssql-tools18/bin/sqlcmd \
    -S localhost -U sa -P "${SA_PASSWORD}" -C -d ${DATABASE_NAME} \
    -Q "SELECT name, create_date FROM sys.procedures WHERE name LIKE 'sp_%' ORDER BY name" \
    2>/dev/null

# Ask if user wants to run tests
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
read -p "$(echo -e ${YELLOW}Do you want to run test scripts? [y/N]:${NC} )" -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    if [ ! -f "$TEST_FILE" ]; then
        echo -e "${RED}Test file not found: ${TEST_FILE}${NC}"
    else
        echo ""
        echo "🧪 Running test scripts..."
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        
        # Copy test file to container
        docker cp "$TEST_FILE" ${CONTAINER_NAME}:/tmp/test.sql
        
        # Execute test file
        docker exec -it ${CONTAINER_NAME} /opt/mssql-tools18/bin/sqlcmd \
            -S localhost -U sa -P "${SA_PASSWORD}" -C \
            -d ${DATABASE_NAME} -i /tmp/test.sql
        
        echo ""
        echo -e "${GREEN}Tests completed!${NC}"
    fi
fi

# Print summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 Installation Complete!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📚 Documentation:"
echo "   • Quick Reference:  Backend/README_DATABASE_PROCEDURES.md"
echo "   • Full Guide:       Backend/STORED_PROCEDURES_GUIDE.md"
echo "   • Test Scripts:     Backend/Test_StoredProcedures.sql"
echo ""
echo "💡 Example Usage:"
echo "   -- Register a new student"
echo "   EXEC sp_RegisterStudent"
echo "      @email = 'student@example.com',"
echo "      @password_hash = '\$2b\$10\$...',"
echo "      @full_name = N'Nguyễn Văn A',"
echo "      ...;"
echo ""
echo "   -- Get attendance rate"
echo "   SELECT dbo.fn_GetAttendanceRate(5, NULL);"
echo ""
echo "   -- Get student report"
echo "   EXEC sp_GetStudentReport @student_id = 5;"
echo ""
echo "🔧 Connect to SQL Server:"
echo "   docker exec -it ${CONTAINER_NAME} /opt/mssql-tools18/bin/sqlcmd \\"
echo "      -S localhost -U sa -P '${SA_PASSWORD}' -C -d ${DATABASE_NAME}"
echo ""
echo "Next Steps:"
echo "   1. Update Backend API to call stored procedures"
echo "   2. Test procedures with sample data"
echo "   3. Integrate with Frontend"
echo ""
