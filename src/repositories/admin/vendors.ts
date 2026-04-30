"use client";

import { marketplaceVendors, type MarketplaceVendor } from "@/components/marketplace/vendor-data";

export function listMarketplaceVendors(): MarketplaceVendor[] {
  return marketplaceVendors;
}

export function getMarketplaceVendorBySlug(slug: string): MarketplaceVendor | undefined {
  return marketplaceVendors.find((vendor) => vendor.slug === slug || vendor.id === slug);
}

export function listVendorSegments(): string[] {
  return Array.from(new Set(marketplaceVendors.map((vendor) => vendor.segment)));
}
