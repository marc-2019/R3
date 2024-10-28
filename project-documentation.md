# R3 System Project Documentation

## Project Overview
R3 (Root Request Router) is a middleware layer application that connects different platforms and networks through a user-friendly interface. The system serves as a connectivity hub with potential for monetization through both the middleware layer and future modular extensions.

## Project Structure
```
D:\R3\
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── data/
│   │   │       ├── access-control-api.ts
│   │   │       └── data-api-routes.ts
│   │   ├── components/
│   │   ├── styles/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── data/
│   │   │   ├── data-dashboard.tsx
│   │   │   └── enhanced-data-dashboard.tsx
│   │   ├── layout/
│   │   │   └── Navbar.tsx
│   │   ├── ui/
│   │   └── permission-management-extended.tsx
│   ├── lib/
│   ├── services/
│   │   └── websocket-service.ts
│   └── types/
```

## Technology Stack
- Framework: Next.js 14 with TypeScript
- Styling: Tailwind CSS
- Database: PostgreSQL (via Docker)
- Caching: Redis (via Docker)
- State Management: [To be determined]
- Testing: [To be implemented]

## Key Components

### API Layer
- Location: `src/app/api/data/`
- Handles data management and access control
- RESTful endpoints for system integration

### Data Dashboard
- Location: `src/components/data/`
- Provides visualization and management interface
- Enhanced version includes advanced features

### Services
- WebSocket service for real-time updates
- Docker integration for database and caching
- Authentication and authorization services

## Current Development Status
- Basic project structure established
- Core components implemented
- Docker configuration in place
- Development environment configured

## Development Approach
- Single developer workflow with AI assistance
- CI/CD pipeline planned for test/production
- Using Docker Desktop for local development
- GitHub repository for version control

## Next Steps
1. Consolidate component organization
2. Set up CI/CD pipeline
3. Implement remaining core features
4. Add test coverage
5. Document API endpoints

## Environment Setup
```bash
# Required environment variables
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/r3_dev
REDIS_URL=redis://localhost:6379
NODE_ENV=development
```

## Scripts and Commands
```bash
# Development
npm run dev         # Start development server
npm run build      # Build production version
npm run lint       # Run linting

# Docker
docker-compose up  # Start Docker services
docker-compose down # Stop Docker services
```

## Important Notes
- Project aims for modular architecture
- Focus on maintainable and scalable code
- Regular documentation updates needed
- Security considerations for middleware layer

## Future Updates
This documentation should be updated when:
1. New major features are added
2. Architecture changes are made
3. New dependencies are introduced
4. Development workflow changes
