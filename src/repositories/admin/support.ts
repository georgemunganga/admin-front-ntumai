"use client";

import { customerDetailHrefByName, vendorDetailHrefByName } from "@/components/admin/ops-workflow-links";
import type { AdminCaseBase, AdminRiskCaseBase } from "@/contracts/admin-domain";
import { routes } from "@/config/routes";

export type SupportTicketLane = "billing" | "service" | "merchant";
export type SupportEscalationLane = "trust" | "vip" | "partner";
export type SupportDisputeLane = "refund" | "delivery" | "payment";

export type SupportTicketCase = AdminCaseBase & {
  customerName: string;
  lane: SupportTicketLane;
  city: string;
  age: string;
  contact: string;
  subject: string;
  summary: string;
  tags: string[];
};

export type SupportEscalationCase = AdminCaseBase & {
  accountName: string;
  lane: SupportEscalationLane;
  city: string;
  age: string;
  summary: string;
  impact: string;
  tags: string[];
};

export type SupportDisputeCase = AdminRiskCaseBase & {
  ticket: string;
  lane: SupportDisputeLane;
  customerName: string;
  taskerName: string;
  merchantName: string;
  city: string;
  amount: string;
  age: string;
  issue: string;
  sourceSummary: string;
};

const supportTicketCases: SupportTicketCase[] = [
  {
    id: "TKT-4211",
    customerName: "Loveness Phiri",
    lane: "billing",
    city: "Lusaka",
    status: "review",
    owner: "Finance support",
    age: "9m",
    contact: "+260 977 210 188",
    subject: "Refund not reflected in wallet",
    summary: "Customer canceled the order and the refund was approved, but the wallet balance still has not updated.",
    tags: ["Wallet follow-up", "Refund trace"],
    timeline: [
      { label: "Ticket opened", detail: "Customer reported a missing wallet refund after order cancellation.", time: "09:28" },
      { label: "Refund approved", detail: "Finance approval was already recorded in the refund queue.", time: "09:34" },
      { label: "Ticket routed", detail: "Support should trace wallet posting before closure.", time: "09:39" },
    ],
    notes: ["Likely depends on wallet confirmation, not a new refund decision."],
    links: [
      { label: "Refund approvals", href: routes.sales.refunds },
      { label: "Payment ops", href: routes.sales.payments },
    ],
  },
  {
    id: "TKT-4202",
    customerName: "Chisomo Tembo",
    lane: "service",
    city: "Kitwe",
    status: "monitoring",
    owner: "Resolution pod",
    age: "18m",
    contact: "+260 969 004 512",
    subject: "Delivery arrived after promised time",
    summary: "Customer accepted the order but is asking for a service credit after the delivery arrived far outside the ETA window.",
    tags: ["Late delivery", "Service recovery"],
    timeline: [
      { label: "Ticket opened", detail: "Customer raised late-delivery complaint after order completion.", time: "08:57" },
      { label: "ETA reviewed", detail: "Ops data confirms a route delay in the final delivery corridor.", time: "09:05" },
      { label: "Waiting action", detail: "Support should decide whether to close or route to disputes.", time: "09:12" },
    ],
    notes: ["May be closable with a goodwill note if no refund is requested."],
    links: [
      { label: "Tracking cases", href: routes.logistics.tracking },
      { label: "Manual dispatch", href: routes.dispatch.manualDispatch },
    ],
  },
  {
    id: "TKT-4194",
    customerName: "Agnes Mumba",
    lane: "billing",
    city: "Kabwe",
    status: "at_risk",
    owner: "Payments review",
    age: "31m",
    contact: "+260 963 118 044",
    subject: "Duplicate charge after checkout retry",
    summary: "Customer says checkout failed once but the card statement now shows two debits for the same order.",
    tags: ["Duplicate charge", "Payments risk"],
    timeline: [
      { label: "Ticket opened", detail: "Duplicate-charge complaint entered the support queue.", time: "08:12" },
      { label: "Payments link found", detail: "Similar case already exists in the payments queue.", time: "08:25" },
      { label: "Risk flag raised", detail: "Support should not resolve until payments confirms the gateway trail.", time: "08:33" },
    ],
    notes: ["Should sync with payments before any support promise is sent."],
    links: [
      { label: "Payment ops", href: routes.sales.payments },
      { label: "Refund approvals", href: routes.sales.refunds },
    ],
  },
  {
    id: "TKT-4186",
    customerName: "Brian Zulu",
    lane: "merchant",
    city: "Ndola",
    status: "queued",
    owner: "Partner support",
    age: "47m",
    contact: "+260 971 301 228",
    subject: "Merchant says item menu is unavailable",
    summary: "A vendor is asking support why a new category is still hidden from the storefront after catalog approval.",
    tags: ["Catalog issue", "Partner-facing"],
    timeline: [
      { label: "Ticket opened", detail: "Merchant support complaint created from vendor portal callback.", time: "07:36" },
      { label: "Catalog context added", detail: "Marketplace state suggests a stale publish step.", time: "07:49" },
      { label: "Queued for owner", detail: "Partner support should decide whether to solve or escalate to marketplace ops.", time: "07:57" },
    ],
    notes: ["Likely a quick escalation to marketplace rather than a prolonged support case."],
    links: [
      { label: "Vendors", href: routes.marketplace.vendors },
      { label: "Categories", href: routes.marketplace.categories },
    ],
  },
  {
    id: "TKT-4179",
    customerName: "Natasha Chinyama",
    lane: "service",
    city: "Lusaka",
    status: "paused",
    owner: "Trust support",
    age: "1h 02m",
    contact: "+260 978 441 200",
    subject: "Abusive chat during delivery",
    summary: "Customer and tasker both reported abusive language in chat, and the ticket is waiting on trust review before response.",
    tags: ["Conduct review", "Trust dependency"],
    timeline: [
      { label: "Ticket opened", detail: "Conduct complaint was opened after delivery chat exchange.", time: "06:54" },
      { label: "Trust linked", detail: "Support linked the case to an open trust review.", time: "07:01" },
      { label: "Paused", detail: "No final support closure until trust returns an outcome.", time: "07:08" },
    ],
    notes: ["Keep paused until trust clears the conduct review."],
    links: [
      { label: "Escalations", href: routes.supportDesk.escalations },
      { label: "Safety compliance", href: routes.risk.compliance },
    ],
  },
];

