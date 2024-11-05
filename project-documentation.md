# R3 System Project Documentation

## Project Overview
R3 (Root Request Router) is a middleware layer application that connects different platforms and networks through a user-friendly interface. The system serves as a connectivity hub with potential for monetization through both the middleware layer and future modular extensions.

## Technology Stack
- Framework: Next.js 14 with TypeScript
- Database: PostgreSQL via Prisma ORM
- Caching: Redis
- Testing: Jest with React Testing Library
- Container: Docker
- CI/CD: GitHub Actions
- Package Registry: GitHub Container Registry (GHCR)

## Development Progress & Learnings

### Current Status
1. Basic project structure set up with Next.js
2. CI pipeline implemented with:
   - Automated testing
   - Docker build process
   - GHCR integration
3. Database schema defined with Prisma:
   - User model
   - DataAccess model
   - Permission model

### Key Learnings
1. Testing Setup:
   - Need to use `require` instead of `import` in jest-setup.js
   - Jest configuration requires specific TypeScript handling
   - CI environment needs explicit dependency installation

2. Docker Considerations:
   - Multi-stage builds for optimal image size
   - Node version compatibility (currently using Node 20)
   - Security considerations (non-root user)

3. Database Schema Evolution:
   - Started with basic User model
   - Added DataAccess and Permission models
   - Using Prisma for type-safe database access

## Important Files & Their Purposes

### Configuration Files
- `docker-compose.yml`: Container orchestration
- `.github/workflows/ci.yml`: CI pipeline definition
- `jest.setup.js`: Testing configuration
- `prisma/schema.prisma`: Database schema

### Core Components
- `src/lib/prisma.ts`: Database client singleton
- `src/app/api/data/access-control-api.ts`: Access control endpoints
- `Dockerfile`: Container build definition

## Environment Setup Requirements
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/r3_dev
REDIS_URL=redis://localhost:6379
NODE_ENV=development
```

## Common Tasks

### Development
```bash
npm run dev     # Start development server
npm test       # Run tests
npm run build  # Build for production
```

### Docker Operations
```bash
docker build -t r3-system:test .
docker run -p 3000:3000 r3-system:test
```

### Database Management
```bash
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema changes
```

## Next Steps & TODOs
1. Complete access control implementation
2. Add Redis caching layer
3. Implement authentication with NextAuth
4. Set up monitoring and logging
5. Create user documentation

## Known Issues & Solutions
1. Jest ES Module Issues:
   - Solution: Use require instead of import in setup files
   - Added proper TypeScript configuration

2. Docker Build Challenges:
   - Missing dependencies in build process
   - Added proper dependency management
   - Updated Node version compatibility

3. CI Pipeline Considerations:
   - Need to sync package-lock.json
   - Added proper secret management
   - Updated to Node 20 for better compatibility

## Additional Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## Contact & Support
- GitHub Repository: [marc-2019/R3](https://github.com/marc-2019/R3)
- Project Lead: marc-2019

