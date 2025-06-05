#!/bin/bash

# Jenkins setup script for Kantoku Help Manual

set -e

echo "🔧 Setting up Jenkins for Kantoku Help Manual deployment"

# Configuration
JENKINS_URL="${JENKINS_URL:-http://localhost:8080}"
JENKINS_USER="${JENKINS_USER:-admin}"
JENKINS_TOKEN="${JENKINS_TOKEN}"
JOB_NAME="kantoku-help-manual"
REPO_URL="${REPO_URL:-https://github.com/your-org/kantoku-help-manual.git}"

# Check if Jenkins CLI is available
if ! command -v jenkins-cli &> /dev/null; then
    echo "📥 Downloading Jenkins CLI..."
    wget -O jenkins-cli.jar "${JENKINS_URL}/jnlpJars/jenkins-cli.jar"
    alias jenkins-cli="java -jar jenkins-cli.jar -s ${JENKINS_URL} -auth ${JENKINS_USER}:${JENKINS_TOKEN}"
fi

# Function to install Jenkins plugin
install_plugin() {
    local plugin_name=$1
    echo "🔌 Installing plugin: ${plugin_name}"
    jenkins-cli install-plugin "${plugin_name}" || echo "Plugin ${plugin_name} already installed or failed to install"
}

# Install required plugins
echo "📦 Installing required Jenkins plugins..."

# Core plugins
install_plugin "workflow-aggregator"          # Pipeline plugin
install_plugin "pipeline-stage-view"          # Pipeline stage view
install_plugin "blueocean"                    # Blue Ocean UI
install_plugin "docker-workflow"              # Docker pipeline plugin
install_plugin "nodejs"                       # Node.js plugin

# SCM plugins
install_plugin "git"                          # Git plugin
install_plugin "github"                       # GitHub plugin
install_plugin "github-branch-source"         # GitHub branch source

# Notification plugins
install_plugin "email-ext"                    # Extended email plugin
install_plugin "slack"                        # Slack plugin
install_plugin "build-timeout"                # Build timeout plugin

# Security and quality plugins
install_plugin "role-strategy"                # Role-based authorization
install_plugin "matrix-auth"                  # Matrix authorization
install_plugin "credentials-binding"          # Credentials binding

# Utility plugins
install_plugin "timestamper"                  # Timestamps in console
install_plugin "ws-cleanup"                   # Workspace cleanup
install_plugin "build-name-setter"            # Build name setter

# Restart Jenkins to load plugins
echo "🔄 Restarting Jenkins to load plugins..."
jenkins-cli restart

# Wait for Jenkins to come back online
echo "⏳ Waiting for Jenkins to restart..."
sleep 30

