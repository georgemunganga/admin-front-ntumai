"use client";

import { useEffect, useMemo, useState } from "react";
import { Avatar, Button, Input, Text, Title } from "rizzui";
import ProfileHeader from "@/components/profile-settings/profile-header";
import ProfileSettingsNav from "@/components/profile-settings/profile-settings-nav";
import FormGroup from "@/components/profile-settings/form-group";
import { useAuth } from "@/components/auth/auth-provider";
import { updateAdminProfile } from "@/repositories/admin/profile-settings";

type ProfileFormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarUrl: string;
};

function toFormState(user: ReturnType<typeof useAuth>["user"]): ProfileFormState {
  return {
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    avatarUrl: user?.avatar || "",
  };
}

export default function ProfileDetailsPage() {
  const { user, syncUser } = useAuth();
  const [form, setForm] = useState<ProfileFormState>(() => toFormState(user));
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    setForm(toFormState(user));
  }, [user]);

  const displayName = useMemo(() => {
    const fullName = [form.firstName, form.lastName].filter(Boolean).join(" ").trim();
    return fullName || user?.name || "Ntumai Admin";
  }, [form.firstName, form.lastName, user?.name]);

  const hasChanges =
    form.firstName !== (user?.firstName || "") ||
    form.lastName !== (user?.lastName || "") ||
    form.email !== (user?.email || "") ||
    form.phone !== (user?.phone || "") ||
    form.avatarUrl !== (user?.avatar || "");

  async function handleSave() {
    setIsSaving(true);
    setFeedback(null);

    try {
      const nextUser = await updateAdminProfile({
        firstName: form.firstName.trim() || undefined,
        lastName: form.lastName.trim() || undefined,
        email: form.email.trim() || undefined,
        phone: form.phone.trim() || undefined,
        avatarUrl: form.avatarUrl.trim() || undefined,
      });

      syncUser(nextUser);
      setFeedback({ type: "success", message: "Profile updated successfully." });
    } catch (error) {
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to update your profile.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <ProfileHeader
        title={displayName}
        description={user?.activeRole ? `${user.activeRole} account` : "Admin account"}
      />
      <ProfileSettingsNav />
      <div className="@container mx-auto mb-10 w-full max-w-screen-2xl">
        <div className="grid gap-7 divide-y divide-dashed divide-gray-200 @2xl:gap-9 @3xl:gap-11">
          <FormGroup
            title="Profile photo"
            description="This avatar is shown in the admin header and profile menu."
            className="pt-7 @2xl:pt-9 @3xl:pt-11"
          >
            <div className="flex flex-col items-start gap-4 @xl:flex-row">
              <Avatar
                name={displayName}
                src={form.avatarUrl || undefined}
                className="!h-20 !w-20"
              />
              <div className="w-full max-w-2xl">
                <Input
                  placeholder="https://cdn.ntumai.com/avatars/admin.jpg"
                  value={form.avatarUrl}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, avatarUrl: event.target.value }))
                  }
                />
                <Text className="mt-2 text-sm text-gray-500">
                  Paste an image URL. File upload is not wired on this admin surface yet.
                </Text>
              </div>
            </div>
          </FormGroup>

          <FormGroup
            title="Personal details"
            description="These fields are saved to the live auth profile."
            className="pt-7 @2xl:pt-9 @3xl:pt-11"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="First name"
                placeholder="First name"
                value={form.firstName}
                onChange={(event) =>
                  setForm((current) => ({ ...current, firstName: event.target.value }))
                }
              />
              <Input
                label="Last name"
                placeholder="Last name"
                value={form.lastName}
                onChange={(event) =>
                  setForm((current) => ({ ...current, lastName: event.target.value }))
                }
              />
              <Input
                type="email"
                label="Email"
                placeholder="info@ntumai.com"
                value={form.email}
                onChange={(event) =>
                  setForm((current) => ({ ...current, email: event.target.value }))
                }
              />
              <Input
                label="Phone"
                placeholder="+260970000000"
                value={form.phone}
                onChange={(event) =>
                  setForm((current) => ({ ...current, phone: event.target.value }))
                }
              />
            </div>
          </FormGroup>

          <FormGroup
            title="Account context"
            description="These values are shown for reference and are managed through staff roles, not profile editing."
            className="pt-7 @2xl:pt-9 @3xl:pt-11"
          >
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4">
                <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Active role</Text>
                <Title as="h4" className="mt-2 text-base font-semibold text-gray-900">
                  {user?.activeRole || user?.role || "admin"}
                </Title>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4">
                <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Access permissions</Text>
                <Title as="h4" className="mt-2 text-base font-semibold text-gray-900">
                  {user?.permissions?.join(", ") || "Inherited"}
                </Title>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4">
                <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Login email</Text>
                <Title as="h4" className="mt-2 text-base font-semibold text-gray-900">
                  {user?.email || "Not available"}
                </Title>
              </div>
            </div>
          </FormGroup>
        </div>

        {feedback ? (
          <div
            className={`mt-6 rounded-2xl border px-4 py-3 text-sm ${
              feedback.type === "success"
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {feedback.message}
          </div>
        ) : null}

        <div className="mt-8 flex items-center justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setForm(toFormState(user));
              setFeedback(null);
            }}
          >
            Reset
          </Button>
          <Button disabled={!hasChanges || isSaving} isLoading={isSaving} onClick={handleSave}>
            Save Profile
          </Button>
        </div>
      </div>
    </>
  );
}
