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
  readStoredAdminSession,
  type AdminSessionUser,
  clearStoredAdminSession,
} from "@/repositories/admin/admin-session";
import {
  loadCurrentAdminUser,
  logoutAdminSession,
  startAdminOtp,
  verifyAdminOtp,
} from "@/repositories/admin/admin-auth";

type AuthContextValue = {
  isAuthenticated: boolean;
  isReady: boolean;
  user: AdminSessionUser | null;
  startSignIn: (payload: { email: string }) => Promise<{ sessionId: string; expiresIn: number }>;
  completeSignIn: (payload: { sessionId: string; otp: string }) => Promise<string>;
  signOut: () => void;
  setLastPath: (path: string) => void;
  getLastPath: () => string;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<AdminSessionUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const session = readStoredAdminSession();
    setUser(session);
    if (!session?.accessToken) {
      setIsReady(true);
      return;
    }

    loadCurrentAdminUser(session)
      .then((nextSession) => {
        if (nextSession) {
          setUser(nextSession);
          return;
        }
        clearStoredAdminSession();
        setUser(null);
      })
      .finally(() => setIsReady(true));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(user),
      isReady,
      user,
      startSignIn: async ({ email }) => {
        const response = await startAdminOtp(email);
        return {
          sessionId: response.sessionId,
          expiresIn: response.expiresIn,
        };
      },
      completeSignIn: async ({ sessionId, otp }) => {
        const sessionUser = await verifyAdminOtp(sessionId, otp);
        setUser(sessionUser);
        return (
          window.localStorage.getItem(ADMIN_LAST_PATH_KEY) ||
          window.location.search ||
          "/"
        );
      },
      signOut: () => {
        logoutAdminSession(user);
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
