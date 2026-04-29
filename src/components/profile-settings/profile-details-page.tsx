"use client";

import Link from "next/link";
import { useState } from "react";
import { Avatar, Button, Checkbox, Input, Select, Text, Textarea, Title } from "rizzui";
import ProfileHeader from "@/components/profile-settings/profile-header";
import ProfileSettingsNav from "@/components/profile-settings/profile-settings-nav";
import FormGroup from "@/components/profile-settings/form-group";
import { routes } from "@/config/routes";

const roleOptions = [
  { label: "Operations Lead", value: "operations" },
  { label: "Dispatch Manager", value: "dispatch" },
  { label: "Support Supervisor", value: "support" },
  { label: "Finance Reviewer", value: "finance" },
];

export default function ProfileDetailsPage() {
  const [role, setRole] = useState("operations");

  return (
    <>
      <ProfileHeader
        title="Ntumai Ops"
        description="Update your photo and personal details."
        action={
          <Link href={routes.profileSettings.profile}>
            <Button as="span">View Profile</Button>
          </Link>
        }
      />
      <ProfileSettingsNav />
      <div className="@container mx-auto mb-10 w-full max-w-screen-2xl">
        <div className="grid gap-7 divide-y divide-dashed divide-gray-200 @2xl:gap-9 @3xl:gap-11">
          <FormGroup title="Username" className="pt-7 @2xl:pt-9 @3xl:pt-11">
            <Input
              className="col-span-full"
              prefix="https://ntumai.com/"
              placeholder="ntumai-ops"
              prefixClassName="relative pe-2.5 before:absolute before:-top-[9px] before:right-0 before:h-[38px] before:w-[1px] before:bg-gray-300"
              defaultValue="ntumai-ops"
            />
          </FormGroup>

          <FormGroup title="Website" className="pt-7 @2xl:pt-9 @3xl:pt-11">
            <Input
              type="url"
              className="col-span-full"
              prefix="https://"
              prefixClassName="relative pe-2.5 before:absolute before:-top-[9px] before:right-0 before:h-[38px] before:w-[1px] before:bg-gray-300"
              placeholder="admin.ntumai.com"
              defaultValue="admin.ntumai.com"
            />
          </FormGroup>

          <FormGroup
            title="Your Photo"
            description="This will be displayed on your profile."
            className="pt-7 @2xl:pt-9 @3xl:pt-11"
          >
            <div className="flex flex-col items-start gap-4 @xl:flex-row">
              <Avatar
                name="Ntumai Ops"
                src="https://isomorphic-furyroad.s3.amazonaws.com/public/avatars/avatar-11.webp"
                className="!h-20 !w-20"
              />
              <div className="flex flex-wrap gap-3">
                <Button variant="outline">Upload new photo</Button>
                <Button variant="text">Remove</Button>
              </div>
            </div>
          </FormGroup>

          <FormGroup title="Your Bio" className="pt-7 @2xl:pt-9 @3xl:pt-11">
            <Textarea
              placeholder="Write a short profile summary"
              defaultValue="Operations admin focused on dispatch, support, and merchant readiness across the Ntumai platform."
              className="[&_textarea]:min-h-[120px]"
            />
          </FormGroup>

          <FormGroup title="Job Title" className="pt-7 @2xl:pt-9 @3xl:pt-11">
            <div className="space-y-3">
              <Select
                dropdownClassName="!z-10 h-auto"
                inPortal={false}
                placeholder="Select Role"
                options={roleOptions}
                onChange={(option: any) => setRole(option)}
                value={role}
                getOptionValue={(option) => option.value}
                displayValue={(selected) =>
                  roleOptions.find((r) => r.value === selected)?.label ?? ""
                }
              />
              <Checkbox label="Show my job title in my profile" defaultChecked />
            </div>
          </FormGroup>

          <FormGroup
            title="Alternative contact email"
            description="Enter an alternative email if you'd like to be contacted via a different email."
            className="pt-7 @2xl:pt-9 @3xl:pt-11"
          >
            <Input type="email" placeholder="ops@ntumai.com" defaultValue="ops@ntumai.com" />
          </FormGroup>

          <FormGroup
            title="Portfolio Projects"
            description="Share a few snippets of your work"
            className="pt-7 @2xl:pt-9 @3xl:pt-11"
          >
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
              <Title as="h4" className="text-base font-semibold text-gray-900">
                Upload operations snapshots
              </Title>
              <Text className="mt-2 text-sm text-gray-500">
                Drag and drop reports, deck screenshots, or process documents here.
              </Text>
              <Button className="mt-4" variant="outline">
                Choose files
              </Button>
            </div>
          </FormGroup>
        </div>
        <div className="mt-8 flex items-center justify-end gap-3">
          <Button variant="outline">Cancel</Button>
          <Button>Save</Button>
        </div>
      </div>
    </>
  );
}
