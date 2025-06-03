pipeline {
  agent any

  tools {
    nodejs 'nodejs' 
  }

  environment {
    DB_URI = 'mongodb+srv://anfecaconcentratda:Password321@cluster0.jxijpiz.mongodb.net/blood_donation_development'
    TEST_DB_URI = 'mongodb+srv://anfecaconcentratda:Password321@cluster0.jxijpiz.mongodb.net/blood_donation_test'
    JWT_SECRET = '353827a985d5c25bf43562fddeacbbd5b542013029df2cc8a4cfd04baec5e0cd'
    JWT_EXPIRES_IN = '20m'
    JWT_REFRESH_SECRET = '939c63387b34d2ec85d1b506b2e69b31aa19d34a84f471b06246454952e043b9918c9fcaafb666ebd89891a17fa971d21daba0adabcabc6fc59fd36c717bed61'
    JWT_REFRESH_EXPIRES_IN = '20d'
  }

  stages {
    stage('Preparar entorno') {
      steps {
        echo "🧹 Limpiando workspace y clonando repositorio..."
        deleteDir()
        git url: 'https://github.com/zuzzet514/api-blood-donation.git', branch: 'main'
      }
    }

    stage('Instalar dependencias') {
      steps {
        echo "📦 Instalando dependencias..."
        sh 'npm install'
      }
    }

    stage('Pruebas unitarias') {
      steps {
        echo "🧪 Ejecutando pruebas unitarias..."
        sh 'npm test tests/unit'
      }
    }

    stage('Pruebas de integración') {
      steps {
        echo "🧪 Ejecutando pruebas de integración (una por una)..."
        sh 'npm test tests/integration/account.integration.test.js -- --detectOpenHandles'
        sh 'npm test tests/integration/auth.integration.test.js -- --detectOpenHandles'
        sh 'npm test tests/integration/bloodRequest.integration.test.js -- --detectOpenHandles --forceExit'
        sh 'npm test tests/integration/contact.integration.test.js -- --detectOpenHandles'
        sh 'npm test tests/integration/donor.integration.test.js -- --detectOpenHandles'
      }
    }
    
    stage('Construir imagen Docker') {
      steps {
        echo "🐳 Construyendo imagen Docker..."
        sh 'docker build -t api-blood-donation .'
      }
    }

    stage('Simular despliegue') {
      steps {
        echo "🚀 Despliegue simulado (imagen construida, lista para subir a DockerHub o correr en servidor)"
      }
    }
  }
  post {
    failure {
      echo '❌ Falló alguna etapa del pipeline.'
    }
    success {
      echo '✅ Pipeline ejecutado exitosamente.'
    }
  }
}
