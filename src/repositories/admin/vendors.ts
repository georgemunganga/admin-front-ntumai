"use client";

import { useMemo } from "react";
import { marketplaceVendors, type MarketplaceVendor } from "@/components/marketplace/vendor-data";
import { useAdminResource, postAdminData } from "@/repositories/admin/admin-api";
import type { AdminStatus } from "@/contracts/admin-domain";

// ─── Types ────────────────────────────────────────────────────────────────────

export type VendorListRecord = {
  id: string;
  slug: string;
  name: string;
  segment: string;
  categories: string[];
  context: string;
  owner: string;
  status: AdminStatus;
  updatedAt: string;
  city: string;
  storeType: string;
  fulfillment: string;
  payoutSchedule: string;
  payoutMethod: string;
  subscriptionPlan: string;
  businessHours: string;
  visibility: string;
  description: string;
  tags: string[];
  metrics: Array<{ label: string; value: string }>;
  timeline: Array<{ label: string; detail: string; time: string }>;
  email?: string;
  phone?: string;
  kycStatus?: string | null;
  activationStatus?: string | null;
  storeName?: string | null;
  storeActive?: boolean;
  productCount?: number;
};

type VendorApiItem = {
  id: string;
  fullName: string;
  email?: string | null;
  phone?: string | null;
  kycStatus?: string | null;
  activationStatus?: string | null;
  onboardingStatus?: string | null;
  store?: {
    id: string;
    name: string;
    isActive: boolean;
    averageRating?: number | null;
    productCount?: number;
  } | null;
  counts?: { payoutRequests?: number; supportTickets?: number };
  createdAt?: string;
  updatedAt?: string;
};

type VendorApiPayload = { items: VendorApiItem[] };

// ─── Fixture helpers (fallback) ───────────────────────────────────────────────

export function listMarketplaceVendors(): MarketplaceVendor[] {
  return marketplaceVendors;
}

export function getMarketplaceVendorBySlug(slug: string): MarketplaceVendor | undefined {
  return marketplaceVendors.find((v) => v.slug === slug || v.id === slug);
}

export function listVendorSegments(): string[] {
  return Array.from(new Set(marketplaceVendors.map((v) => v.segment)));
}

// ─── Live hooks ───────────────────────────────────────────────────────────────

export function useAdminVendors(params?: { kycStatus?: string; search?: string }) {
  const path = buildVendorsPath(params);
  const fallback = useMemo(() => mapFixtureToVendorRecords(), []);
  return useAdminResource<VendorListRecord[]>({ path, fallback, map: mapVendorApiPayload });
}

export function useAdminVendorDetail(userId: string) {
  const fallback = useMemo(
    () => (getMarketplaceVendorBySlug(userId) ?? null) as MarketplaceVendor | null,
    [userId],
  );
  return useAdminResource<MarketplaceVendor | null>({
    path: `/api/v1/admin/vendors/${userId}`,
    fallback,
    map: mapVendorDetailPayload,
    enabled: Boolean(userId),
  });
}

// ─── P0 Mutation — Vendor KYC decision ───────────────────────────────────────

export async function applyVendorKycDecision(
  userId: string,
  kycStatus: "approved" | "rejected" | "suspended" | "pending_review",
  reason?: string,
  note?: string,
) {
  return postAdminData(`/api/v1/admin/users/${userId}/kyc`, {
    role: "vendor",
    kycStatus,
    ...(reason ? { reason } : {}),
    ...(note ? { note } : {}),
  });
}

// ─── Mapping helpers ──────────────────────────────────────────────────────────

function buildVendorsPath(params?: { kycStatus?: string; search?: string }) {
  const qs = new URLSearchParams();
  qs.set("limit", "100");
  if (params?.kycStatus) qs.set("kycStatus", params.kycStatus);
  if (params?.search) qs.set("search", params.search);
  return `/api/v1/admin/vendors?${qs.toString()}`;
}

function mapVendorApiPayload(payload: unknown): VendorListRecord[] {
  const items = (payload as VendorApiPayload)?.items ?? [];
  return items.map(mapVendorItemToRecord);
}

function mapVendorItemToRecord(item: VendorApiItem): VendorListRecord {
  const payoutCount = item.counts?.payoutRequests ?? 0;
  const supportCount = item.counts?.supportTickets ?? 0;
  const productCount = item.store?.productCount ?? 0;
  return {
    id: item.id,
    slug: item.id,
    name: item.fullName,
    segment: item.store ? "Active vendor" : "No store yet",
    categories: item.store ? [item.store.name] : [],
    context: item.store
      ? `${productCount} products in ${item.store.name}.`
      : "Vendor registered but no store provisioned yet.",
    owner: "Partner ops",
    status: mapVendorStatus(item),
    updatedAt: formatDateTime(item.updatedAt || item.createdAt),
    city: "Unknown",
    storeType: item.store ? "Online store" : "Pending",
    fulfillment: "Platform managed",
    payoutSchedule: payoutCount > 0 ? `${payoutCount} payout requests` : "No payouts yet",
    payoutMethod: "Platform wallet",
    subscriptionPlan: "Standard",
    businessHours: item.store?.isActive ? "Active" : "Offline",
    visibility: item.store?.isActive ? "Visible" : "Hidden",
    description: item.store
      ? `Vendor store: ${item.store.name}. Rating: ${item.store.averageRating?.toFixed(1) ?? "N/A"}.`
      : "No store description available.",
    tags: buildVendorTags(item),
    metrics: [
      { label: "Products", value: String(productCount) },
      { label: "Payouts", value: String(payoutCount) },
      { label: "Support cases", value: String(supportCount) },
    ],
    timeline: [],
    email: item.email ?? undefined,
    phone: item.phone ?? undefined,
    kycStatus: item.kycStatus,
    activationStatus: item.activationStatus,
    storeName: item.store?.name ?? null,
    storeActive: item.store?.isActive ?? false,
    productCount,
  };
}

function mapVendorDetailPayload(payload: unknown): MarketplaceVendor | null {
  const item = (payload as { data?: { item?: VendorApiItem } })?.data?.item;
  if (!item) return null;
  return mapVendorItemToRecord(item) as unknown as MarketplaceVendor;
}

function mapVendorStatus(item: VendorApiItem): AdminStatus {
  if (item.activationStatus === "suspended") return "paused";
  if (item.kycStatus === "pending_review" || item.kycStatus === "pending_submission") return "review";
  if (item.kycStatus === "rejected") return "queued";
  if (item.activationStatus === "active" && item.store?.isActive) return "live";
  if (item.activationStatus === "inactive") return "queued";
  return "monitoring";
}

function buildVendorTags(item: VendorApiItem): string[] {
  const tags: string[] = [];
  if (item.kycStatus === "approved") tags.push("KYC approved");
  else if (item.kycStatus === "pending_review") tags.push("KYC pending");
  else if (item.kycStatus === "rejected") tags.push("KYC rejected");
  if (item.store) tags.push("Store active");
  else tags.push("No store");
  if ((item.counts?.payoutRequests ?? 0) > 0) tags.push("Finance linked");
  return tags;
}

function mapFixtureToVendorRecords(): VendorListRecord[] {
  return marketplaceVendors.map((v) => ({
    ...v,
    email: undefined,
    phone: undefined,
    kycStatus: null,
    activationStatus: null,
    storeName: v.name,
    storeActive: v.status === "live",
    productCount: 0,
  }));
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
