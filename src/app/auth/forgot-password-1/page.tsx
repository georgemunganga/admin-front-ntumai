"use client";

import { Text, Title } from "rizzui";
import AuthWrapperSplit from "@/components/auth/auth-wrapper-split";
import ForgotPasswordForm from "@/components/auth/forgot-password-form";
import { PiKeyDuotone } from "react-icons/pi";

export default function ForgotPasswordPage() {
  return (
    <AuthWrapperSplit
      title={<>Reset your password.</>}
      description="Set a new admin password and continue the recovery flow with OTP verification."
      bannerTitle="The simplest way to manage your admin workspace."
      bannerDescription="Reset access and verify ownership without leaving the Ntumai admin authentication flow."
      pageImage={
        <div className="mx-auto max-w-[560px]">
          <div className="rounded-[32px] border border-white/60 bg-white/80 p-8 text-left shadow-sm shadow-gray-200/50">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-[24px] bg-primary text-white">
              <PiKeyDuotone className="h-6 w-6" />
            </div>
            <Title as="h3" className="mt-6 text-[28px] font-bold leading-snug text-gray-900">
              Password recovery
            </Title>
            <Text className="mt-4 leading-[1.85] text-gray-700">
              Choose a new password for the admin account, then confirm the
              change with a one-time password.
            </Text>
          </div>
        </div>
      }
      isSocialLoginActive={false}
    >
      <ForgotPasswordForm />
    </AuthWrapperSplit>
  );
}
