# Octagonl SPA — Copilot Instructions

This is an Octagonl platform SPA built with React + Vite.

## Authentication Rules
- **Use `oid` claim, NOT `sub`** — stable across all Octagonl apps. Store as `entra_oid`.
- Auth library: `@azure/msal-browser` + `@azure/msal-react`
- No client secret needed (public SPA client)
- MSAL handles token caching and refresh automatically

## Coding Standards
- TypeScript strict mode, Node.js 20, npm
- ESLint flat config, zero warnings (`--max-warnings 0`)
- Prefer named exports, no `any`
- Validate at system boundaries with Zod

## Azure Deployment
- Deploys to Azure Static Web Apps
- OIDC federation for CI/CD — no long-lived credentials
- SPA routing fallback in `staticwebapp.config.json`

## File Locations
- MSAL config: `src/lib/msal-config.ts`
- Auth provider: `src/components/AuthProvider.tsx`
- Auth guard: `src/components/AuthGuard.tsx`
- Platform API client: `src/lib/platform-api.ts`
- Brand tokens: `shared/tailwind-brand.cjs`
- Integration docs: `docs/octagonl-docs/app-integration/`
