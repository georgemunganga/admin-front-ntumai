"use client";

export type MarketplaceCategory = {
  id: string;
  name: string;
  slug: string;
  group: string;
  owner: string;
  status: "live" | "stable" | "review" | "monitoring" | "queued";
  updatedAt: string;
  visibility: string;
  description: string;
  productCount: string;
  rules: string[];
};

export const marketplaceCategories: MarketplaceCategory[] = [
  {
    id: "CAT-1101",
    name: "Fresh produce",
    slug: "CAT-1101",
    group: "Grocery",
    owner: "Catalog ops",
    status: "live",
    updatedAt: "Today, 08:10",
    visibility: "Marketplace live",
    description: "High-frequency produce category for fruit, vegetables, and same-day grocery stock.",
    productCount: "84 products",
    rules: ["Same-day eligible", "Weight-based variants", "Freshness badge"],
  },
  {
    id: "CAT-1094",
    name: "Household",
    slug: "CAT-1094",
    group: "Essentials",
    owner: "Retail merchandising",
    status: "stable",
    updatedAt: "Today, 06:42",
    visibility: "Marketplace live",
    description: "Household essentials grouped for repeat replenishment and bundle merchandising.",
    productCount: "63 products",
    rules: ["Bundle support", "Low-stock watch"],
  },
  {
    id: "CAT-1088",
    name: "Pharmacy",
    slug: "CAT-1088",
    group: "Regulated",
    owner: "Compliance ops",
    status: "review",
    updatedAt: "Today, 09:04",
    visibility: "Review hold",
    description: "Restricted and regulated health products routed through compliance review before release.",
    productCount: "44 products",
    rules: ["Restricted copy review", "License checks", "Regulated-product flags"],
  },
  {
    id: "CAT-1080",
    name: "Quick meals",
    slug: "CAT-1080",
    group: "Food",
    owner: "Merchant success",
    status: "monitoring",
    updatedAt: "Yesterday",
    visibility: "Marketplace live",
    description: "Prepared meal category tracking fast menu rotation and peak lunch ordering.",
    productCount: "28 products",
    rules: ["Hot-food SLA", "Menu rotation", "Peak-hour promotions"],
  },
];

export function getMarketplaceCategory(id: string) {
  return marketplaceCategories.find((category) => category.id === id || category.slug === id);
}
