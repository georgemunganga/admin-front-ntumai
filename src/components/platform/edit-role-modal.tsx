"use client";

import { useMemo, useState } from "react";
import { AdvancedCheckbox, Button, CheckboxGroup, Input, Title } from "rizzui";
import { PiCheckBold, PiXBold } from "react-icons/pi";
import { useModal } from "@/app/shared/modal-views/use-modal";
import {
  listPlatformPermissions,
  updatePlatformRole,
} from "@/repositories/admin/platform-access";

type EditableRole = {
  id: string;
  name: string;
  color?: string;
  permissions: string[];
  isSystem?: boolean;
};

function rgbaToHex(value?: string) {
  if (!value) return "#2465FF";
  const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (!match) return value;
  const [, r, g, b] = match;
  return `#${[r, g, b]
    .map((channel) => Number(channel).toString(16).padStart(2, "0"))
    .join("")}`.toUpperCase();
}

export default function EditRoleModal({
  role,
  onSuccess,
}: {
  role: EditableRole;
  onSuccess?: () => void;
}) {
  const { closeModal } = useModal();
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState(role.name);
  const [color, setColor] = useState(rgbaToHex(role.color));
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    role.permissions,
  );

  const permissions = useMemo(() => listPlatformPermissions(), []);

  async function handleSubmit() {
    setIsSaving(true);
    try {
      await updatePlatformRole(role.id, {
        ...(role.isSystem ? {} : { name: name.trim() }),
        color,
        permissions: selectedPermissions,
      });
      onSuccess?.();
      closeModal();
    } catch (error) {
      window.alert(
        error instanceof Error ? error.message : "Failed to update the role.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 p-6 @container">
      <div className="flex items-center justify-between">
        <Title as="h4" className="font-semibold">
          Edit Role
        </Title>
        <button onClick={closeModal} className="text-gray-500 hover:text-gray-900">
          <PiXBold className="h-5 w-5" />
        </button>
      </div>

      <div className="grid gap-4">
        <Input
          label="Role Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          disabled={Boolean(role.isSystem)}
        />
        <Input
          label="Role Color"
          value={color}
          onChange={(event) => setColor(event.target.value)}
          placeholder="#2465FF"
        />
      </div>

      <div className="grid gap-4 divide-y divide-y-reverse divide-gray-200">
        <Title as="h5" className="mb-2 text-base font-semibold">
          Role Access
        </Title>
        <CheckboxGroup
          values={selectedPermissions}
          setValues={(next) => setSelectedPermissions(next as string[])}
          className="grid grid-cols-1 gap-3 md:grid-cols-3"
        >
          {permissions.map((permission) => (
            <AdvancedCheckbox
              key={permission}
              name={`${role.id}.${permission.toLowerCase()}`}
              value={permission}
              inputClassName="[&:checked~span>.icon]:block"
              contentClassName="flex items-center justify-center"
            >
              <PiCheckBold className="icon me-1 hidden h-[14px] w-[14px] md:h-4 md:w-4" />
              <span className="font-medium">{permission}</span>
            </AdvancedCheckbox>
          ))}
        </CheckboxGroup>
      </div>

      <div className="flex items-center justify-end gap-4">
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
