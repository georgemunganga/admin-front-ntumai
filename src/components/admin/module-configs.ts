import type { ModulePageConfig } from "@/components/admin/module-page";

export const dispatchModulePages: Record<string, ModulePageConfig> = {
  overview: {
    eyebrow: "Operations ERP",
    title: "Dispatch",
    description:
      "Control live rider demand, assignment pressure, and intervention tools from the dispatch command layer.",
    badge: "Core",
    sections: [
      {
        title: "Control Room",
        description: "Pages that help operators see demand and trip flow in real time.",
        items: ["Live Map", "Demand Zones", "Trip Feed", "Emergency Monitoring"],
      },
      {
        title: "Interventions",
        description: "Manual tools used when automation needs human override.",
        items: ["Manual Dispatch", "Reassign Driver", "Force Cancel", "Priority Booking"],
      },
    ],
  },
  "live-map": {
    eyebrow: "Operations ERP",
    title: "Live Map",
    description: "Monitor drivers, riders, and active bookings across service zones.",
    sections: [
      {
        title: "Map Layers",
        description: "Operational overlays usually shown in the live control map.",
        items: ["Active Drivers", "Demand Heatmap", "Surge Areas", "Incident Pins"],
      },
      {
        title: "Supervision",
        description: "Operational actions normally triggered from this screen.",
        items: ["Track Trip", "Call Support", "Reroute Driver", "Escalate Incident"],
      },
    ],
  },
  "scheduled-rides": {
    eyebrow: "Operations ERP",
    title: "Scheduled Rides",
    description: "Manage advance bookings, future allocations, and missed-prep risk.",
    sections: [
      {
        title: "Planning Queue",
        description: "Upcoming rides that need assignment or review.",
        items: ["Unassigned Jobs", "Airport Runs", "Corporate Bookings", "Recurring Trips"],
      },
      {
        title: "Controls",
        description: "Operations tools for advance trip management.",
        items: ["Assign Driver", "Change Time Window", "Escalate Delay", "Cancel Booking"],
      },
    ],
  },
  "manual-dispatch": {
    eyebrow: "Operations ERP",
    title: "Manual Dispatch",
    description: "Override auto-matching when the ops team needs to directly control assignment.",
    sections: [
      {
        title: "Assignment Tools",
        description: "Operator actions available in dispatch exceptions.",
        items: ["Manual Match", "Swap Driver", "Stack Order", "Priority Override"],
      },
      {
        title: "Risk Guards",
        description: "Checks applied before forcing reassignment.",
        items: ["ETA Impact", "Zone Rules", "Vehicle Fit", "Driver Capacity"],
      },
    ],
  },
};

