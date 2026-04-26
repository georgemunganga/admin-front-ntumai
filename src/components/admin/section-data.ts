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

export const dispatchRows = [
  {
    primary: "Unassigned live bookings",
    secondary: "Trips waiting beyond assignment threshold",
    tertiary: "Dispatch pod",
    status: "at_risk",
  },
  {
    primary: "Scheduled airport runs",
    secondary: "Advance bookings needing final driver lock",
    tertiary: "Planning desk",
    status: "review",
  },
  {
    primary: "Manual reassignments",
    secondary: "Trips overridden by operators in the last hour",
    tertiary: "Ops control",
    status: "live",
  },
  {
    primary: "Zone demand spikes",
    secondary: "Heat clusters above supply in two corridors",
    tertiary: "Realtime desk",
    status: "monitoring",
  },
];

export const dispatchLiveMapRows = [
  {
    primary: "Lusaka CBD heat cluster",
    secondary: "Demand is outpacing available drivers in the central zone",
    tertiary: "Realtime map",
    status: "at_risk",
  },
  {
    primary: "Airport corridor supply",
    secondary: "Reserve drivers positioned for scheduled arrivals",
    tertiary: "Dispatch map",
    status: "stable",
  },
  {
    primary: "Woodlands surge watch",
    secondary: "Elevated ETAs tied to traffic and incomplete batching",
    tertiary: "Zone control",
    status: "monitoring",
  },
  {
    primary: "Incident pin review",
    secondary: "Operator notes pending on two stuck-trip alerts",
    tertiary: "Safety feed",
    status: "review",
  },
];

export const scheduledRideRows = [
  {
    primary: "Morning airport runs",
    secondary: "Advance bookings waiting for final driver lock-in",
    tertiary: "Planning desk",
    status: "review",
  },
  {
    primary: "Corporate evening block",
    secondary: "Grouped rides for one business client due after 17:00",
    tertiary: "B2B dispatch",
    status: "stable",
  },
  {
    primary: "Recurring medical drop-offs",
    secondary: "Weekly jobs need route smoothing for driver capacity",
    tertiary: "Scheduling lane",
    status: "monitoring",
  },
  {
    primary: "Missed prep alerts",
    secondary: "Advance rides where assigned supply is at risk of churn",
    tertiary: "Ops control",
    status: "queued",
  },
];

export const manualDispatchRows = [
  {
    primary: "Unmatched premium booking",
    secondary: "Operator intervention required after repeated auto-match failures",
    tertiary: "Dispatch pod",
    status: "at_risk",
  },
  {
    primary: "Force reassignment wave",
    secondary: "Trips manually moved after driver-side cancellations",
    tertiary: "Control room",
    status: "live",
  },
  {
    primary: "Priority merchant run",
    secondary: "One high-value order flow is being protected from delay",
    tertiary: "Merchant ops",
    status: "review",
  },
  {
    primary: "Batching override queue",
    secondary: "Operators are separating trips that auto-stacking handled poorly",
    tertiary: "Realtime ops",
    status: "monitoring",
  },
];

export const fleetRows = [
  {
    primary: "Pending driver applications",
    secondary: "New riders waiting for approval workflow",
    tertiary: "Onboarding team",
    status: "review",
  },
  {
    primary: "Expiring driver documents",
    secondary: "Licenses and insurance due within 7 days",
    tertiary: "Compliance queue",
    status: "monitoring",
  },
  {
    primary: "Vehicle inspection holds",
    secondary: "Assets blocked from supply until cleared",
    tertiary: "Fleet care",
    status: "queued",
  },
  {
    primary: "Incentive campaign cohort",
    secondary: "Drivers currently on peak-hour reward program",
    tertiary: "Supply growth",
    status: "live",
  },
];

export const fleetDriverRows = [
  {
    primary: "Top-performing couriers",
    secondary: "Drivers with strong completion and acceptance this week",
    tertiary: "Performance desk",
    status: "live",
  },
  {
    primary: "Low-activity drivers",
    secondary: "Supply accounts drifting offline during peak demand windows",
    tertiary: "Driver success",
    status: "monitoring",
  },
  {
    primary: "Quality coaching list",
    secondary: "Drivers with repeat complaints or falling service scores",
    tertiary: "Fleet ops",
    status: "review",
  },
  {
    primary: "Suspended driver queue",
    secondary: "Accounts waiting for final trust or compliance decisions",
    tertiary: "Risk control",
    status: "queued",
  },
];