const supportEscalationCases: SupportEscalationCase[] = [
  {
    id: "ESC-4210",
    accountName: "Natasha Chinyama",
    lane: "trust",
    city: "Lusaka",
    status: "review",
    owner: "Trust support",
    age: "14m",
    summary: "Customer and tasker both filed conduct complaints after a delivery chat escalated into abuse claims.",
    impact: "Support cannot close the case until trust decides whether account action is needed.",
    tags: ["Conduct review", "Two-sided complaint"],
    timeline: [
      { label: "Escalation opened", detail: "Support marked the case as sensitive and routed it to trust.", time: "09:16" },
      { label: "Evidence bundle attached", detail: "Chat log, call attempts, and complaint notes were added.", time: "09:24" },
      { label: "Awaiting trust decision", detail: "Escalation is active pending a final account-action call.", time: "09:31" },
    ],
    notes: ["Do not let frontline support close this without trust sign-off."],
    links: [
      { label: "Safety compliance", href: routes.risk.compliance },
      { label: "Disputes", href: routes.supportDesk.disputes },
    ],
  },
  {
    id: "ESC-4201",
    accountName: "Chisomo Tembo",
    lane: "vip",
    city: "Kitwe",
    status: "monitoring",
    owner: "VIP recovery",
    age: "26m",
    summary: "A high-value customer had two failed orders in one day and is threatening to stop using the platform.",
    impact: "Requires white-glove service recovery and coordinated follow-up from support and operations.",
    tags: ["VIP recovery", "Retention risk"],
    timeline: [
      { label: "Escalation opened", detail: "Customer profile was flagged for premium recovery handling.", time: "08:52" },
      { label: "Ops notes added", detail: "Operations confirmed one issue was route-related, the other merchant-related.", time: "09:03" },
      { label: "Recovery proposal pending", detail: "Support lead should approve the response package.", time: "09:12" },
    ],
    notes: ["Likely a same-day recovery case if handled tightly."],
    links: [
      { label: "Customer profile", href: customerDetailHrefByName["Chisomo Tembo"] },
      { label: "Manual dispatch", href: routes.dispatch.manualDispatch },
    ],
  },
  {
    id: "ESC-4193",
    accountName: "Green Basket Market",
    lane: "partner",
    city: "Kitwe",
    status: "at_risk",
    owner: "Partner escalation desk",
    age: "41m",
    summary: "Merchant reports a storefront outage during peak demand and says active orders are failing to route correctly.",
    impact: "Commercial exposure is elevated because the outage affects multiple customer orders and partner confidence.",
    tags: ["Storefront outage", "Commercial risk"],
    timeline: [
      { label: "Escalation opened", detail: "Merchant-support ticket was promoted to escalation after repeated failures.", time: "08:07" },
      { label: "Marketplace context added", detail: "Publishing and routing anomalies were linked into the case.", time: "08:19" },
      { label: "Cross-team risk raised", detail: "Escalation needs support, marketplace, and ops coordination.", time: "08:28" },
    ],
    notes: ["Needs a coordinated update, not isolated replies from separate teams."],
    links: [
      { label: "Vendor record", href: vendorDetailHrefByName["Green Basket Market"] },
      { label: "Shipments", href: routes.logistics.shipments },
    ],
  },
  {
    id: "ESC-4184",
    accountName: "Brian Zulu",
    lane: "vip",
    city: "Ndola",
    status: "queued",
    owner: "Support lead",
    age: "53m",
    summary: "Customer has repeated refund and lateness complaints and requested direct leadership review.",
    impact: "Escalation should decide if this remains in care or moves into finance-linked service recovery.",
    tags: ["Leadership review", "Repeat complaints"],
    timeline: [
      { label: "Escalation opened", detail: "Customer requested leadership review after repeated service failures.", time: "07:29" },
      { label: "History added", detail: "Past refunds and ticket clusters were attached to the case.", time: "07:44" },
    ],
    notes: ["This may move into disputes if a new refund request is added."],
    links: [
      { label: "Refund approvals", href: routes.sales.refunds },
      { label: "Disputes", href: routes.supportDesk.disputes },
    ],
  },
  {
    id: "ESC-4178",
    accountName: "CityCare Pharmacy",
    lane: "partner",
    city: "Ndola",
    status: "paused",
    owner: "Compliance support",
    age: "1h 08m",
    summary: "Restricted-category merchant escalation is blocked because compliance still has an unresolved review on one document.",
    impact: "Support should not promise a launch or reopen service until compliance clears the blocker.",
    tags: ["Restricted category", "Compliance dependency"],
    timeline: [
      { label: "Escalation opened", detail: "Merchant complained about delayed enablement and order visibility.", time: "06:45" },
      { label: "Compliance dependency found", detail: "A pending document review blocks the commercial resolution path.", time: "06:56" },
      { label: "Paused", detail: "Escalation should wait until compliance closes the dependency.", time: "07:03" },
    ],
    notes: ["This is blocked upstream, not a pure support issue."],
    links: [
      { label: "Safety compliance", href: routes.risk.compliance },
      { label: "Vendor record", href: vendorDetailHrefByName["CityCare Pharmacy"] },
    ],
  },
];

