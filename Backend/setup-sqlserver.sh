#!/bin/bash

# =================================================================
# Script tự động cài đặt SQL Server cho DMT Education System
# Sử dụng Docker để chạy SQL Server trên macOS
# =================================================================

set -e  # Exit on error

echo "DMT Education System - SQL Server Setup"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
CONTAINER_NAME="dmt-sqlserver"
SA_PASSWORD="DMT@Education2024"
SQL_PORT=1433
DATABASE_NAME="dmt_education_system"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker is not installed!${NC}"
    echo "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop"
    exit 1
fi

echo -e "${GREEN}Docker is installed${NC}"

# Check if container already exists
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo -e "${YELLOW}Container ${CONTAINER_NAME} already exists${NC}"
    read -p "Do you want to remove it and create a new one? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🗑️  Removing old container..."
        docker rm -f ${CONTAINER_NAME}
    else
        echo "Exiting..."
        exit 0
    fi
fi

# Pull SQL Server image
echo ""
echo "📦 Pulling SQL Server 2022 image..."
docker pull mcr.microsoft.com/mssql/server:2022-latest

# Run SQL Server container
echo ""
echo "🐳 Starting SQL Server container..."
docker run -e "ACCEPT_EULA=Y" \
    -e "MSSQL_SA_PASSWORD=${SA_PASSWORD}" \
    -e "MSSQL_PID=Developer" \
    -p ${SQL_PORT}:1433 \
    --name ${CONTAINER_NAME} \
    --hostname sqlserver \
    -d mcr.microsoft.com/mssql/server:2022-latest

# Wait for SQL Server to start
echo ""
echo "⏳ Waiting for SQL Server to start..."
sleep 15

# Check if container is running
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo -e "${RED}Failed to start SQL Server container${NC}"
    echo "Check logs with: docker logs ${CONTAINER_NAME}"
    exit 1
fi

echo -e "${GREEN}SQL Server is running${NC}"

# Create database
echo ""
echo "📊 Creating database: ${DATABASE_NAME}..."
docker exec -it ${CONTAINER_NAME} /opt/mssql-tools/bin/sqlcmd \
    -S localhost -U sa -P "${SA_PASSWORD}" \
    -Q "CREATE DATABASE ${DATABASE_NAME};" 2>/dev/null || echo "Database might already exist"

# Import schema
echo ""
echo "📝 Importing database schema..."
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SQL_FILE="${SCRIPT_DIR}/Db_DMT_SQLServer.sql"

if [ -f "$SQL_FILE" ]; then
    # Copy SQL file to container
    docker cp "$SQL_FILE" ${CONTAINER_NAME}:/tmp/schema.sql
    
    # Execute SQL file
    docker exec -it ${CONTAINER_NAME} /opt/mssql-tools/bin/sqlcmd \
        -S localhost -U sa -P "${SA_PASSWORD}" \
        -d ${DATABASE_NAME} -i /tmp/schema.sql
    
    echo -e "${GREEN}Database schema imported successfully${NC}"
else
    echo -e "${YELLOW}SQL file not found: ${SQL_FILE}${NC}"
    echo "Please run the SQL script manually"
fi

# Update .env.local file
echo ""
echo "⚙️  Updating .env.local configuration..."
ENV_FILE="${SCRIPT_DIR}/.env.local"

if [ -f "$ENV_FILE" ]; then
    # Backup original file
    cp "$ENV_FILE" "${ENV_FILE}.backup"
    
    # Update SQL Server settings
    sed -i '' "s/^DB_SERVER=.*/DB_SERVER=localhost/" "$ENV_FILE"
    sed -i '' "s/^DB_DATABASE=.*/DB_DATABASE=${DATABASE_NAME}/" "$ENV_FILE"
    sed -i '' "s/^DB_USER=.*/DB_USER=sa/" "$ENV_FILE"
    sed -i '' "s/^DB_PASSWORD=.*/DB_PASSWORD=${SA_PASSWORD}/" "$ENV_FILE"
    sed -i '' "s/^DB_PORT=.*/DB_PORT=${SQL_PORT}/" "$ENV_FILE"
    
    echo -e "${GREEN}Configuration file updated${NC}"
else
    echo -e "${YELLOW}.env.local not found, please create it manually${NC}"
fi

# Print summary
echo ""
echo "=========================================="
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo "=========================================="
echo ""
echo "📝 Connection Details:"
echo "   Server:   localhost"
echo "   Port:     ${SQL_PORT}"
echo "   Database: ${DATABASE_NAME}"
echo "   User:     sa"
echo "   Password: ${SA_PASSWORD}"
echo ""
echo "🔧 Useful Commands:"
echo "   Start container:  docker start ${CONTAINER_NAME}"
echo "   Stop container:   docker stop ${CONTAINER_NAME}"
echo "   View logs:        docker logs ${CONTAINER_NAME}"
echo "   Connect to SQL:   docker exec -it ${CONTAINER_NAME} /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P '${SA_PASSWORD}'"
echo ""
echo "Next Steps:"
echo "   1. cd Backend && npm run dev"
echo "   2. Test API: curl http://localhost:3001/health"
echo ""
echo "📚 Documentation: See SQLSERVER_SETUP.md for more details"
echo ""
