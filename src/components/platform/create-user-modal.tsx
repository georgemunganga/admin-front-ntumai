"use client";

import { useState } from "react";
import { Button, Input, Select, Title } from "rizzui";
import { PiXBold } from "react-icons/pi";
import { useModal } from "@/app/shared/modal-views/use-modal";
import { ROLES } from "@/config/constants";
import { listPlatformPermissions, listPlatformUserStatuses } from "@/repositories/admin/platform-access";

const roleOptions = Object.entries(ROLES).map(([key, value]) => ({ label: value, value: key }));
const statusOptions = listPlatformUserStatuses().map((status) => ({ label: status, value: status }));
const permissionOptions = listPlatformPermissions().map((permission) => ({ label: permission, value: permission }));

export default function CreateUserModal() {
  const { closeModal } = useModal();
  const [role, setRole] = useState(roleOptions[0]);
  const [status, setStatus] = useState(statusOptions[0]);
  const [permission, setPermission] = useState(permissionOptions[0]);

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

      <Input label="Full Name" placeholder="Enter user's full name" className="col-span-full" />
      <Input label="Email" placeholder="Enter user's Email Address" className="col-span-full" />
      <Select label="Role" options={roleOptions} value={role} onChange={(option: any) => setRole(option)} />
      <Select label="Status" options={statusOptions} value={status} onChange={(option: any) => setStatus(option)} />
      <div className="col-span-full">
        <Select label="Permissions" options={permissionOptions} value={permission} onChange={(option: any) => setPermission(option)} />
      </div>

      <div className="col-span-full flex items-center justify-end gap-4">
        <Button variant="outline" onClick={closeModal}>
          Cancel
        </Button>
        <Button onClick={closeModal}>Create User</Button>
      </div>
    </div>
  );
}
