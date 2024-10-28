#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Logging
LOG_FILE="logs/data-tools.log"
mkdir -p logs

log() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "$timestamp - $1" >> "$LOG_FILE"
    echo -e "$1"
}

# Data integrity check
check_integrity() {
    log "${BLUE}Starting data integrity check...${NC}"
    
    # Check PostgreSQL
    log "Checking PostgreSQL..."
    if docker-compose -f docker-compose.local.yml exec -T dev-db pg_isready; then
        docker-compose -f docker-compose.local.yml exec -T dev-db vacuumdb --all --analyze
        log "${GREEN}PostgreSQL check complete${NC}"
    else
        log "${RED}PostgreSQL is not responding${NC}"
        return 1
    fi

    # Check Redis
    log "Checking Redis..."
    if docker-compose -f docker-compose.local.yml exec -T dev-redis redis-cli ping | grep -q "PONG"; then
        docker-compose -f docker-compose.local.yml exec -T dev-redis redis-cli DBSIZE
        log "${GREEN}Redis check complete${NC}"
    else
        log "${RED}Redis is not responding${NC}"
        return 1
    fi

    # Check data directories
    log "Checking data directories..."
    local required_dirs=("postgres" "redis" "root-network" "reality2")
    for dir in "${required_dirs[@]}"; do
        if [ ! -d "data/$dir" ]; then
            log "${RED}Missing data directory: $dir${NC}"
            return 1
        fi
    done

    log "${GREEN}All integrity checks passed${NC}"
    return 0
}

# Automated backup schedule
setup_automated_backups() {
    log "${BLUE}Setting up automated backups...${NC}"
    
    # Create cron job for daily backups
    (crontab -l 2>/dev/null; echo "0 3 * * * $(pwd)/scripts/data-management.sh backup > $(pwd)/logs/backup.log 2>&1") | crontab -
    
    # Create cron job for weekly integrity checks
    (crontab -l 2>/dev/null; echo "0 4 * * 0 $(pwd)/scripts/data-tools.sh check > $(pwd)/logs/integrity.log 2>&1") | crontab -
    
    log "${GREEN}Automated backups scheduled${NC}"
}

# Data migration helper
migrate_data() {
    local from_version=$1
    local to_version=$2
    
    log "${BLUE}Starting data migration from v$from_version to v$to_version...${NC}"
    
    # Create backup before migration
    ./scripts/data-management.sh backup
    
    # Run version-specific migrations
    if [ -f "migrations/${from_version}_to_${to_version}.sql" ]; then
        log "Applying database migrations..."
        docker-compose -f docker-compose.local.yml exec -T dev-db psql -U postgres -d r3_dev -f "/migrations/${from_version}_to_${to_version}.sql"
    fi
    
    log "${GREEN}Migration complete${NC}"
}

# Data validation
validate_data() {
    log "${BLUE}Starting data validation...${NC}"
    
    # Check database constraints
    log "Checking database constraints..."
    docker-compose -f docker-compose.local.yml exec -T dev-db psql -U postgres -d r3_dev -c "SELECT conname, contype, conrelid::regclass FROM pg_constraint;" > logs/constraints.log
    
    # Check data size and growth
    log "Checking data size..."
    docker-compose -f docker-compose.local.yml exec -T dev-db psql -U postgres -d r3_dev -c "\dt+ *.*" > logs/table_sizes.log
    
    # Validate Redis keys
    log "Checking Redis keys..."
    docker-compose -f docker-compose.local.yml exec -T dev-redis redis-cli --scan > logs/redis_keys.log
    
    log "${GREEN}Validation complete. Check logs for details.${NC}"
}

# Monitor data growth
monitor_growth() {
    log "${BLUE}Monitoring data growth...${NC}"
    
    # Get database size
    local db_size=$(docker-compose -f docker-compose.local.yml exec -T dev-db psql -U postgres -d r3_dev -t -c "SELECT pg_size_pretty(pg_database_size('r3_dev'));")
    
    # Get Redis size
    local redis_size=$(docker-compose -f docker-compose.local.yml exec -T dev-redis redis-cli info memory | grep used_memory_human)
    
    # Get disk usage
    local disk_usage=$(du -sh data/)
    
    # Log metrics
    local timestamp=$(date +%s)
    echo "$timestamp,$db_size,$redis_size,$disk_usage" >> logs/growth_metrics.csv
    
    log "Current sizes:"
    log "Database: $db_size"
    log "Redis: $redis_size"
    log "Total data: $disk_usage"
}

# Show help
show_help() {
    echo "Usage: $0 [command]"
    echo
    echo "Commands:"
    echo "  check              Run integrity check"
    echo "  setup-auto         Setup automated backups"
    echo "  migrate            Migrate data between versions"
    echo "  validate           Validate data consistency"
    echo "  monitor            Monitor data growth"
    echo "  schedule           Setup automated maintenance"
}

# Main script
case "$1" in
    "check")
        check_integrity
        ;;
    "setup-auto")
        setup_automated_backups
        ;;
    "migrate")
        if [ -z "$2" ] || [ -z "$3" ]; then
            echo "Usage: $0 migrate <from_version> <to_version>"
            exit 1
        fi
        migrate_data "$2" "$3"
        ;;
    "validate")
        validate_data
        ;;
    "monitor")
        monitor_growth
        ;;
    "schedule")
        cat > .github/workflows/data-maintenance.yml << EOF
name: Data Maintenance

on:
  schedule:
    - cron: '0 3 * * *'  # Run daily at 3 AM
  workflow_dispatch:      # Allow manual trigger

jobs:
  maintenance:
    runs-on: self-hosted  # Use self-hosted runner for data access
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Run integrity check
      run: ./scripts/data-tools.sh check
    
    - name: Create backup
      run: ./scripts/data-management.sh backup
    
    - name: Monitor growth
      run: ./scripts/data-tools.sh monitor
    
    - name: Validate data
      run: ./scripts/data-tools.sh validate
    
    - name: Clean old backups
      run: ./scripts/data-management.sh clean
EOF
        log "${GREEN}Maintenance workflow created${NC}"
        ;;
    *)
        show_help
        ;;
esac
