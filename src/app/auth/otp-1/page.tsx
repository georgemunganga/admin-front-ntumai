"use client";

import Image from "next/image";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Text } from "rizzui";
import AuthWrapperSplit from "@/components/auth/auth-wrapper-split";
import OtpForm from "@/components/auth/otp-form";

export default function OtpPage() {
  const searchParams = useSearchParams();
  const email = useMemo(() => searchParams.get("email") || "your email", [searchParams]);

  return (
    <AuthWrapperSplit
      title={<>Enter your OTP.</>}
      description="Confirm the password reset with the one-time password sent to your inbox."
      bannerTitle="The simplest way to manage your admin workspace."
      bannerDescription="Verification is the final step before restoring access to Ntumai admin."
      pageImage={
        <div className="mx-auto max-w-[560px]">
          <div className="overflow-hidden rounded-[32px] border border-white/60 bg-white/80 p-6 shadow-sm shadow-gray-200/50">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[24px]">
              <Image
                src="/brand/ntumai-logo-light.png"
                alt="Ntumai verification"
                fill
                priority
                className="object-contain bg-primary/90 p-10"
              />
            </div>
          </div>
        </div>
      }
      isSocialLoginActive={false}
    >
      <Text className="-mt-1 mb-9 text-center text-[15px] leading-[1.85] text-gray-700 md:text-base md:!leading-loose lg:text-start xl:-mt-6">
        We have sent you One Time Password to <span className="font-semibold text-gray-900">{email}</span>.
      </Text>
      <OtpForm />
    </AuthWrapperSplit>
  );
}