export const fleetApplicationRows = [
  {
    primary: "New driver applications",
    secondary: "Fresh applicants waiting for first onboarding review",
    tertiary: "Onboarding desk",
    status: "review",
  },
  {
    primary: "Vehicle inspection holds",
    secondary: "Applicants blocked on asset verification before activation",
    tertiary: "Fleet care",
    status: "monitoring",
  },
  {
    primary: "Interview-ready cohort",
    secondary: "Candidates cleared for the next human approval step",
    tertiary: "Driver success",
    status: "stable",
  },
  {
    primary: "Rejected appeals",
    secondary: "Applicants requesting a second look after denial",
    tertiary: "Compliance",
    status: "queued",
  },
];

export const fleetDocumentRows = [
  {
    primary: "License expiry alerts",
    secondary: "Driver documents reaching the seven-day warning threshold",
    tertiary: "Compliance queue",
    status: "monitoring",
  },
  {
    primary: "Insurance renewal batch",
    secondary: "Vehicle policies awaiting upload and validation",
    tertiary: "Fleet care",
    status: "review",
  },
  {
    primary: "Inspection backlog",
    secondary: "Physical checks still pending before reactivation",
    tertiary: "Ops control",
    status: "queued",
  },
  {
    primary: "Auto-suspend candidates",
    secondary: "Accounts approaching document expiry without action",
    tertiary: "Governance",
    status: "at_risk",
  },
];

export const fleetVehicleRows = [
  {
    primary: "Maintenance due vehicles",
    secondary: "Fleet assets nearing service or inspection thresholds",
    tertiary: "Asset ops",
    status: "monitoring",
  },
  {
    primary: "Unassigned reserve vehicles",
    secondary: "Available assets ready for onboarding or supply recovery",
    tertiary: "Fleet desk",
    status: "stable",
  },
  {
    primary: "Damage review queue",
    secondary: "Reported incidents waiting for inspection and downtime decisions",
    tertiary: "Safety team",
    status: "review",
  },
  {
    primary: "Vehicle retirement list",
    secondary: "Assets with repeated reliability or compliance issues",
    tertiary: "Fleet strategy",
    status: "queued",
  },
];

export const crmRows = [
  {
    primary: "VIP rider retention list",
    secondary: "High-value users with recent drop in activity",
    tertiary: "CRM team",
    status: "monitoring",
  },
  {
    primary: "Corporate account billing review",
    secondary: "Monthly invoice and department limit checks",
    tertiary: "B2B desk",
    status: "review",
  },
  {
    primary: "Wallet adjustment queue",
    secondary: "Manual credits and debits awaiting confirmation",
    tertiary: "Finance support",
    status: "queued",
  },
  {
    primary: "Blocked user appeals",
    secondary: "Accounts requesting reinstatement after restriction",
    tertiary: "Trust team",
    status: "stable",
  },
];

export const crmRiderRows = [
  {
    primary: "VIP rider watchlist",
    secondary: "High-value customers showing lower repeat activity or rising complaints",
    tertiary: "CRM desk",
    status: "monitoring",
  },
  {
    primary: "Refund-heavy accounts",
    secondary: "Riders with repeated service recovery or wallet adjustments",
    tertiary: "Finance support",
    status: "review",
  },
  {
    primary: "Lifecycle reactivation pool",
    secondary: "Dormant users selected for win-back and promo targeting",
    tertiary: "Growth CRM",
    status: "stable",
  },
  {
    primary: "Flagged rider profiles",
    secondary: "Accounts needing trust or fraud review before normal treatment",
    tertiary: "Trust desk",
    status: "queued",
  },
];

