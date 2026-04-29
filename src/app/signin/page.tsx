"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Checkbox, Input, Password, Text, Title } from "rizzui";
import { useMedia } from "@/hooks/use-media";
import { useAuth } from "@/components/auth/auth-provider";
import AuthWrapperSplit from "@/components/auth/auth-wrapper-split";
import { routes } from "@/config/routes";
import { PiArrowBendUpRightBold, PiShieldCheckeredDuotone } from "react-icons/pi";

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
          Welcome back. Sign in to run Ntumai delivery operations.
        </>
      }
      description="Return to the exact page you were working on and continue inside the Ntumai admin workspace."
      bannerTitle="The simplest way to manage your admin workspace."
      bannerDescription="Use one admin surface for operations, support, dispatch, finance, and merchant activity across Ntumai."
      pageImage={
        <div className="mx-auto max-w-[560px]">
          <div className="rounded-[32px] border border-white/60 bg-white/80 p-8 text-left shadow-sm shadow-gray-200/50">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-[24px] bg-primary text-white">
              <PiShieldCheckeredDuotone className="h-6 w-6" />
            </div>
            <Title as="h3" className="mt-6 text-[28px] font-bold leading-snug text-gray-900">
              Ntumai Admin
            </Title>
            <Text className="mt-4 leading-[1.85] text-gray-700">
              Sign in to continue managing the platform from a single control
              surface. The last page you were working on will be restored after
              authentication.
            </Text>
            <div className="mt-8 rounded-[24px] bg-primary/10 p-5">
              <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Resume target
              </Text>
              <div className="mt-3 flex items-start gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-primary text-white">
                  <PiArrowBendUpRightBold className="h-4 w-4" />
                </span>
                <div>
                  <Title as="h4" className="text-xl font-bold text-gray-900">
                    {next}
                  </Title>
                  <Text className="mt-1 text-sm leading-7 text-gray-700">
                    You will continue from the route you last opened.
                  </Text>
                </div>
              </div>
            </div>
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
          <Link
            href={routes.auth.forgotPassword1}
            className="text-sm font-semibold text-gray-500 transition-colors hover:text-primary"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          className="h-11 w-full rounded-2xl !bg-primary !text-white font-semibold"
          type="submit"
          size={isMedium ? "lg" : "xl"}
          isLoading={isSubmitting}
        >
          Sign In
        </Button>
      </form>
    </AuthWrapperSplit>
  );
}
