pipeline {
    agent any
    
    environment {
        // Application settings
        APP_NAME = 'kantoku-help-manual'
        APP_VERSION = "${env.BUILD_NUMBER}"
        
        // Docker settings
        DOCKER_IMAGE = "${APP_NAME}:${APP_VERSION}"
        DOCKER_LATEST = "${APP_NAME}:latest"
        
        // Registry settings (customize based on your registry)
        DOCKER_REGISTRY = credentials('docker-registry-url')
        DOCKER_CREDENTIALS = credentials('docker-registry-credentials')
        
        // Deployment settings
        STAGING_PORT = '3001'
        PRODUCTION_PORT = '3000'
        
        // Node.js settings
        NODE_VERSION = '18'
        
        // Notification settings
        SLACK_CHANNEL = '#deployments'
        EMAIL_RECIPIENTS = 'devops@company.com'
    }
    
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
        retry(2)
    }
    
    triggers {
        // Poll SCM every 5 minutes for changes
        pollSCM('H/5 * * * *')
        
        // Build daily at 2 AM
        cron('0 2 * * *')
    }
    
    stages {
        stage('Checkout') {
            steps {
                script {
                    echo "🔄 Checking out code from ${env.GIT_BRANCH}"
                    checkout scm
                    
                    // Get commit information
                    env.GIT_COMMIT_SHORT = sh(
                        script: 'git rev-parse --short HEAD',
                        returnStdout: true
                    ).trim()
                    
                    env.GIT_COMMIT_MSG = sh(
                        script: 'git log -1 --pretty=%B',
                        returnStdout: true
                    ).trim()
                }
            }
        }
        
        stage('Environment Setup') {
            steps {
                script {
                    echo "🔧 Setting up build environment"
                    
                    // Install Node.js using NodeJS plugin
                    nodejs(nodeJSInstallationName: "Node-${NODE_VERSION}") {
                        sh '''
                            node --version
                            npm --version
                        '''
                    }
                    
                    // Check Docker
                    sh '''
                        docker --version
                        docker-compose --version
                    '''
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                script {
                    echo "📦 Installing dependencies"
                    nodejs(nodeJSInstallationName: "Node-${NODE_VERSION}") {
                        sh '''
                            npm ci --only=production
                            npm audit --audit-level=high
                        '''
                    }
                }
            }
        }
        
        stage('Code Quality & Security') {
            parallel {
                stage('Lint') {
                    steps {
                        script {
                            echo "🔍 Running linting"
                            nodejs(nodeJSInstallationName: "Node-${NODE_VERSION}") {
                                sh 'npm run lint'
                            }
                        }
                    }
                }
                
                stage('Security Scan') {
                    steps {
                        script {
                            echo "🔒 Running security scan"
                            nodejs(nodeJSInstallationName: "Node-${NODE_VERSION}") {
                                sh '''
                                    npm audit --audit-level=moderate
                                    # Add additional security scanning tools here
                                '''
                            }
                        }
                    }
                }
                
                stage('Dockerfile Lint') {
                    steps {
                        script {
                            echo "🐳 Linting Dockerfile"
                            sh '''
                                # Install hadolint if not available
                                if ! command -v hadolint &> /dev/null; then
                                    echo "Installing hadolint..."
                                    wget -O hadolint https://github.com/hadolint/hadolint/releases/latest/download/hadolint-Linux-x86_64
                                    chmod +x hadolint
                                    sudo mv hadolint /usr/local/bin/
                                fi
                                
                                hadolint Dockerfile || true
                            '''
                        }
                    }
                }
            }
        }
        
        stage('Build Application') {
            steps {
                script {
                    echo "🏗️ Building Next.js application"
                    nodejs(nodeJSInstallationName: "Node-${NODE_VERSION}") {
                        sh '''
                            npm run build
                            
                            # Verify build output
                            ls -la .next/
                            
                            # Check if standalone build was created
                            if [ -f ".next/standalone/server.js" ]; then
                                echo "✅ Standalone build created successfully"
                            else
                                echo "❌ Standalone build failed"
                                exit 1
                            fi
                        '''
                    }
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    echo "🐳 Building Docker image: ${DOCKER_IMAGE}"
                    
                    // Build the Docker image
                    def image = docker.build("${DOCKER_IMAGE}")
                    
                    // Tag as latest
                    sh "docker tag ${DOCKER_IMAGE} ${DOCKER_LATEST}"
                    
                    // Store image ID for later use
                    env.DOCKER_IMAGE_ID = image.id
                    
                    echo "✅ Docker image built successfully: ${DOCKER_IMAGE}"
                }
            }
        }
        
        stage('Test Docker Image') {
            steps {
                script {
                    echo "🧪 Testing Docker image"
                    
                    // Start container for testing
                    sh """
                        # Stop any existing test container
                        docker stop ${APP_NAME}-test 2>/dev/null || true
                        docker rm ${APP_NAME}-test 2>/dev/null || true
                        
                        # Start test container
                        docker run -d --name ${APP_NAME}-test -p 3002:3000 ${DOCKER_IMAGE}
                        
                        # Wait for container to start
                        sleep 10
                        
                        # Test health endpoint
                        for i in {1..30}; do
                            if curl -f http://localhost:3002/api/health; then
                                echo "✅ Health check passed"
                                break
                            fi
                            echo "Waiting for application to start... (\$i/30)"
                            sleep 2
                        done
                        
                        # Test main page
                        curl -f http://localhost:3002/ || exit 1
                        
                        # Cleanup test container
                        docker stop ${APP_NAME}-test
                        docker rm ${APP_NAME}-test
                    """
                }
            }
        }
        
        stage('Push to Registry') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                    branch 'develop'
                }
            }
            steps {
                script {
                    echo "📤 Pushing Docker image to registry"
                    
                    docker.withRegistry("https://${DOCKER_REGISTRY}", "${DOCKER_CREDENTIALS}") {
                        // Push versioned image
                        sh "docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE}"
                        
                        // Push latest tag for main/master branch
                        if (env.GIT_BRANCH == 'main' || env.GIT_BRANCH == 'master') {
                            sh "docker push ${DOCKER_REGISTRY}/${DOCKER_LATEST}"
                        }
                    }
                    
                    echo "✅ Docker image pushed to registry"
                }
            }
        }
        
        stage('Deploy to Staging') {
            when {
                anyOf {
                    branch 'develop'
                    branch 'main'
                    branch 'master'
                }
            }
            steps {
                script {
                    echo "🚀 Deploying to staging environment"
                    
                    sh """
                        # Stop existing staging container
                        docker stop ${APP_NAME}-staging 2>/dev/null || true
                        docker rm ${APP_NAME}-staging 2>/dev/null || true
                        
                        # Start new staging container
                        docker run -d \\
                            --name ${APP_NAME}-staging \\
                            -p ${STAGING_PORT}:3000 \\
                            --restart unless-stopped \\
                            -e NODE_ENV=production \\
                            -e NEXT_TELEMETRY_DISABLED=1 \\
                            ${DOCKER_IMAGE}
                        
                        # Wait for deployment
                        sleep 15
                        
                        # Verify staging deployment
                        curl -f http://localhost:${STAGING_PORT}/api/health || exit 1
                        
                        echo "✅ Staging deployment successful"
                        echo "🌐 Staging URL: http://localhost:${STAGING_PORT}"
                    """
                }
            }
        }
        
        stage('Deploy to Production') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                }
            }
            steps {
                script {
                    // Add manual approval for production deployment
                    timeout(time: 5, unit: 'MINUTES') {
                        input message: 'Deploy to Production?', 
                              ok: 'Deploy',
                              submitterParameter: 'DEPLOYER'
                    }
                    
                    echo "🚀 Deploying to production environment"
                    echo "👤 Deployed by: ${env.DEPLOYER}"
                    
                    sh """
                        # Blue-Green deployment strategy
                        
                        # Check if production container exists
                        if docker ps -q -f name=${APP_NAME}-production; then
                            echo "Performing blue-green deployment..."
                            
                            # Start new container on different port
                            docker run -d \\
                                --name ${APP_NAME}-production-new \\
                                -p 3003:3000 \\
                                --restart unless-stopped \\
                                -e NODE_ENV=production \\
                                -e NEXT_TELEMETRY_DISABLED=1 \\
                                ${DOCKER_IMAGE}
                            
                            # Wait and verify new container
                            sleep 15
                            curl -f http://localhost:3003/api/health || exit 1
                            
                            # Stop old container and start new one on production port
                            docker stop ${APP_NAME}-production
                            docker rm ${APP_NAME}-production
                            docker stop ${APP_NAME}-production-new
                            docker rm ${APP_NAME}-production-new
                        fi
                        
                        # Start production container
                        docker run -d \\
                            --name ${APP_NAME}-production \\
                            -p ${PRODUCTION_PORT}:3000 \\
                            --restart unless-stopped \\
                            -e NODE_ENV=production \\
                            -e NEXT_TELEMETRY_DISABLED=1 \\
                            ${DOCKER_IMAGE}
                        
                        # Wait for deployment
                        sleep 15
                        
                        # Verify production deployment
                        curl -f http://localhost:${PRODUCTION_PORT}/api/health || exit 1
                        
                        echo "✅ Production deployment successful"
                        echo "🌐 Production URL: http://localhost:${PRODUCTION_PORT}"
                    """
                }
            }
        }
    }
    
    post {
        always {
            script {
                echo "🧹 Cleaning up"
                
                // Clean up test containers
                sh """
                    docker stop ${APP_NAME}-test 2>/dev/null || true
                    docker rm ${APP_NAME}-test 2>/dev/null || true
                """
                
                // Clean up old Docker images (keep last 5)
                sh """
                    docker images ${APP_NAME} --format "table {{.Repository}}:{{.Tag}}\t{{.CreatedAt}}" | \\
                    tail -n +2 | sort -k2 -r | tail -n +6 | awk '{print \$1}' | \\
                    xargs -r docker rmi || true
                """
            }
        }
        
        success {
            script {
                echo "✅ Pipeline completed successfully!"
                
                // Send success notification
                emailext (
                    subject: "✅ ${APP_NAME} - Build #${BUILD_NUMBER} - SUCCESS",
                    body: """
                        <h2>Deployment Successful! 🎉</h2>
                        <p><strong>Application:</strong> ${APP_NAME}</p>
                        <p><strong>Build:</strong> #${BUILD_NUMBER}</p>
                        <p><strong>Branch:</strong> ${env.GIT_BRANCH}</p>
                        <p><strong>Commit:</strong> ${env.GIT_COMMIT_SHORT}</p>
                        <p><strong>Message:</strong> ${env.GIT_COMMIT_MSG}</p>
                        <p><strong>Deployed by:</strong> ${env.DEPLOYER ?: 'Automated'}</p>
                        
                        <h3>Deployment URLs:</h3>
                        <ul>
                            <li><strong>Staging:</strong> http://localhost:${STAGING_PORT}</li>
                            <li><strong>Production:</strong> http://localhost:${PRODUCTION_PORT}</li>
                        </ul>
                        
                        <p><strong>Build URL:</strong> ${BUILD_URL}</p>
                    """,
                    mimeType: 'text/html',
                    to: "${EMAIL_RECIPIENTS}"
                )
            }
        }
        
        failure {
            script {
                echo "❌ Pipeline failed!"
                
                // Send failure notification
                emailext (
                    subject: "❌ ${APP_NAME} - Build #${BUILD_NUMBER} - FAILED",
                    body: """
                        <h2>Deployment Failed! ❌</h2>
                        <p><strong>Application:</strong> ${APP_NAME}</p>
                        <p><strong>Build:</strong> #${BUILD_NUMBER}</p>
                        <p><strong>Branch:</strong> ${env.GIT_BRANCH}</p>
                        <p><strong>Commit:</strong> ${env.GIT_COMMIT_SHORT}</p>
                        <p><strong>Message:</strong> ${env.GIT_COMMIT_MSG}</p>
                        
                        <p><strong>Build URL:</strong> ${BUILD_URL}</p>
                        <p><strong>Console Output:</strong> ${BUILD_URL}console</p>
                        
                        <p>Please check the build logs for more details.</p>
                    """,
                    mimeType: 'text/html',
                    to: "${EMAIL_RECIPIENTS}"
                )
            }
        }
        
        unstable {
            script {
                echo "⚠️ Pipeline completed with warnings"
            }
        }
    }
}