export const crmCorporateRows = [
  {
    primary: "Monthly billing reviews",
    secondary: "Corporate accounts waiting for invoice sign-off or clarification",
    tertiary: "B2B finance",
    status: "review",
  },
  {
    primary: "Department ride limits",
    secondary: "Usage caps under revision after overspend on several teams",
    tertiary: "Account success",
    status: "monitoring",
  },
  {
    primary: "New company onboarding",
    secondary: "Business clients moving through setup and employee allocation",
    tertiary: "Enterprise desk",
    status: "stable",
  },
  {
    primary: "Policy exception requests",
    secondary: "Companies asking for special approvals on travel or spend rules",
    tertiary: "B2B ops",
    status: "queued",
  },
];

export const crmWalletRows = [
  {
    primary: "Manual credit queue",
    secondary: "Wallet adjustments waiting for support and finance confirmation",
    tertiary: "Wallet ops",
    status: "review",
  },
  {
    primary: "Failed reversal cases",
    secondary: "Customer balances not updated after payment-side refund attempts",
    tertiary: "Finance support",
    status: "monitoring",
  },
  {
    primary: "Promo wallet grants",
    secondary: "Incentive credits staged for campaign-based activation",
    tertiary: "Growth systems",
    status: "stable",
  },
  {
    primary: "Abuse investigation holds",
    secondary: "Wallet accounts frozen pending fraud and promo-abuse checks",
    tertiary: "Risk desk",
    status: "queued",
  },
];

export const riskRows = [
  {
    primary: "Fraud trip investigation",
    secondary: "Suspicious GPS and payment mismatch patterns",
    tertiary: "Risk desk",
    status: "at_risk",
  },
  {
    primary: "SOS incident follow-ups",
    secondary: "Open safety cases needing operator closure",
    tertiary: "Safety ops",
    status: "review",
  },
  {
    primary: "KYC compliance queue",
    secondary: "Pending merchant and driver verification reviews",
    tertiary: "Compliance team",
    status: "queued",
  },
  {
    primary: "Promo abuse watchlist",
    secondary: "Accounts linked to repeated incentive misuse",
    tertiary: "Fraud systems",
    status: "monitoring",
  },
];

export const riskFraudRows = [
  {
    primary: "Promo abuse cluster",
    secondary: "Linked accounts repeatedly triggering incentive and referral anomalies",
    tertiary: "Fraud desk",
    status: "monitoring",
  },
  {
    primary: "GPS spoofing review",
    secondary: "Trip movement signatures inconsistent with route and time expectations",
    tertiary: "Realtime risk",
    status: "review",
  },
  {
    primary: "Chargeback watchlist",
    secondary: "Customers and drivers tied to repeated payment disputes or reversals",
    tertiary: "Finance risk",
    status: "queued",
  },
  {
    primary: "Device-link investigation",
    secondary: "Multiple accounts mapped to overlapping device or identity patterns",
    tertiary: "Trust systems",
    status: "at_risk",
  },
];

export const riskEmergencyRows = [
  {
    primary: "Open SOS incidents",
    secondary: "Safety cases still awaiting operator closure or city-team response",
    tertiary: "Safety ops",
    status: "monitoring",
  },
  {
    primary: "Accident response queue",
    secondary: "Trip incidents needing documentation, contact logs, and disposition",
    tertiary: "Incident desk",
    status: "review",
  },
  {
    primary: "Unsafe trip reports",
    secondary: "Customer and driver safety complaints escalated for urgent action",
    tertiary: "Trust response",
    status: "queued",
  },
  {
    primary: "Emergency callback backlog",
    secondary: "Post-incident follow-ups still pending final notes and sign-off",
    tertiary: "Support safety",
    status: "stable",
  },
];

export const riskComplianceRows = [
  {
    primary: "Driver KYC reviews",
    secondary: "Verification cases waiting for final governance approval",
    tertiary: "Compliance team",
    status: "review",
  },
  {
    primary: "Merchant license expiry",
    secondary: "Regulated vendors approaching compliance cutoffs in live markets",
    tertiary: "Merchant governance",
    status: "monitoring",
  },
  {
    primary: "Restricted goods queue",
    secondary: "Products and categories blocked pending policy and regulatory review",
    tertiary: "Catalog compliance",
    status: "queued",
  },
  {
    primary: "Audit pack preparation",
    secondary: "Records being assembled for internal and external reporting needs",
    tertiary: "Regulatory ops",
    status: "stable",
  },
];

