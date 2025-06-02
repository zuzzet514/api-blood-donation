pipeline {
    agent any

    environment {
        NODE_ENV = "development"
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

        stage('Pruebas') {
            agent {
                docker {
                    image 'node:18'
                }
            }
            steps {
                sh 'npm test'
            }
        }

        stage('Build imagen Docker') {
            steps {
                sh 'docker build -t api-blood-donation .'
            }
        }

        stage('Despliegue simulado') {
            steps {
                echo '✅ Simulando despliegue de contenedor...'
                sh 'docker run -d -p 3000:3000 --name api-blood-donation api-blood-donation'
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
