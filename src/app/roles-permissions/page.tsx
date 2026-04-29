"use client";

import { Button } from "rizzui";
import PageHeader from "@/components/admin/page-header";
import RolesGrid from "@/components/platform/roles-grid";
import RolesUsersTable from "@/components/platform/roles-users-table";
import CreateRoleModal from "@/components/platform/create-role-modal";
import { useModal } from "@/app/shared/modal-views/use-modal";

export default function RolesPermissionsPage() {
  const { openModal } = useModal();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles and Permissions "
        breadcrumb={["Dashboard", "Role Management & Permission"]}
        action={
          <Button onClick={() => openModal({ view: <CreateRoleModal />, customSize: 700 })}>
            Add New Role
          </Button>
        }
      />
      <RolesGrid />
      <RolesUsersTable />
    </div>
  );
}
