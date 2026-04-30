"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ADMIN_LAST_PATH_KEY,
  ADMIN_SESSION_KEY,
  readStoredAdminSession,
  type AdminSessionUser,
} from "@/repositories/admin/admin-session";

type AuthContextValue = {
  isAuthenticated: boolean;
  isReady: boolean;
  user: AdminSessionUser | null;
  signIn: (payload: { email: string; password: string; apiToken?: string }) => string;
  signOut: () => void;
  setLastPath: (path: string) => void;
  getLastPath: () => string;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<AdminSessionUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setUser(readStoredAdminSession());
    setIsReady(true);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(user),
      isReady,
      user,
      signIn: ({ email, apiToken }) => {
        const sessionUser = {
          name: "Ntumai Admin",
          email,
          role: "Operations",
          apiToken: apiToken?.trim() || undefined,
        };
        window.localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionUser));
        setUser(sessionUser);
        return (
          window.localStorage.getItem(ADMIN_LAST_PATH_KEY) ||
          window.location.search ||
          "/"
        );
      },
      signOut: () => {
        window.localStorage.removeItem(ADMIN_SESSION_KEY);
        setUser(null);
      },
      setLastPath: (path: string) => {
        window.localStorage.setItem(ADMIN_LAST_PATH_KEY, path);
      },
      getLastPath: () => window.localStorage.getItem(ADMIN_LAST_PATH_KEY) || "/",
    }),
    [isReady, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
