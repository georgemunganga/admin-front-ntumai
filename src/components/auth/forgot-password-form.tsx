"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Password, Text } from "rizzui";
import { useMedia } from "@/hooks/use-media";
import { routes } from "@/config/routes";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const isMedium = useMedia("(max-width: 1200px)", false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const params = new URLSearchParams({ email });
    router.push(`${routes.auth.otp1}?${params.toString()}`);
  };

  return (
    <>
      <form className="space-y-6 pt-1.5" onSubmit={handleSubmit}>
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
        <Password
          label="Confirm Password"
          placeholder="Enter confirm password"
          size={isMedium ? "lg" : "xl"}
          className="[&>label>span]:font-medium"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />
        <Button
          className="h-11 w-full rounded-2xl !bg-primary !text-white font-semibold"
          type="submit"
          size={isMedium ? "lg" : "xl"}
          isLoading={isSubmitting}
        >
          Reset Password
        </Button>
      </form>
      <Text className="mt-6 text-center text-[15px] leading-loose text-gray-500 lg:mt-8 lg:text-start xl:text-base">
        Don&apos;t want to reset your password?{" "}
        <Link
          href={routes.auth.signIn}
          className="font-bold text-gray-700 transition-colors hover:text-primary"
        >
          Sign In
        </Link>
      </Text>
    </>
  );
}
