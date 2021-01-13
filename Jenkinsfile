pipeline {
  agent any
  stages {
    stage('build project') {
      parallel {
        stage('build backend') {
          when {
            anyOf {
              changeset '/**'
              expression {
                params.FULLBUILD
              }

            }

          }
          steps {
            dir(path: 'backend') {
              sh 'pnpm install --production'
            }

          }
        }

      }
    }

  }
  environment {
    tag = VersionNumber(versionNumberString: '${BUILD_DATE_FORMATTED,"yyyyMMdd"}_${BUILDS_TODAY}')
  }
  parameters {
    booleanParam(name: 'FULLBUILD', defaultValue: false, description: 'build and deploy all artifacts regardless of if they changed')
  }
  triggers {
    pollSCM('')
  }
}