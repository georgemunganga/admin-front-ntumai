"use client";

export type MarketplaceProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  subcategory: string;
  businessType: string;
  vendor: string;
  stock: string;
  stockLevel: number;
  price: string;
  priceValue: number;
  status: "Published" | "Low stock" | "Review";
  sku: string;
  description: string;
  fulfillment: string;
  visibility: string;
  updatedAt: string;
  tags: string[];
  isAvailable: boolean;
  reviewLane: string;
  attributes: Array<{ label: string; value: string }>;
  timeline: Array<{ label: string; detail: string; time: string }>;
};

export const marketplaceProducts: MarketplaceProduct[] = [
  {
    id: "PRD-4201",
    slug: "PRD-4201",
    name: "Organic tomato basket",
    category: "Fresh produce",
    subcategory: "Tomatoes & onions",
    businessType: "Grocery vendor",
    vendor: "Green Basket Market",
    stock: "84",
    stockLevel: 84,
    price: "ZMW 95",
    priceValue: 95,
    status: "Published",
    sku: "GBM-TOM-084",
    description: "Fresh tomato basket prepared for daily neighborhood delivery windows.",
    fulfillment: "Same-day",
    visibility: "Marketplace live",
    updatedAt: "Today, 08:42",
    tags: ["Fresh", "Top seller", "Same-day"],
    isAvailable: true,
    reviewLane: "Auto-review",
    attributes: [
      { label: "Unit", value: "Basket" },
      { label: "Weight", value: "4kg" },
      { label: "Lead time", value: "Under 2h" },
      { label: "Storage", value: "Ambient" },
    ],
    timeline: [
      { label: "Price updated", detail: "Morning market adjustment synced from vendor.", time: "08:42" },
      { label: "Stock synced", detail: "Inventory count refreshed from vendor panel.", time: "08:20" },
      { label: "Quality review passed", detail: "Catalog team cleared image and copy checks.", time: "Yesterday" },
    ],
  },
  {
    id: "PRD-4198",
    slug: "PRD-4198",
    name: "Family essentials pack",
    category: "Household",
    subcategory: "Cleaning bundles",
    businessType: "Retail vendor",
    vendor: "HomeBox Supplies",
    stock: "36",
    stockLevel: 36,
    price: "ZMW 280",
    priceValue: 280,
    status: "Low stock",
    sku: "HBX-FAM-036",
    description: "Mixed household bundle covering soap, tissue, and kitchen basics.",
    fulfillment: "Next-slot",
    visibility: "Marketplace live",
    updatedAt: "Today, 07:16",
    tags: ["Bundle", "Low stock"],
    isAvailable: true,
    reviewLane: "Catalog QA",
    attributes: [
      { label: "Unit", value: "Pack" },
      { label: "Weight", value: "6.5kg" },
      { label: "Lead time", value: "3h" },
      { label: "Storage", value: "Dry shelf" },
    ],
    timeline: [
      { label: "Low-stock alert", detail: "Catalog watch threshold crossed this morning.", time: "07:16" },
      { label: "Promo removed", detail: "Bundle discount paused until replenishment confirms.", time: "Yesterday" },
      { label: "Vendor note added", detail: "Supplier expects partial restock by tomorrow.", time: "Yesterday" },
    ],
  },
  {
    id: "PRD-4192",
    slug: "PRD-4192",
    name: "Pain relief combo",
    category: "Pharmacy",
    subcategory: "Pain relief",
    businessType: "Pharmacy vendor",
    vendor: "CityCare Pharmacy",
    stock: "122",
    stockLevel: 122,
    price: "ZMW 145",
    priceValue: 145,
    status: "Review",
    sku: "CCP-REL-122",
    description: "Over-the-counter relief combo pending restricted-category copy review.",
    fulfillment: "Scheduled",
    visibility: "Review hold",
    updatedAt: "Today, 09:04",
    tags: ["Restricted", "Compliance review"],
    isAvailable: false,
    reviewLane: "Compliance review",
    attributes: [
      { label: "Unit", value: "Combo pack" },
      { label: "Weight", value: "0.4kg" },
      { label: "Lead time", value: "4h" },
      { label: "Storage", value: "Controlled shelf" },
    ],
    timeline: [
      { label: "Compliance hold", detail: "Description needs regulated-product wording update.", time: "09:04" },
      { label: "Vendor revision requested", detail: "Pharmacy team asked for dosage clarification.", time: "08:31" },
      { label: "Stock confirmed", detail: "Inventory remains healthy while review is open.", time: "Yesterday" },
    ],
  },
  {
    id: "PRD-4187",
    slug: "PRD-4187",
    name: "Lunch bowl combo",
    category: "Quick meals",
    subcategory: "Prepared lunch bowls",
    businessType: "Food vendor",
    vendor: "QuickBite Kitchens",
    stock: "Daily menu",
    stockLevel: 999,
    price: "ZMW 88",
    priceValue: 88,
    status: "Published",
    sku: "QBK-LUN-001",
    description: "Prepared lunch combo rotating with the vendor's daily kitchen menu.",
    fulfillment: "On-demand",
    visibility: "Marketplace live",
    updatedAt: "Today, 10:05",
    tags: ["Hot food", "Lunch"],
    isAvailable: true,
    reviewLane: "Auto-review",
    attributes: [
      { label: "Unit", value: "Meal" },
      { label: "Weight", value: "0.8kg" },
      { label: "Lead time", value: "35 min" },
      { label: "Storage", value: "Prepared fresh" },
    ],
    timeline: [
      { label: "Menu swapped", detail: "Vendor published today's lunch variant.", time: "10:05" },
      { label: "Photo approved", detail: "Latest image passed catalog quality checks.", time: "Yesterday" },
      { label: "Availability extended", detail: "Lunch window extended through late afternoon.", time: "Yesterday" },
    ],
  },
  {
    id: "PRD-4181",
    slug: "PRD-4181",
    name: "USB charger cable",
    category: "Accessories",
    subcategory: "Charging accessories",
    businessType: "Electronics vendor",
    vendor: "Digital Point",
    stock: "12",
    stockLevel: 12,
    price: "ZMW 60",
    priceValue: 60,
    status: "Low stock",
    sku: "DGP-USB-012",
    description: "Fast-charging USB cable with low remaining stock in the current batch.",
    fulfillment: "Same-day",
    visibility: "Marketplace live",
    updatedAt: "Today, 06:54",
    tags: ["Accessory", "Low stock"],
    isAvailable: true,
    reviewLane: "Catalog QA",
    attributes: [
      { label: "Unit", value: "Cable" },
      { label: "Weight", value: "0.1kg" },
      { label: "Lead time", value: "90 min" },
      { label: "Storage", value: "Shelf bin" },
    ],
    timeline: [
      { label: "Low-stock alert", detail: "Current batch dropped below reorder threshold.", time: "06:54" },
      { label: "Vendor follow-up", detail: "Supplier asked to confirm replenishment ETA.", time: "Yesterday" },
      { label: "Catalog sync", detail: "Listing refreshed after barcode verification.", time: "Yesterday" },
    ],
  },
];

export function getMarketplaceProduct(slug: string) {
  return marketplaceProducts.find((product) => product.slug === slug || product.id === slug);
}
