"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type SessionUser = {
  name: string;
  email: string;
  role: string;
};

type AuthContextValue = {
  isAuthenticated: boolean;
  isReady: boolean;
  user: SessionUser | null;
  signIn: (payload: { email: string; password: string }) => string;
  signOut: () => void;
  setLastPath: (path: string) => void;
  getLastPath: () => string;
};

const SESSION_KEY = "ntumai-admin-session";
const LAST_PATH_KEY = "ntumai-admin-last-path";

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredSession(): SessionUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    window.localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setUser(readStoredSession());
    setIsReady(true);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(user),
      isReady,
      user,
      signIn: ({ email }) => {
        const sessionUser = {
          name: "Ntumai Admin",
          email,
          role: "Operations",
        };
        window.localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
        setUser(sessionUser);
        return (
          window.localStorage.getItem(LAST_PATH_KEY) ||
          window.location.search ||
          "/"
        );
      },
      signOut: () => {
        window.localStorage.removeItem(SESSION_KEY);
        setUser(null);
      },
      setLastPath: (path: string) => {
        window.localStorage.setItem(LAST_PATH_KEY, path);
      },
      getLastPath: () => window.localStorage.getItem(LAST_PATH_KEY) || "/",
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
