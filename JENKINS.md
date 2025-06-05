# Jenkins CI/CD Setup for Kantoku Help Manual

This document provides comprehensive instructions for setting up Jenkins CI/CD pipelines for the Kantoku Help Manual project.

## Overview

The Jenkins setup includes:
- **Main Pipeline** (`Jenkinsfile`) - Complete CI/CD pipeline with staging and production deployment
- **Multibranch Pipeline** (`jenkins/Jenkinsfile.multibranch`) - Branch-specific deployments
- **Production Pipeline** (`jenkins/Jenkinsfile.production`) - Production-focused deployment with approval gates
- **Shared Library** (`jenkins/vars/deployKantoku.groovy`) - Reusable deployment functions

## Prerequisites

### Jenkins Requirements
- Jenkins 2.400+ with Pipeline plugin
- Docker installed on Jenkins agents
- Node.js plugin for Jenkins
- Required plugins (see setup script)

### Credentials Required
- `github-credentials`: GitHub username/token
- `docker-registry-url`: Docker registry URL
- `docker-registry-credentials`: Docker registry credentials
- `slack-webhook-url`: Slack webhook for notifications
- `datadog-api-key`: Datadog API key for monitoring

## Quick Setup

### Automated Setup

```bash
# Clone the repository
git clone <repository-url>
cd kantoku-help-manual

# Run Jenkins setup script
chmod +x jenkins/setup/jenkins-setup.sh
./jenkins/setup/jenkins-setup.sh
```

### Manual Setup

1. **Install Required Plugins**
   ```
   - Pipeline
   - Docker Pipeline
   - Node.js
   - GitHub
   - Email Extension
   - Slack Notification
   - Blue Ocean (optional)
   ```

2. **Create Pipeline Job**
   - New Item → Pipeline
   - Configure SCM to point to your repository
   - Set Script Path to `Jenkinsfile`

3. **Create Multibranch Pipeline**
   - New Item → Multibranch Pipeline
   - Add GitHub source
   - Set Script Path to `jenkins/Jenkinsfile.multibranch`

## Pipeline Features

### Main Pipeline (`Jenkinsfile`)

**Stages:**
1. **Checkout** - Get source code
2. **Environment Setup** - Configure Node.js and Docker
3. **Install Dependencies** - npm install with audit
4. **Code Quality & Security** - Linting, security scans, Dockerfile lint
5. **Build Application** - Next.js build with standalone output
6. **Build Docker Image** - Multi-stage Docker build
7. **Test Docker Image** - Health checks and basic tests
8. **Push to Registry** - Push to Docker registry (main/master branches)
9. **Deploy to Staging** - Automatic staging deployment
10. **Deploy to Production** - Manual approval required

**Key Features:**
- ✅ Parallel execution for code quality checks
- ✅ Docker image security scanning
- ✅ Blue-green deployment strategy
- ✅ Health checks and smoke tests
- ✅ Email and Slack notifications
- ✅ Automatic cleanup of old images

### Multibranch Pipeline

**Branch Strategies:**
- `main/master` → Production deployment (with approval)
- `develop` → Staging deployment (automatic)
- `feature/*` → Feature environment deployment
- `hotfix/*` → Hotfix environment deployment (with approval)

### Production Pipeline

**Enhanced Features:**
- 🔒 Security scanning with Trivy
- 📊 Performance testing
- 🎯 Multiple deployment strategies (blue-green, rolling, canary)
- 📈 Monitoring integration (Datadog)
- 🔄 Automatic rollback on failure
- ✋ Manual approval gates

## Environment Configuration

### Staging Environment
- **Port**: 3001
- **URL**: http://localhost:3001
- **Auto-deploy**: develop, main branches
- **Health Check**: `/api/health`

### Production Environment
- **Port**: 3000
- **URL**: http://localhost:3000
- **Deploy**: Manual approval required
- **Strategy**: Blue-green deployment
- **Monitoring**: Full monitoring and alerting

