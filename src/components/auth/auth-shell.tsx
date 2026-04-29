"use client";

import Image from "next/image";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import HydrogenLayout from "@/layouts/hydrogen/layout";
import { useAuth } from "@/components/auth/auth-provider";

function FullscreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f3f0e8] px-6">
      <div className="w-full max-w-sm rounded-[28px] border border-gray-100 bg-white p-8 text-center shadow-sm shadow-gray-100/80">
        <Image
          src="/brand/ntumai-logo-dark.png"
          alt="Ntumai Admin"
          width={180}
          height={52}
          className="mx-auto h-12 w-auto"
          priority
        />
        <div className="mt-5 flex justify-center">
          <span className="inline-flex h-10 w-10 animate-spin rounded-full border-[3px] border-primary/20 border-t-primary" />
        </div>
        <p className="mt-5 text-sm font-medium text-gray-600">
          Preparing your admin workspace…
        </p>
      </div>
    </div>
  );
}

export default function AuthShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isReady, setLastPath } = useAuth();

  const isSignInPage = pathname === "/signin";
  const nextPath =
    typeof window !== "undefined"
      ? `${pathname}${window.location.search}`
      : pathname;

  useEffect(() => {
    if (!isReady) return;
    if (!isSignInPage) {
      setLastPath(nextPath);
    }
  }, [isReady, isSignInPage, nextPath, setLastPath]);

  useEffect(() => {
    if (!isReady) return;

    if (!isAuthenticated && !isSignInPage) {
      router.replace(`/signin?next=${encodeURIComponent(nextPath)}`);
      return;
    }

    if (isAuthenticated && isSignInPage) {
      const next =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("next") || "/"
          : "/";
      router.replace(next);
    }
  }, [isAuthenticated, isReady, isSignInPage, nextPath, router]);

  if (!isReady) return <FullscreenLoader />;

  if (!isAuthenticated && !isSignInPage) return <FullscreenLoader />;

  if (isSignInPage) return <>{children}</>;

  return <HydrogenLayout>{children}</HydrogenLayout>;
}
