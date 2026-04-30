"use client";

import RoleCard from "@/components/platform/role-card";
import { listPlatformRoles } from "@/repositories/admin/platform-access";
import { cn } from "@/utils/class-names";

export default function RolesGrid({
  className,
  gridClassName,
}: {
  className?: string;
  gridClassName?: string;
}) {
  const roles = listPlatformRoles();

  return (
    <div className={cn("@container", className)}>
      <div
        className={cn(
          "grid grid-cols-1 gap-6 @[36.65rem]:grid-cols-2 @[56rem]:grid-cols-3 @[78.5rem]:grid-cols-4 @[100rem]:grid-cols-5",
          gridClassName,
        )}
      >
        {roles.map((role) => (
          <RoleCard key={role.name} {...role} />
        ))}
      </div>
    </div>
  );
}
