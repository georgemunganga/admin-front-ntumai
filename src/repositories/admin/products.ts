"use client";

import { useMemo } from "react";
import type { AdminWorkflowContext } from "@/contracts/admin-domain";
import { marketplaceProducts, type MarketplaceProduct } from "@/components/marketplace/product-data";
import {
  patchAdminData,
  postAdminData,
  useAdminResource,
} from "@/repositories/admin/admin-api";

export type ProductCatalogStatus = MarketplaceProduct["status"];

export type MarketplaceProductRecord = MarketplaceProduct & {
  workflow: AdminWorkflowContext;
  storeId?: string;
  categoryId?: string | null;
  brandId?: string | null;
  imageUrl?: string | null;
};

type ProductApiItem = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  discountedPrice?: number | null;
  stock: number;
  imageUrl?: string | null;
  tags?: string[];
  isActive: boolean;
  categoryId?: string | null;
  brandId?: string | null;
  subcategory?: string | null;
  storeId: string;
  createdAt?: string;
  updatedAt?: string;
  Store?: { id: string; name: string } | null;
  Category?: { id: string; name: string } | null;
  Brand?: { id: string; name: string } | null;
};

type ProductApiPayload = {
  items?: ProductApiItem[];
  item?: ProductApiItem;
};

type ProductMutationInput = {
  name: string;
  description?: string;
  price?: number;
  discountedPrice?: number | null;
  stock?: number;
  imageUrl?: string | null;
  tags?: string[];
  isActive?: boolean;
  categoryId?: string | null;
  brandId?: string | null;
  subcategory?: string | null;
  storeId?: string;
};

const statusToWorkflowState: Record<ProductCatalogStatus, AdminWorkflowContext["state"]> = {
  Published: "approved",
  "Low stock": "blocked",
  Review: "under_review",
};

const statusToSummary: Record<ProductCatalogStatus, string> = {
  Published:
    "Product is live in the customer marketplace and needs normal storefront and dispatch monitoring.",
  "Low stock":
    "Product is visible to customers but needs vendor replenishment follow-up before the mobile flow degrades.",
  Review:
    "Product is held for catalog or compliance review before it can affect the mobile storefront.",
};

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

export function useAdminProducts() {
  const fallback = useMemo(() => listMarketplaceProducts(), []);
  return useAdminResource<MarketplaceProductRecord[]>({
    path: "/api/v1/admin/products?limit=100",
    fallback,
    map: mapProductsPayload,
  });
}

export function useAdminProductDetail(productId: string) {
  const fallback = useMemo(
    () => getMarketplaceProductBySlug(productId) ?? null,
    [productId],
  );
  return useAdminResource<MarketplaceProductRecord | null>({
    path: `/api/v1/admin/products/${productId}`,
    fallback,
    map: mapProductDetailPayload,
    enabled: Boolean(productId),
  });
}

export async function createAdminProduct(input: ProductMutationInput) {
  return postAdminData<{ item: ProductApiItem }>("/api/v1/admin/products", sanitizeProductPayload(input));
}

export async function updateAdminProduct(productId: string, input: ProductMutationInput) {
  return patchAdminData<{ item: ProductApiItem }>(
    `/api/v1/admin/products/${productId}`,
    sanitizeProductPayload(input),
  );
}

function mapProductsPayload(payload: unknown): MarketplaceProductRecord[] {
  const items = (payload as ProductApiPayload)?.items ?? [];
  return items.map(mapProductItemToRecord);
}

function mapProductDetailPayload(payload: unknown): MarketplaceProductRecord | null {
  const item = (payload as ProductApiPayload)?.item;
  return item ? mapProductItemToRecord(item) : null;
}

function mapProductItemToRecord(item: ProductApiItem): MarketplaceProductRecord {
  const status = mapProductStatus(item);
  const stockLevel = Number(item.stock ?? 0);
  const priceValue = Number(item.price ?? 0);
  const discountedPrice = item.discountedPrice ?? null;
  const vendor = item.Store?.name ?? "Marketplace vendor";
  const category = item.Category?.name ?? "Uncategorized";
  const updatedAt = formatDateTime(item.updatedAt || item.createdAt);

  return {
    id: item.id,
    slug: item.id,
    name: item.name,
    category,
    subcategory: item.subcategory ?? "General",
    businessType: "Marketplace vendor",
    vendor,
    stock: String(stockLevel),
    stockLevel,
    price: formatCurrency(discountedPrice ?? priceValue),
    priceValue: discountedPrice ?? priceValue,
    status,
    sku: item.id,
    description:
      item.description ??
      "Marketplace catalog item synced from the live admin product feed.",
    fulfillment: stockLevel > 0 ? "Same-day" : "Scheduled",
    visibility: item.isActive ? "Marketplace live" : "Review hold",
    updatedAt,
    tags: item.tags ?? [],
    isAvailable: item.isActive,
    reviewLane: item.isActive ? "Auto-review" : "Catalog QA",
    attributes: [
      { label: "Unit", value: "Item" },
      { label: "Weight", value: "Not set" },
      { label: "Lead time", value: stockLevel > 0 ? "Same-day" : "Needs review" },
      { label: "Storage", value: "General" },
    ],
    timeline: [
      {
        label: "Last sync",
        detail: item.isActive
          ? "Live catalog record refreshed from admin marketplace APIs."
          : "Product remains hidden pending admin review or reactivation.",
        time: updatedAt,
      },
    ],
    workflow: {
      actor: "vendor",
      source: "marketplace_order",
      state: statusToWorkflowState[status],
      ownerTeam: "marketplace_ops",
      summary: statusToSummary[status],
    },
    storeId: item.storeId,
    categoryId: item.categoryId ?? null,
    brandId: item.brandId ?? null,
    imageUrl: item.imageUrl ?? null,
  };
}

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

function mapProductStatus(item: ProductApiItem): ProductCatalogStatus {
  if (!item.isActive) return "Review";
  if (Number(item.stock ?? 0) <= 20) return "Low stock";
  return "Published";
}

function sanitizeProductPayload(input: ProductMutationInput) {
  return {
    name: input.name,
    ...(input.description !== undefined ? { description: input.description } : {}),
    ...(input.price !== undefined ? { price: input.price } : {}),
    ...(input.discountedPrice !== undefined
      ? { discountedPrice: input.discountedPrice }
      : {}),
    ...(input.stock !== undefined ? { stock: input.stock } : {}),
    ...(input.imageUrl !== undefined ? { imageUrl: input.imageUrl } : {}),
    ...(input.tags !== undefined ? { tags: input.tags } : {}),
    ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
    ...(input.categoryId !== undefined ? { categoryId: input.categoryId } : {}),
    ...(input.brandId !== undefined ? { brandId: input.brandId } : {}),
    ...(input.subcategory !== undefined ? { subcategory: input.subcategory } : {}),
    ...(input.storeId !== undefined ? { storeId: input.storeId } : {}),
  };
}

function formatCurrency(value: number) {
  return `ZMW ${Math.round(value)}`;
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
