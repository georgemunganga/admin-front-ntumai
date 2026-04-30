"use client";

import type { AdminStatus, AdminTimelineEntry } from "@/contracts/admin-domain";

export type MarketplaceVendor = {
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
  timeline: AdminTimelineEntry[];
};

export const marketplaceVendors: MarketplaceVendor[] = [
  {
    id: "VND-2401",
    slug: "VND-2401",
    name: "Green Basket Market",
    segment: "Fresh produce",
    categories: ["Fresh produce", "Household"],
    context: "Daily produce catalog with same-day neighborhood delivery.",
    owner: "Partner ops",
    status: "live",
    updatedAt: "Today, 08:16",
    city: "Lusaka",
    storeType: "Grocery",
    fulfillment: "Same-day",
    payoutSchedule: "Weekly",
    payoutMethod: "Mobile money",
    subscriptionPlan: "Growth plan",
    businessHours: "06:00 - 20:00",
    visibility: "Marketplace live",
    description: "Neighborhood produce partner with high repeat order volume and same-day restock cycles.",
    tags: ["Top seller", "Same-day", "Fresh"],
    metrics: [
      { label: "Orders this week", value: "412" },
      { label: "Active products", value: "84" },
      { label: "On-time handoff", value: "96.2%" },
      { label: "Refund rate", value: "1.8%" },
    ],
    timeline: [
      { label: "Catalog refresh", detail: "Morning stock and price sync completed.", time: "08:16" },
      { label: "Payout cleared", detail: "Last settlement released with no holds.", time: "Yesterday" },
      { label: "Promo enabled", detail: "Weekend produce bundle reactivated.", time: "Yesterday" },
    ],
  },
  {
    id: "VND-2398",
    slug: "VND-2398",
    name: "QuickBite Kitchens",
    segment: "Quick meals",
    categories: ["Quick meals", "Drinks"],
    context: "Prepared meal partner with lunch and evening peak demand.",
    owner: "Merchant success",
    status: "stable",
    updatedAt: "Today, 07:52",
    city: "Lusaka",
    storeType: "Restaurant",
    fulfillment: "On-demand",
    payoutSchedule: "Twice weekly",
    payoutMethod: "Bank",
    subscriptionPlan: "Scale plan",
    businessHours: "10:00 - 22:00",
    visibility: "Marketplace live",
    description: "Prepared meals vendor with strong lunch demand and rotating menu operations.",
    tags: ["Hot food", "Lunch peak"],
    metrics: [
      { label: "Orders this week", value: "536" },
      { label: "Active products", value: "28" },
      { label: "On-time handoff", value: "93.7%" },
      { label: "Refund rate", value: "2.4%" },
    ],
    timeline: [
      { label: "Menu update", detail: "Lunch menu slots refreshed for the day.", time: "07:52" },
      { label: "SLA check", detail: "Peak-hour prep times remain within target.", time: "Yesterday" },
      { label: "Photo update", detail: "Hero images approved by catalog team.", time: "Yesterday" },
    ],
  },
  {
    id: "VND-2394",
    slug: "VND-2394",
    name: "CityCare Pharmacy",
    segment: "Pharmacy",
    categories: ["Pharmacy"],
    context: "Restricted-category partner with compliance-controlled listings.",
    owner: "Compliance ops",
    status: "review",
    updatedAt: "Today, 09:04",
    city: "Kitwe",
    storeType: "Pharmacy",
    fulfillment: "Scheduled",
    payoutSchedule: "Weekly",
    payoutMethod: "Bank",
    subscriptionPlan: "Growth plan",
    businessHours: "08:00 - 18:00",
    visibility: "Review hold",
    description: "Regulated-product partner with listings routed through compliance review before release.",
    tags: ["Restricted", "Compliance review"],
    metrics: [
      { label: "Orders this week", value: "128" },
      { label: "Active products", value: "44" },
      { label: "On-time handoff", value: "95.1%" },
      { label: "Refund rate", value: "1.2%" },
    ],
    timeline: [
      { label: "Compliance hold", detail: "Two listings waiting on regulated copy updates.", time: "09:04" },
      { label: "License check", detail: "Pharmacy documents revalidated this week.", time: "Yesterday" },
      { label: "Vendor response", detail: "Merchant uploaded revised product notes.", time: "Yesterday" },
    ],
  },
  {
    id: "VND-2388",
    slug: "VND-2388",
    name: "HomeBox Supplies",
    segment: "Household",
    categories: ["Household", "Essentials"],
    context: "Bulk essentials partner with replenishment sensitivity on top bundles.",
    owner: "Catalog ops",
    status: "monitoring",
    updatedAt: "Today, 06:48",
    city: "Ndola",
    storeType: "Household",
    fulfillment: "Next-slot",
    payoutSchedule: "Weekly",
    payoutMethod: "Mobile money",
    subscriptionPlan: "Starter plan",
    businessHours: "07:30 - 19:00",
    visibility: "Marketplace live",
    description: "Household partner under watch for low-stock pressure across top bundled items.",
    tags: ["Low stock", "Bundles"],
    metrics: [
      { label: "Orders this week", value: "214" },
      { label: "Active products", value: "63" },
      { label: "On-time handoff", value: "91.8%" },
      { label: "Refund rate", value: "3.1%" },
    ],
    timeline: [
      { label: "Low-stock watch", detail: "Bundle inventory still below target buffer.", time: "06:48" },
      { label: "Restock ETA", detail: "Supplier promised partial replenishment by tomorrow.", time: "Yesterday" },
      { label: "Promo paused", detail: "High-demand bundle promo disabled until stock stabilizes.", time: "Yesterday" },
    ],
  },
];

export function getMarketplaceVendor(slug: string) {
  return marketplaceVendors.find((vendor) => vendor.slug === slug || vendor.id === slug);
}