export const fleetModulePages: Record<string, ModulePageConfig> = {
  overview: {
    eyebrow: "Operations ERP",
    title: "Fleet",
    description:
      "Manage the supply side of the platform: drivers, vehicles, onboarding, documents, and payouts.",
    badge: "Supply",
    sections: [
      {
        title: "People",
        description: "Driver lifecycle management for operations and compliance teams.",
        items: ["Drivers", "Applications", "Documents", "Incentives"],
      },
      {
        title: "Assets",
        description: "Vehicle and payout oversight for the active fleet.",
        items: ["Vehicles", "Driver Payouts", "Vehicle Status", "Maintenance Alerts"],
      },
    ],
  },
  drivers: {
    eyebrow: "Operations ERP",
    title: "Fleet Drivers",
    description: "Driver records, status, and quality controls for active supply.",
    sections: [
      {
        title: "Driver Profile",
        description: "Core items usually surfaced in driver admin views.",
        items: ["Status", "Ratings", "Trip History", "Warnings"],
      },
      {
        title: "Operations",
        description: "Actions used by fleet and support teams.",
        items: ["Suspend", "Reactivate", "Review Docs", "Check Earnings"],
      },
    ],
  },
  "driver-applications": {
    eyebrow: "Operations ERP",
    title: "Driver Applications",
    description: "Track pending onboarding, approval queues, and rejection reasons.",
    sections: [
      {
        title: "Onboarding Queue",
        description: "Main states in the application review pipeline.",
        items: ["Pending Review", "Vehicle Check", "Interview", "Rejected"],
      },
      {
        title: "Review Actions",
        description: "Actions support or fleet staff take before approval.",
        items: ["Verify KYC", "Request Documents", "Schedule Inspection", "Approve"],
      },
    ],
  },
  "driver-documents": {
    eyebrow: "Operations ERP",
    title: "Driver Documents",
    description: "Manage licenses, insurance, road tax, and expiry alerts.",
    sections: [
      {
        title: "Compliance Items",
        description: "Document classes typically tracked for drivers and vehicles.",
        items: ["License", "Insurance", "Road Tax", "Inspection"],
      },
      {
        title: "Automation",
        description: "Safety and compliance triggers tied to document states.",
        items: ["Expiry Reminders", "Auto Suspend", "Review Queue", "Escalations"],
      },
    ],
  },
  "driver-incentives": {
    eyebrow: "Operations ERP",
    title: "Driver Incentives",
    description: "Configure supply stimulation programs that keep drivers active in the right places.",
    sections: [
      {
        title: "Campaign Types",
        description: "Common incentive structures used by ride and delivery platforms.",
        items: ["Quest Bonuses", "Peak Hour", "Streak Rewards", "Zone Bonuses"],
      },
      {
        title: "Performance",
        description: "Metrics watched when evaluating incentive campaigns.",
        items: ["Acceptance Rate", "Completion Rate", "Supply Lift", "Cost per Trip"],
      },
    ],
  },
  "driver-payouts": {
    eyebrow: "Operations ERP",
    title: "Driver Payouts",
    description: "Review settlement batches, failed transfers, and driver bank verification.",
    sections: [
      {
        title: "Payout Flow",
        description: "Core states in driver settlement operations.",
        items: ["Pending", "Approved", "Failed", "Reversed"],
      },
      {
        title: "Controls",
        description: "Finance actions commonly needed during settlement review.",
        items: ["Bank Verify", "Retry Transfer", "Hold Payout", "Export Ledger"],
      },
    ],
  },
  vehicles: {
    eyebrow: "Operations ERP",
    title: "Vehicles",
    description: "Track asset records, service type fit, and maintenance readiness.",
    sections: [
      {
        title: "Vehicle Data",
        description: "Common fields required for platform fleet operations.",
        items: ["Plate Number", "Vehicle Type", "Assigned Driver", "Inspection Status"],
      },
      {
        title: "Maintenance",
        description: "Asset reliability items usually reviewed by fleet teams.",
        items: ["Service Alerts", "Insurance Expiry", "Damage Flags", "Replacement Queue"],
      },
    ],
  },
};

export const logisticsExtraPages: Record<string, ModulePageConfig> = {
  "zones-geofencing": {
    eyebrow: "Operations ERP",
    title: "Zones & Geofencing",
    description: "Control service areas, no-go zones, airport rules, and surge boundaries.",
    sections: [
      {
        title: "Zone Controls",
        description: "Geographic rules commonly applied by operations teams.",
        items: ["Service Areas", "No-go Zones", "Airport Rules", "Surge Zones"],
      },
      {
        title: "Operational Use",
        description: "How zone controls feed dispatch and growth workflows.",
        items: ["Supply Planning", "Price Boundaries", "Safety Restrictions", "Expansion Rollout"],
      },
    ],
  },
  "service-types": {
    eyebrow: "Operations ERP",
    title: "Service Types",
    description: "Manage the service menu offered by the platform and its vehicle requirements.",
    sections: [
      {
        title: "Service Catalog",
        description: "Commercial and operational ride or delivery products.",
        items: ["Economy", "Comfort", "Bike", "Delivery", "Corporate"],
      },
      {
        title: "Constraints",
        description: "Rules tied to each service class.",
        items: ["Vehicle Requirements", "Pricing Rules", "Zone Access", "Driver Eligibility"],
      },
    ],
  },
  "pricing-commission": {
    eyebrow: "Operations ERP",
    title: "Pricing & Commission",
    description: "Configure fares, city pricing, cancellation fees, and platform commission rules.",
    sections: [
      {
        title: "Pricing Controls",
        description: "Core commercial levers used by operations and finance teams.",
        items: ["Base Fare", "Per Km / Minute", "Surge Rules", "Cancellation Fees"],
      },
      {
        title: "Commercial Rules",
        description: "Policy layers that shape merchant or driver revenue share.",
        items: ["Driver Commission", "City Pricing", "Promo Discounts", "Service Fees"],
      },
    ],
  },
};

