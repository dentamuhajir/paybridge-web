pipeline { 
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = credentials('dockerhub-credentials')
        IMAGE_NAME = "dentamuhajir/paybridge-web"
        IMAGE_TAG = "${BUILD_NUMBER}"
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

        // ================================
        // STAGE 4: Update Manifest Repo
        // ================================
        stage('Update Manifest') {
            steps {
                echo "======== Updating manifest repo ========"
                sh """
                    rm -rf ${MANIFEST_REPO_NAME}

                    git clone https://${GITHUB_CREDENTIALS_USR}:${GITHUB_CREDENTIALS_PSW}@github.com/dentamuhajir/paybridge-k8s-manifests.git

                    cd ${MANIFEST_REPO_NAME}

                    echo "=== Before update ==="
                    grep 'image:' ${DEPLOYMENT_FILE}

                    sed -i 's|image: ${IMAGE_NAME}:.*|image: ${IMAGE_NAME}:${IMAGE_TAG}|g' ${DEPLOYMENT_FILE}

                    echo "=== After update ==="
                    grep 'image:' ${DEPLOYMENT_FILE}

                    git config user.email "jenkins@paybridge.local"
                    git config user.name "Jenkins CI"
                    git add ${DEPLOYMENT_FILE}
                    git commit -m "ci(auto): update paybridge-web image tag :${IMAGE_TAG} - Jenkins Build #${BUILD_NUMBER} [skip ci]"
                    git push origin main

                    echo "======== Manifest updated & pushed! ========"
                """
            }
        }
    }

    post {
        success {
            echo "======== CI Successful! ========"
            echo "Image pushed  : dentamuhajir/paybridge-web:${BUILD_NUMBER}"
            echo "Manifest repo : updated to tag :${BUILD_NUMBER}"
            echo "DockerHub     : https://hub.docker.com/r/dentamuhajir/paybridge-web"
            echo "Deploy manual : git pull && kubectl apply -f base/applications/paybridge-web/deployment.yaml"
        }
        failure {
            echo "======== CI Failed! Check build logs above. ========"
        }
        always {
            sh "docker rmi dentamuhajir/paybridge-web:${BUILD_NUMBER} || true"
            sh "docker rmi dentamuhajir/paybridge-web:latest || true"
            sh "docker logout || true"
            sh "rm -rf paybridge-k8s-manifests || true"
        }
    }
}