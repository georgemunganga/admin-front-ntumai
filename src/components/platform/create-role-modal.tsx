"use client";

import { useState } from "react";
import { RgbaColorPicker } from "react-colorful";
import { Button, Input, Text, Title } from "rizzui";
import { PiChecksBold, PiFilesBold, PiXBold } from "react-icons/pi";
import { useModal } from "@/app/shared/modal-views/use-modal";

export default function CreateRoleModal() {
  const { closeModal } = useModal();
  const [isCopied, setIsCopied] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [roleColor, setRoleColor] = useState({ r: 36, g: 101, b: 255, a: 1 });

  const colorCode = `rgba(${roleColor.r}, ${roleColor.g}, ${roleColor.b}, ${roleColor.a})`;

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

      <Input label="Role Name" placeholder="Role name" value={roleName} onChange={(e) => setRoleName(e.target.value)} />

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
          >
            {isCopied ? <PiChecksBold className="h-4 w-4" /> : <PiFilesBold className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <RgbaColorPicker color={roleColor} onChange={setRoleColor} />

      <div className="flex items-center justify-end gap-4">
        <Button variant="outline" onClick={closeModal}>
          Cancel
        </Button>
        <Button onClick={closeModal}>Create Role</Button>
      </div>
    </div>
  );
}
