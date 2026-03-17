pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = credentials('dockerhub-credentials')
        IMAGE_NAME = "dentamuhajir/paybridge-web"
        IMAGE_TAG = "${BUILD_NUMBER}"
        WEB_ENV = credentials('web-env')
    }

    stages {

        // ================================
        // STAGE 1: Checkout Source Code
        // ================================
        stage('Checkout') {
            steps {
                echo "======== Checking out source code ========"
                checkout scm
            }
        }

        // ================================
        // STAGE 2: Build Docker Image
        // ================================
        stage('Build Docker Image') {
            steps {
                echo "======== Building Docker Image ========"
                 withCredentials([
            string(credentialsId: 'web-env', variable: 'API_URL')
                ]) {
                    sh """
                        echo "Using API_URL=$API_URL"

                        DOCKER_BUILDKIT=0 docker build \
                            --no-cache \
                            --build-arg REACT_APP_API_GATEWAY_URL=$API_URL \
                            --target prod \
                            -t ${IMAGE_NAME}:${IMAGE_TAG} \
                            -t ${IMAGE_NAME}:latest \
                            -f Dockerfile .
                    """
                }
            }
        }

        // ================================
        // STAGE 3: Push to Docker Hub
        // ================================
        stage('Push to Docker Hub') {
            steps {
                echo "======== Pushing Image to Docker Hub ========"
                sh "echo ${DOCKER_HUB_CREDENTIALS_PSW} | docker login -u ${DOCKER_HUB_CREDENTIALS_USR} --password-stdin"
                sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
                sh "docker push ${IMAGE_NAME}:latest"
                echo "======== Image pushed: ${IMAGE_NAME}:${IMAGE_TAG} ========"
            }
        }

    }

    post {
        success {
            echo "CI Successful!"
            echo "Image available at: https://hub.docker.com/r/dentamuhajir/paybridge-web"
            echo "Tags pushed: ${IMAGE_NAME}:${IMAGE_TAG} and ${IMAGE_NAME}:latest"
        }
        failure {
            echo "CI Failed! Check build logs above."
        }
        always {
            // Cleanup local image supaya disk Jenkins tidak penuh
            sh "docker rmi ${IMAGE_NAME}:${IMAGE_TAG} || true"
            sh "docker rmi ${IMAGE_NAME}:latest || true"
            sh "docker logout || true"
        }
    }
}
