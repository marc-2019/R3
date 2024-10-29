# Using the R3 Container Image

## Pulling the Container Image

1. Authenticate with GitHub Container Registry:
```bash
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin
```

2. Pull the image:
```bash
docker pull ghcr.io/marc-2019/r3:latest
```

## Running with Docker Compose

Create a `docker-compose.yml`:
```yaml
version: '3.8'

services:
  r3-app:
    image: ghcr.io/marc-2019/r3:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:postgres@r3-db:5432/r3_dev
      - REDIS_URL=redis://r3-redis:6379
    depends_on:
      - r3-db
      - r3-redis

  r3-db:
    image: postgres:14-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=r3_dev
    volumes:
      - postgres_data:/var/lib/postgresql/data

  r3-redis:
    image: redis:alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

Then run:
```bash
docker compose up -d
```

## Tags Available

- `latest`: Most recent main branch build
- `develop`: Development branch build
- `sha-xxxxx`: Specific commit builds
- Version tags (when released)

## Troubleshooting

If you encounter permission issues:
1. Ensure you're logged in to ghcr.io
2. Check your GitHub account has access to the package
3. Try pulling with explicit credentials
