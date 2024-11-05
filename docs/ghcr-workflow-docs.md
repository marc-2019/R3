# GitHub Container Registry Setup

## Working Configuration
- Use `GITHUB_TOKEN` instead of PAT for GHCR authentication
- Ensure proper permissions in workflow:
  ```yaml
  permissions:
    contents: read
    packages: write
  ```
- Use repository owner for package naming
- Container images are available at: `ghcr.io/marc-2019/r3:latest`

## Pulling the Image
Others can pull the image using:
```bash
docker pull ghcr.io/marc-2019/r3:latest
```

## CI/CD Pipeline
- Tests run on both Linux and Windows environments
- Container is built and pushed only after successful tests
- Images are tagged with:
  - Latest version
  - Commit SHA
  - Branch name (for feature branches)
