"use client";

import {
  clearStoredAdminSession,
  readStoredAdminSession,
  type AdminSessionUser,
  writeStoredAdminSession,
} from "@/repositories/admin/admin-session";

const DEFAULT_API_BASE_URL = "https://api.ntumai.com";

function getAuthApiBaseUrl() {
  return process.env.NEXT_PUBLIC_NTUMAI_API_BASE_URL || DEFAULT_API_BASE_URL;
}

type ApiEnvelope<T> = {
  success?: boolean;
  data?: T;
};

type ApiErrorEnvelope = {
  error?: {
    message?: string | string[];
  };
};

type AuthStartPayload = {
  sessionId: string;
  expiresIn: number;
  flowType: "login" | "signup";
  channelsSent: string[];
};

type AuthVerifyPayload = {
  flowType: "login" | "signup";
  requiresRoleSelection: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  user: {
    id: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    activeRole?: string;
    roles?: string[];
  };
};

type AuthMePayload = {
  user: {
    id: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    activeRole?: string;
    roles?: string[];
    /** Staff permissions returned from the backend StaffRole assignment */
    permissions?: string[];
  };
};

type AuthRefreshPayload = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

async function parseJson<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as T;
  return payload;
}

async function getApiErrorMessage(
  response: Response,
  fallback: string,
): Promise<string> {
  try {
    const payload = await parseJson<ApiErrorEnvelope>(response);
    const message = payload.error?.message;
    if (Array.isArray(message)) {
      return message.join(", ");
    }
    if (typeof message === "string" && message.trim().length > 0) {
      return message;
    }
  } catch {
    // Fall through to the provided fallback message.
  }

  return fallback;
}

export async function startAdminOtp(email: string) {
  const response = await fetch(`${getAuthApiBaseUrl()}/api/v1/auth/admin/otp/start`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response, "Failed to send the sign-in code."));
  }

  const payload = await parseJson<ApiEnvelope<AuthStartPayload>>(response);
  if (!payload.data?.sessionId) {
    throw new Error("The sign-in response did not include an OTP session.");
  }

  return payload.data;
}

export async function verifyAdminOtp(sessionId: string, otp: string) {
  const response = await fetch(`${getAuthApiBaseUrl()}/api/v1/auth/admin/otp/verify`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sessionId, otp }),
  });

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response, "The OTP code is invalid or expired."));
  }

  const payload = await parseJson<ApiEnvelope<AuthVerifyPayload>>(response);
  const data = payload.data;
  if (!data?.accessToken || !data.refreshToken || !data.user) {
    throw new Error("The auth response is missing staff session tokens.");
  }
  if (data.requiresRoleSelection) {
    throw new Error("This account is not ready for staff admin access.");
  }
  if (String(data.user.role || "").toLowerCase() !== "admin") {
    throw new Error("This account does not have staff admin access.");
  }

  const session = toStoredSession(data.user, data.accessToken, data.refreshToken, data.expiresIn ?? 3600);
  writeStoredAdminSession(session);
  return session;
}

export async function refreshAdminSession(session = readStoredAdminSession()) {
  if (!session?.refreshToken) return null;

  const response = await fetch(`${getAuthApiBaseUrl()}/api/v1/auth/admin/refresh`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken: session.refreshToken }),
  });

  if (!response.ok) {
    clearStoredAdminSession();
    throw new Error(await getApiErrorMessage(response, "Your admin session has expired. Please sign in again."));
  }

  const payload = await parseJson<ApiEnvelope<AuthRefreshPayload>>(response);
  if (!payload.data?.accessToken || !payload.data.refreshToken) {
    clearStoredAdminSession();
    throw new Error("Failed to refresh the admin session.");
  }

  const nextSession: AdminSessionUser = {
    ...session,
    accessToken: payload.data.accessToken,
    refreshToken: payload.data.refreshToken,
    tokenExpiresAt: Date.now() + payload.data.expiresIn * 1000,
  };
  writeStoredAdminSession(nextSession);
  return nextSession;
}

export async function loadCurrentAdminUser(session = readStoredAdminSession()) {
  if (!session?.accessToken) return null;
  if (session.tokenExpiresAt && session.tokenExpiresAt <= Date.now() + 30_000) {
    session = await refreshAdminSession(session);
    if (!session?.accessToken) return null;
  }

  const response = await fetch(`${getAuthApiBaseUrl()}/api/v1/auth/admin/me`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  const payload = await parseJson<ApiEnvelope<AuthMePayload>>(response);
  const user = payload.data?.user;
  if (!user) return null;

  const nextSession: AdminSessionUser = {
    ...session,
    id: user.id,
    name: [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || session.name,
    email: user.email || session.email,
    role: user.role || session.role,
    activeRole: user.activeRole || session.activeRole,
    roles: user.roles || session.roles,
    // Persist staff permissions returned by the backend StaffRole assignment
    permissions: user.permissions ?? session.permissions ?? [],
  };
  writeStoredAdminSession(nextSession);
  return nextSession;
}

export async function logoutAdminSession(session = readStoredAdminSession()) {
  if (session?.refreshToken) {
    await fetch(`${getAuthApiBaseUrl()}/api/v1/auth/admin/logout`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken: session.refreshToken }),
    }).catch(() => undefined);
  }

  clearStoredAdminSession();
}

function toStoredSession(
  user: AuthVerifyPayload["user"],
  accessToken: string,
  refreshToken: string,
  expiresIn: number,
): AdminSessionUser {
  return {
    id: user.id,
    name: [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || user.email || "Ntumai Admin",
    email: user.email || "",
    role: user.role || "admin",
    activeRole: user.activeRole || user.role || "admin",
    roles: user.roles || [user.role || "admin"],
    permissions: [],
    accessToken,
    refreshToken,
    tokenExpiresAt: Date.now() + expiresIn * 1000,
  };
}
