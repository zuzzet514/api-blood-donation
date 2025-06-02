pipeline {
  agent any

  environment {
    IMAGE_NAME = 'api-blood-donation'
    IMAGE_TAG = 'latest'
    CONTAINER_NAME = 'api-blood-donation-test'
  }

  stages {
    stage('Checkout') {
      steps {
        git url: 'https://github.com/zuzzet514/api-blood-donation.git', branch: 'main'
      }
    }

    stage('Build Docker Image') {
      steps {
        script {
          sh "docker build -t $IMAGE_NAME:$IMAGE_TAG ."
        }
      }
    }

    stage('Run Container (con .env)') {
      steps {
        script {
          // Verifica que el archivo .env esté presente en tu repo
          sh "docker run -d --name $CONTAINER_NAME --env-file .env -p 3000:3000 $IMAGE_NAME:$IMAGE_TAG"
          sh "sleep 5"
          sh "docker ps"
        }
      }
    }
  }

  post {
    always {
      sh "docker rm -f $CONTAINER_NAME || true"
    }
    success {
      echo '✅ Contenedor corriendo exitosamente con .env.'
    }
    failure {
      echo '❌ Hubo un error en el pipeline.'
    }
  }
}
