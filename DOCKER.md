# Docker Setup for Kantoku Help Manual

This document provides comprehensive instructions for running the Kantoku Help Manual using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose (usually included with Docker Desktop)

## Quick Start

### Option 1: Using Docker Compose (Recommended)

```bash
# Production build and run
docker-compose up --build

# Development mode with hot reload
docker-compose -f docker-compose.dev.yml up --build
```

### Option 2: Using npm scripts

```bash
# Build Docker image
npm run docker:build

# Run production container
npm run docker:prod

# Run development container
npm run docker:dev

# Stop containers
npm run docker:stop
```

### Option 3: Manual Docker commands

```bash
# Build the image
docker build -t kantoku-help-manual:latest .

# Run the container
docker run -p 3000:3000 kantoku-help-manual:latest
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run docker:build` | Build production Docker image |
| `npm run docker:run` | Run production container |
| `npm run docker:dev` | Start development environment |
| `npm run docker:prod` | Start production environment |
| `npm run docker:stop` | Stop all containers |
| `npm run docker:clean` | Clean up Docker system |

## Docker Files Overview

- **`Dockerfile`** - Production build with multi-stage optimization
- **`Dockerfile.dev`** - Development build with hot reload
- **`docker-compose.yml`** - Production environment configuration
- **`docker-compose.dev.yml`** - Development environment configuration
- **`.dockerignore`** - Files to exclude from Docker context

## Environment Configuration

### Production Environment

The production container runs with:
- Node.js 18 Alpine Linux
- Optimized Next.js standalone build
- Health checks enabled
- Automatic restart policy

### Development Environment

The development container includes:
- Hot reload functionality
- Volume mounting for live code changes
- Development dependencies
- Debug capabilities

## Health Checks

The application includes a health check endpoint at `/api/health` that returns:

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "production",
  "version": "1.0.0"
}
```

## Port Configuration

- **Production**: `http://localhost:3000`
- **Development**: `http://localhost:3001`

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Check what's using the port
   lsof -i :3000
   
   # Kill the process or use a different port
   docker run -p 3001:3000 kantoku-help-manual:latest
   ```

2. **Build failures**
   ```bash
   # Clean Docker cache
   docker system prune -f
   docker builder prune -f
   
   # Rebuild without cache
   docker build --no-cache -t kantoku-help-manual:latest .
   ```

3. **Container won't start**
   ```bash
   # Check container logs
   docker logs kantoku-help-manual
   
   # Run container interactively for debugging
   docker run -it kantoku-help-manual:latest sh
   ```

### Performance Optimization

For better performance in production:

1. **Use multi-stage builds** (already implemented)
2. **Enable output file tracing** (already configured)
3. **Optimize image layers** (already optimized)

## Security Considerations

- The container runs as a non-root user (`nextjs`)
- Only necessary files are copied to the final image
- No sensitive information is included in the image
- Health checks are implemented for monitoring

## Deployment

### Local Deployment

```bash
# Start production environment
docker-compose up -d

# View logs
docker-compose logs -f

# Stop environment
docker-compose down
```

### Cloud Deployment

The Docker image can be deployed to any container platform:

- **AWS ECS/Fargate**
- **Google Cloud Run**
- **Azure Container Instances**
- **Kubernetes**
- **DigitalOcean App Platform**

Example for cloud deployment:

```bash
# Tag for registry
docker tag kantoku-help-manual:latest your-registry/kantoku-help-manual:latest

# Push to registry
docker push your-registry/kantoku-help-manual:latest
```

## Monitoring

The application includes:
- Health check endpoint (`/api/health`)
- Structured logging
- Process monitoring via Docker

For production monitoring, consider adding:
- Application Performance Monitoring (APM)
- Log aggregation
- Metrics collection
- Alerting

## Support

For Docker-related issues:
1. Check the logs: `docker logs kantoku-help-manual`
2. Verify the health endpoint: `curl http://localhost:3000/api/health`
3. Review this documentation
4. Check Docker and system resources