export const crmModulePages: Record<string, ModulePageConfig> = {
  overview: {
    eyebrow: "Customer CRM",
    title: "CRM",
    description:
      "Manage rider accounts, company accounts, wallet balances, ratings, and trust-sensitive customer issues.",
    badge: "CRM",
    sections: [
      {
        title: "Customers",
        description: "Pages focused on rider and account relationship management.",
        items: ["Riders", "Corporate Accounts", "Wallets", "Blocked Users"],
      },
      {
        title: "Signals",
        description: "Feedback and trust indicators tied to rider accounts.",
        items: ["Ratings", "Complaints", "Refund History", "Fraud Flags"],
      },
    ],
  },
  riders: {
    eyebrow: "Customer CRM",
    title: "Riders",
    description: "Customer profiles, trip history, refund history, and account actions.",
    sections: [
      {
        title: "Profile View",
        description: "Typical rider information needed by support or ops staff.",
        items: ["Trip History", "Payment Methods", "Ratings", "Complaints"],
      },
      {
        title: "Account Actions",
        description: "Actions taken against rider accounts.",
        items: ["Block", "Refund", "Flag for Risk", "View Wallet"],
      },
    ],
  },
  "corporate-accounts": {
    eyebrow: "Customer CRM",
    title: "Corporate Accounts",
    description: "Manage business clients, employees, and monthly billing controls.",
    sections: [
      {
        title: "Account Structure",
        description: "Typical B2B controls used by enterprise customers.",
        items: ["Companies", "Departments", "Employees", "Ride Limits"],
      },
      {
        title: "Billing",
        description: "Business account finance controls.",
        items: ["Monthly Invoices", "Usage Reports", "Spend Caps", "Approval Flows"],
      },
    ],
  },
  wallets: {
    eyebrow: "Customer CRM",
    title: "Wallets",
    description: "Review customer wallet balances, manual adjustments, and wallet transaction history.",
    sections: [
      {
        title: "Wallet Controls",
        description: "Core admin tools for customer value storage.",
        items: ["Manual Credit", "Manual Debit", "Transaction Logs", "Refund Ledger"],
      },
      {
        title: "Risk Checks",
        description: "Flags and controls tied to wallet misuse.",
        items: ["Abuse Review", "Balance Freeze", "Payment Failures", "Chargeback Review"],
      },
    ],
  },
  "ratings-reviews": {
    eyebrow: "Customer CRM",
    title: "Ratings & Reviews",
    description: "Monitor low-rated experiences and quality complaints across riders and drivers.",
    sections: [
      {
        title: "Moderation",
        description: "Feedback streams usually reviewed by support or quality teams.",
        items: ["Low-rated Trips", "Driver Complaints", "Rider Complaints", "Review Moderation"],
      },
      {
        title: "Quality Loops",
        description: "How ratings data feeds operations improvement.",
        items: ["Driver Coaching", "Merchant QA", "Refund Decisions", "Escalations"],
      },
    ],
  },
  "blocked-users": {
    eyebrow: "Customer CRM",
    title: "Blocked Users",
    description: "Manage bans, suspensions, appeal status, and repeat abuse patterns.",
    sections: [
      {
        title: "Restriction States",
        description: "Core account restriction categories.",
        items: ["Suspended Riders", "Blocked Drivers", "Ban Reasons", "Appeal Status"],
      },
      {
        title: "Risk Context",
        description: "Signals that usually accompany account restrictions.",
        items: ["Fraud Flags", "Chargeback Abuse", "Safety Reports", "Multi-account Links"],
      },
    ],
  },
};

export const riskModulePages: Record<string, ModulePageConfig> = {
  overview: {
    eyebrow: "Risk & Safety",
    title: "Risk",
    description:
      "Handle fraud, abuse, emergency incidents, and compliance review in one governance layer.",
    badge: "Guardrails",
    sections: [
      {
        title: "Risk Operations",
        description: "Pages that monitor abuse, fraud, and suspicious activity.",
        items: ["Fraud & Risk", "Blocked Users", "Chargebacks", "Promo Abuse"],
      },
      {
        title: "Safety Operations",
        description: "Pages for emergency and compliance review.",
        items: ["SOS Center", "Incident Reports", "KYC Review", "Compliance Queue"],
      },
    ],
  },
  "fraud-risk": {
    eyebrow: "Risk & Safety",
    title: "Fraud & Risk",
    description: "Review suspicious trips, payment risk, promo abuse, and account-linking signals.",
    sections: [
      {
        title: "Fraud Cases",
        description: "Typical abuse streams surfaced to risk teams.",
        items: ["Fake Trips", "GPS Spoofing", "Promo Abuse", "Multiple Accounts"],
      },
      {
        title: "Controls",
        description: "Common mitigation actions available to admins.",
        items: ["Freeze Wallet", "Suspend Account", "Escalate Review", "Blacklist Device"],
      },
    ],
  },
  "sos-emergency": {
    eyebrow: "Risk & Safety",
    title: "SOS / Emergency",
    description: "Track panic alerts, accident reports, and unsafe-trip escalations in real time.",
    sections: [
      {
        title: "Alert Types",
        description: "High-priority safety feeds commonly monitored by ops teams.",
        items: ["Panic Alerts", "Accident Reports", "Unsafe Trip Reports", "Emergency Calls"],
      },
      {
        title: "Response Actions",
        description: "Immediate actions normally available during incident handling.",
        items: ["Contact Rider", "Contact Driver", "Escalate City Team", "Create Incident Case"],
      },
    ],
  },
  "safety-compliance": {
    eyebrow: "Risk & Safety",
    title: "Safety & Compliance",
    description: "Manage KYC review, document expiry, restricted categories, and regulatory records.",
    sections: [
      {
        title: "Compliance Queues",
        description: "Operational review lists commonly required by platform governance.",
        items: ["KYC Verification", "License Expiry", "Restricted Goods", "Merchant Licenses"],
      },
      {
        title: "Governance",
        description: "Administrative safeguards and reporting requirements.",
        items: ["Audit Pack", "Regulatory Docs", "Review Holds", "Approval Logs"],
      },
    ],
  },
};

