"use client";

import { useMemo } from "react";
import { crudPages } from "@/components/crud/crud-data";
import { useAdminResource, postAdminData } from "@/repositories/admin/admin-api";
import type { AdminStatus } from "@/contracts/admin-domain";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TaskerListRecord = {
  id: string;
  name: string;
  context: string;
  segment: string;
  status: AdminStatus;
  owner: string;
  updatedAt: string;
  email?: string;
  phone?: string;
  kycStatus?: string | null;
  activationStatus?: string | null;
  payoutCount?: number;
  supportCount?: number;
};

type TaskerApiItem = {
  id: string;
  fullName: string;
  email?: string | null;
  phone?: string | null;
  kycStatus?: string | null;
  activationStatus?: string | null;
  onboardingStatus?: string | null;
  verification?: { email?: boolean; phone?: boolean };
  counts?: { payoutRequests?: number; supportTickets?: number };
  createdAt?: string;
  updatedAt?: string;
};

type TaskerApiPayload = { items: TaskerApiItem[] };

// ─── Fixture helpers (fallback) ───────────────────────────────────────────────

export function listTaskerRecords(): TaskerListRecord[] {
  return crudPages.logisticsDrivers.rows.map((row) => ({
    id: row.id,
    name: row.primary,
    context: row.secondary,
    segment: row.tertiary,
    status: row.status as AdminStatus,
    owner: row.owner,
    updatedAt: row.updatedAt,
  }));
}

export function listTaskerSegments(): string[] {
  return Array.from(new Set(crudPages.logisticsDrivers.rows.map((row) => row.tertiary)));
}

// ─── Live hooks ───────────────────────────────────────────────────────────────

export function useAdminTaskers(params?: {
  kycStatus?: string;
  activationStatus?: string;
  search?: string;
}) {
  const path = buildTaskersPath(params);
  const fallback = useMemo(() => listTaskerRecords(), []);
  return useAdminResource<TaskerListRecord[]>({ path, fallback, map: mapTaskerApiPayload });
}

export function useAdminTaskerDetail(userId: string) {
  return useAdminResource<TaskerApiItem | null>({
    path: `/api/v1/admin/taskers/${userId}`,
    fallback: null,
    map: (payload) => (payload as { data?: { item?: TaskerApiItem } })?.data?.item ?? null,
    enabled: Boolean(userId),
  });
}

// ─── P0 Mutation — Tasker KYC decision ───────────────────────────────────────

export async function applyTaskerKycDecision(
  userId: string,
  kycStatus: "approved" | "rejected" | "suspended" | "pending_review",
  reason?: string,
  note?: string,
) {
  return postAdminData(`/api/v1/admin/users/${userId}/kyc`, {
    role: "tasker",
    kycStatus,
    ...(reason ? { reason } : {}),
    ...(note ? { note } : {}),
  });
}

// ─── Mapping helpers ──────────────────────────────────────────────────────────

function buildTaskersPath(params?: {
  kycStatus?: string;
  activationStatus?: string;
  search?: string;
}) {
  const qs = new URLSearchParams();
  qs.set("limit", "100");
  if (params?.kycStatus) qs.set("kycStatus", params.kycStatus);
  if (params?.activationStatus) qs.set("activationStatus", params.activationStatus);
  if (params?.search) qs.set("search", params.search);
  return `/api/v1/admin/taskers?${qs.toString()}`;
}

function mapTaskerApiPayload(payload: unknown): TaskerListRecord[] {
  const items = (payload as TaskerApiPayload)?.items ?? [];
  return items.map(mapTaskerItemToRecord);
}

function mapTaskerItemToRecord(item: TaskerApiItem): TaskerListRecord {
  const payoutCount = item.counts?.payoutRequests ?? 0;
  const supportCount = item.counts?.supportTickets ?? 0;
  return {
    id: item.id,
    name: item.fullName,
    context: buildTaskerContext({ payoutCount, supportCount, kycStatus: item.kycStatus }),
    segment: mapTaskerSegment(item),
    status: mapTaskerStatus(item),
    owner: "Fleet desk",
    updatedAt: formatDateTime(item.updatedAt || item.createdAt),
    email: item.email ?? undefined,
    phone: item.phone ?? undefined,
    kycStatus: item.kycStatus,
    activationStatus: item.activationStatus,
    payoutCount,
    supportCount,
  };
}

function mapTaskerStatus(item: TaskerApiItem): AdminStatus {
  if (item.activationStatus === "suspended") return "paused";
  if (item.kycStatus === "pending_review" || item.kycStatus === "pending_submission") return "review";
  if (item.kycStatus === "rejected") return "queued";
  if (item.activationStatus === "active") return "live";
  if (item.activationStatus === "inactive") return "queued";
  return "monitoring";
}

function mapTaskerSegment(item: TaskerApiItem): string {
  if (item.kycStatus === "pending_review") return "KYC review";
  if (item.kycStatus === "approved" && item.activationStatus === "active") return "Active driver";
  if (item.kycStatus === "rejected") return "Rejected";
  return "Onboarding";
}

function buildTaskerContext({
  payoutCount,
  supportCount,
  kycStatus,
}: {
  payoutCount: number;
  supportCount: number;
  kycStatus?: string | null;
}) {
  if (kycStatus === "pending_review") return "KYC documents submitted, awaiting review.";
  if (supportCount > 0) return `${supportCount} support cases linked to this tasker.`;
  if (payoutCount > 0) return `${payoutCount} payout requests on record.`;
  return "Tasker profile loaded from the fleet registry.";
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
