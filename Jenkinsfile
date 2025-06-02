pipeline {
    agent {
        docker {
            image 'node:18'
        }
    }

    environment {
        NODE_ENV = "development"
    }

    stages {
        stage('Instalar dependencias') {
            steps {
                sh 'npm install'
            }
        }

        stage('Ejecutar pruebas') {
            steps {
                sh 'npm test'
            }
        }

        stage('Despliegue') {
            when {
                expression {
                    return currentBuild.result == null || currentBuild.result == 'SUCCESS'
                }
            }
            steps {
                echo '✅ Despliegue simulado. Puedes reemplazar esto por PM2, Docker, o lo que necesites.'
                // Ejemplo real:
                // sh 'pm2 restart ecosystem.config.js'
            }
        }
    }

    post {
        success {
            echo '✅ CI/CD ejecutado con éxito.'
        }
        failure {
            echo '❌ Las pruebas fallaron. No se desplegó.'
        }
    }
}