const supportDisputeCases: SupportDisputeCase[] = [
  {
    id: "DSP-4204",
    ticket: "SUP-22108",
    lane: "refund",
    customerName: "Loveness Phiri",
    taskerName: "Moses Banda",
    merchantName: "QuickBite Express",
    city: "Lusaka",
    status: "review",
    amount: "ZMW 186",
    owner: "Support finance",
    age: "11m",
    issue: "Customer says two items never arrived, while merchant marked the order fully packed and the tasker completed the handoff.",
    sourceSummary: "Marketplace order with missing-items claim and partial refund request",
    riskFlags: ["Item mismatch", "Merchant evidence attached"],
    timeline: [
      { label: "Ticket opened", detail: "Customer reported missing items after completed handoff.", time: "09:18" },
      { label: "Merchant evidence added", detail: "Packing image and order confirmation attached.", time: "09:24" },
      { label: "Refund review started", detail: "Support finance should decide partial recovery.", time: "09:29" },
    ],
    notes: ["Likely partial refund, not a full write-off."],
    links: [
      { label: "Customer profile", href: customerDetailHrefByName["Loveness Phiri"] },
      { label: "Refund approvals", href: routes.sales.refunds },
      { label: "Tracking cases", href: routes.logistics.tracking },
    ],
  },
  {
    id: "DSP-4198",
    ticket: "SUP-22097",
    lane: "delivery",
    customerName: "Chisomo Tembo",
    taskerName: "Ruth Mwape",
    merchantName: "Green Basket Market",
    city: "Kitwe",
    status: "monitoring",
    amount: "ZMW 0",
    owner: "Resolution pod",
    age: "23m",
    issue: "Customer says the tasker delivered to the wrong gate, while the tasker claims the customer was unreachable during the final handoff.",
    sourceSummary: "Two-sided delivery dispute requiring contact and route evidence review",
    riskFlags: ["Two-sided account", "Contact gap"],
    timeline: [
      { label: "Case escalated", detail: "Tier 1 support moved the case into disputes.", time: "08:48" },
      { label: "Tasker notes reviewed", detail: "Final-drop notes and call attempts pulled into the case.", time: "08:57" },
      { label: "Waiting customer confirmation", detail: "Support still needs destination clarification.", time: "09:06" },
    ],
    notes: ["This may end as a courtesy credit, not a merchant refund."],
    links: [
      { label: "Customer profile", href: customerDetailHrefByName["Chisomo Tembo"] },
      { label: "Manual dispatch", href: routes.dispatch.manualDispatch },
      { label: "Tracking cases", href: routes.logistics.tracking },
    ],
  },
  {
    id: "DSP-4189",
    ticket: "SUP-22074",
    lane: "payment",
    customerName: "Agnes Mumba",
    taskerName: "Natasha Chinyama",
    merchantName: "HomeBox Supplies",
    city: "Kabwe",
    status: "at_risk",
    amount: "ZMW 412",
    owner: "Payments review",
    age: "37m",
    issue: "Wallet balance was debited twice after a retry flow, but the order only settled once in the marketplace ledger.",
    sourceSummary: "Possible duplicate capture involving wallet retry and checkout fallback",
    riskFlags: ["Double debit", "Payments discrepancy"],
    timeline: [
      { label: "Payment complaint opened", detail: "Customer reported duplicated debit after checkout retry.", time: "08:02" },
      { label: "Ledger mismatch found", detail: "Order shows one successful settlement only.", time: "08:16" },
      { label: "Risk flag attached", detail: "Payments team should validate source before refund release.", time: "08:24" },
    ],
    notes: ["Do not auto-refund until payments confirms the duplicate movement."],
    links: [
      { label: "Customer profile", href: customerDetailHrefByName["Agnes Mumba"] },
      { label: "Payment ops", href: routes.sales.payments },
      { label: "Refund approvals", href: routes.sales.refunds },
    ],
  },
  {
    id: "DSP-4174",
    ticket: "SUP-22031",
    lane: "refund",
    customerName: "Brian Zulu",
    taskerName: "Ruth Mulenga",
    merchantName: "CityCare Pharmacy",
    city: "Ndola",
    status: "queued",
    amount: "ZMW 92",
    owner: "Refund desk",
    age: "52m",
    issue: "Customer canceled after merchant delay, and the refund is waiting on policy confirmation because restricted-item handling changed the normal timing rules.",
    sourceSummary: "Delayed-order cancellation with policy-sensitive refund timing",
    riskFlags: ["Restricted category", "Policy check pending"],
    timeline: [
      { label: "Cancellation logged", detail: "Order canceled after merchant delay threshold passed.", time: "07:26" },
      { label: "Policy check opened", detail: "Refund desk needs restricted-item rule validation.", time: "07:39" },
    ],
    notes: ["Should move quickly once policy confirms category handling."],
    links: [
      { label: "Customer profile", href: customerDetailHrefByName["Brian Zulu"] },
      { label: "Safety compliance", href: routes.risk.compliance },
      { label: "Refund approvals", href: routes.sales.refunds },
    ],
  },
  {
    id: "DSP-4168",
    ticket: "SUP-21994",
    lane: "delivery",
    customerName: "Natasha Chinyama",
    taskerName: "Martha Chola",
    merchantName: "FastFix Services",
    city: "Lusaka",
    status: "paused",
    amount: "ZMW 0",
    owner: "Support governance",
    age: "1h 09m",
    issue: "Customer and tasker accounts are both claiming abuse in chat history, so the case is paused pending trust review before support decides any service recovery.",
    sourceSummary: "Conduct dispute with linked chat abuse review",
    riskFlags: ["Abuse review open", "Trust dependency"],
    timeline: [
      { label: "Conduct complaint opened", detail: "Support marked the thread for governance review.", time: "06:44" },
      { label: "Chat export attached", detail: "Conversation log and call attempts added to evidence bundle.", time: "06:52" },
      { label: "Trust hold applied", detail: "Case should stay paused pending risk outcome.", time: "07:01" },
    ],
    notes: ["No refund or credit should be promised before trust clears the conduct review."],
    links: [
      { label: "Customer profile", href: customerDetailHrefByName["Natasha Chinyama"] },
      { label: "Escalations", href: routes.supportDesk.escalations },
      { label: "Safety compliance", href: routes.risk.compliance },
    ],
  },
];

export function listSupportTicketCases(): SupportTicketCase[] {
  return supportTicketCases;
}

export function listSupportEscalationCases(): SupportEscalationCase[] {
  return supportEscalationCases;
}

export function listSupportDisputeCases(): SupportDisputeCase[] {
  return supportDisputeCases;
}
