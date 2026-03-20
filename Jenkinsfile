pipeline { 
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = credentials('dockerhub-credentials')
        IMAGE_NAME = "dentamuhajir/paybridge-web"
        // Get the 7-character short commit hash from the application source code
        IMAGE_TAG = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
        WEB_ENV = credentials('web-env')
        GITHUB_CREDENTIALS = credentials('github-credentials')
        MANIFEST_REPO_NAME = "paybridge-k8s-manifests"
        DEPLOYMENT_FILE = "base/applications/paybridge-web/deployment.yaml"
    }

    stages {
        // ==========================================
        // STAGE 1: Checkout Source Code
        // ==========================================
        stage('Checkout') {
            steps {
                echo "======== Checking out source code ========"
                checkout scm
            }
        }

        // ==========================================
        // STAGE 2: Build Docker Image
        // ==========================================
        stage('Build Docker Image') {
            steps {
                echo "======== Building Docker Image with Tag: ${IMAGE_TAG} ========"
                withCredentials([
                    string(credentialsId: 'web-env', variable: 'API_URL')
                ]) {
                    sh """
                        echo "Using API_URL=$API_URL"
                        DOCKER_BUILDKIT=1 docker build \
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

        // ==========================================
        // STAGE 3: Push to Docker Hub
        // ==========================================
        stage('Push to Docker Hub') {
            steps {
                echo "======== Pushing Image to Docker Hub ========"
                sh "echo ${DOCKER_HUB_CREDENTIALS_PSW} | docker login -u ${DOCKER_HUB_CREDENTIALS_USR} --password-stdin"
                sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
                sh "docker push ${IMAGE_NAME}:latest"
                echo "======== Image pushed: ${IMAGE_NAME}:${IMAGE_TAG} ========"
            }
        }

        // ==========================================
        // STAGE 4: Update Manifest Repository
        // ==========================================
        stage('Update Manifest') {
            steps {
                echo "======== Updating manifest repository via Paybridge Bot ========"
                sh """
                    rm -rf ${MANIFEST_REPO_NAME}
                    git clone https://${GITHUB_CREDENTIALS_USR}:${GITHUB_CREDENTIALS_PSW}@github.com/dentamuhajir/paybridge-k8s-manifests.git
                    cd ${MANIFEST_REPO_NAME}

                    # Detect current branch dynamically 
                    CURRENT_BRANCH=\$(git rev-parse --abbrev-ref HEAD)
                    echo "Current branch detected: \$CURRENT_BRANCH"

                    # Update image tag in the deployment YAML
                    sed -i "s|image: ${IMAGE_NAME}:.*|image: ${IMAGE_NAME}:${IMAGE_TAG}|g" ${DEPLOYMENT_FILE}

                    # Configure Paybridge Bot identity
                    git config user.email "11desember@gmail.com"
                    git config user.name "Paybridge Bot"
                    
                    git add ${DEPLOYMENT_FILE}
                    
                    git commit -m "ci(deploy): update paybridge-web to ${IMAGE_TAG} [build #${BUILD_NUMBER}] [skip ci]"
                    
                    # Push back to the detected branch
                    git push origin \$CURRENT_BRANCH
                    
                    echo "======== Manifest updated to ${IMAGE_TAG} and pushed! ========"
                """
            }
        }
    }

    post {
        success {
            echo "======== CI Successful! ========"
            echo "Deployment Version : ${IMAGE_TAG}"
            echo "Jenkins Build      : #${BUILD_NUMBER}"
        }
        failure {
            echo "======== CI Failed! Check the logs above. ========"
        }
        always {
            // Cleanup local images to prevent disk space issues
            sh "docker rmi ${IMAGE_NAME}:${IMAGE_TAG} || true"
            sh "docker rmi ${IMAGE_NAME}:latest || true"
            sh "docker logout || true"
            sh "rm -rf ${MANIFEST_REPO_NAME} || true"
        }
    }
}