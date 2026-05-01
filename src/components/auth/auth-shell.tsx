"use client";

import Image from "next/image";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import HydrogenLayout from "@/layouts/hydrogen/layout";
import { useAuth } from "@/components/auth/auth-provider";
import { canAccessAdminPath, isPublicAdminPath } from "@/repositories/admin/admin-permissions";
import { routes } from "@/config/routes";

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
  const { isAuthenticated, isReady, setLastPath, user } = useAuth();

  const nextPath =
    typeof window !== "undefined"
      ? `${pathname}${window.location.search}`
      : pathname;
  const isSignInPage = pathname === routes.auth.signIn;
  const isPublicPath = isPublicAdminPath(pathname);
  const hasRouteAccess = canAccessAdminPath(nextPath, user);

  useEffect(() => {
    if (!isReady) return;
    if (!isPublicPath && hasRouteAccess) {
      setLastPath(nextPath);
    }
  }, [hasRouteAccess, isPublicPath, isReady, nextPath, setLastPath]);

  useEffect(() => {
    if (!isReady) return;

    if (!isAuthenticated && !isPublicPath) {
      router.replace(`/signin?next=${encodeURIComponent(nextPath)}`);
      return;
    }

    if (isAuthenticated && isSignInPage) {
      const next =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("next") || "/"
          : "/";
      router.replace(next);
      return;
    }

    if (isAuthenticated && !isPublicPath && !hasRouteAccess) {
      router.replace(`${routes.accessDenied}?next=${encodeURIComponent(nextPath)}`);
    }
  }, [hasRouteAccess, isAuthenticated, isPublicPath, isReady, isSignInPage, nextPath, router]);

  if (!isReady) return <FullscreenLoader />;

  if (!isAuthenticated && !isPublicPath) return <FullscreenLoader />;

  if (isAuthenticated && !isPublicPath && !hasRouteAccess) {
    return <FullscreenLoader />;
  }

  if (isPublicPath) return <>{children}</>;

  return <HydrogenLayout>{children}</HydrogenLayout>;
}
