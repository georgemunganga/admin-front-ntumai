export type CrudRecord = {
  id: string;
  primary: string;
  secondary: string;
  tertiary: string;
  status: string;
  owner: string;
  updatedAt: string;
};

export type CrudPageConfig = {
  title: string;
  breadcrumb: string[];
  searchPlaceholder: string;
  rows: CrudRecord[];
};

export const crudPages: Record<string, CrudPageConfig> = {
  orders: {
    title: "Orders",
    breadcrumb: ["Home", "Operations", "Orders"],
    searchPlaceholder: "Search orders...",
    rows: [
      { id: "ORD-1042", primary: "Priority grocery basket", secondary: "Card paid", tertiary: "Lusaka Central", status: "live", owner: "Ops desk A", updatedAt: "Apr 26, 09:15" },
      { id: "ORD-1041", primary: "Late-night meal order", secondary: "ETA complaint", tertiary: "Woodlands", status: "monitoring", owner: "Care pod", updatedAt: "Apr 26, 09:02" },
      { id: "ORD-1040", primary: "Corporate office restock", secondary: "Pricing override", tertiary: "Longacres", status: "review", owner: "Finance ops", updatedAt: "Apr 26, 08:44" },
      { id: "ORD-1039", primary: "Pharmacy refill request", secondary: "Awaiting driver", tertiary: "Roma", status: "queued", owner: "Dispatch pod", updatedAt: "Apr 26, 08:31" },
      { id: "ORD-1038", primary: "Fresh produce order", secondary: "Packing complete", tertiary: "Kabulonga", status: "stable", owner: "Merchant ops", updatedAt: "Apr 26, 08:11" },
    ],
  },
  deliveries: {
    title: "Deliveries",
    breadcrumb: ["Home", "Operations", "Deliveries"],
    searchPlaceholder: "Search deliveries...",
    rows: [
      { id: "DLV-322", primary: "Lusaka CBD cluster", secondary: "27 live stops", tertiary: "Fleet lane A", status: "stable", owner: "Dispatch", updatedAt: "Apr 26, 09:12" },
      { id: "DLV-321", primary: "Airport corridor", secondary: "Traffic pressure", tertiary: "East route", status: "monitoring", owner: "Routing", updatedAt: "Apr 26, 08:58" },
      { id: "DLV-320", primary: "Woodlands express", secondary: "Driver shortage", tertiary: "South route", status: "at_risk", owner: "Fleet success", updatedAt: "Apr 26, 08:41" },
      { id: "DLV-319", primary: "Roma errands", secondary: "Reserve capacity", tertiary: "West route", status: "live", owner: "Dispatch", updatedAt: "Apr 26, 08:20" },
      { id: "DLV-318", primary: "Levy Junction", secondary: "Handoff clean", tertiary: "Retail lane", status: "stable", owner: "Ops", updatedAt: "Apr 26, 08:03" },
    ],
  },
  catalog: {
    title: "Catalog",
    breadcrumb: ["Home", "Commerce", "Catalog"],
    searchPlaceholder: "Search products or categories...",
    rows: [
      { id: "CAT-201", primary: "Fresh produce collection", secondary: "22 SKUs hidden", tertiary: "Groceries", status: "review", owner: "Merchandising", updatedAt: "Apr 26, 09:05" },
      { id: "CAT-200", primary: "Household essentials", secondary: "Promo ends today", tertiary: "Home care", status: "live", owner: "Growth", updatedAt: "Apr 26, 08:42" },
      { id: "CAT-199", primary: "Pharmacy category", secondary: "Restricted items", tertiary: "Health", status: "monitoring", owner: "Compliance", updatedAt: "Apr 26, 08:16" },
      { id: "CAT-198", primary: "Electronics", secondary: "Image cleanup", tertiary: "Accessories", status: "queued", owner: "Content ops", updatedAt: "Apr 26, 07:58" },
      { id: "CAT-197", primary: "Quick meals", secondary: "Menu refresh", tertiary: "Food", status: "stable", owner: "Partner ops", updatedAt: "Apr 26, 07:42" },
    ],
  },
  customers: {
    title: "Customers",
    breadcrumb: ["Home", "People", "Customers"],
    searchPlaceholder: "Search customers...",
    rows: [
      { id: "CUS-881", primary: "VIP retention cohort", secondary: "Recent inactivity", tertiary: "High value", status: "monitoring", owner: "CRM desk", updatedAt: "Apr 26, 09:04" },
      { id: "CUS-880", primary: "Wallet verification", secondary: "Manual KYC", tertiary: "Trust review", status: "review", owner: "Trust team", updatedAt: "Apr 26, 08:50" },
      { id: "CUS-879", primary: "High-frequency households", secondary: "Healthy cadence", tertiary: "Weekly repeat", status: "stable", owner: "Success team", updatedAt: "Apr 26, 08:21" },
      { id: "CUS-878", primary: "Refund follow-up", secondary: "17 callbacks", tertiary: "Refunds", status: "at_risk", owner: "Care pod", updatedAt: "Apr 26, 08:00" },
      { id: "CUS-877", primary: "Referral campaign users", secondary: "Newly onboarded", tertiary: "Growth", status: "live", owner: "Growth desk", updatedAt: "Apr 26, 07:39" },
    ],
  },
  drivers: {
    title: "Drivers",
    breadcrumb: ["Home", "Fleet", "Drivers"],
    searchPlaceholder: "Search drivers...",
    rows: [
      { id: "DRV-511", primary: "Onboarding cohort April B", secondary: "12 document checks", tertiary: "New riders", status: "review", owner: "Driver success", updatedAt: "Apr 26, 09:03" },
      { id: "DRV-510", primary: "Top-performing couriers", secondary: "97% completion", tertiary: "Performance", status: "live", owner: "Operations", updatedAt: "Apr 26, 08:45" },
      { id: "DRV-509", primary: "Low-battery sessions", secondary: "Offline risk", tertiary: "Realtime ops", status: "monitoring", owner: "Fleet desk", updatedAt: "Apr 26, 08:25" },
      { id: "DRV-508", primary: "Suspended accounts", secondary: "Fraud flags", tertiary: "Risk", status: "queued", owner: "Risk control", updatedAt: "Apr 26, 08:02" },
      { id: "DRV-507", primary: "Verified riders", secondary: "Ready for dispatch", tertiary: "Activation", status: "stable", owner: "Onboarding", updatedAt: "Apr 26, 07:41" },
    ],
  },
  vendors: {
    title: "Vendors",
    breadcrumb: ["Home", "Partners", "Vendors"],
    searchPlaceholder: "Search vendors...",
    rows: [
      { id: "VEN-144", primary: "Green Basket Market", secondary: "Catalog freshness", tertiary: "Grocery", status: "stable", owner: "Vendor growth", updatedAt: "Apr 26, 09:01" },
      { id: "VEN-143", primary: "CityCare Pharmacy", secondary: "License expiry", tertiary: "Pharmacy", status: "monitoring", owner: "Compliance", updatedAt: "Apr 26, 08:47" },
      { id: "VEN-142", primary: "HomeBox Supplies", secondary: "Reject spike", tertiary: "Retail", status: "at_risk", owner: "Partner ops", updatedAt: "Apr 26, 08:14" },
      { id: "VEN-141", primary: "QuickBite Kitchens", secondary: "Menu asset refresh", tertiary: "Food", status: "review", owner: "Content ops", updatedAt: "Apr 26, 07:59" },
      { id: "VEN-140", primary: "FreshHub", secondary: "Healthy order rate", tertiary: "Produce", status: "live", owner: "Growth", updatedAt: "Apr 26, 07:36" },
    ],
  },
  support: {
    title: "Support",
    breadcrumb: ["Home", "Care", "Support"],
    searchPlaceholder: "Search tickets or queues...",
    rows: [
      { id: "SUP-073", primary: "Late delivery complaints", secondary: "Peak-hour spike", tertiary: "Customer care", status: "monitoring", owner: "Tier 1", updatedAt: "Apr 26, 09:10" },
      { id: "SUP-072", primary: "Wallet disputes", secondary: "Finance review", tertiary: "Payments", status: "review", owner: "Finance ops", updatedAt: "Apr 26, 08:48" },
      { id: "SUP-071", primary: "Cancellation appeals", secondary: "8 callbacks", tertiary: "Resolutions", status: "queued", owner: "Care pod", updatedAt: "Apr 26, 08:22" },
      { id: "SUP-070", primary: "Merchant support line", secondary: "Within SLA", tertiary: "Partners", status: "stable", owner: "Partner care", updatedAt: "Apr 26, 07:57" },
      { id: "SUP-069", primary: "Refund escalations", secondary: "Clearing", tertiary: "Refunds", status: "live", owner: "Support lead", updatedAt: "Apr 26, 07:30" },
    ],
  },
  settings: {
    title: "Settings",
    breadcrumb: ["Home", "System", "Settings"],
    searchPlaceholder: "Search settings...",
    rows: [
      { id: "SET-01", primary: "Fees and commissions", secondary: "Rollout approval", tertiary: "Finance rules", status: "review", owner: "Finance + Product", updatedAt: "Apr 26, 09:06" },
      { id: "SET-02", primary: "Fulfilment zones", secondary: "Two suburbs ready", tertiary: "Expansion", status: "queued", owner: "Ops strategy", updatedAt: "Apr 26, 08:43" },
      { id: "SET-03", primary: "Notification rules", secondary: "Threshold tuned", tertiary: "Messaging", status: "stable", owner: "Platform ops", updatedAt: "Apr 26, 08:19" },
      { id: "SET-04", primary: "Role permissions", secondary: "Cleanup needed", tertiary: "Access control", status: "monitoring", owner: "Security", updatedAt: "Apr 26, 07:55" },
      { id: "SET-05", primary: "Dispatch policy", secondary: "Latest update active", tertiary: "Operations", status: "live", owner: "Dispatch lead", updatedAt: "Apr 26, 07:28" },
    ],
  },
};