export const growthModulePages: Record<string, ModulePageConfig> = {
  overview: {
    eyebrow: "Growth System",
    title: "Growth",
    description:
      "Run incentives, promotions, and customer communication programs that drive demand and supply.",
    badge: "Growth",
    sections: [
      {
        title: "Acquisition & Retention",
        description: "Growth pages focused on user acquisition and repeat behavior.",
        items: ["Promotions", "Referral Bonuses", "Targeted Discounts", "Retention Triggers"],
      },
      {
        title: "Communications",
        description: "Broadcast and lifecycle messaging tools.",
        items: ["Notifications", "Announcements", "Email", "Push Campaigns"],
      },
    ],
  },
  promotions: {
    eyebrow: "Growth System",
    title: "Promotions",
    description: "Configure promo codes, referral bonuses, and city- or segment-based offers.",
    sections: [
      {
        title: "Offer Types",
        description: "Standard growth instruments used by delivery platforms.",
        items: ["Promo Codes", "Referrals", "Delivery Discounts", "Merchant Campaigns"],
      },
      {
        title: "Targeting",
        description: "Typical segmentation dimensions for campaign rollout.",
        items: ["By City", "By Activity", "By Value Tier", "By Churn Risk"],
      },
    ],
  },
  "driver-incentives": {
    eyebrow: "Growth System",
    title: "Driver Incentives",
    description: "View the supply-growth side of incentives from the commercial planning lens.",
    sections: [
      {
        title: "Campaigns",
        description: "Incentive programs that shape supply during peak demand.",
        items: ["Peak Hour", "Quest Bonus", "Zone Reward", "Weekly Target"],
      },
      {
        title: "Planning Metrics",
        description: "Signals used when assessing incentive impact.",
        items: ["Supply Lift", "Acceptance Rate", "Cost per Incremental Trip", "Zone Fill"],
      },
    ],
  },
  notifications: {
    eyebrow: "Growth System",
    title: "Notifications",
    description: "Manage push, SMS, email, and operator broadcast flows.",
    sections: [
      {
        title: "Channels",
        description: "Admin-managed customer and driver messaging channels.",
        items: ["Push", "SMS", "Email", "In-app Broadcast"],
      },
      {
        title: "Automation",
        description: "Common notification automation use cases.",
        items: ["Trip Reminders", "Promo Launches", "Version Alerts", "Safety Notices"],
      },
    ],
  },
};

export const salesExtraPages: Record<string, ModulePageConfig> = {
  payments: {
    eyebrow: "Commerce ERP",
    title: "Payments",
    description: "Monitor rider payments, failed charges, transfer states, and settlement risks.",
    badge: "Finance",
    sections: [
      {
        title: "Payment Operations",
        description: "Core finance views expected in a ride or delivery admin.",
        items: ["Successful Charges", "Failed Payments", "Chargebacks", "Bank Transfer Records"],
      },
      {
        title: "Controls",
        description: "Review and intervention actions used by finance teams.",
        items: ["Retry Charge", "Flag Risk", "Export Report", "Escalate Gateway Issue"],
      },
    ],
  },
};