# Create job configuration XML
cat > job-config.xml << 'EOF'
<?xml version='1.1' encoding='UTF-8'?>
<flow-definition plugin="workflow-job@2.40">
  <actions>
    <org.jenkinsci.plugins.pipeline.modeldefinition.actions.DeclarativeJobAction plugin="pipeline-model-definition@1.8.5"/>
    <org.jenkinsci.plugins.pipeline.modeldefinition.actions.DeclarativeJobPropertyTrackerAction plugin="pipeline-model-definition@1.8.5">
      <jobProperties/>
      <triggers/>
      <parameters/>
      <options/>
    </org.jenkinsci.plugins.pipeline.modeldefinition.actions.DeclarativeJobPropertyTrackerAction>
  </actions>
  <description>Kantoku Help Manual - Multi-language documentation deployment pipeline</description>
  <keepDependencies>false</keepDependencies>
  <properties>
    <hudson.plugins.jira.JiraProjectProperty plugin="jira@3.1.1"/>
    <jenkins.model.BuildDiscarderProperty>
      <strategy class="hudson.tasks.LogRotator">
        <daysToKeep>30</daysToKeep>
        <numToKeep>10</numToKeep>
        <artifactDaysToKeep>-1</artifactDaysToKeep>
        <artifactNumToKeep>-1</artifactNumToKeep>
      </strategy>
    </jenkins.model.BuildDiscarderProperty>
    <org.jenkinsci.plugins.workflow.job.properties.PipelineTriggersJobProperty>
      <triggers>
        <hudson.triggers.SCMTrigger>
          <spec>H/5 * * * *</spec>
          <ignorePostCommitHooks>false</ignorePostCommitHooks>
        </hudson.triggers.SCMTrigger>
      </triggers>
    </org.jenkinsci.plugins.workflow.job.properties.PipelineTriggersJobProperty>
  </properties>
  <definition class="org.jenkinsci.plugins.workflow.cps.CpsScmFlowDefinition" plugin="workflow-cps@2.92">
    <scm class="hudson.plugins.git.GitSCM" plugin="git@4.8.3">
      <configVersion>2</configVersion>
      <userRemoteConfigs>
        <hudson.plugins.git.UserRemoteConfig>
          <url>REPO_URL_PLACEHOLDER</url>
          <credentialsId>github-credentials</credentialsId>
        </hudson.plugins.git.UserRemoteConfig>
      </userRemoteConfigs>
      <branches>
        <hudson.plugins.git.BranchSpec>
          <name>*/main</name>
        </hudson.plugins.git.BranchSpec>
      </branches>
      <doGenerateSubmoduleConfigurations>false</doGenerateSubmoduleConfigurations>
      <submoduleCfg class="list"/>
      <extensions/>
    </scm>
    <scriptPath>Jenkinsfile</scriptPath>
    <lightweight>true</lightweight>
  </definition>
  <triggers/>
  <disabled>false</disabled>
</flow-definition>
EOF

# Replace placeholder with actual repo URL
sed -i "s|REPO_URL_PLACEHOLDER|${REPO_URL}|g" job-config.xml

# Create the Jenkins job
echo "📋 Creating Jenkins job: ${JOB_NAME}"
jenkins-cli create-job "${JOB_NAME}" < job-config.xml || echo "Job may already exist"

