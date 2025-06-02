pipeline {
    agent any

    environment {
        NODE_ENV = "development"
    }

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/zuzzet514/api-blood-donation.git', branch: 'main'
            }
        }

        stage('Build & Test') {
            agent {
                docker {
                    image 'node:18'
                }
            }
            steps {
                dir('api-blood-donation') {
                    sh 'npm install'
                    sh 'npm test'
                }
            }
        }

        stage('Deploy') {
            when {
                expression { currentBuild.currentResult == 'SUCCESS' }
            }
            steps {
                echo '✅ Despliegue simulado. Reemplaza con tu lógica real.'
            }
        }
    }

    post {
        success {
            echo '✅ CI/CD finalizó con éxito.'
        }
        failure {
            echo '❌ Algo falló en Build & Test, no se desplegó.'
        }
    }
}
