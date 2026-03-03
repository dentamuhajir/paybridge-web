pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Docker Compose Deploy') {
            steps {
                sh "docker network create paybridge_network || true"

                sh "DOCKER_BUILDKIT=0 docker compose -f docker-compose.yml down || true"
                sh "DOCKER_BUILDKIT=0 docker compose -f docker-compose.yml up -d --build"
            }
        }

        stage('Verification') {
            steps {
                echo "======== Verifying Web ========"
                sh "docker compose -f docker-compose.yml ps"
            }
        }
    }

    post {
        success {
            echo "Web Deployment Successful! Access at http://localhost:3000"
        }
        failure {
            echo "Web Deployment Failed. Checking logs..."
            sh "docker compose -f docker-compose.yml logs --tail=20"
        }
    }
}