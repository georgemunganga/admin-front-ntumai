"use client";

import { useMemo, useState } from "react";
import { Button, Input, Select, Textarea, Title } from "rizzui";
import { PiXBold } from "react-icons/pi";
import { useModal } from "@/app/shared/modal-views/use-modal";
import type {
  PlatformAccessUser,
  PlatformRoleCard,
} from "@/repositories/admin/platform-access";
import {
  listPlatformUserStatuses,
  updatePlatformAccessUser,
} from "@/repositories/admin/platform-access";

export default function EditUserModal({
  user,
  roles,
  onSuccess,
}: {
  user: PlatformAccessUser;
  roles: PlatformRoleCard[];
  onSuccess?: () => void;
}) {
  const { closeModal } = useModal();
  const [isSaving, setIsSaving] = useState(false);

  const nameParts = user.fullName.split(" ");
  const [firstName, setFirstName] = useState(nameParts[0] ?? "");
  const [lastName, setLastName] = useState(nameParts.slice(1).join(" "));
  const [accessScope, setAccessScope] = useState(user.accessScope ?? "");

  const roleOptions = useMemo(
    () => roles.map((role) => ({ label: role.name, value: role.id })),
    [roles],
  );
  const statusOptions = useMemo(
    () =>
      listPlatformUserStatuses().map((status) => ({
        label: status,
        value: status.toUpperCase(),
      })),
    [],
  );

  const [selectedRole, setSelectedRole] = useState(
    roleOptions.find((option) => option.value === user.staffRoleId) ?? null,
  );
  const [selectedStatus, setSelectedStatus] = useState(
    statusOptions.find(
      (option) => option.label.toLowerCase() === user.status.toLowerCase(),
    ) ?? statusOptions[0] ?? null,
  );

  async function handleSubmit() {
    setIsSaving(true);
    try {
      await updatePlatformAccessUser(String(user.userId ?? user.id), {
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
        staffRoleId: selectedRole?.value,
        status: selectedStatus?.value,
        accessScope: accessScope.trim() || undefined,
      });
      onSuccess?.();
      closeModal();
    } catch (error) {
      window.alert(
        error instanceof Error ? error.message : "Failed to update the staff user.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 p-6 @container md:grid-cols-2">
      <div className="col-span-full flex items-center justify-between">
        <Title as="h4" className="font-semibold">
          Edit User
        </Title>
        <button onClick={closeModal} className="text-gray-500 hover:text-gray-900">
          <PiXBold className="h-5 w-5" />
        </button>
      </div>

      <Input
        label="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <Input
        label="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <Input
        label="Email"
        className="col-span-full"
        value={user.email}
        disabled
      />
      <Select
        label="Role"
        options={roleOptions}
        value={selectedRole}
        onChange={(option: any) => setSelectedRole(option)}
      />
      <Select
        label="Status"
        options={statusOptions}
        value={selectedStatus}
        onChange={(option: any) => setSelectedStatus(option)}
      />
      <Textarea
        label="Access Scope"
        className="col-span-full"
        value={accessScope}
        onChange={(e) => setAccessScope(e.target.value)}
      />

      <div className="col-span-full flex items-center justify-end gap-4">
        <Button variant="outline" onClick={closeModal}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}
