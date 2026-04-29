"use client";

import { useState } from "react";
import { AdvancedCheckbox, Button, CheckboxGroup, Title } from "rizzui";
import { PiCheckBold, PiXBold } from "react-icons/pi";
import { useModal } from "@/app/shared/modal-views/use-modal";
import { permissions } from "@/components/platform/roles-permissions-data";
import { ROLES } from "@/config/constants";

const roleRows = Object.values(ROLES);

export default function EditRoleModal() {
  const { closeModal } = useModal();
  const [values, setValues] = useState<Record<string, string[]>>({
    Administrator: ["Read"],
    Manager: ["Write"],
    Sales: ["Delete"],
    Support: ["Read"],
    Developer: ["Write"],
    "HR Department": ["Delete"],
    "Restricted User": ["Write"],
    Customer: ["Read"],
  });

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

      <div className="grid gap-4 divide-y divide-y-reverse divide-gray-200">
        <Title as="h5" className="mb-2 text-base font-semibold">
          Role Access
        </Title>
        {roleRows.map((role) => (
          <div key={role} className="flex flex-col gap-3 pb-4 md:flex-row md:items-center md:justify-between">
            <Title as="h6" className="font-medium text-gray-700 2xl:text-sm">
              {role}
            </Title>
            <CheckboxGroup
              values={values[role] ?? []}
              setValues={(next) => setValues((prev) => ({ ...prev, [role]: next as string[] }))}
              className="grid grid-cols-3 gap-4 md:flex"
            >
              {permissions.map((permission) => (
                <AdvancedCheckbox
                  key={permission}
                  name={`${role}.${permission.toLowerCase()}`}
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
        ))}
      </div>

      <div className="flex items-center justify-end gap-4">
        <Button variant="outline" onClick={closeModal}>
          Cancel
        </Button>
        <Button onClick={closeModal}>Save</Button>
      </div>
    </div>
  );
}
