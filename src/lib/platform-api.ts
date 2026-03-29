const API_BASE_URL = import.meta.env.VITE_PLATFORM_API_BASE_URL || "http://localhost:8080";

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function apiRequest<T>(
  path: string,
  accessToken: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...(init?.headers as Record<string, string>),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(
      res.status,
      (body as Record<string, string>).error || res.statusText,
    );
  }
  return res.json() as Promise<T>;
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
}
export interface Tenant {
  id: string;
  name: string;
  slug: string;
  role: string;
}
export interface Membership {
  id: string;
  tenantId: string;
  tenantName: string;
  role: string;
}

export const platformApi = {
  getMe: (token: string) => apiRequest<User>("/v1/me", token),
  getMemberships: (token: string) =>
    apiRequest<Membership[]>("/v1/me/memberships", token),
  createTenant: (token: string, data: { name: string; slug: string }) =>
    apiRequest<Tenant>("/v1/tenants", token, {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
