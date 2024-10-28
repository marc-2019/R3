#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_step() {
    echo -e "\n${BLUE}=== $1 ===${NC}"
}

print_error() {
    echo -e "${RED}ERROR: $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}WARNING: $1${NC}"
}

print_success() {
    echo -e "${GREEN}SUCCESS: $1${NC}"
}

# Check if running with correct permissions
if [ "$EUID" -eq 0 ]; then 
    print_error "Please do not run as root"
    exit 1
fi

print_step "Starting R3 System Setup"

# Check for required tools
print_step "Checking prerequisites"
REQUIRED_TOOLS="node npm git docker docker-compose"
MISSING_TOOLS=()

for tool in $REQUIRED_TOOLS; do
    if ! command -v $tool >/dev/null 2>&1; then
        MISSING_TOOLS+=($tool)
    fi
done

if [ ${#MISSING_TOOLS[@]} -ne 0 ]; then
    print_error "Missing required tools: ${MISSING_TOOLS[*]}"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
if [ $(echo "$NODE_VERSION 18.0.0" | awk '{print ($1 < $2)}') -eq 1 ]; then
    print_error "Node.js version must be 18.0.0 or higher. Current version: $NODE_VERSION"
    exit 1
fi

# Create environment files
print_step "Creating environment files"
cat > .env.example << EOF
# Application
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Authentication
JWT_SECRET=your-jwt-secret
JWT_EXPIRY=1h
REFRESH_TOKEN_EXPIRY=7d

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/r3_dev
REDIS_URL=redis://localhost:6379

# Docker
DOCKER_HOST=unix:///var/run/docker.sock
ROOT_NETWORK_NODE=http://localhost:8545
REALITY2_ENDPOINT=http://localhost:3001

# Monitoring
LOG_LEVEL=debug
SENTRY_DSN=your-sentry-dsn
EOF

cp .env.example .env.local
cp .env.example .env.test

# Create Docker development configuration
print_step "Creating Docker development configuration"
cat > docker-compose.dev.yml << EOF
version: '3.8'

services:
  dev-db:
    image: postgres:14-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: r3_dev
    volumes:
      - dev-db-data:/var/lib/postgresql/data

  dev-redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    volumes:
      - dev-redis-data:/data

  dev-mailhog:
    image: mailhog/mailhog
    ports:
      - "1025:1025"
      - "8025:8025"

volumes:
  dev-db-data:
  dev-redis-data:
EOF

# Create example component and test
print_step "Creating example component and test"
mkdir -p src/components/UserManagement
cat > src/components/UserManagement/UserManagement.tsx << EOF
import React, { useState } from 'react';
import { User, Settings, Shield } from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <User className="h-6 w-6 text-blue-500" />
          <h1 className="text-2xl font-bold">User Management</h1>
        </div>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Manage Permissions
        </button>
      </div>
      
      {users.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No users found</p>
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Add User
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {users.map(user => (
            <div key={user.id} className="p-4 border rounded-lg flex justify-between items-center">
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{user.role}</span>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
EOF

cat > src/components/UserManagement/UserManagement.test.tsx << EOF
import { render, screen } from '@testing-library/react';
import { UserManagement } from './UserManagement';

describe('UserManagement', () => {
  it('renders the component', () => {
    render(<UserManagement />);
    expect(screen.getByText('User Management')).toBeInTheDocument();
  });

  it('shows empty state when no users', () => {
    render(<UserManagement />);
    expect(screen.getByText('No users found')).toBeInTheDocument();
  });

  it('shows add user button in empty state', () => {
    render(<UserManagement />);
    expect(screen.getByText('Add User')).toBeInTheDocument();
  });
});
EOF

# Create development utilities
print_step "Creating development utilities"
mkdir -p scripts

cat > scripts/dev-setup.sh << EOF
#!/bin/bash
# Development environment setup script

# Start development databases
docker-compose -f docker-compose.dev.yml up -d

# Wait for database to be ready
echo "Waiting for database to be ready..."
until docker-compose -f docker-compose.dev.yml exec -T dev-db pg_isready; do
  sleep 1
done

# Run database migrations (when we add them)
# npm run prisma:migrate:dev

echo "Development environment is ready!"
EOF

chmod +x scripts/dev-setup.sh

cat > scripts/test-setup.sh << EOF
#!/bin/bash
# Test environment setup script

# Set test environment
export NODE_ENV=test

# Run tests with coverage
npm run test:coverage
EOF

chmod +x scripts/test-setup.sh

# Update package.json scripts
print_step "Updating package.json scripts"
cat > package.json << EOF
{
  "name": "r3-system",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "dev:setup": "./scripts/dev-setup.sh",
    "test:setup": "./scripts/test-setup.sh",
    "prepare": "husky install",
    "docker:dev": "docker-compose -f docker-compose.dev.yml up -d",
    "docker:dev:down": "docker-compose -f docker-compose.dev.yml down",
    "docker:dev:logs": "docker-compose -f docker-compose.dev.yml logs -f",
    "postinstall": "npm run prepare"
  },
  "dependencies": {
    "@types/node": "20.11.5",
    "@types/react": "18.2.48",
    "@types/react-dom": "18.2.18",
    "next": "14.1.0",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "typescript": "5.3.3",
    "lucide-react": "0.263.1",
    "@/components/ui": "workspace:*",
    "axios": "^1.6.5",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "date-fns": "^3.2.0",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.1.6",
    "@testing-library/react": "^14.1.2",
    "@types/jest": "^29.5.11",
    "eslint": "^8.56.0",
    "eslint-config-next": "14.1.0",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "prettier": "^3.2.4",
    "husky": "^8.0.3",
    "tailwindcss": "^3.4.1",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.33",
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.5",
    "msw": "^2.1.2",
    "cross-env": "^7.0.3"
  }
}
EOF

# Initialize Git repository and set up hooks
print_step "Setting up Git repository"
git init

# Set up Husky
npx husky install
npx husky add .husky/pre-commit "npm run lint"
npx husky add .husky/pre-push "npm test"

# Install dependencies
print_step "Installing dependencies"
npm install

# Set up Git repository
git add .
git commit -m "Initial commit: R3 system setup with development environment"
git branch -M main
git remote add origin git@github.com:marc-2019/R3.git

# Push to GitHub
print_step "Pushing to GitHub"
git push -u origin main

print_success "Setup complete! Your enhanced R3 system is ready for development."
echo -e "\nNext steps:"
echo -e "1. Run ${BLUE}npm run dev:setup${NC} to start the development environment"
echo -e "2. Run ${BLUE}npm run dev${NC} to start the development server"
echo -e "3. Visit ${BLUE}http://localhost:3000${NC} to see your application"
echo -e "4. Run ${BLUE}npm run test:setup${NC} to run tests with coverage"
echo -e "5. Check GitHub Actions for CI pipeline status"

# Add development tools notice
echo -e "\n${YELLOW}Additional development tools available:${NC}"
echo -e "- MailHog (mail testing): ${BLUE}http://localhost:8025${NC}"
echo -e "- Database: PostgreSQL running on ${BLUE}localhost:5432${NC}"
echo -e "- Redis: Running on ${BLUE}localhost:6379${NC}"
