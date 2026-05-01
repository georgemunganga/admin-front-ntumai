"use client";

import { Button } from "rizzui";
import PageHeader from "@/components/admin/page-header";
import RolesGrid from "@/components/platform/roles-grid";
import RolesUsersTable from "@/components/platform/roles-users-table";
import CreateRoleModal from "@/components/platform/create-role-modal";
import { useModal } from "@/app/shared/modal-views/use-modal";
import { useAuth } from "@/components/auth/auth-provider";
import {
  usePlatformAccessRoles,
  usePlatformAccessUsers,
} from "@/repositories/admin/platform-access";

export default function RolesPermissionsPage() {
  const { openModal } = useModal();
  const { canWrite } = useAuth();
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
        action={canWrite ? (
          <Button
            onClick={() =>
              openModal({
                view: <CreateRoleModal onSuccess={refresh} />,
                customSize: 700,
              })
            }
          >
            Add New Role
          </Button>
        ) : null}
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
