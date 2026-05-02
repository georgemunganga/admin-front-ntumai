export type AdminSessionUser = {
  id?: string;
  name: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string | null;
  role: string;
  activeRole?: string;
  roles?: string[];
  /** Staff permissions assigned via StaffRole (e.g. ["Read", "Write", "Delete"]) */
  permissions?: string[];
  accessToken?: string;
  refreshToken?: string;
  tokenExpiresAt?: number;
};

export const ADMIN_SESSION_KEY = "ntumai-admin-session";
export const ADMIN_LAST_PATH_KEY = "ntumai-admin-last-path";

export function readStoredAdminSession(): AdminSessionUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(ADMIN_SESSION_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AdminSessionUser;
  } catch {
    window.localStorage.removeItem(ADMIN_SESSION_KEY);
    return null;
  }
}

export function writeStoredAdminSession(session: AdminSessionUser) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
}

export function clearStoredAdminSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ADMIN_SESSION_KEY);
}
