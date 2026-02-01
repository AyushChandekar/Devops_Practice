pipeline {
    agent any

    environment {
        IMAGE_NAME = "ayushchandekar/merged-docker" // lowercase is safer
        IMAGE_TAG = "1.0.0"
    }

    stages {

        stage('Try') {
            steps {
                echo "hello i have started"
            }
        }

        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/AyushChandekar-codex/demo_jenkins.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker image..."
                    def customImage = docker.build("${IMAGE_NAME}:${IMAGE_TAG}")
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'dockerhub') {
                        docker.image("${IMAGE_NAME}:${IMAGE_TAG}").push()
                    }
                }
            }
        }
    }

    post {
        success { echo "Docker image successfully built and pushed 🚀" }
        failure { echo "Pipeline failed ❌" }
    }
}