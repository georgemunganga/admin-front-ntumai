"use client";

import { Button } from "rizzui";
import PageHeader from "@/components/admin/page-header";
import RolesGrid from "@/components/platform/roles-grid";
import RolesUsersTable from "@/components/platform/roles-users-table";
import CreateRoleModal from "@/components/platform/create-role-modal";
import { useModal } from "@/app/shared/modal-views/use-modal";
import { useAdminActionGuard } from "@/components/auth/use-admin-action-guard";
import {
  usePlatformAccessRoles,
  usePlatformAccessUsers,
} from "@/repositories/admin/platform-access";

export default function RolesPermissionsPage() {
  const { openModal } = useModal();
  const { guardAction } = useAdminActionGuard();
  const rolesState = usePlatformAccessRoles();
  const usersState = usePlatformAccessUsers();

  const refresh = () => {
    rolesState.refresh();
    usersState.refresh();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles and Permissions "
        breadcrumb={["Dashboard", "Role Management & Permission"]}
        action={
          <Button
            onClick={() =>
              guardAction("write", () =>
                openModal({
                  view: <CreateRoleModal onSuccess={refresh} />,
                  customSize: 700,
                }),
              )
            }
          >
            Add New Role
          </Button>
        }
      />
      <RolesGrid roles={rolesState.data} onRefresh={rolesState.refresh} />
      <RolesUsersTable
        users={usersState.data}
        roles={rolesState.data}
        onRefresh={refresh}
      />
    </div>
  );
}
