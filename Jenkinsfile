pipeline {
    agent any

    environment {
        IMAGE_NAME = "ayushchandekar/merged-demo-docker"
        IMAGE_TAG = "1.0.0"
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
                echo "✅ Code checked out successfully"
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "🐳 Building Docker image..."
                    docker.build("${IMAGE_NAME}:${IMAGE_TAG}")
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    echo "📤 Pushing Docker image to Docker Hub..."
                    docker.withRegistry('https://index.docker.io/v1/', 'dockerhub') {
                        docker.image("${IMAGE_NAME}:${IMAGE_TAG}").push()
                        docker.image("${IMAGE_NAME}:${IMAGE_TAG}").push('latest')
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([file(credentialsId: 'kubeconfig-portable', variable: 'KUBECONFIG')]) {
                    script {
                        echo "☸️ Deploying to Kubernetes cluster..."
                        sh '''
                            # Display kubeconfig info (without sensitive data)
                            echo "Using kubeconfig: $KUBECONFIG"
                            
                            # Apply Kubernetes manifests
                            kubectl apply -f k8s/deployment.yaml
                            kubectl apply -f k8s/service.yaml
                            
                            # Verify deployment
                            echo "Waiting for pods to be ready..."
                            sleep 5
                            kubectl get pods -l app=trendit-demo
                            kubectl get svc trendit-service
                            
                            # Display service URLs
                            echo "✅ Deployment successful!"
                            echo "Service Name: trendit-service"
                            echo "Frontend NodePort: 30300"
                            echo "Backend NodePort: 30500"
                        '''
                    }
                }
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline completed successfully! Application deployed to K8s 🚀"
        }
        failure {
            echo "❌ Pipeline failed. Check logs above for details."
        }
    }
}