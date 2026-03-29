# Setup Guide

Step-by-step instructions to configure this template for your Octagonl app.

## 1. Create the GitHub repository

```bash
gh repo create my-org/my-app \
  --template Galacticnaut/octagonl-spa-template \
  --private --clone
cd my-app
git submodule update --init
```

## 2. Register the app in Microsoft Entra External ID

1. Go to **Azure Portal → Microsoft Entra External ID → App registrations**
2. Click **New registration**
   - Name: `my-app-dev`
   - Supported account types: **Accounts in this organizational directory only**
   - Redirect URI: `http://localhost:5173` (type: **SPA**)
3. Copy the **Application (client) ID** → this is your `VITE_OIDC_CLIENT_ID`
4. Under **Authentication**, add the production redirect URI (your SWA hostname)
5. Under **API permissions**, add the Platform API scope

## 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_OIDC_CLIENT_ID=<your-client-id>
VITE_OIDC_AUTHORITY=https://login.octago.nl/<tenant-id>/v2.0
VITE_OIDC_API_SCOPE=api://<platform-api-client-id>/access
VITE_REDIRECT_URI=http://localhost:5173
VITE_PLATFORM_API_BASE_URL=http://localhost:8080
```

## 4. Set up OIDC federation for GitHub Actions

Create a federated credential on your Azure service principal so GitHub Actions can deploy without secrets:

```bash
az ad app federated-credential create \
  --id <service-principal-object-id> \
  --parameters '{
    "name": "my-app-github",
    "issuer": "https://token.actions.githubusercontent.com",
    "subject": "repo:my-org/my-app:ref:refs/heads/main",
    "audiences": ["api://AzureADTokenExchange"]
  }'
```

## 5. Configure GitHub secrets

```bash
gh secret set AZURE_CLIENT_ID --body "<client-id>"
gh secret set AZURE_TENANT_ID --body "<tenant-id>"
gh secret set AZURE_SUBSCRIPTION_ID --body "<subscription-id>"
gh secret set SWA_DEPLOYMENT_TOKEN --body "<swa-token>"
```

## 6. Deploy infrastructure

```bash
# Create resource group
az group create -n rg-octagonl-myapp-dev -l westeurope

# Deploy Bicep
az deployment group create \
  -g rg-octagonl-myapp-dev \
  -f infra/main.bicep \
  -p appName=myapp env=dev
```

## 7. Deploy the app

Push to `main` and the CI/CD pipeline will build and deploy automatically.

```bash
git add -A && git commit -m "Initial app setup" && git push
```

## 8. Verify

- Open the Static Web App URL shown in the Azure portal
- You should be redirected to the Entra External ID login page
- After signing in, you should see the authenticated app shell
