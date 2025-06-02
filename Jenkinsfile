pipeline {
    agent any

    environment {
        NODE_ENV = 'development'
    }

    stages {
        stage('Instalar dependencias') {
            agent {
                docker {
                    image 'node:18'
                }
            }
            steps {
                sh 'npm install'
            }
        }

        stage('Ejecutar pruebas') {
            agent {
                docker {
                    image 'node:18'
                }
            }
            steps {
                sh 'npm test'
            }
        }

        stage('Construir imagen Docker') {
            steps {
                sh 'docker build -t api-blood-donation .'
            }
        }

        stage('Despliegue simulado') {
            steps {
                echo '🚀 Simulando despliegue del contenedor...'
                sh 'docker run -d -p 3000:3000 --name api-blood-donation api-blood-donation || echo "Ya está corriendo o falló la simulación"'
            }
        }
    }

    post {
        success {
            echo '✅ CI/CD finalizó con éxito.'
        }
        failure {
            echo '❌ Falló alguna etapa del pipeline.'
        }
    }
}
