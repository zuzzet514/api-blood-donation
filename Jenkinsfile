pipeline {
    agent any

    environment {
        NODE_ENV = "development"
    }

    stages {
        stage('Clonar repositorio privado') {
            steps {
                git credentialsId: 'github-creds', url: 'https://github.com/zuzzet514/api-blood-donation.git', branch: 'main'
            }
        }

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
                echo '✅ Pruebas exitosas. Desplegando...'
                // Aquí tu comando real de despliegue, por ejemplo:
                sh 'echo Despliegue simulado'
            }
        }
    }

    post {
        failure {
            echo '❌ Las pruebas fallaron. No se realizó el despliegue.'
        }
        success {
            echo '✅ Despliegue finalizado con éxito.'
        }
    }
}
