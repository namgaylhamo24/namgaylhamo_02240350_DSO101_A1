pipeline {
    agent any
    tools {
        nodejs 'NodeJs'
    }
    stages {

        stage('Checkout') {
            steps {
                // regular checkout
                git branch: 'main',
                    url: 'https://github.com/namgaylhamo24/namgaylhamo_02240350_DSO101_A1.git',
                    credentialsId: 'github-creds'
            }
        }

        stage('Clean Checkout') {
            steps {
                // ensure workspace is fresh to pick up latest files
                bat 'git reset --hard'
                bat 'git clean -fdx'
                bat 'git fetch --all'
                bat 'git checkout main'
                bat 'git pull origin main'
            }
        }

        stage('Install Backend') {
            steps {
                dir('backend') {
                    bat 'npm install'
                }
            }
        }

        stage('Install Frontend') {
            steps {
                dir('frontend') {
                    bat 'npm install'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    bat 'npm run build'
                }
            }
        }

        stage('Test Backend') {
            steps {
                dir('backend') {
                    bat 'npm test'
                }
            }
        }

        stage('Test Frontend') {
            steps {
                dir('frontend') {
                    bat 'npm test'
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // Use Docker CLI instead of pipeline 'docker' object to avoid missing plugin
                    // Requires Docker CLI available on the agent and a Jenkins usernamePassword
                    // credential stored as 'docker-hub-creds'.
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        bat 'docker --version'
                        bat "docker build -t namgaylhamo/be-todo:latest ./backend"
                        bat "docker build -t namgaylhamo/fe-todo:latest ./frontend"
                        bat "docker login -u %DOCKER_USER% -p %DOCKER_PASS% https://index.docker.io/v1/"
                                                bat '''
set RETRIES=3
set COUNT=0
echo Pushing namgaylhamo/be-todo:latest
:push_be
docker push namgaylhamo/be-todo:latest && (
    echo backend image pushed && goto push_be_ok
)
set /a COUNT=%COUNT%+1
if %COUNT% lss %RETRIES% (
    echo backend push failed, retrying in %COUNT%*5 seconds...
    timeout /t 5 >nul
    goto push_be
)
echo backend push failed after %RETRIES% attempts
exit 1
:push_be_ok
echo Backend push succeeded

set RETRIES=3
set COUNT=0
echo Pushing namgaylhamo/fe-todo:latest
:push_fe
docker push namgaylhamo/fe-todo:latest && (
    echo frontend image pushed && goto push_fe_ok
)
set /a COUNT=%COUNT%+1
if %COUNT% lss %RETRIES% (
    echo frontend push failed, retrying in %COUNT%*5 seconds...
    timeout /t 5 >nul
    goto push_fe
)
echo frontend push failed after %RETRIES% attempts
exit 1
:push_fe_ok
echo Frontend push succeeded
'''
                    }
                }
            }
        }
    }
}