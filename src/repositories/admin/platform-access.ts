"use client";

import { useMemo } from "react";
import type { AdminWorkflowContext } from "@/contracts/admin-domain";
import { deleteAdminData, patchAdminData, postAdminData, useAdminResource } from "@/repositories/admin/admin-api";
import {
  permissions,
  roleUsers,
  rolesList,
} from "@/components/platform/roles-permissions-data";

export type PlatformPermission = (typeof permissions)[number] | string;
export type PlatformUserStatus =
  | "Pending"
  | "Accepted"
  | "Expired"
  | "Revoked"
  | "Active"
  | "Deactivated";

export type PlatformRoleCard = {
  id: string;
  name: string;
  color?: string;
  users: string[];
  permissions: string[];
  memberCount?: number;
  isSystem?: boolean;
};

export type PlatformAccessUser = {
  id: number;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
  permissions: string[];
  status: PlatformUserStatus;
  userId?: string;
  activeRole: "Customer" | "Tasker" | "Vendor" | "Staff";
  accessScope: string;
  workflow: AdminWorkflowContext;
  staffRoleId?: string;
};

type PlatformRoleApiItem = {
  id: string;
  name: string;
  color?: string;
  permissions?: string[];
  isSystem?: boolean;
  memberCount?: number;
};

type PlatformUserApiItem = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  staffRoleId?: string;
  createdAt: string;
  permissions: string[];
  status: PlatformUserStatus;
  activeRole: "Staff";
  accessScope: string;
  workflow: AdminWorkflowContext;
};

const roleAvatars = [
  "/avatars/avatar-1.webp",
  "/avatars/avatar-2.webp",
  "/avatars/avatar-3.webp",
  "/avatars/avatar-4.webp",
];

const accessContextByUserId: Record<
  number,
  Pick<PlatformAccessUser, "activeRole" | "accessScope" | "workflow">
> = {
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

function toPlatformAccessUser(
  user: (typeof roleUsers)[number],
): PlatformAccessUser {
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
  return rolesList.map((role) => ({
    id: role.name.toLowerCase().replace(/\s+/g, "-"),
    name: role.name,
    color: role.color,
    users: role.users,
    permissions: [...permissions],
    memberCount: role.users.length,
    isSystem: true,
  }));
}

export function listPlatformRoleUsers(): PlatformAccessUser[] {
  return roleUsers.map(toPlatformAccessUser);
}

export function listPlatformPermissions(): PlatformPermission[] {
  return [...permissions];
}

export function listPlatformUserStatuses(): PlatformUserStatus[] {
  return ["Pending", "Accepted", "Expired", "Revoked"];
}

export function usePlatformAccessRoles() {
  const fallback = useMemo(() => listPlatformRoles(), []);
  return useAdminResource({
    path: "/api/v1/admin/access/roles",
    fallback,
    map: mapPlatformRolesPayload,
  });
}

export function usePlatformAccessUsers() {
  const fallback = useMemo(() => listPlatformRoleUsers(), []);
  return useAdminResource({
    path: "/api/v1/admin/access/users?limit=100",
    fallback,
    map: mapPlatformUsersPayload,
  });
}

export async function createPlatformRole(input: {
  name: string;
  color?: string;
  permissions?: string[];
}) {
  return postAdminData<{ item: PlatformRoleApiItem }>("/api/v1/admin/access/roles", input);
}

export async function updatePlatformRole(
  id: string,
  input: { name?: string; color?: string; permissions?: string[] },
) {
  return patchAdminData<{ item: PlatformRoleApiItem }>(`/api/v1/admin/access/roles/${id}`, input);
}

export async function deletePlatformRole(id: string) {
  return deleteAdminData<{ id: string }>(`/api/v1/admin/access/roles/${id}`);
}

export async function createPlatformAccessUser(input: {
  firstName: string;
  lastName: string;
  email: string;
  staffRoleId?: string;
  status?: string;
  accessScope?: string;
}) {
  return postAdminData<{ item: PlatformUserApiItem }>("/api/v1/admin/access/users", input);
}

export async function updatePlatformAccessUser(
  id: string,
  input: {
    firstName?: string;
    lastName?: string;
    email?: string;
    staffRoleId?: string;
    status?: string;
    accessScope?: string;
  },
) {
  return patchAdminData<{ item: PlatformUserApiItem }>(`/api/v1/admin/access/users/${id}`, input);
}

export async function deletePlatformAccessUser(id: string) {
  return deleteAdminData<{ item: PlatformUserApiItem }>(`/api/v1/admin/access/users/${id}`);
}

function mapPlatformRolesPayload(payload: unknown): PlatformRoleCard[] {
  const items = ((payload as { items?: PlatformRoleApiItem[] })?.items ?? []);
  if (!items.length) return listPlatformRoles();

  return items.map((item, index) => ({
    id: item.id,
    name: item.name,
    color: item.color || rolesList[index % rolesList.length]?.color || "#2465FF",
    users: roleAvatars.slice(0, Math.max(1, Math.min(item.memberCount ?? 0, roleAvatars.length))),
    permissions: item.permissions ?? [],
    memberCount: item.memberCount ?? roleUsers.filter((user) => user.role === item.name).length,
    isSystem: item.isSystem,
  }));
}

function mapPlatformUsersPayload(payload: unknown): PlatformAccessUser[] {
  const items = ((payload as { items?: PlatformUserApiItem[] })?.items ?? []);
  if (!items.length) return listPlatformRoleUsers();

  return items.map((item) => ({
    id: parseInt(String(item.id).slice(-6), 16) || Math.floor(Math.random() * 100000),
    userId: item.id,
    fullName: item.fullName,
    email: item.email,
    role: item.role,
    createdAt: item.createdAt,
    permissions: item.permissions,
    status: normalizePlatformUserStatus(item.status),
    activeRole: item.activeRole,
    accessScope: item.accessScope,
    workflow: item.workflow,
    staffRoleId: item.staffRoleId,
  }));
}

function normalizePlatformUserStatus(status: string): PlatformUserStatus {
  const normalized = String(status || "").trim().toLowerCase();
  if (normalized === "accepted" || normalized === "active") return "Accepted";
  if (normalized === "expired") return "Expired";
  if (normalized === "revoked" || normalized === "deactivated") return "Revoked";
  return "Pending";
}

/**
 * Send (or resend) a staff invite email — calls POST /api/v1/admin/access/users/:id/invite
 */
export async function sendStaffInvite(
  userId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await postAdminData<{ success: boolean }>(
      `/api/v1/admin/access/users/${userId}/invite`,
      {},
    );
    return { success: true };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to send invite";
    return { success: false, error: message };
  }
}
