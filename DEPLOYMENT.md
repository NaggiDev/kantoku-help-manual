# Kantoku Help Manual - Deployment Guide

This guide covers various deployment options for the Kantoku Help Manual.

## Docker Deployment (Recommended)

### Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd kantoku-help-manual

# Build and run with Docker Compose
docker-compose up --build -d

# Access the application
open http://localhost:3000
```

### Production Deployment

```bash
# Build production image
npm run docker:build

# Run production container
npm run docker:prod

# Or manually
docker run -d \
  --name kantoku-help-manual \
  -p 3000:3000 \
  --restart unless-stopped \
  kantoku-help-manual:latest
```

### Development with Docker

```bash
# Start development environment
npm run docker:dev

# Access development server
open http://localhost:3001
```

## Cloud Deployment Options

### 1. AWS ECS/Fargate

```bash
# Build and tag for ECR
docker build -t kantoku-help-manual .
docker tag kantoku-help-manual:latest <account-id>.dkr.ecr.<region>.amazonaws.com/kantoku-help-manual:latest

# Push to ECR
aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <account-id>.dkr.ecr.<region>.amazonaws.com
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/kantoku-help-manual:latest
```

### 2. Google Cloud Run

```bash
# Build and push to Google Container Registry
gcloud builds submit --tag gcr.io/<project-id>/kantoku-help-manual

# Deploy to Cloud Run
gcloud run deploy kantoku-help-manual \
  --image gcr.io/<project-id>/kantoku-help-manual \
  --platform managed \
  --region <region> \
  --allow-unauthenticated
```

### 3. Azure Container Instances

```bash
# Build and push to Azure Container Registry
az acr build --registry <registry-name> --image kantoku-help-manual .

# Deploy to Container Instances
az container create \
  --resource-group <resource-group> \
  --name kantoku-help-manual \
  --image <registry-name>.azurecr.io/kantoku-help-manual:latest \
  --dns-name-label kantoku-help-manual \
  --ports 3000
```

### 4. DigitalOcean App Platform

Create `app.yaml`:

```yaml
name: kantoku-help-manual
services:
- name: web
  source_dir: /
  github:
    repo: <your-repo>
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  routes:
  - path: /
```

## Traditional Deployment

### Node.js Server

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Start production server
npm start
```

### PM2 Process Manager

```bash
# Install PM2 globally
npm install -g pm2

# Create ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'kantoku-help-manual',
    script: 'npm',
    args: 'start',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `3000` |
| `HOSTNAME` | Server hostname | `0.0.0.0` |
| `NEXT_TELEMETRY_DISABLED` | Disable Next.js telemetry | `1` |

## Health Monitoring

The application provides a health check endpoint:

```bash
# Check application health
curl http://localhost:3000/api/health

# Expected response
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "production",
  "version": "1.0.0"
}
```

## SSL/HTTPS Setup

### Using Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Performance Optimization

### Docker Optimization

- Multi-stage builds (already implemented)
- Minimal base image (Alpine Linux)
- Output file tracing enabled
- Non-root user execution

### Application Optimization

- Static generation for content pages
- API route caching
- Image optimization disabled for Docker
- Standalone output mode

## Backup and Recovery

### Content Backup

```bash
# Backup content directory
tar -czf content-backup-$(date +%Y%m%d).tar.gz content/

# Restore content
tar -xzf content-backup-YYYYMMDD.tar.gz
```

### Database Backup (if applicable)

Currently, the application uses file-based content, so backing up the `content/` directory is sufficient.

## Troubleshooting

### Common Issues

1. **Port conflicts**: Change port mapping in docker-compose.yml
2. **Memory issues**: Increase container memory limits
3. **Build failures**: Clear Docker cache and rebuild
4. **Health check failures**: Check application logs

### Debugging

```bash
# View container logs
docker logs kantoku-help-manual

# Access container shell
docker exec -it kantoku-help-manual sh

# Check resource usage
docker stats kantoku-help-manual
```

## Support

For deployment issues:
1. Check application logs
2. Verify health endpoint
3. Review environment variables
4. Check network connectivity
5. Consult this documentation
