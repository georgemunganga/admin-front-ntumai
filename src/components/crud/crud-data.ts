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
  logisticsDrivers: {
    title: "Taskers",
    breadcrumb: ["Home", "Logistics", "Taskers"],
    searchPlaceholder: "Search drivers...",
    rows: [
      { id: "DRV-511", primary: "Onboarding cohort April B", secondary: "12 document checks", tertiary: "New riders", status: "review", owner: "Driver success", updatedAt: "Apr 26, 09:03" },
      { id: "DRV-510", primary: "Top-performing couriers", secondary: "97% completion", tertiary: "Performance", status: "live", owner: "Operations", updatedAt: "Apr 26, 08:45" },
      { id: "DRV-509", primary: "Low-battery sessions", secondary: "Offline risk", tertiary: "Realtime ops", status: "monitoring", owner: "Fleet desk", updatedAt: "Apr 26, 08:25" },
      { id: "DRV-508", primary: "Suspended accounts", secondary: "Fraud flags", tertiary: "Risk", status: "queued", owner: "Risk control", updatedAt: "Apr 26, 08:02" },
      { id: "DRV-507", primary: "Verified riders", secondary: "Ready for dispatch", tertiary: "Activation", status: "stable", owner: "Onboarding", updatedAt: "Apr 26, 07:41" },
    ],
  },
  logisticsExceptions: {
    title: "Exceptions",
    breadcrumb: ["Home", "Logistics", "Exceptions"],
    searchPlaceholder: "Search exceptions...",
    rows: [
      { id: "EX-204", primary: "Failed handoff", secondary: "Recipient unavailable on second attempt", tertiary: "Delivery disputes", status: "at_risk", owner: "Recovery team", updatedAt: "Apr 26, 09:18" },
      { id: "EX-198", primary: "Stacked route overload", secondary: "3 orders shifted off one courier", tertiary: "Dispatch", status: "review", owner: "Dispatch pod", updatedAt: "Apr 26, 08:51" },
      { id: "EX-194", primary: "Vehicle issue", secondary: "Bike battery swap required", tertiary: "Fleet care", status: "monitoring", owner: "Fleet ops", updatedAt: "Apr 26, 08:29" },
      { id: "EX-191", primary: "Cold chain warning", secondary: "Temperature threshold exceeded", tertiary: "Pharmacy lane", status: "queued", owner: "Compliance", updatedAt: "Apr 26, 08:06" },
      { id: "EX-188", primary: "Address mismatch", secondary: "Manual verification needed", tertiary: "Support assist", status: "live", owner: "Ops desk", updatedAt: "Apr 26, 07:37" },
    ],
  },
  marketplaceVendors: {
    title: "Vendors",
    breadcrumb: ["Home", "Marketplace", "Vendors"],
    searchPlaceholder: "Search vendors...",
    rows: [
      { id: "VEN-144", primary: "Green Basket Market", secondary: "Catalog freshness", tertiary: "Grocery", status: "stable", owner: "Vendor growth", updatedAt: "Apr 26, 09:01" },
      { id: "VEN-143", primary: "CityCare Pharmacy", secondary: "License expiry", tertiary: "Pharmacy", status: "monitoring", owner: "Compliance", updatedAt: "Apr 26, 08:47" },
      { id: "VEN-142", primary: "HomeBox Supplies", secondary: "Reject spike", tertiary: "Retail", status: "at_risk", owner: "Partner ops", updatedAt: "Apr 26, 08:14" },
      { id: "VEN-141", primary: "QuickBite Kitchens", secondary: "Menu asset refresh", tertiary: "Food", status: "review", owner: "Content ops", updatedAt: "Apr 26, 07:59" },
      { id: "VEN-140", primary: "FreshHub", secondary: "Healthy order rate", tertiary: "Produce", status: "live", owner: "Growth", updatedAt: "Apr 26, 07:36" },
    ],
  },
  marketplaceCategories: {
    title: "Categories",
    breadcrumb: ["Home", "Marketplace", "Categories"],
    searchPlaceholder: "Search categories...",
    rows: [
      { id: "CAT-201", primary: "Fresh produce collection", secondary: "22 SKUs hidden", tertiary: "Groceries", status: "review", owner: "Merchandising", updatedAt: "Apr 26, 09:05" },
      { id: "CAT-200", primary: "Household essentials", secondary: "Promo ends today", tertiary: "Home care", status: "live", owner: "Growth", updatedAt: "Apr 26, 08:42" },
      { id: "CAT-199", primary: "Pharmacy category", secondary: "Restricted items", tertiary: "Health", status: "monitoring", owner: "Compliance", updatedAt: "Apr 26, 08:16" },
      { id: "CAT-198", primary: "Electronics", secondary: "Image cleanup", tertiary: "Accessories", status: "queued", owner: "Content ops", updatedAt: "Apr 26, 07:58" },
      { id: "CAT-197", primary: "Quick meals", secondary: "Menu refresh", tertiary: "Food", status: "stable", owner: "Partner ops", updatedAt: "Apr 26, 07:42" },
    ],
  },
  marketplaceReviews: {
    title: "Reviews",
    breadcrumb: ["Home", "Marketplace", "Reviews"],
    searchPlaceholder: "Search reviews...",
    rows: [
      { id: "REV-611", primary: "QuickBite lunch menu", secondary: "4.8 avg after campaign", tertiary: "Food", status: "live", owner: "Growth", updatedAt: "Apr 26, 09:07" },
      { id: "REV-610", primary: "CityCare pharmacy listing", secondary: "Compliance concern raised", tertiary: "Health", status: "review", owner: "Trust team", updatedAt: "Apr 26, 08:44" },
      { id: "REV-609", primary: "Fresh produce quality feedback", secondary: "Delivery bruising complaints", tertiary: "Groceries", status: "monitoring", owner: "Vendor success", updatedAt: "Apr 26, 08:23" },
      { id: "REV-608", primary: "HomeBox household bundle", secondary: "Out-of-stock complaints", tertiary: "Retail", status: "queued", owner: "Catalog ops", updatedAt: "Apr 26, 07:58" },
      { id: "REV-607", primary: "Digital Point accessories", secondary: "Strong satisfaction trend", tertiary: "Electronics", status: "stable", owner: "Marketplace ops", updatedAt: "Apr 26, 07:34" },
    ],
  },
  salesOrders: {
    title: "Orders",
    breadcrumb: ["Home", "Sales", "Orders"],
    searchPlaceholder: "Search sales orders...",
    rows: [
      { id: "SAL-1042", primary: "Priority grocery basket", secondary: "Card paid", tertiary: "Lusaka Central", status: "live", owner: "Sales ops", updatedAt: "Apr 26, 09:15" },
      { id: "SAL-1041", primary: "Late-night meal order", secondary: "ETA complaint", tertiary: "Woodlands", status: "monitoring", owner: "Recovery desk", updatedAt: "Apr 26, 09:02" },
      { id: "SAL-1040", primary: "Corporate office restock", secondary: "Pricing override", tertiary: "Longacres", status: "review", owner: "Revenue ops", updatedAt: "Apr 26, 08:44" },
      { id: "SAL-1039", primary: "Pharmacy refill request", secondary: "Awaiting pickup", tertiary: "Roma", status: "queued", owner: "Merchant desk", updatedAt: "Apr 26, 08:31" },
      { id: "SAL-1038", primary: "Fresh produce order", secondary: "Packing complete", tertiary: "Kabulonga", status: "stable", owner: "Partner success", updatedAt: "Apr 26, 08:11" },
    ],
  },
  salesCustomers: {
    title: "Customers",
    breadcrumb: ["Home", "Sales", "Customers"],
    searchPlaceholder: "Search sales customers...",
    rows: [
      { id: "CRM-881", primary: "VIP retention cohort", secondary: "Recent inactivity", tertiary: "High value", status: "monitoring", owner: "Growth desk", updatedAt: "Apr 26, 09:04" },
      { id: "CRM-880", primary: "Wallet verification", secondary: "Manual KYC", tertiary: "Trust review", status: "review", owner: "Finance care", updatedAt: "Apr 26, 08:50" },
      { id: "CRM-879", primary: "High-frequency households", secondary: "Healthy cadence", tertiary: "Weekly repeat", status: "stable", owner: "Lifecycle", updatedAt: "Apr 26, 08:21" },
      { id: "CRM-878", primary: "Refund follow-up", secondary: "17 callbacks", tertiary: "Refunds", status: "at_risk", owner: "Customer care", updatedAt: "Apr 26, 08:00" },
      { id: "CRM-877", primary: "Referral campaign users", secondary: "Newly onboarded", tertiary: "Growth", status: "live", owner: "Acquisition", updatedAt: "Apr 26, 07:39" },
    ],
  },
  salesRefunds: {
    title: "Refunds",
    breadcrumb: ["Home", "Sales", "Refunds"],
    searchPlaceholder: "Search refunds...",
    rows: [
      { id: "REF-301", primary: "Failed drop-off compensation", secondary: "Wallet credit", tertiary: "Customer", status: "review", owner: "Finance ops", updatedAt: "Apr 26, 09:06" },
      { id: "REF-300", primary: "Stock-out refund batch", secondary: "Merchant chargeback", tertiary: "Partners", status: "monitoring", owner: "Risk + finance", updatedAt: "Apr 26, 08:43" },
      { id: "REF-299", primary: "Duplicate charge review", secondary: "Payment gateway", tertiary: "Payments", status: "queued", owner: "Billing desk", updatedAt: "Apr 26, 08:19" },
      { id: "REF-298", primary: "Cancelled basket claim", secondary: "Customer callback", tertiary: "Resolution", status: "live", owner: "Care pod", updatedAt: "Apr 26, 07:55" },
      { id: "REF-297", primary: "Delayed SLA compensation", secondary: "Auto-rule", tertiary: "Service credits", status: "stable", owner: "Revenue ops", updatedAt: "Apr 26, 07:28" },
    ],
  },
  salesPayouts: {
    title: "Payouts",
    breadcrumb: ["Home", "Sales", "Payouts"],
    searchPlaceholder: "Search payouts...",
    rows: [
      { id: "PAY-221", primary: "Green Basket weekly settlement", secondary: "Bank transfer queued", tertiary: "Vendors", status: "queued", owner: "Finance ops", updatedAt: "Apr 26, 09:12" },
      { id: "PAY-220", primary: "QuickBite payout release", secondary: "Reconciliation hold", tertiary: "Food vendors", status: "review", owner: "Revenue ops", updatedAt: "Apr 26, 08:57" },
      { id: "PAY-219", primary: "Driver incentive cycle", secondary: "Bonus cleared", tertiary: "Fleet", status: "live", owner: "Payroll desk", updatedAt: "Apr 26, 08:35" },
      { id: "PAY-218", primary: "Refund ledger top-up", secondary: "Wallet reserve", tertiary: "Customers", status: "monitoring", owner: "Billing", updatedAt: "Apr 26, 08:12" },
      { id: "PAY-217", primary: "Merchant recovery charge", secondary: "Manual adjustment", tertiary: "Finance", status: "stable", owner: "Collections", updatedAt: "Apr 26, 07:49" },
    ],
  },
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
    title: "Taskers",
    breadcrumb: ["Home", "Fleet", "Taskers"],
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
  supportTickets: {
    title: "Tickets",
    breadcrumb: ["Home", "Support", "Tickets"],
    searchPlaceholder: "Search support tickets...",
    rows: [
      { id: "TKT-073", primary: "Late delivery complaints", secondary: "Peak-hour spike", tertiary: "Customer care", status: "monitoring", owner: "Tier 1", updatedAt: "Apr 26, 09:10" },
      { id: "TKT-072", primary: "Wallet disputes", secondary: "Finance review", tertiary: "Payments", status: "review", owner: "Finance ops", updatedAt: "Apr 26, 08:48" },
      { id: "TKT-071", primary: "Cancellation appeals", secondary: "8 callbacks", tertiary: "Resolutions", status: "queued", owner: "Care pod", updatedAt: "Apr 26, 08:22" },
      { id: "TKT-070", primary: "Merchant support line", secondary: "Within SLA", tertiary: "Partners", status: "stable", owner: "Partner care", updatedAt: "Apr 26, 07:57" },
      { id: "TKT-069", primary: "Refund escalations", secondary: "Clearing", tertiary: "Refunds", status: "live", owner: "Support lead", updatedAt: "Apr 26, 07:30" },
    ],
  },
  supportEscalations: {
    title: "Escalations",
    breadcrumb: ["Home", "Support", "Escalations"],
    searchPlaceholder: "Search escalations...",
    rows: [
      { id: "ESC-041", primary: "Driver abuse investigation", secondary: "Legal follow-up", tertiary: "Trust & safety", status: "at_risk", owner: "Ops lead", updatedAt: "Apr 26, 09:18" },
      { id: "ESC-040", primary: "Pharmacy order compliance", secondary: "Restricted item dispute", tertiary: "Compliance", status: "review", owner: "Risk control", updatedAt: "Apr 26, 08:51" },
      { id: "ESC-039", primary: "Payment reversal backlog", secondary: "Manual release", tertiary: "Finance", status: "monitoring", owner: "Billing lead", updatedAt: "Apr 26, 08:29" },
      { id: "ESC-038", primary: "VIP customer recovery", secondary: "Executive callback", tertiary: "Retention", status: "live", owner: "Customer success", updatedAt: "Apr 26, 08:06" },
      { id: "ESC-037", primary: "Failed merchant handoff", secondary: "Multi-order impact", tertiary: "Merchant ops", status: "queued", owner: "Partner lead", updatedAt: "Apr 26, 07:37" },
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
