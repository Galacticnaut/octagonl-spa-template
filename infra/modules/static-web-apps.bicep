// ──────────────────────────────────────────
// Static Web Apps
// ──────────────────────────────────────────

@description('Resource name prefix')
param prefix string

@description('Azure region')
param location string

@description('GitHub repository URL')
param repositoryUrl string

@description('Branch to deploy')
param branch string

@description('App Insights connection string')
param appInsightsConnectionString string

resource swa 'Microsoft.Web/staticSites@2023-12-01' = {
  name: '${prefix}-swa'
  location: location
  sku: {
    name: 'Standard'
    tier: 'Standard'
  }
  properties: {
    repositoryUrl: repositoryUrl
    branch: branch
    buildProperties: {
      appLocation: '/'
      outputLocation: 'dist'
      skipGithubActionWorkflowGeneration: true
    }
  }
}

resource swaAppSettings 'Microsoft.Web/staticSites/config@2023-12-01' = {
  name: 'appsettings'
  parent: swa
  properties: {
    APPINSIGHTS_CONNECTION_STRING: appInsightsConnectionString
  }
}

output name string = swa.name
output defaultHostname string = swa.properties.defaultHostname
output resourceId string = swa.id
