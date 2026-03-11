param appName string = 'mycrm'
param location string = resourceGroup().location
param containerImage string
param sqlAdministratorLogin string
param sqlAdministratorObjectId string
param sqlAdministratorTenantId string = tenant().tenantId
param registryServer string = ''
param registryUsername string = ''
@secure()
param registryPassword string = ''
param containerPort int = 3000
param cpu int = 1
param memory string = '2Gi'
param environmentVariables array = []
param tags object = {}

var logAnalyticsWorkspaceName = 'law-${appName}'
var applicationInsightsName = 'appi-${appName}'
var managedEnvironmentName = 'cae-${appName}'
var containerAppName = 'ca-${appName}'
var appConfigurationName = take('appcs-${appName}-${uniqueString(resourceGroup().id)}', 50)
var normalizedAppName = toLower(replace(appName, '-', ''))
var keyVaultName = take('kv${normalizedAppName}${uniqueString(subscription().id, resourceGroup().id)}', 24)
var sqlServerName = take('sql-${normalizedAppName}-${uniqueString(resourceGroup().id)}', 63)
var sqlDatabaseName = 'sqldb-${appName}'
var databaseUrl = 'sqlserver://${sqlServer.properties.fullyQualifiedDomainName}:1433;database=${sqlDatabase.name};encrypt=true;trustServerCertificate=false;authentication=DefaultAzureCredential'
var hasRegistryCredentials = !empty(registryServer) && !empty(registryUsername) && !empty(registryPassword)
var appConfigDataReaderRoleDefinitionId = subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '516239f1-63e1-4d78-a4de-a74fb236a071')
var keyVaultSecretsUserRoleDefinitionId = subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '4633458b-17de-408a-b874-0445c86b69e6')

resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: logAnalyticsWorkspaceName
  location: location
  tags: tags
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
  }
}

resource applicationInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: applicationInsightsName
  location: location
  kind: 'web'
  tags: tags
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalyticsWorkspace.id
  }
}

resource appConfiguration 'Microsoft.AppConfiguration/configurationStores@2024-05-01' = {
  name: appConfigurationName
  location: location
  tags: tags
  sku: {
    name: 'standard'
  }
  properties: {
    disableLocalAuth: true
    publicNetworkAccess: 'Enabled'
    softDeleteRetentionInDays: 7
  }
}

resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: keyVaultName
  location: location
  tags: tags
  properties: {
    tenantId: tenant().tenantId
    sku: {
      family: 'A'
      name: 'standard'
    }
    enableRbacAuthorization: true
    enablePurgeProtection: true
    publicNetworkAccess: 'Enabled'
    softDeleteRetentionInDays: 90
  }
}

resource sqlServer 'Microsoft.Sql/servers@2023-08-01-preview' = {
  name: sqlServerName
  location: location
  tags: tags
  properties: {
    administrators: {
      administratorType: 'ActiveDirectory'
      azureADOnlyAuthentication: true
      login: sqlAdministratorLogin
      sid: sqlAdministratorObjectId
      tenantId: sqlAdministratorTenantId
    }
    publicNetworkAccess: 'Enabled'
    restrictOutboundNetworkAccess: 'Disabled'
    version: '12.0'
  }
}

resource sqlServerFirewallAllowAzure 'Microsoft.Sql/servers/firewallRules@2023-08-01-preview' = {
  parent: sqlServer
  name: 'AllowAzureServices'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}

resource sqlDatabase 'Microsoft.Sql/servers/databases@2023-08-01-preview' = {
  parent: sqlServer
  name: sqlDatabaseName
  location: location
  tags: tags
  sku: {
    name: 'GP_S_Gen5_1'
    tier: 'GeneralPurpose'
    family: 'Gen5'
    capacity: 1
  }
  properties: {
    autoPauseDelay: 60
    requestedBackupStorageRedundancy: 'Local'
    zoneRedundant: false
  }
}

resource managedEnvironment 'Microsoft.App/managedEnvironments@2024-03-01' = {
  name: managedEnvironmentName
  location: location
  tags: tags
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalyticsWorkspace.properties.customerId
        sharedKey: logAnalyticsWorkspace.listKeys().primarySharedKey
      }
    }
  }
}

resource containerApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: containerAppName
  location: location
  tags: tags
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    managedEnvironmentId: managedEnvironment.id
    configuration: {
      registries: hasRegistryCredentials
        ? [
            {
              server: registryServer
              username: registryUsername
              passwordSecretRef: 'container-registry-password'
            }
          ]
        : []
      secrets: hasRegistryCredentials
        ? [
            {
              name: 'container-registry-password'
              value: registryPassword
            }
          ]
        : []
      ingress: {
        external: true
        targetPort: containerPort
        transport: 'auto'
      }
    }
    template: {
      containers: [
        {
          name: 'web'
          image: containerImage
          env: concat(
            [
              {
                name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
                value: applicationInsights.properties.ConnectionString
              }
              {
                name: 'AZURE_APPCONFIG_ENDPOINT'
                value: appConfiguration.properties.endpoint
              }
              {
                name: 'AZURE_KEY_VAULT_URI'
                value: keyVault.properties.vaultUri
              }
              {
                name: 'AZURE_SQL_SERVER_FQDN'
                value: sqlServer.properties.fullyQualifiedDomainName
              }
              {
                name: 'AZURE_SQL_DATABASE_NAME'
                value: sqlDatabase.name
              }
              {
                name: 'DATABASE_URL'
                value: databaseUrl
              }
              {
                name: 'CRM_DATA_SOURCE'
                value: 'prisma'
              }
            ],
            environmentVariables
          )
          resources: {
            cpu: cpu
            memory: memory
          }
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 3
      }
    }
  }
}

resource appConfigurationDataReaderAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(appConfiguration.id, containerApp.name, appConfigDataReaderRoleDefinitionId)
  scope: appConfiguration
  properties: {
    principalId: containerApp.identity.principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: appConfigDataReaderRoleDefinitionId
  }
}

resource keyVaultSecretsUserAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(keyVault.id, containerApp.name, keyVaultSecretsUserRoleDefinitionId)
  scope: keyVault
  properties: {
    principalId: containerApp.identity.principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: keyVaultSecretsUserRoleDefinitionId
  }
}

output containerAppName string = containerApp.name
output containerAppFqdn string = containerApp.properties.configuration.ingress.fqdn
output managedIdentityPrincipalId string = containerApp.identity.principalId
output appConfigurationEndpoint string = appConfiguration.properties.endpoint
output keyVaultUri string = keyVault.properties.vaultUri
output sqlServerName string = sqlServer.name
output sqlServerFqdn string = sqlServer.properties.fullyQualifiedDomainName
output sqlDatabaseName string = sqlDatabase.name
