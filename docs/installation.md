# R3 System Installation Guide

## System Requirements

### Development Machine
- Node.js 18+
- Docker Desktop
- Git
- 16GB RAM minimum
- 100GB free disk space

### Test/CI Machine
- Node.js 18+
- Docker support
- 8GB RAM minimum
- 50GB free disk space

## Installation Steps

### 1. Initial Setup (All Environments)
```bash
# Clone the repository
git clone git@github.com:marc-2019/R3.git
cd R3

# Make setup script executable
chmod +x setup.sh

# Run setup script
./setup.sh
```

### 2. Development Environment

#### A. Configure Environment
```bash
# Copy example environment file
cp .env.example .env.local

# Edit .env.local with your settings
nano .env.local
```

#### B. Start Development Services
```bash
# Start required services
npm run docker:dev

# Wait for services to be ready
npm run dev:setup
```

#### C. Start Development Server
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Available development commands:
- `npm run dev` - Start development server
- `npm run test` - Run tests
- `npm run lint` - Run linter
- `npm run docker:dev:logs` - View Docker services logs
- `npm run docker:dev:down` - Stop Docker services

### 3. Test Environment

#### A. Configure Test Environment
```bash
# Copy test environment file
cp .env.example .env.test

# Edit test environment settings
nano .env.test
```

#### B. Run Tests
```bash
# Set up test environment
npm run test:setup

# Run test suite with coverage
npm run test:coverage
```

### 4. CI Environment
CI runs automatically on GitHub Actions when:
- Push to main branch
- Pull request to main branch
- Manual trigger

## Service Ports

### Development Services
| Service | Port | URL |
|---------|------|-----|
| Next.js Dev Server | 3000 | http://localhost:3000 |
| PostgreSQL | 5432 | postgresql://localhost:5432 |
| Redis | 6379 | redis://localhost:6379 |
| MailHog | 8025 | http://localhost:8025 |
| Root Network | 8545 | http://localhost:8545 |
| Reality2 | 3001 | http://localhost:3001 |

## Directory Structure
```
R3/
├── src/               # Source code
├── docs/              # Documentation
├── scripts/           # Utility scripts
├── docker/            # Docker configurations
├── tests/             # Test files
└── .github/           # GitHub Actions workflows
```

## Common Tasks

### Starting Fresh Development Environment
```bash
# Pull latest changes
git pull

# Install dependencies
npm install

# Start services
npm run docker:dev

# Start development
npm run dev
```

### Running Tests
```bash
# Full test suite
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Updating Dependencies
```bash
# Update all dependencies
npm update

# Check for major updates
npx npm-check-updates
```

## Troubleshooting

### Services Won't Start
1. Check Docker is running
2. Clear Docker volumes:
```bash
npm run docker:dev:down
docker volume prune
npm run docker:dev
```

### Database Issues
1. Check PostgreSQL logs:
```bash
npm run docker:dev:logs dev-db
```

2. Reset database:
```bash
npm run docker:dev:down
docker volume rm r3_dev-db-data
npm run docker:dev
```

### Development Server Issues
1. Clear Next.js cache:
```bash
rm -rf .next
npm run dev
```

2. Reset node_modules:
```bash
rm -rf node_modules
npm install
```

## Support

For issues:
1. Check [Common Issues](./docs/TROUBLESHOOTING.md)
2. Search GitHub Issues
3. Create new issue with:
   - Environment details
   - Steps to reproduce
   - Expected vs actual behavior

## Security Notes

- Never commit `.env` files
- Keep dependencies updated
- Run security audits regularly:
```bash
npm audit
```
