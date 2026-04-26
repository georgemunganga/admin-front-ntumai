"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button, Checkbox, Input, Password, Text } from "rizzui";
import { useMedia } from "@/hooks/use-media";
import { useAuth } from "@/components/auth/auth-provider";
import AuthWrapperFour from "@/components/auth/auth-wrapper-four";

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
    <AuthWrapperFour
      title={
        <>
          Welcome Back! <br /> Sign in with your credentials.
        </>
      }
      isSignIn
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
    </AuthWrapperFour>
  );
}
