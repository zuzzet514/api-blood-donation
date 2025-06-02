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
            // Este stage corre dentro de un contenedor Node 18
            agent {
                docker {
                    image 'node:18'
                }
            }
            steps {
                // Ya estamos dentro de la carpeta clonada
                sh 'npm install'
                sh 'npm test'
            }
        }

        stage('Deploy') {
            when {
                // Solo si todo en Build & Test salió OK
                expression { currentBuild.currentResult == 'SUCCESS' }
            }
            steps {
                echo '✅ Despliegue simulado. Reemplaza aquí con tu comando real.'
                // Ejemplo real (descomenta y adapta según tu entorno):
                // sh 'pm2 restart ecosystem.config.js'
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