export const platformModulePages: Record<string, ModulePageConfig> = {
  overview: {
    eyebrow: "Platform Control",
    title: "Platform",
    description:
      "Run the shared admin systems: reporting, content, app control, system health, users, and settings.",
    badge: "Platform",
    sections: [
      {
        title: "Governance",
        description: "Operator tools that define who can do what and how the app behaves.",
        items: ["Admin Users", "Activity Logs", "Feature Toggles", "Settings"],
      },
      {
        title: "Visibility",
        description: "Pages that provide health and reporting coverage for the business.",
        items: ["Reports", "System Health", "Version Control", "Content Management"],
      },
    ],
  },
  "reports-analytics": {
    eyebrow: "Platform Control",
    title: "Reports & Analytics",
    description: "Review business performance, trip quality, cancellations, and operational KPIs.",
    sections: [
      {
        title: "Core Reports",
        description: "Typical report families in a mobility or delivery ERP.",
        items: ["Revenue", "Trips", "Driver Performance", "Support Tickets"],
      },
      {
        title: "Operational Analytics",
        description: "Deeper operational views often required by leadership.",
        items: ["Zone Performance", "Fulfillment Rate", "Cancellation Analysis", "Payment Reports"],
      },
    ],
  },
  "content-management": {
    eyebrow: "Platform Control",
    title: "Content Management",
    description: "Control banners, FAQs, policy pages, and help content across the app.",
    sections: [
      {
        title: "Managed Content",
        description: "Common editable content surfaces for the platform.",
        items: ["FAQs", "Help Articles", "Banners", "Terms & Policies"],
      },
      {
        title: "Release Needs",
        description: "Reasons teams use content control in admin tools.",
        items: ["Urgent Notices", "Merchant Spotlight", "Safety Updates", "Homepage Blocks"],
      },
    ],
  },
  "app-version-control": {
    eyebrow: "Platform Control",
    title: "App Version Control",
    description: "Manage minimum versions, force updates, feature toggles, and maintenance mode.",
    sections: [
      {
        title: "Release Controls",
        description: "App-runtime controls commonly managed by admins.",
        items: ["Minimum Version", "Force Update", "Feature Toggles", "Maintenance Mode"],
      },
      {
        title: "Rollout Safety",
        description: "Safeguards used during production rollouts.",
        items: ["Gradual Release", "Kill Switch", "Region Toggle", "Client Gate"],
      },
    ],
  },
  "system-health": {
    eyebrow: "Platform Control",
    title: "System Health",
    description: "Track dependency health and platform availability across the stack.",
    sections: [
      {
        title: "Dependencies",
        description: "External and internal systems usually monitored by platform teams.",
        items: ["Payment Gateway", "SMS Provider", "Map API", "Push Service"],
      },
      {
        title: "Runtime Signals",
        description: "Core telemetry usually surfaced in admin health centers.",
        items: ["API Errors", "Queue Delays", "Job Failures", "Latency Alerts"],
      },
    ],
  },
  "admin-users": {
    eyebrow: "Platform Control",
    title: "Admin Users",
    description: "Manage staff roles, permissions, and operator access boundaries.",
    sections: [
      {
        title: "Admin Roles",
        description: "Typical role layers in a delivery platform back office.",
        items: ["Super Admin", "Ops Manager", "Finance Admin", "Support Agent"],
      },
      {
        title: "Access Controls",
        description: "Core identity and access controls expected in internal ERPs.",
        items: ["Permissions", "2FA", "Role Scopes", "Login Restrictions"],
      },
    ],
  },
  "admin-activity-logs": {
    eyebrow: "Platform Control",
    title: "Admin Activity Logs",
    description: "Audit who changed what across users, trips, payments, and system configuration.",
    sections: [
      {
        title: "Audit Trails",
        description: "High-signal actions commonly logged by internal admin systems.",
        items: ["Payment Edits", "Account Suspensions", "Role Changes", "Trip Overrides"],
      },
      {
        title: "Investigation Use",
        description: "How activity history supports risk and debugging.",
        items: ["Who Did It", "When", "From Where", "Before / After State"],
      },
    ],
  },
  settings: {
    eyebrow: "Platform Control",
    title: "Settings",
    description: "Configure region, payment, language, and operational behavior for the platform.",
    sections: [
      {
        title: "Regional Settings",
        description: "Market-level configuration usually needed for multi-city rollout.",
        items: ["Cities", "Currencies", "Languages", "Tax Rules"],
      },
      {
        title: "Platform Rules",
        description: "Operational defaults and controls managed by admins.",
        items: ["Trip Rules", "Cancellation Rules", "Support Settings", "Gateway Settings"],
      },
    ],
  },
};
