pipeline {
  agent any
  stages {
    stage('build project') {
    
    }
  }
  environment {
    tag = VersionNumber(versionNumberString: '${BUILD_DATE_FORMATTED,"yyyyMMdd"}_${BUILDS_TODAY}')
    REACT_APP_API_BASE_URL = 'http://api.bugbountyautomation.kube.local'
  }
  parameters {
    booleanParam(name: 'FULLBUILD', defaultValue: false, description: 'build and deploy all artifacts regardless of if they changed')
  }
  triggers {
    pollSCM('')
  }
}
