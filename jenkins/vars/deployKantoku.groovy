// Jenkins shared library for Kantoku Help Manual deployment

def call(Map config) {
    pipeline {
        agent any
        
        environment {
            APP_NAME = config.appName ?: 'kantoku-help-manual'
            ENVIRONMENT = config.environment ?: 'staging'
            PORT = config.port ?: '3000'
            DOCKER_REGISTRY = config.dockerRegistry ?: ''
            HEALTH_CHECK_PATH = config.healthCheckPath ?: '/api/health'
        }
        
        stages {
            stage('Validate Config') {
                steps {
                    script {
                        echo "🔍 Validating deployment configuration"
                        
                        // Validate required parameters
                        if (!config.dockerImage) {
                            error("Docker image is required")
                        }
                        
                        echo "✅ Configuration validated"
                        echo "App: ${env.APP_NAME}"
                        echo "Environment: ${env.ENVIRONMENT}"
                        echo "Port: ${env.PORT}"
                        echo "Image: ${config.dockerImage}"
                    }
                }
            }
            
            stage('Pre-deployment Health Check') {
                steps {
                    script {
                        echo "🏥 Checking current deployment health"
                        
                        sh """
                            if docker ps -q -f name=${env.APP_NAME}-${env.ENVIRONMENT}; then
                                echo "Current deployment found, checking health..."
                                curl -f http://localhost:${env.PORT}${env.HEALTH_CHECK_PATH} || echo "Current deployment unhealthy"
                            else
                                echo "No current deployment found"
                            fi
                        """
                    }
                }
            }
            
            stage('Deploy') {
                steps {
                    script {
                        echo "🚀 Deploying ${config.dockerImage} to ${env.ENVIRONMENT}"
                        
                        // Blue-green deployment
                        deployBlueGreen(
                            appName: env.APP_NAME,
                            environment: env.ENVIRONMENT,
                            dockerImage: config.dockerImage,
                            port: env.PORT,
                            healthCheckPath: env.HEALTH_CHECK_PATH
                        )
                    }
                }
            }
            
            stage('Post-deployment Verification') {
                steps {
                    script {
                        echo "✅ Verifying deployment"
                        
                        // Wait for application to start
                        sh """
                            echo "Waiting for application to start..."
                            for i in {1..30}; do
                                if curl -f http://localhost:${env.PORT}${env.HEALTH_CHECK_PATH}; then
                                    echo "✅ Health check passed"
                                    break
                                fi
                                echo "Waiting... (\$i/30)"
                                sleep 2
                            done
                        """
                        
                        // Run additional verification tests
                        if (config.verificationTests) {
                            config.verificationTests.each { test ->
                                sh test
                            }
                        }
                    }
                }
            }
        }
        
        post {
            success {
                script {
                    echo "✅ Deployment successful!"
                    
                    if (config.notifications?.slack) {
                        slackSend(
                            channel: config.notifications.slack.channel,
                            color: 'good',
                            message: "✅ ${env.APP_NAME} deployed to ${env.ENVIRONMENT} successfully"
                        )
                    }
                }
            }
            
            failure {
                script {
                    echo "❌ Deployment failed!"
                    
                    // Rollback on failure
                    if (config.rollbackOnFailure) {
                        rollbackDeployment(
                            appName: env.APP_NAME,
                            environment: env.ENVIRONMENT
                        )
                    }
                    
                    if (config.notifications?.slack) {
                        slackSend(
                            channel: config.notifications.slack.channel,
                            color: 'danger',
                            message: "❌ ${env.APP_NAME} deployment to ${env.ENVIRONMENT} failed"
                        )
                    }
                }
            }
        }
    }
}

def deployBlueGreen(Map params) {
    def containerName = "${params.appName}-${params.environment}"
    def backupName = "${containerName}-backup"
    
    sh """
        # Create backup of current deployment
        if docker ps -q -f name=${containerName}; then
            echo "Creating backup of current deployment..."
            docker stop ${backupName} 2>/dev/null || true
            docker rm ${backupName} 2>/dev/null || true
            docker rename ${containerName} ${backupName} || true
        fi
        
        # Deploy new version
        echo "Deploying new version..."
        docker run -d \\
            --name ${containerName} \\
            -p ${params.port}:3000 \\
            --restart unless-stopped \\
            -e NODE_ENV=production \\
            -e NEXT_TELEMETRY_DISABLED=1 \\
            ${params.dockerImage}
        
        # Wait for new deployment to be ready
        sleep 10
        
        # Verify new deployment
        if curl -f http://localhost:${params.port}${params.healthCheckPath}; then
            echo "✅ New deployment verified, removing backup"
            docker stop ${backupName} 2>/dev/null || true
            docker rm ${backupName} 2>/dev/null || true
        else
            echo "❌ New deployment failed, rolling back"
            docker stop ${containerName} 2>/dev/null || true
            docker rm ${containerName} 2>/dev/null || true
            docker rename ${backupName} ${containerName} || true
            docker start ${containerName} || true
            exit 1
        fi
    """
}

def rollbackDeployment(Map params) {
    def containerName = "${params.appName}-${params.environment}"
    def backupName = "${containerName}-backup"
    
    echo "🔄 Rolling back deployment"
    
    sh """
        # Stop current failed deployment
        docker stop ${containerName} 2>/dev/null || true
        docker rm ${containerName} 2>/dev/null || true
        
        # Restore backup if available
        if docker ps -a -q -f name=${backupName}; then
            echo "Restoring backup deployment..."
            docker rename ${backupName} ${containerName}
            docker start ${containerName}
        else
            echo "No backup available for rollback"
        fi
    """
}
