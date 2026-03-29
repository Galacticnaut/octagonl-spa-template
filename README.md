# Octagonl SPA Template

A React + Vite single-page application template pre-configured with:

- **Microsoft Entra External ID** authentication via MSAL.js (Authorization Code + PKCE)
- **Azure Static Web Apps** deployment
- **Tailwind CSS** with Octagonl brand tokens
- **GitHub Actions** CI/CD with OIDC federation (no long-lived secrets)
- **Copilot instructions** for Octagonl coding standards, auth patterns, and security rules

## Quick start

```bash
# 1. Use this template on GitHub
gh repo create my-org/my-app --template Galacticnaut/octagonl-spa-template --private --clone
cd my-app

# 2. Install dependencies
npm install

# 3. Copy env file and fill in values
cp .env.example .env

# 4. Start dev server
npm run dev
```

## Project structure

```
src/
  main.tsx                 # App entry point
  App.tsx                  # Root component (wrapped in AuthGuard)
  components/
    AuthProvider.tsx        # MSAL provider wrapper
    AuthGuard.tsx           # Redirects unauthenticated users to login
  lib/
    msal-config.ts         # MSAL configuration (reads VITE_OIDC_* env vars)
    platform-api.ts        # Typed client for the Octagonl Platform API
infra/
  main.bicep               # Azure deployment orchestrator
  modules/
    monitoring.bicep        # Log Analytics + App Insights
    static-web-apps.bicep   # Azure Static Web Apps
shared/
  tailwind-brand.js         # Octagonl brand colour tokens
```

## Authentication

This template uses **MSAL.js** with the **Authorization Code + PKCE** flow against Microsoft Entra External ID.

Key rules:
- Use the `oid` claim (not `sub`) as the stable user identity
- `knownAuthorities` must include your Entra External ID tenant hostname
- Tokens are stored in `localStorage` (no cookies, no server-side sessions)

See [SETUP.md](SETUP.md) for app registration instructions.

## Environment variables

| Variable | Description |
|---|---|
| `VITE_OIDC_CLIENT_ID` | Entra External ID app registration client ID |
| `VITE_OIDC_AUTHORITY` | Authority URL, e.g. `https://login.octago.nl/<tenant-id>/v2.0` |
| `VITE_OIDC_API_SCOPE` | API scope for acquiring access tokens |
| `VITE_REDIRECT_URI` | OAuth redirect URI (defaults to `window.location.origin`) |
| `VITE_PLATFORM_API_BASE_URL` | Platform API base URL |

## Deployment

Deployments use GitHub Actions with OIDC federation to Azure (no long-lived secrets).

### Required GitHub secrets

| Secret | Description |
|---|---|
| `AZURE_CLIENT_ID` | Service principal client ID |
| `AZURE_TENANT_ID` | Azure AD tenant ID |
| `AZURE_SUBSCRIPTION_ID` | Azure subscription ID |
| `SWA_DEPLOYMENT_TOKEN` | Static Web Apps deployment token |

### Deploying

Push to `main` triggers the dev deployment. Create a release to trigger prod.

```bash
# Manual infra deployment
az deployment group create \
  -g rg-octagonl-myapp-dev \
  -f infra/main.bicep \
  -p appName=myapp env=dev
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |

## License

Proprietary – Octagonl B.V.
