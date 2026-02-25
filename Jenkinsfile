pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build & Deploy') {
            steps {
                script {
                    def tag = "${BUILD_NUMBER}-${GIT_COMMIT.take(7)}"

                    sh """
                    echo "Building image with tag: ${tag}"
                    TAG=${tag} docker-compose -f docker-compose.prod.yml up -d --build
                    """
                }
            }
        }
    }
}