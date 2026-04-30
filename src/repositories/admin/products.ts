"use client";

import type { AdminWorkflowContext } from "@/contracts/admin-domain";
import { marketplaceProducts, type MarketplaceProduct } from "@/components/marketplace/product-data";

export type ProductCatalogStatus = MarketplaceProduct["status"];

export type MarketplaceProductRecord = MarketplaceProduct & {
  workflow: AdminWorkflowContext;
};

const statusToWorkflowState: Record<ProductCatalogStatus, AdminWorkflowContext["state"]> = {
  Published: "approved",
  "Low stock": "blocked",
  Review: "under_review",
};

const statusToSummary: Record<ProductCatalogStatus, string> = {
  Published: "Product is live in the customer marketplace and needs normal storefront and dispatch monitoring.",
  "Low stock": "Product is visible to customers but needs vendor replenishment follow-up before the mobile flow degrades.",
  Review: "Product is held for catalog or compliance review before it can affect the mobile storefront.",
};

function toMarketplaceProductRecord(product: MarketplaceProduct): MarketplaceProductRecord {
  return {
    ...product,
    workflow: {
      actor: "vendor",
      source: "marketplace_order",
      state: statusToWorkflowState[product.status],
      ownerTeam: "marketplace_ops",
      summary: statusToSummary[product.status],
    },
  };
}

export function listMarketplaceProducts(): MarketplaceProductRecord[] {
  return marketplaceProducts.map(toMarketplaceProductRecord);
}

export function getMarketplaceProductBySlug(slug: string): MarketplaceProductRecord | undefined {
  const product = marketplaceProducts.find((item) => item.slug === slug || item.id === slug);
  return product ? toMarketplaceProductRecord(product) : undefined;
}

export function listProductStatuses(): ProductCatalogStatus[] {
  return Array.from(new Set(marketplaceProducts.map((product) => product.status)));
}

export function listProductCategories(): string[] {
  return Array.from(new Set(marketplaceProducts.map((product) => product.category)));
}
