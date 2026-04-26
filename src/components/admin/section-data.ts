export const dashboardStats = [
  {
    label: "Orders today",
    value: "1,248",
    change: "+12.4%",
    tone: "positive" as const,
    detail: "Fast-moving order volume across delivery and errand flows.",
  },
  {
    label: "Active drivers",
    value: "326",
    change: "+8 ready",
    tone: "neutral" as const,
    detail: "Available capacity currently online and eligible for dispatch.",
  },
  {
    label: "Support backlog",
    value: "41",
    change: "-9 cleared",
    tone: "positive" as const,
    detail: "Tickets still waiting for a first admin action or reassignment.",
  },
  {
    label: "Payments at risk",
    value: "17",
    change: "Needs review",
    tone: "warning" as const,
    detail: "Transactions, reversals, and wallet events needing manual eyes.",
  },
];

export const controlRooms = [
  {
    title: "Order operations",
    description: "Track live demand, failed checkouts, assignment stalls, and customer friction.",
    metric: "214 in motion",
  },
  {
    title: "Delivery network",
    description: "Keep dispatch, zones, fleet quality, and exception handling visible in one lane.",
    metric: "38 delayed",
  },
  {
    title: "Catalog and pricing",
    description: "Manage products, categories, vendors, availability, and promotional exposure.",
    metric: "12 pending edits",
  },
];

export const regionPulse = [
  { name: "Lusaka central", load: "Healthy", volume: "482 orders" },
  { name: "Longacres", load: "Monitoring", volume: "119 orders" },
  { name: "Roma", load: "Healthy", volume: "93 orders" },
  { name: "Woodlands", load: "At risk", volume: "61 orders" },
];

export const orderRows = [
  {
    primary: "Priority grocery basket",
    secondary: "Customer checkout / card paid",
    tertiary: "Ops desk A",
    status: "live",
  },
  {
    primary: "Pharmacy refill request",
    secondary: "Awaiting driver confirmation",
    tertiary: "Dispatch pod",
    status: "queued",
  },
  {
    primary: "Bulk office supply drop",
    secondary: "Vendor stock mismatch",
    tertiary: "Catalog review",
    status: "review",
  },
  {
    primary: "Late-night meal order",
    secondary: "Customer ETA complaint",
    tertiary: "Support escalation",
    status: "monitoring",
  },
];

export const deliveryRows = [
  {
    primary: "Lusaka CBD cluster",
    secondary: "27 live stops / 4 reassigned",
    tertiary: "Fleet desk",
    status: "stable",
  },
  {
    primary: "Airport corridor",
    secondary: "Traffic pressure on eastbound routes",
    tertiary: "Routing team",
    status: "monitoring",
  },
  {
    primary: "Woodlands express lane",
    secondary: "Driver shortage after shift drop",
    tertiary: "Driver success",
    status: "at_risk",
  },
  {
    primary: "Roma errands queue",
    secondary: "Stacking well with spare capacity",
    tertiary: "Dispatch pod",
    status: "live",
  },
];

export const catalogRows = [
  {
    primary: "Fresh produce collection",
    secondary: "22 SKUs hidden due to stock mismatch",
    tertiary: "Merchandising",
    status: "review",
  },
  {
    primary: "Household essentials",
    secondary: "Promo pricing ends in 6 hours",
    tertiary: "Growth team",
    status: "live",
  },
  {
    primary: "Pharmacy category",
    secondary: "Restricted item checks expanded",
    tertiary: "Compliance",
    status: "monitoring",
  },
  {
    primary: "Electronics",
    secondary: "Vendor image cleanup pending",
    tertiary: "Content ops",
    status: "queued",
  },
];

export const customerRows = [
  {
    primary: "VIP retention cohort",
    secondary: "Repeat buyers with recent inactivity",
    tertiary: "CRM desk",
    status: "monitoring",
  },
  {
    primary: "Wallet verification cases",
    secondary: "Manual KYC completion required",
    tertiary: "Trust team",
    status: "review",
  },
  {
    primary: "High-frequency households",
    secondary: "Stable order cadence this week",
    tertiary: "Customer success",
    status: "stable",
  },
  {
    primary: "Refund follow-up queue",
    secondary: "17 unresolved customer callbacks",
    tertiary: "Support pod",
    status: "at_risk",
  },
];

export const driverRows = [
  {
    primary: "Onboarding cohort April B",
    secondary: "12 awaiting final document checks",
    tertiary: "Driver success",
    status: "review",
  },
  {
    primary: "Top-performing couriers",
    secondary: "97% completion rate today",
    tertiary: "Operations",
    status: "live",
  },
  {
    primary: "Low-battery sessions",
    secondary: "Drivers likely to churn off route",
    tertiary: "Realtime ops",
    status: "monitoring",
  },
  {
    primary: "Suspended accounts",
    secondary: "Fraud flags and payment disputes",
    tertiary: "Risk control",
    status: "queued",
  },
];

export const vendorRows = [
  {
    primary: "Green Basket Market",
    secondary: "Catalog freshness above target",
    tertiary: "Vendor growth",
    status: "stable",
  },
  {
    primary: "CityCare Pharmacy",
    secondary: "License expiry reminder triggered",
    tertiary: "Compliance desk",
    status: "monitoring",
  },
  {
    primary: "HomeBox Supplies",
    secondary: "Order reject spike after noon",
    tertiary: "Partner ops",
    status: "at_risk",
  },
  {
    primary: "QuickBite Kitchens",
    secondary: "Menu asset refresh requested",
    tertiary: "Content ops",
    status: "review",
  },
];

export const contentRows = [
  {
    primary: "Homepage hero rotation",
    secondary: "Weekend delivery campaign assets",
    tertiary: "Growth marketing",
    status: "live",
  },
  {
    primary: "Push notification bundle",
    secondary: "Segmented re-engagement drafts",
    tertiary: "CRM desk",
    status: "review",
  },
  {
    primary: "Vendor spotlight banner",
    secondary: "Awaiting copy and legal checks",
    tertiary: "Brand team",
    status: "queued",
  },
  {
    primary: "App store screenshots",
    secondary: "Refresh after feature release",
    tertiary: "Product marketing",
    status: "monitoring",
  },
];

export const supportRows = [
  {
    primary: "Late delivery complaints",
    secondary: "Peak hour spikes in two zones",
    tertiary: "Support tier 1",
    status: "monitoring",
  },
  {
    primary: "Wallet dispute cases",
    secondary: "Need finance review before resolution",
    tertiary: "Finance ops",
    status: "review",
  },
  {
    primary: "Order cancellation appeals",
    secondary: "8 still pending a callback",
    tertiary: "Resolution pod",
    status: "queued",
  },
  {
    primary: "Merchant support line",
    secondary: "Response times back within target",
    tertiary: "Partner support",
    status: "stable",
  },
];

export const settingsRows = [
  {
    primary: "Fees and commissions",
    secondary: "Awaiting rollout approval",
    tertiary: "Finance + product",
    status: "review",
  },
  {
    primary: "Fulfilment zones",
    secondary: "Two new suburbs prepared for launch",
    tertiary: "Ops strategy",
    status: "queued",
  },
  {
    primary: "Notification rules",
    secondary: "Fallback SMS thresholds tuned",
    tertiary: "Platform ops",
    status: "stable",
  },
  {
    primary: "Role permissions",
    secondary: "Admin scope cleanup needed",
    tertiary: "Security desk",
    status: "monitoring",
  },
];
