"use client";

import { Button, Password, Text, Title } from "rizzui";
import { PiDesktop } from "react-icons/pi";
import ProfileHeader from "@/components/profile-settings/profile-header";
import ProfileSettingsNav from "@/components/profile-settings/profile-settings-nav";
import FormGroup from "@/components/profile-settings/form-group";

export default function PasswordSettingsPage() {
  return (
    <>
      <ProfileHeader title="Ntumai Ops" description="admin@ntumai.com" />
      <ProfileSettingsNav />
      <div className="mx-auto w-full max-w-screen-2xl">
        <div className="space-y-8 py-8">
          <FormGroup title="Current Password">
            <Password placeholder="Enter your password" />
          </FormGroup>
          <FormGroup title="New Password">
            <Password
              placeholder="Enter your password"
              helperText="Your current password must be more than 8 characters"
            />
          </FormGroup>
          <FormGroup title="Confirm New Password">
            <Password placeholder="Enter your password" />
          </FormGroup>
        </div>
        <div className="mt-6 flex w-auto items-center justify-end gap-3">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit" variant="solid">
            Update Password
          </Button>
        </div>

        <div className="mt-10 border-b border-dashed border-muted pb-6">
          <Title as="h2" className="mb-3 text-xl font-bold text-gray-900">
            Where you&apos;re logged in
          </Title>
          <Text className="text-sm text-gray-500">
            We&apos;ll alert you via admin@ntumai.com if there is any unusual activity on your account.
          </Text>
        </div>
        <div className="flex items-center gap-6 border-b border-dashed border-muted py-6">
          <PiDesktop className="h-7 w-7 text-gray-500" />
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Title as="h3" className="text-base font-medium text-gray-900">
                Dispatch workstation
              </Title>
              <Text
                as="span"
                className="relative hidden rounded-md border border-muted py-1.5 pe-2.5 ps-5 text-xs font-semibold text-gray-900 before:absolute before:start-2.5 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full before:bg-green sm:block"
              >
                Active Now
              </Text>
            </div>
            <div className="flex items-center gap-2">
              <Text className="text-sm text-gray-500">Lusaka, Zambia</Text>
              <span className="h-1 w-1 rounded-full bg-gray-600" />
              <Text className="text-sm text-gray-500">29 Apr at 11:20am</Text>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6 py-6">
          <PiDesktop className="h-7 w-7 text-gray-500" />
          <div>
            <Title as="h3" className="mb-2 text-base font-medium text-gray-900">
              Finance review machine
            </Title>
            <div className="flex items-center gap-2">
              <Text className="text-sm text-gray-500">Lusaka, Zambia</Text>
              <span className="h-1 w-1 rounded-full bg-gray-600" />
              <Text className="text-sm text-gray-500">28 Apr at 7:40pm</Text>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