export const platformRows = [
  {
    primary: "Weekly revenue reporting pack",
    secondary: "Leadership dashboards and export checks",
    tertiary: "BI desk",
    status: "stable",
  },
  {
    primary: "App version control release",
    secondary: "Minimum version and force-update planning",
    tertiary: "Platform ops",
    status: "review",
  },
  {
    primary: "Admin role audit",
    secondary: "Permission review for recent staff changes",
    tertiary: "Security",
    status: "monitoring",
  },
  {
    primary: "Gateway health alerts",
    secondary: "Payment and SMS provider latency spikes",
    tertiary: "Infra control",
    status: "queued",
  },
];

export const platformReportRows = [
  {
    primary: "Revenue reporting pack",
    secondary: "Daily and weekly finance exports queued for leadership review",
    tertiary: "BI desk",
    status: "stable",
  },
  {
    primary: "Trip performance analysis",
    secondary: "Cancellation and SLA summaries waiting for ops commentary",
    tertiary: "Operations analytics",
    status: "review",
  },
  {
    primary: "Support KPI digest",
    secondary: "Ticket resolution trends flagged for service leadership",
    tertiary: "Support reporting",
    status: "monitoring",
  },
  {
    primary: "Zone performance rollout",
    secondary: "A new city dashboard is queued for stakeholder release",
    tertiary: "Analytics enablement",
    status: "queued",
  },
];

export const platformContentRows = [
  {
    primary: "Homepage banner rotation",
    secondary: "Campaign assets pending publish scheduling and review",
    tertiary: "Content ops",
    status: "review",
  },
  {
    primary: "FAQ article refresh",
    secondary: "Support content updates tied to new payment and refund flows",
    tertiary: "Help center",
    status: "stable",
  },
  {
    primary: "Policy page legal check",
    secondary: "Terms and rider safety copy awaiting final compliance sign-off",
    tertiary: "Legal ops",
    status: "monitoring",
  },
  {
    primary: "Merchant spotlight queue",
    secondary: "Promotional placements stacked behind copy and image approval",
    tertiary: "Growth content",
    status: "queued",
  },
];

export const platformHealthRows = [
  {
    primary: "Payment gateway latency",
    secondary: "Intermittent slowdown affecting reversal confirmations",
    tertiary: "Infra control",
    status: "monitoring",
  },
  {
    primary: "SMS provider failover",
    secondary: "Backup route activated for notification delivery coverage",
    tertiary: "Messaging ops",
    status: "review",
  },
  {
    primary: "Queue backlog sweep",
    secondary: "Background jobs catching up after peak processing load",
    tertiary: "Platform jobs",
    status: "queued",
  },
  {
    primary: "Map API health",
    secondary: "Routing calls are back inside normal latency bounds",
    tertiary: "Maps stack",
    status: "stable",
  },
];

export const growthRows = [
  {
    primary: "Promo campaign launch",
    secondary: "City-based discount campaign waiting for final publish",
    tertiary: "Growth marketing",
    status: "review",
  },
  {
    primary: "Driver bonus rollout",
    secondary: "Peak-hour incentive cohorts actively targeted this week",
    tertiary: "Supply growth",
    status: "live",
  },
  {
    primary: "Push segmentation refresh",
    secondary: "Retention audiences being recalculated for lifecycle messaging",
    tertiary: "CRM desk",
    status: "monitoring",
  },
  {
    primary: "Referral abuse cleanup",
    secondary: "Suspicious reward claims paused pending trust sign-off",
    tertiary: "Growth ops",
    status: "queued",
  },
];

export const growthPromotionRows = [
  {
    primary: "City discount campaign",
    secondary: "Region-targeted delivery fee promotion waiting for final release",
    tertiary: "Growth marketing",
    status: "review",
  },
  {
    primary: "Referral reward wave",
    secondary: "Customer invite incentives active but under abuse monitoring",
    tertiary: "Acquisition desk",
    status: "monitoring",
  },
  {
    primary: "Merchant co-promo queue",
    secondary: "Partner-funded offers stacked behind commercial approval",
    tertiary: "Marketplace growth",
    status: "queued",
  },
  {
    primary: "Retention offer lane",
    secondary: "Win-back promotions flowing to dormant user segments",
    tertiary: "CRM growth",
    status: "stable",
  },
];

