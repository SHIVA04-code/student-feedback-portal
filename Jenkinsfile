pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
  }

  environment {
    IMAGE_NAME = 'student-feedback'
    CONTAINER_NAME = 'student-feedback-portal'
    APP_PORT = '8081'
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Check Docker') {
      steps {
        bat '''
          @echo off
          if not defined DOCKER_CLI (
            echo Set DOCKER_CLI in Jenkins Global Properties to the path of docker.exe.
            exit /b 1
          )
          for %%I in ("%DOCKER_CLI%") do set "DOCKER_CLI_DIR=%%~dpI"
          set "PATH=%DOCKER_CLI_DIR%;%PATH%"
          call "%DOCKER_CLI%" info
          if errorlevel 1 exit /b 1
        '''
      }
    }

    stage('Build image') {
      steps {
        bat '''
          @echo off
          for %%I in ("%DOCKER_CLI%") do set "DOCKER_CLI_DIR=%%~dpI"
          set "PATH=%DOCKER_CLI_DIR%;%PATH%"
          call "%DOCKER_CLI%" build --pull -t %IMAGE_NAME%:latest .
          if errorlevel 1 exit /b 1
        '''
      }
    }

    stage('Deploy locally') {
      when {
        expression {
          env.BRANCH_NAME == 'main' || env.GIT_BRANCH == 'main' || env.GIT_BRANCH == 'origin/main'
        }
      }
      steps {
        bat '''
          @echo off
          for %%I in ("%DOCKER_CLI%") do set "DOCKER_CLI_DIR=%%~dpI"
          set "PATH=%DOCKER_CLI_DIR%;%PATH%"
          call "%DOCKER_CLI%" rm -f "%CONTAINER_NAME%" >NUL 2>&1
          call "%DOCKER_CLI%" run -d --name "%CONTAINER_NAME%" --restart unless-stopped -p %APP_PORT%:80 %IMAGE_NAME%:latest
          if errorlevel 1 exit /b 1
        '''
      }
    }
  }
}
