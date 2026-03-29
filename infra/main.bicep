// ──────────────────────────────────────────────────────────
// Octagonl SPA Template – Azure Static Web Apps + Monitoring
// ──────────────────────────────────────────────────────────
targetScope = 'resourceGroup'

@description('Short app identifier (lowercase, no spaces)')
param appName string

@description('Environment: dev | prod')
@allowed(['dev', 'prod'])
param env string

@description('Azure region for resources')
param location string = resourceGroup().location

@description('GitHub repository URL for Static Web Apps deployment')
param repositoryUrl string = ''

@description('Branch to deploy')
param branch string = 'main'

var prefix = '${appName}-${env}'

// ── Monitoring ─────────────────────────────────────
module monitoring './modules/monitoring.bicep' = {
  name: '${prefix}-monitoring'
  params: {
    prefix: prefix
    location: location
  }
}

// ── Static Web App ─────────────────────────────────
module swa './modules/static-web-apps.bicep' = {
  name: '${prefix}-swa'
  params: {
    prefix: prefix
    location: location
    repositoryUrl: repositoryUrl
    branch: branch
    appInsightsConnectionString: monitoring.outputs.appInsightsConnectionString
  }
}

// ── Outputs ────────────────────────────────────────
output staticWebAppName string = swa.outputs.name
output staticWebAppDefaultHostname string = swa.outputs.defaultHostname
output logAnalyticsWorkspaceId string = monitoring.outputs.workspaceId
output appInsightsName string = monitoring.outputs.appInsightsName
