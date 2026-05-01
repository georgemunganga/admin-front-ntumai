"use client";

import { useState } from "react";
import { RgbaColorPicker } from "react-colorful";
import { AdvancedCheckbox, Button, CheckboxGroup, Input, Text, Title } from "rizzui";
import { PiCheckBold, PiChecksBold, PiFilesBold, PiXBold } from "react-icons/pi";
import { useModal } from "@/app/shared/modal-views/use-modal";
import {
  createPlatformRole,
  listPlatformPermissions,
} from "@/repositories/admin/platform-access";

export default function CreateRoleModal({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const { closeModal } = useModal();
  const [isCopied, setIsCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([
    "Read",
  ]);
  const [roleColor, setRoleColor] = useState({ r: 36, g: 101, b: 255, a: 1 });

  const permissions = listPlatformPermissions();
  const colorCode = `rgba(${roleColor.r}, ${roleColor.g}, ${roleColor.b}, ${roleColor.a})`;

  async function handleSubmit() {
    if (!roleName.trim()) {
      window.alert("Role name is required.");
      return;
    }

    setIsSaving(true);
    try {
      await createPlatformRole({
        name: roleName.trim(),
        color: colorCode,
        permissions: selectedPermissions,
      });
      onSuccess?.();
      closeModal();
    } catch (error) {
      window.alert(
        error instanceof Error ? error.message : "Failed to create the role.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6 @container">
      <div className="flex items-center justify-between">
        <Title as="h4" className="font-semibold">
          Add a new Role
        </Title>
        <button onClick={closeModal} className="text-gray-500 hover:text-gray-900">
          <PiXBold className="h-5 w-5" />
        </button>
      </div>

      <Input
        label="Role Name"
        placeholder="Role name"
        value={roleName}
        onChange={(e) => setRoleName(e.target.value)}
      />

      <div>
        <Text className="mb-2 text-sm font-medium text-gray-900">Role Color</Text>
        <div className="flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3">
          <span className="text-sm text-gray-700">{colorCode}</span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(colorCode);
              setIsCopied(true);
              setTimeout(() => setIsCopied(false), 2000);
            }}
            className="ms-auto text-gray-500 hover:text-gray-900"
            type="button"
          >
            {isCopied ? <PiChecksBold className="h-4 w-4" /> : <PiFilesBold className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <RgbaColorPicker color={roleColor} onChange={setRoleColor} />

      <div className="grid gap-4">
        <Title as="h5" className="text-base font-semibold">
          Permissions
        </Title>
        <CheckboxGroup
          values={selectedPermissions}
          setValues={(next) => setSelectedPermissions(next as string[])}
          className="grid grid-cols-1 gap-3 md:grid-cols-3"
        >
          {permissions.map((permission) => (
            <AdvancedCheckbox
              key={permission}
              name={`create-role-${permission.toLowerCase()}`}
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
          {isSaving ? "Creating..." : "Create Role"}
        </Button>
      </div>
    </div>
  );
}
