"use client";

import { patchAdminData, useAdminResource } from "@/repositories/admin/admin-api";
import type { AdminSessionUser } from "@/repositories/admin/admin-session";

export type AdminProfileUpdateInput = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
};

export type AdminUserPreferences = {
  notifications: {
    orderUpdates: boolean;
    promotions: boolean;
    newRestaurants: boolean;
    priceDrops: boolean;
  };
  taskerNotifications: {
    newJobs: boolean;
    jobReminders: boolean;
    earningsUpdates: boolean;
    weeklyReport: boolean;
  };
  vendorNotifications: {
    newOrders: boolean;
    orderReminders: boolean;
    lowStock: boolean;
    dailyReport: boolean;
    customerReviews: boolean;
  };
};

const defaultPreferences: AdminUserPreferences = {
  notifications: {
    orderUpdates: true,
    promotions: true,
    newRestaurants: false,
    priceDrops: true,
  },
  taskerNotifications: {
    newJobs: true,
    jobReminders: true,
    earningsUpdates: true,
    weeklyReport: true,
  },
  vendorNotifications: {
    newOrders: true,
    orderReminders: true,
    lowStock: true,
    dailyReport: true,
    customerReviews: true,
  },
};

type PreferencesEnvelope = {
  preferences?: Partial<AdminUserPreferences> & {
    notifications?: Partial<AdminUserPreferences["notifications"]>;
    taskerNotifications?: Partial<AdminUserPreferences["taskerNotifications"]>;
    vendorNotifications?: Partial<AdminUserPreferences["vendorNotifications"]>;
  };
};

type ProfileEnvelope = {
  user?: {
    id: string;
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    avatar?: string | null;
    role?: string;
    activeRole?: string;
    roles?: string[];
    permissions?: string[];
  };
};

export function mapAdminProfileToSession(payload: unknown): Partial<AdminSessionUser> {
  const data = payload as ProfileEnvelope;
  const user = data.user;
  if (!user) return {};
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  return {
    id: user.id,
    name: name || user.email || "Ntumai Admin",
    email: user.email || "",
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    avatar: user.avatar ?? null,
    role: user.role || "admin",
    activeRole: user.activeRole || user.role || "admin",
    roles: user.roles || (user.role ? [user.role] : ["admin"]),
    permissions: user.permissions ?? [],
  };
}

export function useAdminProfilePreferences() {
  return useAdminResource<AdminUserPreferences>({
    path: "/api/v1/auth/me/preferences",
    fallback: defaultPreferences,
    map: (payload) => {
      const data = payload as PreferencesEnvelope;
      return {
        notifications: {
          ...defaultPreferences.notifications,
          ...(data.preferences?.notifications || {}),
        },
        taskerNotifications: {
          ...defaultPreferences.taskerNotifications,
          ...(data.preferences?.taskerNotifications || {}),
        },
        vendorNotifications: {
          ...defaultPreferences.vendorNotifications,
          ...(data.preferences?.vendorNotifications || {}),
        },
      };
    },
  });
}

export async function updateAdminProfile(input: AdminProfileUpdateInput) {
  const payload = await patchAdminData<ProfileEnvelope>("/api/v1/auth/me", input);
  return mapAdminProfileToSession(payload ?? {});
}

export async function updateAdminProfilePreferences(input: Partial<AdminUserPreferences>) {
  const payload = await patchAdminData<PreferencesEnvelope>("/api/v1/auth/me/preferences", input);
  const data = payload ?? {};
  return {
    notifications: {
      ...defaultPreferences.notifications,
      ...(data.preferences?.notifications || {}),
    },
    taskerNotifications: {
      ...defaultPreferences.taskerNotifications,
      ...(data.preferences?.taskerNotifications || {}),
    },
    vendorNotifications: {
      ...defaultPreferences.vendorNotifications,
      ...(data.preferences?.vendorNotifications || {}),
    },
  } satisfies AdminUserPreferences;
}
