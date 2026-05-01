"use client";

import { useMemo } from "react";
import type { AdminStatus } from "@/contracts/admin-domain";
import { customerProfiles, type CustomerProfile } from "@/components/crm/customer-data";
import { useAdminResource, postAdminData } from "@/repositories/admin/admin-api";

export type CustomerListRecord = {
  id: string;
  name: string;
  context: string;
  segment: string;
  status: AdminStatus;
  owner: string;
  updatedAt: string;
  email: string;
  phone: string;
  city: string;
};

type CustomerListApiItem = {
  id: string;
  fullName: string;
  email?: string | null;
  phone?: string | null;
  activeRole?: string | null;
  verification?: {
    email?: boolean;
    phone?: boolean;
  };
  counts?: {
    orders?: number;
    supportTickets?: number;
    payoutRequests?: number;
  };
  roleAssignments?: Array<{
    role: string;
    onboardingStatus?: string | null;
    kycStatus?: string | null;
    activationStatus?: string | null;
  }>;
  createdAt?: string;
  updatedAt?: string;
};

type CustomerListApiPayload = {
  items: CustomerListApiItem[];
};

type CustomerDetailApiItem = {
  id: string;
  fullName: string;
  email?: string | null;
  phone?: string | null;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
  verification?: {
    email?: boolean;
    phone?: boolean;
  };
  roleAssignments?: Array<{
    role: string;
    active: boolean;
    onboardingStatus?: string | null;
    lifecycleStatus?: string | null;
    kycStatus?: string | null;
    activationStatus?: string | null;
    updatedAt?: string;
  }>;
  addresses?: Array<{
    street?: string | null;
    city?: string | null;
    state?: string | null;
    label?: string | null;
    isDefault?: boolean;
  }>;
  recentOrders?: Array<{
    id: string;
    createdAt?: string;
    updatedAt?: string;
    totalAmount?: number;
    status?: string;
    payment?: {
      method?: string | null;
    } | null;
  }>;
  recentSupportTickets?: Array<{
    subject: string;
    status: string;
    category: string;
    updatedAt?: string;
    createdAt?: string;
  }>;
  recentPayoutRequests?: Array<{
    amount: number;
    currency: string;
    status: string;
    createdAt?: string;
  }>;
  recentShipments?: Array<{
    pickup?: { address?: { city?: string | null; street?: string | null } | null } | null;
    dropoff?: { address?: { city?: string | null; street?: string | null } | null } | null;
    createdAt?: string;
  }>;
  metrics?: {
    orderCount?: number;
    supportTicketCount?: number;
    payoutRequestCount?: number;
    shipmentCount?: number;
  };
};

type CustomerDetailApiPayload = {
  item: CustomerDetailApiItem;
};

export function listCustomerProfiles(): CustomerProfile[] {
  return customerProfiles;
}

export function getCustomerProfileById(id: string): CustomerProfile | undefined {
  return customerProfiles.find((customer) => customer.id === id);
}

export function listCustomerRecords(): CustomerListRecord[] {
  return customerProfiles.map((customer) => ({
    id: customer.id,
    name: customer.name,
    context: customer.notes,
    segment: customer.segment,
    status: customer.status,
    owner: customer.owner,
    updatedAt: customer.updatedAt,
    email: customer.email,
    phone: customer.phone,
    city: customer.city,
  }));
}

export function listCustomerSegments(): string[] {
  return Array.from(new Set(customerProfiles.map((customer) => customer.segment)));
}

export function useCustomerRecords() {
  const fallback = useMemo(() => listCustomerRecords(), []);
  return useAdminResource({
    path: "/api/v1/admin/customers?limit=100",
    fallback,
    map: mapCustomerRecordsPayload,
  });
}

export function useCustomerProfile(id: string) {
  const fallback = useMemo(() => getCustomerProfileById(id) ?? null, [id]);
  return useAdminResource({
    path: `/api/v1/admin/customers/${id}`,
    fallback,
    map: mapCustomerDetailPayload,
    enabled: Boolean(id),
  });
}

