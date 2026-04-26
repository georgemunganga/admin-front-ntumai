"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button, Checkbox, Input, Password, Text, Title } from "rizzui";
import { useMedia } from "@/hooks/use-media";
import { useAuth } from "@/components/auth/auth-provider";
import AuthWrapperSplit from "@/components/auth/auth-wrapper-split";
import {
  PiArrowBendUpRightBold,
  PiMapPinLineDuotone,
  PiShieldCheckeredDuotone,
  PiTruckDuotone,
  PiUsersThreeDuotone,
  PiWarningCircleDuotone,
} from "react-icons/pi";

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
      description="Return to the exact page you were working on and keep managing orders, couriers, vendors, dispatch pressure, and support escalations from one control surface."
      bannerTitle="A modern operations desk for on-demand deliveries."
      bannerDescription="Ntumai behaves more like a DoorDash or Uber-style delivery network, so the admin experience should feel like live city operations, not a generic back office."
      pageImage={
        <div className="mx-auto grid max-w-2xl gap-5">
          <div className="rounded-[30px] bg-gray-900 p-6 text-left text-white shadow-sm shadow-gray-300/30">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                  Live dispatch pulse
                </Text>
                <Title as="h3" className="mt-4 text-3xl font-semibold text-white">
                  214 active deliveries
                </Title>
              </div>
              <span className="inline-flex items-center rounded-2xl bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/75">
                Lusaka live
              </span>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-[22px] border border-white/10 bg-white/10 p-4">
                <PiTruckDuotone className="h-5 w-5 text-white/75" />
                <Text className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
                  Drivers online
                </Text>
                <Title as="h4" className="mt-2 text-2xl font-semibold text-white">
                  326
                </Title>
              </div>
              <div className="rounded-[22px] border border-white/10 bg-white/10 p-4">
                <PiWarningCircleDuotone className="h-5 w-5 text-white/75" />
                <Text className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
                  Delayed orders
                </Text>
                <Title as="h4" className="mt-2 text-2xl font-semibold text-white">
                  18
                </Title>
              </div>
              <div className="rounded-[22px] border border-white/10 bg-white/10 p-4">
                <PiUsersThreeDuotone className="h-5 w-5 text-white/75" />
                <Text className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
                  Support queue
                </Text>
                <Title as="h4" className="mt-2 text-2xl font-semibold text-white">
                  41
                </Title>
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[28px] border border-white/40 bg-white/75 p-6 text-left shadow-sm shadow-gray-200/50">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#dde6de] text-gray-900">
                  <PiMapPinLineDuotone className="h-5 w-5" />
                </span>
                <div>
                  <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                    Zone health
                  </Text>
                  <Title as="h3" className="mt-1 text-xl font-semibold">
                    City operations overview
                  </Title>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {[
                  ["Lusaka Central", "Healthy load", "82 active drops"],
                  ["Woodlands", "Driver pressure", "6 deliveries at risk"],
                  ["Roma", "Stable handoff", "34 live errands"],
                ].map(([zone, status, volume]) => (
                  <div
                    key={zone}
                    className="flex items-center justify-between rounded-[20px] border border-gray-100 bg-[#f7f4ee] px-4 py-3"
                  >
                    <div>
                      <Text className="font-semibold text-gray-900">{zone}</Text>
                      <Text className="mt-1 text-sm text-gray-500">{volume}</Text>
                    </div>
                    <span className="rounded-2xl bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-gray-600">
                      {status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] bg-[#d8e4dc] p-6 text-left">
              <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                Resume target
              </Text>
              <Title as="h3" className="mt-4 text-2xl font-semibold text-gray-900">
                {next}
              </Title>
              <Text className="mt-3 text-sm leading-7 text-gray-700">
                Once you sign in, the admin shell returns you straight to the
                route you were handling.
              </Text>
              <div className="mt-6 rounded-[22px] border border-white/50 bg-white/55 p-4">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-gray-900 text-white">
                    <PiArrowBendUpRightBold className="h-4 w-4" />
                  </span>
                  <div>
                    <Text className="font-semibold text-gray-900">
                      Continue without losing context
                    </Text>
                    <Text className="mt-1 text-sm leading-6 text-gray-600">
                      Orders, couriers, partners, and support views stay part of
                      the same flow.
                    </Text>
                  </div>
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
          <span className="text-sm font-semibold text-gray-500">
            Resume path: {next}
          </span>
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
