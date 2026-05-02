"use client";

import Link from "next/link";
import { Button, Text, Title } from "rizzui";
import { PiArrowSquareOutBold, PiDesktop } from "react-icons/pi";
import ProfileHeader from "@/components/profile-settings/profile-header";
import ProfileSettingsNav from "@/components/profile-settings/profile-settings-nav";
import FormGroup from "@/components/profile-settings/form-group";
import { useAuth } from "@/components/auth/auth-provider";
import { routes } from "@/config/routes";

export default function PasswordSettingsPage() {
  const { user } = useAuth();

  return (
    <>
      <ProfileHeader
        title={user?.name || "Ntumai Ops"}
        description="Password changes currently use the OTP recovery flow."
      />
      <ProfileSettingsNav />
      <div className="mx-auto w-full max-w-screen-2xl py-8">
        <FormGroup
          title="Password reset"
          description="This admin does not have a dedicated change-password endpoint yet. Use the same OTP reset flow used on sign-in."
        >
          <div className="rounded-2xl border border-gray-200 bg-gray-50/80 p-5">
            <Title as="h3" className="text-base font-semibold text-gray-900">
              Reset via OTP
            </Title>
            <Text className="mt-2 text-sm leading-6 text-gray-500">
              Start the OTP recovery flow with your admin email, confirm the code, then return to sign in with the updated password.
            </Text>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href={routes.auth.forgotPassword1}>
                <Button as="span" className="rounded-2xl bg-primary text-white hover:bg-primary/90">
                  Start OTP Reset
                  <PiArrowSquareOutBold className="ms-1.5 h-4 w-4" />
                </Button>
              </Link>
              <Link href={routes.auth.signIn}>
                <Button as="span" variant="outline" className="rounded-2xl">
                  Back to Sign In
                </Button>
              </Link>
            </div>
          </div>
        </FormGroup>

        <div className="mt-10 border-b border-dashed border-muted pb-6">
          <Title as="h2" className="mb-3 text-xl font-bold text-gray-900">
            Current session context
          </Title>
          <Text className="text-sm text-gray-500">
            We&apos;ll use your current admin identity and OTP flow for password recovery until a dedicated self-service password endpoint is added.
          </Text>
        </div>
        <div className="flex items-center gap-6 border-b border-dashed border-muted py-6">
          <PiDesktop className="h-7 w-7 text-gray-500" />
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Title as="h3" className="text-base font-medium text-gray-900">
                Current admin session
              </Title>
              <Text
                as="span"
                className="relative hidden rounded-md border border-muted py-1.5 pe-2.5 ps-5 text-xs font-semibold text-gray-900 before:absolute before:start-2.5 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full before:bg-green sm:block"
              >
                Active Now
              </Text>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Text className="text-sm text-gray-500">{user?.email || "Admin session"}</Text>
              <span className="hidden h-1 w-1 rounded-full bg-gray-600 sm:block" />
              <Text className="text-sm text-gray-500">{user?.activeRole || user?.role || "admin"}</Text>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