function mapCustomerRecordsPayload(payload: unknown): CustomerListRecord[] {
  const items = (payload as CustomerListApiPayload)?.items ?? [];
  return items.map((item) => {
    const activeAssignment = item.roleAssignments?.find((assignment) => assignment.role === item.activeRole) ?? item.roleAssignments?.[0];
    const supportCount = item.counts?.supportTickets ?? 0;
    const payoutCount = item.counts?.payoutRequests ?? 0;
    const orderCount = item.counts?.orders ?? 0;

    return {
      id: item.id,
      name: item.fullName,
      context: buildCustomerContext({
        supportCount,
        payoutCount,
        orderCount,
      }),
      segment: activeAssignment?.kycStatus === "under_review"
        ? "KYC review"
        : supportCount > 0
          ? "Support recovery"
          : orderCount > 20
            ? "Repeat customer"
            : "Customer care",
      status: mapCustomerStatus({
        activationStatus: activeAssignment?.activationStatus,
        kycStatus: activeAssignment?.kycStatus,
        supportCount,
      }),
      owner: activeAssignment?.role === "tasker" ? "Fleet desk" : "CRM desk",
      updatedAt: formatDateTime(item.updatedAt || item.createdAt),
      email: item.email ?? "No email",
      phone: item.phone ?? "No phone",
      city: "Unknown",
    };
  });
}

function mapCustomerDetailPayload(payload: unknown): CustomerProfile | null {
  const item = (payload as CustomerDetailApiPayload)?.item;
  if (!item) return null;

  const address =
    item.addresses?.find((entry) => entry.isDefault) ??
    item.addresses?.[0];
  const activeAssignment = item.roleAssignments?.find((assignment) => assignment.active) ?? item.roleAssignments?.[0];
  const totalOrders = item.metrics?.orderCount ?? item.recentOrders?.length ?? 0;
  const supportCount = item.metrics?.supportTicketCount ?? item.recentSupportTickets?.length ?? 0;
  const payoutCount = item.metrics?.payoutRequestCount ?? item.recentPayoutRequests?.length ?? 0;
  const shipmentCount = item.metrics?.shipmentCount ?? item.recentShipments?.length ?? 0;
  const latestOrder = item.recentOrders?.[0];
  const latestTicket = item.recentSupportTickets?.[0];
  const latestPayout = item.recentPayoutRequests?.[0];

  return {
    id: item.id,
    name: item.fullName,
    email: item.email ?? "No email",
    phone: item.phone ?? "No phone",
    segment:
      activeAssignment?.role === "tasker"
        ? "Tasker-linked account"
        : supportCount > 0
          ? "Support recovery"
          : payoutCount > 0
            ? "Finance watch"
            : "Customer profile",
    status: mapCustomerStatus({
      activationStatus: activeAssignment?.activationStatus,
      kycStatus: activeAssignment?.kycStatus,
      supportCount,
    }),
    city: address?.city ?? "Unknown",
    address: [address?.street, address?.city, address?.state].filter(Boolean).join(", ") || "No primary address",
    owner: activeAssignment?.role === "tasker" ? "Fleet desk" : "CRM desk",
    joinedAt: formatDate(item.createdAt),
    updatedAt: formatDateTime(item.updatedAt || item.createdAt),
    walletBalance: latestPayout ? formatMoney(latestPayout.amount, latestPayout.currency) : "ZMW 0",
    lifetimeSpend: formatMoney((item.recentOrders ?? []).reduce((sum, order) => sum + (order.totalAmount ?? 0), 0)),
    totalOrders: String(totalOrders),
    completedOrders: String((item.recentOrders ?? []).filter((order) => order.status === "COMPLETED" || order.status === "DELIVERED").length),
    cancelledOrders: String((item.recentOrders ?? []).filter((order) => order.status === "CANCELLED").length),
    lastOrder: formatDateTime(latestOrder?.updatedAt || latestOrder?.createdAt),
    appVersion: activeAssignment?.role === "tasker" ? "Tasker App vCurrent" : "Customer App vCurrent",
    paymentMethod: normalizePaymentMethod(latestOrder?.payment?.method),
    notes: latestTicket
      ? `${latestTicket.subject} is the latest support case connected to this mobile user.`
      : "Live admin record loaded from the Nest staff endpoint.",
    tags: [
      activeAssignment?.role === "tasker" ? "Tasker-linked" : "Customer",
      supportCount > 0 ? "Support active" : "No open support",
      payoutCount > 0 ? "Finance linked" : "Wallet clear",
    ],
    timeline: buildCustomerTimeline(item),
  };
}