# Create multibranch pipeline job
cat > multibranch-config.xml << 'EOF'
<?xml version='1.1' encoding='UTF-8'?>
<org.jenkinsci.plugins.workflow.multibranch.WorkflowMultiBranchProject plugin="workflow-multibranch@2.22">
  <actions/>
  <description>Kantoku Help Manual - Multibranch Pipeline</description>
  <properties>
    <org.jenkinsci.plugins.pipeline.modeldefinition.config.GlobalConfig_-GlobalConfigurationCategory plugin="pipeline-model-definition@1.8.5">
      <dockerLabel></dockerLabel>
      <registry plugin="docker-commons@1.17"/>
    </org.jenkinsci.plugins.pipeline.modeldefinition.config.GlobalConfig_-GlobalConfigurationCategory>
  </properties>
  <folderViews class="jenkins.branch.MultiBranchProjectViewHolder" plugin="branch-api@2.6.4">
    <owner class="org.jenkinsci.plugins.workflow.multibranch.WorkflowMultiBranchProject" reference="../.."/>
  </folderViews>
  <healthMetrics>
    <com.cloudbees.hudson.plugins.folder.health.WorstChildHealthMetric plugin="cloudbees-folder@6.15">
      <nonRecursive>false</nonRecursive>
    </com.cloudbees.hudson.plugins.folder.health.WorstChildHealthMetric>
  </healthMetrics>
  <icon class="jenkins.branch.MetadataActionFolderIcon" plugin="branch-api@2.6.4">
    <owner class="org.jenkinsci.plugins.workflow.multibranch.WorkflowMultiBranchProject" reference="../.."/>
  </icon>
  <orphanedItemStrategy class="com.cloudbees.hudson.plugins.folder.computed.DefaultOrphanedItemStrategy" plugin="cloudbees-folder@6.15">
    <pruneDeadBranches>true</pruneDeadBranches>
    <daysToKeep>-1</daysToKeep>
    <numToKeep>-1</numToKeep>
  </orphanedItemStrategy>
  <triggers>
    <com.cloudbees.hudson.plugins.folder.computed.PeriodicFolderTrigger plugin="cloudbees-folder@6.15">
      <spec>H H/4 * * *</spec>
      <interval>86400000</interval>
    </com.cloudbees.hudson.plugins.folder.computed.PeriodicFolderTrigger>
  </triggers>
  <disabled>false</disabled>
  <sources class="jenkins.branch.BranchSource" plugin="branch-api@2.6.4">
    <source class="org.jenkinsci.plugins.github_branch_source.GitHubSCMSource" plugin="github-branch-source@2.11.2">
      <id>github-source</id>
      <credentialsId>github-credentials</credentialsId>
      <repoOwner>your-org</repoOwner>
      <repository>kantoku-help-manual</repository>
      <traits>
        <org.jenkinsci.plugins.github_branch_source.BranchDiscoveryTrait>
          <strategyId>1</strategyId>
        </org.jenkinsci.plugins.github_branch_source.BranchDiscoveryTrait>
        <org.jenkinsci.plugins.github_branch_source.OriginPullRequestDiscoveryTrait>
          <strategyId>1</strategyId>
        </org.jenkinsci.plugins.github_branch_source.OriginPullRequestDiscoveryTrait>
        <org.jenkinsci.plugins.github_branch_source.ForkPullRequestDiscoveryTrait>
          <strategyId>1</strategyId>
          <trust class="org.jenkinsci.plugins.github_branch_source.ForkPullRequestDiscoveryTrait$TrustPermission"/>
        </org.jenkinsci.plugins.github_branch_source.ForkPullRequestDiscoveryTrait>
      </traits>
    </source>
    <strategy class="jenkins.branch.DefaultBranchPropertyStrategy" plugin="branch-api@2.6.4">
      <properties class="empty-list"/>
    </strategy>
  </sources>
  <factory class="org.jenkinsci.plugins.workflow.multibranch.WorkflowBranchProjectFactory" plugin="workflow-multibranch@2.22">
    <owner class="org.jenkinsci.plugins.workflow.multibranch.WorkflowMultiBranchProject" reference="../.."/>
    <scriptPath>jenkins/Jenkinsfile.multibranch</scriptPath>
  </factory>
</org.jenkinsci.plugins.workflow.multibranch.WorkflowMultiBranchProject>
EOF

# Create multibranch pipeline
echo "🌳 Creating multibranch pipeline: ${JOB_NAME}-multibranch"
jenkins-cli create-job "${JOB_NAME}-multibranch" < multibranch-config.xml || echo "Multibranch job may already exist"

# Set up credentials (you'll need to do this manually or via script)
echo "🔐 Setting up credentials..."
echo "Please manually configure the following credentials in Jenkins:"
echo "1. github-credentials: GitHub username/token for repository access"
echo "2. docker-registry-url: Docker registry URL"
echo "3. docker-registry-credentials: Docker registry username/password"
echo "4. slack-webhook-url: Slack webhook URL for notifications"
echo "5. datadog-api-key: Datadog API key for monitoring"

# Create curl format file for performance testing
cat > curl-format.txt << 'EOF'
     time_namelookup:  %{time_namelookup}\n
        time_connect:  %{time_connect}\n
     time_appconnect:  %{time_appconnect}\n
    time_pretransfer:  %{time_pretransfer}\n
       time_redirect:  %{time_redirect}\n
  time_starttransfer:  %{time_starttransfer}\n
                     ----------\n
          time_total:  %{time_total}\n
EOF

# Clean up
rm -f job-config.xml multibranch-config.xml jenkins-cli.jar

echo "✅ Jenkins setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Configure credentials in Jenkins UI"
echo "2. Update repository URLs in job configurations"
echo "3. Configure Slack/email notifications"
echo "4. Set up Docker registry access"
echo "5. Configure monitoring integrations"
echo ""
echo "🔗 Jenkins URL: ${JENKINS_URL}"
echo "📊 Job URL: ${JENKINS_URL}/job/${JOB_NAME}"
echo "🌳 Multibranch URL: ${JENKINS_URL}/job/${JOB_NAME}-multibranch"
