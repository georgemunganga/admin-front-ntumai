"use client";

import type { AdminWorkflowContext } from "@/contracts/admin-domain";
import {
  permissions,
  roleUsers,
  rolesList,
  statuses,
  type RoleUser,
} from "@/components/platform/roles-permissions-data";

export type PlatformPermission = (typeof permissions)[number];
export type PlatformUserStatus = (typeof statuses)[number];
export type PlatformRoleCard = (typeof rolesList)[number];

export type PlatformAccessUser = RoleUser & {
  activeRole: "Customer" | "Tasker" | "Vendor" | "Staff";
  accessScope: string;
  workflow: AdminWorkflowContext;
};

const accessContextByUserId: Record<number, Omit<PlatformAccessUser, keyof RoleUser>> = {
  1001: {
    activeRole: "Staff",
    accessScope: "Owns platform-wide staff controls and emergency approval actions.",
    workflow: {
      actor: "staff",
      source: "role_access",
      state: "approved",
      ownerTeam: "platform",
      summary: "Platform administrator access used to govern staff permissions across customer, tasker, and vendor workflows.",
    },
  },
  1002: {
    activeRole: "Staff",
    accessScope: "Runs day-to-day marketplace, dispatch, and support interventions for mobile users.",
    workflow: {
      actor: "staff",
      source: "role_access",
      state: "approved",
      ownerTeam: "platform",
      summary: "Operations manager access spans customer and tasker issue resolution across the mobile business.",
    },
  },
  1003: {
    activeRole: "Staff",
    accessScope: "Pending support-desk access for customer, tasker, and vendor issue handling.",
    workflow: {
      actor: "staff",
      source: "role_access",
      state: "under_review",
      ownerTeam: "platform",
      summary: "Support access is still pending final approval before this staff user can manage live mobile complaints.",
    },
  },
  1004: {
    activeRole: "Staff",
    accessScope: "Former finance access used for payout, refund, and settlement operations.",
    workflow: {
      actor: "staff",
      source: "role_access",
      state: "blocked",
      ownerTeam: "platform",
      summary: "Finance access is deactivated and should not be used for payout or refund workflows until restored.",
    },
  },
};

function toPlatformAccessUser(user: RoleUser): PlatformAccessUser {
  return {
    ...user,
    ...(accessContextByUserId[user.id] ?? {
      activeRole: "Staff",
      accessScope: "Staff access context is not yet mapped.",
      workflow: {
        actor: "staff",
        source: "role_access",
        state: "submitted",
        ownerTeam: "platform",
        summary: "Staff access state still needs to be reviewed by the platform team.",
      },
    }),
  };
}

export function listPlatformRoles(): PlatformRoleCard[] {
  return rolesList;
}

export function listPlatformRoleUsers(): PlatformAccessUser[] {
  return roleUsers.map(toPlatformAccessUser);
}

export function listPlatformPermissions(): PlatformPermission[] {
  return [...permissions];
}

export function listPlatformUserStatuses(): PlatformUserStatus[] {
  return [...statuses];
}