### Feature Environments
- **Port**: 3002
- **Auto-deploy**: feature/* branches
- **Cleanup**: Automatic after branch deletion

## Deployment Strategies

### Blue-Green Deployment (Default)
```groovy
// Automatic blue-green deployment with health checks
deployKantoku([
    appName: 'kantoku-help-manual',
    environment: 'production',
    dockerImage: env.DOCKER_IMAGE,
    port: '3000',
    rollbackOnFailure: true
])
```

### Rolling Deployment
- Gradual replacement of instances
- Zero-downtime deployment
- Configurable rollout speed

### Canary Deployment
- Deploy to subset of users
- Monitor metrics before full rollout
- Automatic rollback on issues

## Monitoring and Alerting

### Health Checks
- **Endpoint**: `/api/health`
- **Frequency**: Every 30 seconds
- **Timeout**: 10 seconds
- **Retries**: 3 attempts

### Notifications

**Slack Integration:**
```groovy
slackSend(
    channel: '#deployments',
    color: 'good',
    message: "✅ Kantoku deployed successfully"
)
```

**Email Notifications:**
- Success: DevOps team
- Failure: DevOps + On-call team
- Production: DevOps + Product team

### Monitoring Integration

**Datadog:**
- Deployment markers
- Performance metrics
- Error tracking
- Custom dashboards

## Security

### Image Scanning
- Trivy security scanner
- High/Critical vulnerability detection
- Docker bench security tests
- Fail build on critical issues

### Access Control
- Role-based permissions
- Approval gates for production
- Audit logging
- Secure credential management

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Check Node.js version
   node --version
   
   # Clear npm cache
   npm cache clean --force
   
   # Rebuild Docker image
   docker build --no-cache -t kantoku-help-manual .
   ```

2. **Docker Issues**
   ```bash
   # Check Docker daemon
   docker info
   
   # Clean up Docker system
   docker system prune -f
   
   # Check image size
   docker images kantoku-help-manual
   ```

3. **Deployment Failures**
   ```bash
   # Check container logs
   docker logs kantoku-help-manual-production
   
   # Verify health endpoint
   curl http://localhost:3000/api/health
   
   # Check port conflicts
   netstat -tulpn | grep :3000
   ```

### Debug Mode

Enable debug logging in pipeline:
```groovy
environment {
    DEBUG = 'true'
    VERBOSE = 'true'
}
```

## Performance Optimization

### Build Optimization
- Multi-stage Docker builds
- Layer caching
- Parallel stage execution
- Artifact caching

### Deployment Optimization
- Health check optimization
- Resource limits
- Container startup time
- Image size reduction

## Backup and Recovery

### Automated Backups
- Configuration backup
- Build artifacts
- Docker images
- Deployment logs

### Recovery Procedures
- Rollback to previous version
- Emergency deployment process
- Disaster recovery plan

## Best Practices

### Pipeline Design
- ✅ Fail fast principle
- ✅ Parallel execution where possible
- ✅ Comprehensive testing
- ✅ Clear stage naming
- ✅ Proper error handling

### Security
- ✅ Least privilege access
- ✅ Secure credential storage
- ✅ Regular security scans
- ✅ Audit trail maintenance

### Monitoring
- ✅ Comprehensive health checks
- ✅ Performance monitoring
- ✅ Error alerting
- ✅ Deployment tracking

## Support and Maintenance

### Regular Tasks
- Update Jenkins plugins
- Review security scans
- Monitor build performance
- Clean up old artifacts

### Escalation
1. Check build logs
2. Verify environment health
3. Contact DevOps team
4. Emergency procedures

## Additional Resources

- [Jenkins Pipeline Documentation](https://www.jenkins.io/doc/book/pipeline/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Blue-Green Deployment](https://martinfowler.com/bliki/BlueGreenDeployment.html)
