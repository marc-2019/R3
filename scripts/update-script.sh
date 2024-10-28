#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}Starting system update...${NC}"

# Create backup before update
echo -e "${BLUE}Creating backup before update...${NC}"
./scripts/data-management.sh backup

# Pull latest changes
echo -e "${BLUE}Pulling latest changes...${NC}"
git pull

# Update dependencies
echo -e "${BLUE}Updating dependencies...${NC}"
npm install

# Rebuild containers while preserving data
echo -e "${BLUE}Rebuilding containers...${NC}"
docker-compose -f docker-compose.local.yml up -d --build

echo -e "${GREEN}Update completed successfully!${NC}"
echo -e "Your local data has been preserved in the ./data directory"
