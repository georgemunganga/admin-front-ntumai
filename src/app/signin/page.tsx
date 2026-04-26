"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button, Checkbox, Input, Password, Text, Title } from "rizzui";
import { useMedia } from "@/hooks/use-media";
import { useAuth } from "@/components/auth/auth-provider";
import AuthWrapperSplit from "@/components/auth/auth-wrapper-split";
import { PiShieldCheckeredDuotone } from "react-icons/pi";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMedium = useMedia("(max-width: 1200px)", false);
  const { signIn, getLastPath } = useAuth();

  const next = useMemo(
    () => searchParams.get("next") || getLastPath() || "/",
    [getLastPath, searchParams],
  );

  const [email, setEmail] = useState("admin@ntumai.com");
  const [password, setPassword] = useState("password123");
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    signIn({ email, password });
    router.replace(next);
  };

  return (
    <AuthWrapperSplit
      title={
        <>
          Welcome back. Sign in to continue running the admin workspace.
        </>
      }
      description="By signing in, you return to the exact area you were working on, with the current UI-first admin structure preserved until real backend auth is wired."
      bannerTitle="The simplest way to manage your workspace."
      bannerDescription="Use one control surface for operations, support, catalog, growth, and dispatch review without losing context between sessions."
      pageImage={
        <div className="mx-auto grid max-w-2xl gap-5 md:grid-cols-2">
          <div className="rounded-[28px] border border-white/40 bg-white/70 p-6 text-left shadow-sm shadow-gray-200/50">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-900 text-white">
              <PiShieldCheckeredDuotone className="h-5 w-5" />
            </div>
            <Title as="h3" className="mt-5 text-2xl font-semibold">
              Resume instantly
            </Title>
            <Text className="mt-3 text-sm leading-7 text-gray-600">
              Sign back in and continue from the exact path you were handling:
              orders, dispatch, support, vendors, or settings.
            </Text>
          </div>
          <div className="rounded-[28px] bg-gray-900 p-6 text-left text-white shadow-sm shadow-gray-300/30">
            <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
              Current destination
            </Text>
            <Title as="h3" className="mt-5 text-2xl font-semibold text-white">
              {next}
            </Title>
            <Text className="mt-3 text-sm leading-7 text-white/70">
              The auth shell stores your last working page and restores that path
              immediately after sign-in.
            </Text>
          </div>
          <div className="rounded-[28px] bg-[#d8e4dc] p-6 text-left md:col-span-2">
            <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
              Why this layout
            </Text>
            <Text className="mt-3 text-sm leading-7 text-gray-700">
              This screen intentionally reuses the template’s split auth rhythm
              from the `sign-up-1` family, so the login experience already feels
              like part of the system instead of a temporary side page.
            </Text>
          </div>
        </div>
      }
      isSocialLoginActive={false}
    >
      <form className="space-y-5 lg:space-y-6" onSubmit={handleSubmit}>
        <Input
          type="email"
          size={isMedium ? "lg" : "xl"}
          label="Email"
          placeholder="Enter your email"
          className="[&>label>span]:font-medium"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Password
          label="Password"
          placeholder="Enter your password"
          size={isMedium ? "lg" : "xl"}
          className="[&>label>span]:font-medium"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <div className="flex items-center justify-between pb-1">
          <Checkbox
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
            label="Remember Me"
            className="[&>label>span]:font-medium"
          />
          <span className="text-sm font-semibold text-gray-500">
            Resume path: {next}
          </span>
        </div>

        <Button
          className="w-full"
          type="submit"
          size={isMedium ? "lg" : "xl"}
          isLoading={isSubmitting}
        >
          Sign In
        </Button>
      </form>

      <Text className="mt-6 text-center text-[15px] leading-loose text-gray-500 md:mt-7 lg:mt-9 lg:text-base">
        Access is provisioned by platform admins.{" "}
        <Link
          href="/"
          className="font-semibold text-gray-700 transition-colors hover:text-primary"
        >
          Return home
        </Link>
      </Text>
    </AuthWrapperSplit>
  );
}