export const growthIncentiveRows = [
  {
    primary: "Peak-hour bonus cohort",
    secondary: "Driver incentives active in high-demand zones this week",
    tertiary: "Supply growth",
    status: "live",
  },
  {
    primary: "Quest payout validation",
    secondary: "Performance reward cases waiting for commercial confirmation",
    tertiary: "Growth finance",
    status: "review",
  },
  {
    primary: "Low-uptake zone campaign",
    secondary: "One region’s incentive offer is underperforming against supply targets",
    tertiary: "Ops planning",
    status: "monitoring",
  },
  {
    primary: "Weekly target reset",
    secondary: "Next incentive cycle queued behind budget and rules refresh",
    tertiary: "Campaign ops",
    status: "queued",
  },
];

export const growthNotificationRows = [
  {
    primary: "Push campaign schedule",
    secondary: "Customer lifecycle messages prepared for the next engagement window",
    tertiary: "CRM messaging",
    status: "stable",
  },
  {
    primary: "SMS fallback queue",
    secondary: "Delivery and promo notifications staged through alternate messaging paths",
    tertiary: "Messaging ops",
    status: "monitoring",
  },
  {
    primary: "Broadcast approval lane",
    secondary: "Operational announcements waiting for copy and final sign-off",
    tertiary: "Comms desk",
    status: "review",
  },
  {
    primary: "Version alert rollout",
    secondary: "Force-update and release notices queued for segmented delivery",
    tertiary: "Platform comms",
    status: "queued",
  },
];

export const salesRows = [
  {
    primary: "Daily revenue snapshot",
    secondary: "Transaction totals and settlement deltas under review",
    tertiary: "Finance ops",
    status: "stable",
  },
  {
    primary: "Refund approvals",
    secondary: "Customer claims waiting for payment-side clearance",
    tertiary: "Support finance",
    status: "review",
  },
  {
    primary: "Payout exception batch",
    secondary: "Merchant and driver transfer failures grouped for retry",
    tertiary: "Settlement desk",
    status: "monitoring",
  },
  {
    primary: "Invoice aging queue",
    secondary: "Open business and merchant invoices moving beyond target terms",
    tertiary: "Collections",
    status: "queued",
  },
];

export const salesPaymentRows = [
  {
    primary: "Failed payment retries",
    secondary: "Customer charges waiting for rerun or wallet fallback handling",
    tertiary: "Payments ops",
    status: "monitoring",
  },
  {
    primary: "Chargeback investigation batch",
    secondary: "Card disputes grouped for finance and fraud review",
    tertiary: "Finance risk",
    status: "review",
  },
  {
    primary: "Settlement confirmation queue",
    secondary: "Payment-side events pending reconciliation against internal ledgers",
    tertiary: "Settlement desk",
    status: "queued",
  },
  {
    primary: "Healthy payment lane",
    secondary: "Transactions clearing without exceptions across normal flows",
    tertiary: "Payments platform",
    status: "stable",
  },
];

export const salesPayoutRows = [
  {
    primary: "Driver payout batch",
    secondary: "Supply settlements waiting for final approval and release",
    tertiary: "Payroll ops",
    status: "review",
  },
  {
    primary: "Merchant settlement queue",
    secondary: "Vendor and partner payouts blocked on reconciliation gaps",
    tertiary: "Finance ops",
    status: "monitoring",
  },
  {
    primary: "Failed transfer retries",
    secondary: "Bank-side errors requiring payout reruns or account checks",
    tertiary: "Settlement support",
    status: "queued",
  },
  {
    primary: "Cleared payout cycle",
    secondary: "Weekly settlements processed inside expected operating window",
    tertiary: "Treasury",
    status: "stable",
  },
];

