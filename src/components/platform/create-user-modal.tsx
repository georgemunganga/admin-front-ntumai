"use client";

import { useMemo, useState } from "react";
import { Button, Input, Select, Textarea, Title } from "rizzui";
import { PiXBold } from "react-icons/pi";
import { useModal } from "@/app/shared/modal-views/use-modal";
import type { PlatformRoleCard } from "@/repositories/admin/platform-access";
import { createPlatformAccessUser } from "@/repositories/admin/platform-access";

export default function CreateUserModal({
  roles,
  roleId,
  onSuccess,
}: {
  roles: PlatformRoleCard[];
  roleId?: string;
  onSuccess?: () => void;
}) {
  const { closeModal } = useModal();
  const [isSaving, setIsSaving] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [accessScope, setAccessScope] = useState("");

  const roleOptions = useMemo(
    () => roles.map((role) => ({ label: role.name, value: role.id })),
    [roles],
  );
  const [selectedRole, setSelectedRole] = useState(
    roleOptions.find((option) => option.value === roleId) ?? roleOptions[0] ?? null,
  );

  async function handleSubmit() {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      window.alert("First name, last name, and email are required.");
      return;
    }
    if (!selectedRole?.value) {
      window.alert("Please select a staff role.");
      return;
    }

    setIsSaving(true);
    try {
      await createPlatformAccessUser({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        staffRoleId: selectedRole.value,
        accessScope: accessScope.trim() || undefined,
      });
      onSuccess?.();
      closeModal();
    } catch (error) {
      window.alert(
        error instanceof Error ? error.message : "Failed to create the staff user.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 p-6 @container md:grid-cols-2">
      <div className="col-span-full flex items-center justify-between">
        <Title as="h4" className="font-semibold">
          Add a new User
        </Title>
        <button onClick={closeModal} className="text-gray-500 hover:text-gray-900">
          <PiXBold className="h-5 w-5" />
        </button>
      </div>

      <Input
        label="First Name"
        placeholder="Enter first name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <Input
        label="Last Name"
        placeholder="Enter last name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <Input
        label="Email"
        placeholder="Enter email address"
        className="col-span-full"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div className="col-span-full">
        <Select
          label="Role"
          options={roleOptions}
          value={selectedRole}
          onChange={(option: any) => setSelectedRole(option)}
        />
      </div>
      <Textarea
        label="Access Scope"
        placeholder="Optional staff scope or team note"
        className="col-span-full"
        value={accessScope}
        onChange={(e) => setAccessScope(e.target.value)}
      />

      <div className="col-span-full flex items-center justify-end gap-4">
        <Button variant="outline" onClick={closeModal}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isSaving}>
          {isSaving ? "Creating..." : "Create User"}
        </Button>
      </div>
    </div>
  );
}
