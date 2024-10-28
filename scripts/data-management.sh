#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Create data directories if they don't exist
create_data_dirs() {
    echo -e "${BLUE}Creating data directories...${NC}"
    mkdir -p data/{postgres,redis,root-network,reality2}
    chmod -R 777 data/
}

# Backup all data
backup_data() {
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_dir="backups/${timestamp}"
    
    echo -e "${BLUE}Creating backup in ${backup_dir}...${NC}"
    mkdir -p "${backup_dir}"
    
    # Stop services
    docker-compose -f docker-compose.local.yml stop
    
    # Backup each data directory
    tar -czf "${backup_dir}/postgres.tar.gz" -C data postgres
    tar -czf "${backup_dir}/redis.tar.gz" -C data redis
    tar -czf "${backup_dir}/root-network.tar.gz" -C data root-network
    tar -czf "${backup_dir}/reality2.tar.gz" -C data reality2
    
    # Start services
    docker-compose -f docker-compose.local.yml start
    
    echo -e "${GREEN}Backup completed in ${backup_dir}${NC}"
}

# Restore from backup
restore_data() {
    if [ -z "$1" ]; then
        echo -e "${RED}Please specify backup directory${NC}"
        exit 1
    }
    
    local backup_dir="backups/$1"
    
    if [ ! -d "${backup_dir}" ]; then
        echo -e "${RED}Backup directory ${backup_dir} not found${NC}"
        exit 1
    }
    
    echo -e "${BLUE}Restoring from ${backup_dir}...${NC}"
    
    # Stop services
    docker-compose -f docker-compose.local.yml stop
    
    # Restore each data directory
    tar -xzf "${backup_dir}/postgres.tar.gz" -C data
    tar -xzf "${backup_dir}/redis.tar.gz" -C data
    tar -xzf "${backup_dir}/root-network.tar.gz" -C data
    tar -xzf "${backup_dir}/reality2.tar.gz" -C data
    
    # Start services
    docker-compose -f docker-compose.local.yml start
    
    echo -e "${GREEN}Restore completed${NC}"
}

# Clean old data (keeps last 5 backups)
clean_old_backups() {
    echo -e "${BLUE}Cleaning old backups...${NC}"
    cd backups
    ls -t | tail -n +6 | xargs -r rm -r
    cd ..
    echo -e "${GREEN}Cleanup completed${NC}"
}

# Show help
show_help() {
    echo "Usage: $0 [command]"
    echo
    echo "Commands:"
    echo "  init        Create data directories"
    echo "  backup      Create a new backup"
    echo "  restore     Restore from a backup"
    echo "  clean       Remove old backups"
    echo "  list        List available backups"
}

# Main script
case "$1" in
    "init")
        create_data_dirs
        ;;
    "backup")
        backup_data
        ;;
    "restore")
        restore_data "$2"
        ;;
    "clean")
        clean_old_backups
        ;;
    "list")
        ls -l backups/
        ;;
    *)
        show_help
        ;;
esac
