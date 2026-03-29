import { Configuration, LogLevel } from "@azure/msal-browser";

export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_OIDC_CLIENT_ID,
    authority: import.meta.env.VITE_OIDC_AUTHORITY,
    redirectUri: import.meta.env.VITE_REDIRECT_URI || window.location.origin,
    postLogoutRedirectUri: window.location.origin,
    knownAuthorities: [new URL(import.meta.env.VITE_OIDC_AUTHORITY).hostname],
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      logLevel: LogLevel.Warning,
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        console.log(`[MSAL ${LogLevel[level]}]`, message);
      },
    },
  },
};

export const loginRequest = {
  scopes: ["openid", "profile", "email"],
};

export const apiRequest = {
  scopes: [import.meta.env.VITE_OIDC_API_SCOPE].filter(Boolean),
};
