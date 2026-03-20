pipeline { 
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = credentials('dockerhub-credentials')
        IMAGE_NAME = "dentamuhajir/paybridge-web"
        IMAGE_TAG = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
        WEB_ENV = credentials('web-env')
        GITHUB_CREDENTIALS = credentials('github-credentials')
        MANIFEST_REPO_NAME = "paybridge-k8s-manifests"
        DEPLOYMENT_FILE = "base/applications/paybridge-web/deployment.yaml"
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

        // ================================
        // STAGE 4: Update Manifest Repo
        // ================================
        stage('Update Manifest') {
            steps {
                echo "======== Updating manifest repo using Paybridge Bot ========"
                sh """
                    rm -rf ${MANIFEST_REPO_NAME}
                    git clone https://${GITHUB_CREDENTIALS_USR}:${GITHUB_CREDENTIALS_PSW}@github.com/dentamuhajir/paybridge-k8s-manifests.git
                    cd ${MANIFEST_REPO_NAME}

                    # Update image tag di deployment.yaml
                    sed -i 's|image: ${IMAGE_NAME}:.*|image: ${IMAGE_NAME}:${IMAGE_TAG}|g' ${DEPLOYMENT_FILE}

                    # Identitas Commit yang lebih Pro
                    git config user.email "bot@paybridge.dev"
                    git config user.name "Paybridge Bot"
                    
                    git add ${DEPLOYMENT_FILE}
                    
                    # Format commit message sesuai standar conventional commits
                    git commit -m "ci(deploy): update paybridge-web to ${IMAGE_TAG} [build #${BUILD_NUMBER}] [skip ci]"
                    
                    git push origin main
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
            echo "======== CI Failed! Check build logs above. ========"
        }
        always {
            // Cleanup images to save disk space
            sh "docker rmi ${IMAGE_NAME}:${IMAGE_TAG} || true"
            sh "docker rmi ${IMAGE_NAME}:latest || true"
            sh "docker logout || true"
            sh "rm -rf ${MANIFEST_REPO_NAME} || true"
        }
    }
}