export const salesRefundRows = [
  {
    primary: "Auto-refund validation",
    secondary: "Claims flowing through automated policy thresholds for confirmation",
    tertiary: "Refund ops",
    status: "review",
  },
  {
    primary: "Manual exception refunds",
    secondary: "Customer cases outside standard policy bands requiring operator judgment",
    tertiary: "Finance support",
    status: "monitoring",
  },
  {
    primary: "Partial credit queue",
    secondary: "Service recovery adjustments waiting for payment or wallet execution",
    tertiary: "Support finance",
    status: "queued",
  },
  {
    primary: "Resolved claims lane",
    secondary: "Refunds closed with confirmed disbursement and customer notice",
    tertiary: "Recovery desk",
    status: "stable",
  },
];

export const marketplaceRows = [
  {
    primary: "Low-stock catalog lane",
    secondary: "Products at risk of going unavailable in active zones",
    tertiary: "Catalog ops",
    status: "monitoring",
  },
  {
    primary: "Vendor onboarding review",
    secondary: "New marketplace partners waiting for activation checks",
    tertiary: "Partner growth",
    status: "review",
  },
  {
    primary: "Category mapping cleanup",
    secondary: "Merchandising fixes queued for misclassified items",
    tertiary: "Merchandising",
    status: "queued",
  },
  {
    primary: "Review moderation queue",
    secondary: "Product and vendor feedback requiring trust or quality action",
    tertiary: "Marketplace ops",
    status: "live",
  },
];

export const supportDeskRows = [
  {
    primary: "Late delivery escalation wave",
    secondary: "Support load elevated in two zones after route congestion",
    tertiary: "Tier 1 care",
    status: "monitoring",
  },
  {
    primary: "Refund disputes",
    secondary: "Ticket cluster tied to billing and trip cancellation complaints",
    tertiary: "Finance support",
    status: "review",
  },
  {
    primary: "Merchant complaint queue",
    secondary: "Partner-facing tickets waiting for operations feedback",
    tertiary: "Partner care",
    status: "queued",
  },
  {
    primary: "Escalation backlog",
    secondary: "High-priority tickets being pushed to senior support leads",
    tertiary: "Escalation desk",
    status: "live",
  },
];

export const supportTicketRows = [
  {
    primary: "Billing complaint queue",
    secondary: "Customer tickets tied to failed reversals and wallet mismatches",
    tertiary: "Finance support",
    status: "review",
  },
  {
    primary: "Late delivery cluster",
    secondary: "High-volume zone issues pushing tickets into SLA watch",
    tertiary: "Tier 1 care",
    status: "monitoring",
  },
  {
    primary: "Merchant support batch",
    secondary: "Partner-facing service tickets waiting for ops feedback",
    tertiary: "Partner care",
    status: "queued",
  },
  {
    primary: "Routine resolution lane",
    secondary: "Tickets moving cleanly through normal support workflow",
    tertiary: "Support pods",
    status: "stable",
  },
];

export const supportEscalationRows = [
  {
    primary: "Trust escalation wave",
    secondary: "High-sensitivity cases pushed from frontline support to senior review",
    tertiary: "Escalation desk",
    status: "review",
  },
  {
    primary: "VIP recovery cases",
    secondary: "Premium customers needing executive-level service intervention",
    tertiary: "Customer success",
    status: "monitoring",
  },
  {
    primary: "Merchant outage escalations",
    secondary: "Partner incidents requiring operations and platform coordination",
    tertiary: "Ops + support",
    status: "queued",
  },
  {
    primary: "Resolved escalations",
    secondary: "High-priority cases cleared after multi-team response",
    tertiary: "Senior support",
    status: "stable",
  },
];

export const supportDisputeRows = [
  {
    primary: "Fare dispute review",
    secondary: "Trip and order complaints needing commercial recalculation",
    tertiary: "Dispute desk",
    status: "review",
  },
  {
    primary: "Refund approval queue",
    secondary: "Claims awaiting finance or policy confirmation before release",
    tertiary: "Finance support",
    status: "monitoring",
  },
  {
    primary: "Driver-rider complaint cases",
    secondary: "Two-sided disputes needing evidence and service-rule interpretation",
    tertiary: "Support governance",
    status: "queued",
  },
  {
    primary: "Partial refund lane",
    secondary: "Claims resolved through calibrated, non-full reimbursement rules",
    tertiary: "Service recovery",
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
