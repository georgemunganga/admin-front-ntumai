"use client";

import type { AdminWorkflowContext } from "@/contracts/admin-domain";
import { marketplaceCategories, type MarketplaceCategory } from "@/components/marketplace/category-data";

export type CategoryGovernanceStatus = MarketplaceCategory["status"];

export type MarketplaceCategoryRecord = MarketplaceCategory & {
  workflow: AdminWorkflowContext;
};

const statusToWorkflowState: Record<CategoryGovernanceStatus, AdminWorkflowContext["state"]> = {
  live: "approved",
  stable: "resolved",
  review: "under_review",
  monitoring: "in_progress",
  queued: "submitted",
};

const statusToSummary: Record<CategoryGovernanceStatus, string> = {
  live: "Category is already shaping the customer storefront and vendor product creation flows.",
  stable: "Category is operating normally for both storefront discovery and vendor submissions.",
  review: "Category is waiting on catalog or compliance review before vendors can use it safely.",
  monitoring: "Category is live but needs merchandising or quality monitoring across mobile demand.",
  queued: "Category has been created for staff review and is not yet fully released to vendor flows.",
};

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
