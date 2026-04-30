export type AdminSessionUser = {
  name: string;
  email: string;
  role: string;
  apiToken?: string;
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
