"use client";

import { useMemo } from "react";
import type { AdminWorkflowContext } from "@/contracts/admin-domain";
import {
  marketplaceCategories,
  type MarketplaceCategory,
} from "@/components/marketplace/category-data";
import {
  deleteAdminData,
  patchAdminData,
  postAdminData,
  useAdminResource,
} from "@/repositories/admin/admin-api";

export type CategoryGovernanceStatus = MarketplaceCategory["status"];

export type MarketplaceCategoryRecord = MarketplaceCategory & {
  workflow: AdminWorkflowContext;
  iconKey?: string | null;
  imageUrl?: string | null;
  isActive?: boolean;
};

type CategoryApiItem = {
  id: string;
  name: string;
  iconKey?: string | null;
  imageUrl?: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type CategoryApiPayload = {
  items?: CategoryApiItem[];
  item?: CategoryApiItem;
};

type CategoryMutationInput = {
  name: string;
  iconKey?: string;
  imageUrl?: string;
  isActive?: boolean;
};

const statusToWorkflowState: Record<CategoryGovernanceStatus, AdminWorkflowContext["state"]> =
  {
    live: "approved",
    stable: "resolved",
    review: "under_review",
    monitoring: "in_progress",
    queued: "submitted",
  };

const statusToSummary: Record<CategoryGovernanceStatus, string> = {
  live: "Category is already shaping the customer storefront and vendor product creation flows.",
  stable:
    "Category is operating normally for both storefront discovery and vendor submissions.",
  review:
    "Category is waiting on catalog or compliance review before vendors can use it safely.",
  monitoring:
    "Category is live but needs merchandising or quality monitoring across mobile demand.",
  queued:
    "Category has been created for staff review and is not yet fully released to vendor flows.",
};

export function listMarketplaceCategories(): MarketplaceCategoryRecord[] {
  return marketplaceCategories.map(toMarketplaceCategoryRecord);
}

export function getMarketplaceCategoryById(id: string): MarketplaceCategoryRecord | undefined {
  const category = marketplaceCategories.find((item) => item.id === id || item.slug === id);
  return category ? toMarketplaceCategoryRecord(category) : undefined;
}

export function listCategoryStatuses(): CategoryGovernanceStatus[] {
  return Array.from(new Set(marketplaceCategories.map((category) => category.status)));
}

export function listCategoryGroups(): string[] {
  return Array.from(new Set(marketplaceCategories.map((category) => category.group)));
}

export function useAdminCategories() {
  const fallback = useMemo(() => listMarketplaceCategories(), []);
  return useAdminResource<MarketplaceCategoryRecord[]>({
    path: "/api/v1/admin/categories?limit=100",
    fallback,
    map: mapCategoriesPayload,
  });
}

export function useAdminCategoryDetail(categoryId: string) {
  const fallback = useMemo(
    () => getMarketplaceCategoryById(categoryId) ?? null,
    [categoryId],
  );
  return useAdminResource<MarketplaceCategoryRecord | null>({
    path: `/api/v1/admin/categories/${categoryId}`,
    fallback,
    map: mapCategoryDetailPayload,
    enabled: Boolean(categoryId),
  });
}

export async function createAdminCategory(input: CategoryMutationInput) {
  return postAdminData<{ item: CategoryApiItem }>(
    "/api/v1/admin/categories",
    sanitizeCategoryPayload(input),
  );
}

export async function updateAdminCategory(categoryId: string, input: CategoryMutationInput) {
  return patchAdminData<{ item: CategoryApiItem }>(
    `/api/v1/admin/categories/${categoryId}`,
    sanitizeCategoryPayload(input),
  );
}

export async function deleteAdminCategory(categoryId: string) {
  return deleteAdminData<{ deleted: boolean }>(`/api/v1/admin/categories/${categoryId}`);
}

function mapCategoriesPayload(payload: unknown): MarketplaceCategoryRecord[] {
  const items = (payload as CategoryApiPayload)?.items ?? [];
  return items.map(mapCategoryItemToRecord);
}

function mapCategoryDetailPayload(payload: unknown): MarketplaceCategoryRecord | null {
  const item = (payload as CategoryApiPayload)?.item;
  return item ? mapCategoryItemToRecord(item) : null;
}

function mapCategoryItemToRecord(item: CategoryApiItem): MarketplaceCategoryRecord {
  const status: CategoryGovernanceStatus = item.isActive ? "live" : "queued";
  const group = item.iconKey ? humanize(item.iconKey) : "Catalog";
  return {
    id: item.id,
    slug: item.id,
    name: item.name,
    group,
    owner: "Catalog ops",
    status,
    updatedAt: formatDateTime(item.updatedAt || item.createdAt),
    visibility: item.isActive ? "Marketplace live" : "Review hold",
    description:
      "Marketplace category governing vendor product placement and customer storefront discovery.",
    productCount: item.isActive ? "Live catalog" : "Review hold",
    rules: [item.isActive ? "Marketplace live" : "Review hold", "Vendor taxonomy"],
    workflow: {
      actor: "vendor",
      source: "catalog_management",
      state: statusToWorkflowState[status],
      ownerTeam: "marketplace_ops",
      summary: statusToSummary[status],
    },
    iconKey: item.iconKey ?? null,
    imageUrl: item.imageUrl ?? null,
    isActive: item.isActive,
  };
}

function toMarketplaceCategoryRecord(category: MarketplaceCategory): MarketplaceCategoryRecord {
  return {
    ...category,
    workflow: {
      actor: "vendor",
      source: "catalog_management",
      state: statusToWorkflowState[category.status],
      ownerTeam: "marketplace_ops",
      summary: statusToSummary[category.status],
    },
  };
}

function sanitizeCategoryPayload(input: CategoryMutationInput) {
  return {
    name: input.name,
    ...(input.iconKey !== undefined ? { iconKey: input.iconKey } : {}),
    ...(input.imageUrl !== undefined ? { imageUrl: input.imageUrl } : {}),
    ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
  };
}

function humanize(value: string) {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
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