function buildCustomerContext({
  supportCount,
  payoutCount,
  orderCount,
}: {
  supportCount: number;
  payoutCount: number;
  orderCount: number;
}) {
  if (supportCount > 0) {
    return `${supportCount} support cases linked to this mobile account.`;
  }
  if (payoutCount > 0) {
    return `${payoutCount} finance actions linked to this user account.`;
  }
  return `${orderCount} orders recorded across the mobile flow.`;
}

function mapCustomerStatus({
  activationStatus,
  kycStatus,
  supportCount,
}: {
  activationStatus?: string | null;
  kycStatus?: string | null;
  supportCount: number;
}): AdminStatus {
  if (activationStatus === "suspended" || activationStatus === "restricted") return "paused";
  if (kycStatus === "under_review" || kycStatus === "pending_submission") return "review";
  if (supportCount > 0) return "monitoring";
  if (activationStatus === "inactive") return "queued";
  return "live";
}

function buildCustomerTimeline(item: CustomerDetailApiItem) {
  const timeline = [];

  if (item.roleAssignments?.length) {
    for (const assignment of item.roleAssignments.slice(0, 3)) {
      timeline.push({
        label: `${capitalize(assignment.role)} role updated`,
        detail: `Onboarding ${assignment.onboardingStatus ?? "unknown"}, KYC ${assignment.kycStatus ?? "unknown"}, activation ${assignment.activationStatus ?? "unknown"}.`,
        time: formatDateTime(assignment.updatedAt),
      });
    }
  }

  if (item.recentSupportTickets?.length) {
    for (const ticket of item.recentSupportTickets.slice(0, 2)) {
      timeline.push({
        label: ticket.subject,
        detail: `${ticket.category} case is ${ticket.status.toLowerCase().replace(/_/g, " ")} in support.`,
        time: formatDateTime(ticket.updatedAt || ticket.createdAt),
      });
    }
  }

  if (item.recentOrders?.length) {
    for (const order of item.recentOrders.slice(0, 2)) {
      timeline.push({
        label: "Order activity",
        detail: `Order ${order.id} moved through ${String(order.status ?? "unknown").toLowerCase().replace(/_/g, " ")} state.`,
        time: formatDateTime(order.updatedAt || order.createdAt),
      });
    }
  }

  return timeline.slice(0, 5);
}

function normalizePaymentMethod(method?: string | null) {
  if (!method) return "No payment method";
  return method.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatMoney(amount: number, currency = "ZMW") {
  return `${currency} ${Math.round(amount).toLocaleString()}`;
}

function formatDate(value?: string) {
  if (!value) return "Unknown";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value?: string) {
  if (!value) return "Unknown";
  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function capitalize(value?: string | null) {
  if (!value) return "Unknown";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

// ─── P0 Mutations — KYC Decisions (Track A Phase 3) ─────────────────────────

export async function applyAdminKycDecision(
  userId: string,
  role: "tasker" | "vendor",
  kycStatus: "approved" | "rejected" | "suspended" | "pending_review",
  reason?: string,
  note?: string,
): Promise<{
  userId: string;
  role: string;
  kycStatus: string;
  activationStatus: unknown;
  decidedAt: string;
} | null> {
  return postAdminData(
    `/api/v1/admin/users/${userId}/kyc`,
    {
      role,
      kycStatus,
      ...(reason ? { reason } : {}),
      ...(note ? { note } : {}),
    },
  );
}
