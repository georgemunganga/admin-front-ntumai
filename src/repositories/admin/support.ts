"use client";

import { useMemo } from "react";
import { customerDetailHrefByName, vendorDetailHrefByName } from "@/components/admin/ops-workflow-links";
import type { AdminCaseBase, AdminRiskCaseBase } from "@/contracts/admin-domain";
import { routes } from "@/config/routes";
import { patchAdminData, postAdminData, useAdminResource } from "@/repositories/admin/admin-api";

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

export type SupportInboxBucket = "open" | "closed";
export type SupportInboxCategory = "unassigned" | "assigned-to-me" | "all-open" | "chat";

export type SupportInboxThreadEntry = {
  id: string;
  author: string;
  email: string;
  time: string;
  body: string;
  senderRole: "ADMIN" | "CUSTOMER";
  attachments?: Array<{ name: string; size: string }>;
};

export type SupportInboxMessage = {
  id: string;
  conversationId?: string | null;
  title: string;
  summary: string;
  customer: string;
  email: string;
  supportType: "Chat" | "Email";
  bucket: SupportInboxBucket;
  category: SupportInboxCategory;
  markedAsRead: boolean;
  hasAttachments: boolean;
  date: string;
  priority: "Low" | "Medium" | "High";
  agent: string;
  status: "New" | "Waiting on contact" | "Waiting on us" | "Closed";
  city: string;
  thread: SupportInboxThreadEntry[];
};

type SupportTicketApiItem = {
  id: string;
  category?: string | null;
  subject: string;
  description: string;
  status?: string | null;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id: string;
    email?: string | null;
    phone?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    Address?: Array<{
      city?: string | null;
      address?: string | null;
    }>;
  } | null;
};

type SupportTicketsPayload = {
  items: SupportTicketApiItem[];
};

type SupportInboxApiItem = {
  id: string;
  conversationId?: string | null;
  subject: string;
  description: string;
  category?: string | null;
  status?: string | null;
  createdAt?: string;
  updatedAt?: string;
  messageCount?: number;
  customer?: {
    id?: string;
    fullName?: string | null;
    email?: string | null;
    phone?: string | null;
    city?: string | null;
  } | null;
};

type SupportInboxListPayload = {
  items: SupportInboxApiItem[];
};

type SupportInboxDetailPayload = {
  item: {
    ticket: SupportInboxApiItem;
    customer?: {
      id?: string;
      fullName?: string | null;
      email?: string | null;
      phone?: string | null;
      city?: string | null;
      address?: string | null;
    } | null;
    messages?: Array<{
      id: string;
      senderId: string;
      senderName?: string | null;
      senderEmail?: string | null;
      body: string;
      messageType: string;
      createdAt: string;
      senderRole?: "ADMIN" | "CUSTOMER" | string;
    }>;
  };
};

type SupportEscalationApiItem = {
  id: string;
  lane?: "trust" | "vip" | "partner";
  role?: string | null;
  title: string;
  description: string;
  category?: string | null;
  severity?: string | null;
  status?: string | null;
  strikeCount?: number | null;
  suspensionState?: string | null;
  occurredAt?: string;
  reviewedAt?: string | null;
  resolutionNotes?: string | null;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id?: string | null;
    fullName?: string | null;
    email?: string | null;
    city?: string | null;
    address?: string | null;
  } | null;
  latestAppeal?: {
    id: string;
    status?: string | null;
    message?: string | null;
    createdAt?: string;
    reviewedAt?: string | null;
    reviewNotes?: string | null;
  } | null;
};

type SupportEscalationsPayload = {
  items: SupportEscalationApiItem[];
};

type SupportDisputeApiItem = {
  id: string;
  category?: string | null;
  subject: string;
  description: string;
  status?: string | null;
  createdAt?: string;
  updatedAt?: string;
  customer?: {
    id?: string | null;
    fullName?: string | null;
    email?: string | null;
    phone?: string | null;
    city?: string | null;
  } | null;
  order?: {
    id?: string | null;
    trackingId?: string | null;
    status?: string | null;
    totalAmount?: number | null;
  } | null;
  payment?: {
    id?: string | null;
    status?: string | null;
    amount?: number | null;
    reference?: string | null;
    method?: string | null;
  } | null;
  store?: {
    id?: string | null;
    name?: string | null;
  } | null;
  shipment?: {
    id?: string | null;
    status?: string | null;
  } | null;
  tasker?: {
    id?: string | null;
    fullName?: string | null;
    email?: string | null;
  } | null;
};

type SupportDisputesPayload = {
  items: SupportDisputeApiItem[];
};

type SupportEscalationDecision = "assign" | "escalate" | "close";
type SupportDisputeDecision = "refund" | "deny" | "escalate";

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

const supportInboxMessages: SupportInboxMessage[] = [
  {
    id: "SUP-1842",
    conversationId: "conv-sup-1842",
    title: "Refund not reflected in wallet",
    summary: "Customer confirms the cancelled order refund still has not landed in wallet after two hours.",
    customer: "Martha Chola",
    email: "martha.chola@ntumai.test",
    supportType: "Chat",
    bucket: "open",
    category: "assigned-to-me",
    markedAsRead: false,
    hasAttachments: true,
    date: "4 min ago",
    priority: "High",
    agent: "Support lead",
    status: "Waiting on us",
    city: "Lusaka",
    thread: [
      {
        id: "msg-1",
        author: "Martha Chola",
        email: "martha.chola@ntumai.test",
        time: "09:02",
        body: "I cancelled the order after the rider called, but I still have not received the refund in my wallet. The app still shows the balance unchanged.",
        senderRole: "CUSTOMER",
        attachments: [{ name: "wallet-screenshot.png", size: "340 KB" }],
      },
      {
        id: "msg-2",
        author: "Ntumai agent",
        email: "support@ntumai.com",
        time: "09:05",
        body: "We verified the cancellation event and escalated the wallet trace to finance operations. We are waiting for ledger confirmation before closing the case.",
        senderRole: "ADMIN",
      },
    ],
  },
  {
    id: "SUP-1838",
    conversationId: "conv-sup-1838",
    title: "Merchant tablet stops syncing",
    summary: "Store cannot mark orders ready, causing queue buildup on the lunchtime dispatch board.",
    customer: "QuickBite Kitchens",
    email: "ops@quickbite.test",
    supportType: "Email",
    bucket: "open",
    category: "all-open",
    markedAsRead: true,
    hasAttachments: false,
    date: "12 min ago",
    priority: "Medium",
    agent: "Partner pod",
    status: "Waiting on contact",
    city: "Lusaka",
    thread: [
      {
        id: "msg-3",
        author: "QuickBite Kitchens",
        email: "ops@quickbite.test",
        time: "10:11",
        body: "Orders are arriving but the tablet does not refresh when we try to mark them ready.",
        senderRole: "CUSTOMER",
      },
    ],
  },
  {
    id: "SUP-1834",
    conversationId: "conv-sup-1834",
    title: "Courier marked complete without handoff",
    summary: "Customer says the driver completed the trip but the parcel was not delivered to the recipient.",
    customer: "Joseph Tembo",
    email: "j.tembo@ntumai.test",
    supportType: "Chat",
    bucket: "open",
    category: "chat",
    markedAsRead: false,
    hasAttachments: true,
    date: "18 min ago",
    priority: "High",
    agent: "Resolution pod",
    status: "New",
    city: "Kitwe",
    thread: [
      {
        id: "msg-4",
        author: "Joseph Tembo",
        email: "j.tembo@ntumai.test",
        time: "10:42",
        body: "The driver marked this complete but nothing was handed over at the destination. Please help urgently.",
        senderRole: "CUSTOMER",
        attachments: [{ name: "handoff-location.jpg", size: "220 KB" }],
      },
    ],
  },
  {
    id: "SUP-1807",
    conversationId: "conv-sup-1807",
    title: "Closed refund follow-up",
    summary: "Customer confirmed refund was received and the issue can be closed.",
    customer: "Agnes Mumba",
    email: "agnes.mumba@ntumai.test",
    supportType: "Email",
    bucket: "closed",
    category: "unassigned",
    markedAsRead: true,
    hasAttachments: false,
    date: "1 day ago",
    priority: "Low",
    agent: "Billing queue",
    status: "Closed",
    city: "Kabwe",
    thread: [
      {
        id: "msg-5",
        author: "Agnes Mumba",
        email: "agnes.mumba@ntumai.test",
        time: "Yesterday",
        body: "Refund has arrived now. Thank you.",
        senderRole: "CUSTOMER",
      },
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

export function listSupportInboxMessages(): SupportInboxMessage[] {
  return supportInboxMessages;
}

export function getSupportInboxMessageById(id: string) {
  return supportInboxMessages.find((message) => message.id === id);
}

export function useSupportTicketCases() {
  const fallback = useMemo(() => listSupportTicketCases(), []);
  return useAdminResource({
    path: "/api/v1/admin/support/tickets?limit=100",
    fallback,
    map: mapSupportTicketPayload,
  });
}

export function useSupportEscalationCases() {
  const fallback = useMemo(() => listSupportEscalationCases(), []);
  return useAdminResource({
    path: "/api/v1/admin/support/escalations?limit=100",
    fallback,
    map: mapSupportEscalationPayload,
  });
}

export function useSupportDisputeCases() {
  const fallback = useMemo(() => listSupportDisputeCases(), []);
  return useAdminResource({
    path: "/api/v1/admin/support/disputes?limit=100",
    fallback,
    map: mapSupportDisputePayload,
  });
}

export function useSupportInboxMessages() {
  const fallback = useMemo(() => listSupportInboxMessages(), []);
  return useAdminResource({
    path: "/api/v1/admin/support/inbox?limit=100",
    fallback,
    map: mapSupportInboxListPayload,
  });
}

export function useSupportInboxThread(id: string, refreshKey = 0) {
  const fallback = useMemo(() => getSupportInboxMessageById(id) ?? null, [id]);
  return useAdminResource({
    path: `/api/v1/admin/support/inbox/${id}?v=${refreshKey}`,
    fallback,
    map: mapSupportInboxDetailPayload,
    enabled: Boolean(id),
  });
}

export async function sendSupportInboxMessage(ticketId: string, body: string) {
  return postAdminData<{ message: unknown }>(`/api/v1/admin/support/inbox/${ticketId}/messages`, {
    body,
  });
}

export async function saveSupportEscalationDecision(
  id: string,
  action: SupportEscalationDecision,
  reasonCode: string,
  note: string,
) {
  return patchAdminData<{ item: SupportEscalationApiItem }>(`/api/v1/admin/support/escalations/${id}`, {
    action,
    reasonCode,
    note,
  });
}

export async function saveSupportDisputeDecision(
  id: string,
  action: SupportDisputeDecision,
  reasonCode: string,
  note: string,
) {
  return patchAdminData<{ item: SupportDisputeApiItem }>(`/api/v1/admin/support/disputes/${id}`, {
    action,
    reasonCode,
    note,
  });
}

function mapSupportTicketPayload(payload: unknown): SupportTicketCase[] {
  const items = (payload as SupportTicketsPayload)?.items ?? [];
  return items.map((item) => {
    const lane = mapSupportTicketLane(item.category);
    const customerName = fullName(item.user?.firstName, item.user?.lastName) || item.user?.email || "Unknown customer";
    const city = item.user?.Address?.[0]?.city ?? "Unknown";
    const customerHref = item.user?.id ? routes.crm.customerDetails(item.user.id) : routes.crm.customers;
    const age = formatAge(item.createdAt ?? item.updatedAt);

    return {
      id: item.id,
      customerName,
      lane,
      city,
      status: mapSupportTicketStatus(item.status),
      owner: lane === "billing" ? "Finance support" : lane === "merchant" ? "Partner support" : "Resolution pod",
      age,
      contact: item.user?.phone ?? item.user?.email ?? "No contact",
      subject: item.subject,
      summary: item.description,
      tags: [normalizeToken(item.category ?? "general"), normalizeToken(item.status ?? "open")],
      timeline: [
        {
          label: "Ticket opened",
          detail: `Support ticket entered the ${lane} queue for mobile-user follow-up.`,
          time: formatTime(item.createdAt),
        },
        {
          label: "Latest staff update",
          detail: `Ticket is currently ${normalizeToken(item.status ?? "open").toLowerCase()} in the staff support queue.`,
          time: formatTime(item.updatedAt ?? item.createdAt),
        },
      ],
      notes: [
        "Live support ticket loaded from the Nest admin endpoint.",
        lane === "billing"
          ? "Coordinate with finance before promising a wallet or refund outcome."
          : lane === "merchant"
            ? "Check vendor and catalog context before replying."
            : "Use order, delivery, and tasker context before closing the ticket.",
      ],
      links: buildSupportTicketLinks(lane, customerHref),
      refs: item.user?.id ? { customerId: item.user.id, supportCaseId: item.id } : { supportCaseId: item.id },
      workflow: {
        actor: "customer",
        source: lane === "billing" ? "refund_dispute" : "support_recovery",
        state:
          item.status === "RESOLVED"
            ? "resolved"
            : item.status === "IN_PROGRESS"
              ? "in_progress"
              : "under_review",
        ownerTeam: "support",
        summary: item.description,
      },
    };
  });
}

function mapSupportEscalationPayload(payload: unknown): SupportEscalationCase[] {
  const items = (payload as SupportEscalationsPayload)?.items ?? [];
  return items.map((item) => {
    const lane = mapEscalationLane(item);
    const accountName = item.user?.fullName ?? item.user?.email ?? item.title;
    const city = item.user?.city ?? "Unknown";
    const customerHref = item.user?.id ? routes.crm.customerDetails(item.user.id) : routes.crm.customers;
    const vendorHref = vendorDetailHrefByName[accountName] ?? routes.marketplace.vendors;
    const impact = buildEscalationImpact(lane, item);
    const notes = [
      item.resolutionNotes?.trim() || "Live escalation loaded from the Nest admin endpoint.",
      item.latestAppeal?.message?.trim() ? `Latest appeal: ${item.latestAppeal.message.trim()}` : null,
    ].filter(Boolean) as string[];

    return {
      id: item.id,
      accountName,
      lane,
      city,
      status: mapEscalationStatus(item.status, item.suspensionState),
      owner: lane === "trust" ? "Trust support" : lane === "partner" ? "Partner escalation desk" : "VIP recovery",
      age: formatAge(item.updatedAt ?? item.occurredAt ?? item.createdAt),
      summary: item.description,
      impact,
      tags: [
        normalizeToken(item.category ?? lane),
        normalizeToken(item.severity ?? "review"),
        item.suspensionState && item.suspensionState !== "clear" ? normalizeToken(item.suspensionState) : null,
      ].filter(Boolean) as string[],
      timeline: buildEscalationTimeline(item),
      notes,
      links: buildSupportEscalationLinks(lane, customerHref, vendorHref),
      refs: item.user?.id
        ? lane === "partner"
          ? { vendorId: item.user.id, supportCaseId: item.id }
          : { customerId: item.user.id, supportCaseId: item.id }
        : { supportCaseId: item.id },
      workflow: {
        actor: item.role?.toLowerCase() === "vendor" ? "vendor" : item.role?.toLowerCase() === "driver" ? "tasker" : "customer",
        source: lane === "partner" ? "onboarding_review" : "support_recovery",
        state:
          item.status === "resolved"
            ? "resolved"
            : item.status === "appealed"
              ? "escalated"
              : item.suspensionState === "suspended"
                ? "blocked"
                : "under_review",
        ownerTeam: lane === "partner" ? "marketplace_ops" : "support",
        summary: impact,
      },
    };
  });
}

function mapSupportDisputePayload(payload: unknown): SupportDisputeCase[] {
  const items = (payload as SupportDisputesPayload)?.items ?? [];
  return items.map((item) => {
    const lane = mapDisputeLane(item.category);
    const customerName = item.customer?.fullName ?? item.customer?.email ?? "Unknown customer";
    const merchantName = item.store?.name ?? "Ntumai merchant";
    const customerHref = item.customer?.id ? routes.crm.customerDetails(item.customer.id) : routes.crm.customers;

    return {
      id: item.id,
      ticket: item.order?.trackingId ?? item.subject,
      lane,
      customerName,
      taskerName: item.tasker?.fullName ?? "Dispatch follow-up",
      merchantName,
      city: item.customer?.city ?? "Unknown",
      status: mapSupportTicketStatus(item.status),
      amount: formatCurrency(item.payment?.amount ?? item.order?.totalAmount ?? 0),
      owner: lane === "payment" ? "Payments review" : lane === "refund" ? "Support finance" : "Resolution pod",
      age: formatAge(item.updatedAt ?? item.createdAt),
      issue: item.description,
      sourceSummary: buildDisputeSourceSummary(lane, item),
      riskFlags: buildDisputeRiskFlags(lane, item),
      timeline: buildDisputeTimeline(lane, item),
      notes: [
        "Live dispute case loaded from the Nest admin endpoint.",
        lane === "payment"
          ? "Validate payment movement before promising any wallet or card recovery."
          : lane === "delivery"
            ? "Review order, shipment, and tasker context before closing."
            : "Coordinate support and finance if a partial recovery is likely.",
      ],
      links: buildSupportDisputeLinks(lane, customerHref, merchantName, item.shipment?.id ?? null),
      refs: {
        customerId: item.customer?.id ?? undefined,
        taskerId: item.tasker?.id ?? undefined,
        vendorId: item.store?.id ?? undefined,
        orderId: item.order?.id ?? undefined,
        shipmentId: item.shipment?.id ?? undefined,
        supportCaseId: item.id,
        paymentCaseId: item.payment?.id ?? undefined,
      },
      workflow: {
        actor: "customer",
        source: lane === "payment" ? "refund_dispute" : "support_recovery",
        state:
          item.status === "RESOLVED"
            ? "resolved"
            : item.status === "IN_PROGRESS"
              ? "in_progress"
              : "under_review",
        ownerTeam: lane === "payment" ? "finance" : "support",
        summary: item.description,
      },
    };
  });
}

function mapSupportTicketLane(category?: string | null): SupportTicketLane {
  switch (category) {
    case "PAYMENT":
      return "billing";
    case "ORDER":
    case "DELIVERY":
      return "service";
    default:
      return "merchant";
  }
}

function mapSupportTicketStatus(status?: string | null) {
  switch (status) {
    case "OPEN":
      return "review";
    case "IN_PROGRESS":
      return "monitoring";
    case "RESOLVED":
      return "live";
    case "CLOSED":
      return "stable";
    default:
      return "queued";
  }
}

function mapEscalationLane(item: SupportEscalationApiItem): SupportEscalationLane {
  if (item.lane) return item.lane;

  const role = item.role?.toLowerCase() ?? "";
  const category = item.category?.toLowerCase() ?? "";
  const severity = item.severity?.toLowerCase() ?? "";
  const suspension = item.suspensionState?.toLowerCase() ?? "";

  if (role === "vendor") return "partner";
  if (
    suspension === "suspended" ||
    ["critical", "high"].includes(severity) ||
    ["fraud", "abuse", "conduct", "safety", "compliance"].some((token) => category.includes(token))
  ) {
    return "trust";
  }

  return "vip";
}

function mapEscalationStatus(status?: string | null, suspensionState?: string | null) {
  const normalized = status?.toLowerCase() ?? "";
  if (suspensionState?.toLowerCase() === "suspended") return "paused";
  if (normalized === "open" || normalized === "under_review") return "review";
  if (normalized === "appealed") return "monitoring";
  if (normalized === "resolved" || normalized === "closed") return "stable";
  return "queued";
}

function buildEscalationImpact(lane: SupportEscalationLane, item: SupportEscalationApiItem) {
  if (lane === "partner") {
    return "Partner support, marketplace, and logistics should read the same escalation before any merchant promise is made.";
  }

  if (lane === "trust") {
    return item.suspensionState?.toLowerCase() === "suspended"
      ? "Account action is already affecting the mobile user, so support should wait for trust direction before closing."
      : "Support cannot close the case until trust decides whether safety or conduct action is needed.";
  }

  return "Support should coordinate recovery tightly because the affected mobile user is at high churn or repeat-failure risk.";
}

function buildEscalationTimeline(item: SupportEscalationApiItem) {
  return [
    {
      label: "Escalation opened",
      detail: item.title,
      time: formatTime(item.occurredAt ?? item.createdAt),
    },
    {
      label: "Latest staff review",
      detail: item.description,
      time: formatTime(item.reviewedAt ?? item.updatedAt ?? item.createdAt),
    },
    item.latestAppeal
      ? {
          label: "Appeal submitted",
          detail: item.latestAppeal.message?.trim() || "The affected mobile user submitted a follow-up appeal for staff review.",
          time: formatTime(item.latestAppeal.createdAt),
        }
      : null,
  ].filter(Boolean) as SupportEscalationCase["timeline"];
}

function buildSupportEscalationLinks(
  lane: SupportEscalationLane,
  customerHref: string,
  vendorHref: string,
) {
  if (lane === "partner") {
    return [
      { label: "Vendor record", href: vendorHref },
      { label: "Shipments", href: routes.logistics.shipments },
      { label: "Safety compliance", href: routes.risk.compliance },
    ];
  }

  if (lane === "trust") {
    return [
      { label: "Safety compliance", href: routes.risk.compliance },
      { label: "Disputes", href: routes.supportDesk.disputes },
      { label: "Customer profile", href: customerHref },
    ];
  }

  return [
    { label: "Customer profile", href: customerHref },
    { label: "Manual dispatch", href: routes.dispatch.manualDispatch },
    { label: "Support inbox", href: routes.supportDesk.inbox },
  ];
}

function mapDisputeLane(category?: string | null): SupportDisputeLane {
  switch (category) {
    case "PAYMENT":
      return "payment";
    case "DELIVERY":
      return "delivery";
    default:
      return "refund";
  }
}

function buildDisputeSourceSummary(lane: SupportDisputeLane, item: SupportDisputeApiItem) {
  const orderRef = item.order?.trackingId ? `order ${item.order.trackingId}` : "the linked mobile-app order";
  if (lane === "payment") {
    return `Payment-linked dispute on ${orderRef} that needs gateway, wallet, or retry validation before recovery.`;
  }
  if (lane === "delivery") {
    return `Delivery dispute on ${orderRef} that needs shipment, route, and handoff evidence review.`;
  }
  return `Refund review on ${orderRef} that needs item, order, and merchant evidence before release.`;
}

function buildDisputeRiskFlags(lane: SupportDisputeLane, item: SupportDisputeApiItem) {
  const flags = [normalizeToken(item.category ?? lane)];
  if (lane === "payment") flags.push("Payments discrepancy");
  if (lane === "delivery") flags.push("Delivery trace");
  if (lane === "refund") flags.push("Refund decision");
  if (item.payment?.status) flags.push(normalizeToken(item.payment.status));
  return flags;
}

function buildDisputeTimeline(lane: SupportDisputeLane, item: SupportDisputeApiItem) {
  return [
    {
      label: lane === "payment" ? "Payment complaint opened" : lane === "delivery" ? "Dispute escalated" : "Refund review opened",
      detail: item.subject,
      time: formatTime(item.createdAt),
    },
    {
      label: "Latest staff update",
      detail: item.description,
      time: formatTime(item.updatedAt ?? item.createdAt),
    },
    item.payment?.reference
      ? {
          label: "Payment reference linked",
          detail: `Finance can trace this case through payment reference ${item.payment.reference}.`,
          time: formatTime(item.updatedAt ?? item.createdAt),
        }
      : null,
  ].filter(Boolean) as SupportDisputeCase["timeline"];
}

function buildSupportDisputeLinks(
  lane: SupportDisputeLane,
  customerHref: string,
  merchantName: string,
  shipmentId: string | null,
) {
  const trackingHref = shipmentId ? routes.logistics.trackingDetails(shipmentId) : routes.logistics.tracking;
  const vendorHref = vendorDetailHrefByName[merchantName] ?? routes.marketplace.vendors;

  if (lane === "payment") {
    return [
      { label: "Customer profile", href: customerHref },
      { label: "Payment ops", href: routes.sales.payments },
      { label: "Refund approvals", href: routes.sales.refunds },
    ];
  }

  if (lane === "delivery") {
    return [
      { label: "Customer profile", href: customerHref },
      { label: "Manual dispatch", href: routes.dispatch.manualDispatch },
      { label: "Tracking cases", href: trackingHref },
    ];
  }

  return [
    { label: "Customer profile", href: customerHref },
    { label: "Refund approvals", href: routes.sales.refunds },
    { label: "Vendor record", href: vendorHref },
  ];
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-ZM", {
    style: "currency",
    currency: "ZMW",
    maximumFractionDigits: 0,
  }).format(amount);
}

function buildSupportTicketLinks(lane: SupportTicketLane, customerHref: string) {
  if (lane === "billing") {
    return [
      { label: "Customer profile", href: customerHref },
      { label: "Payment ops", href: routes.sales.payments },
      { label: "Refund approvals", href: routes.sales.refunds },
    ];
  }

  if (lane === "merchant") {
    return [
      { label: "Customer profile", href: customerHref },
      { label: "Vendors", href: routes.marketplace.vendors },
      { label: "Categories", href: routes.marketplace.categories },
    ];
  }

  return [
    { label: "Customer profile", href: customerHref },
    { label: "Tracking cases", href: routes.logistics.tracking },
    { label: "Manual dispatch", href: routes.dispatch.manualDispatch },
  ];
}

function fullName(firstName?: string | null, lastName?: string | null) {
  return [firstName, lastName].filter(Boolean).join(" ");
}

function normalizeToken(value: string) {
  return value.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatTime(value?: string) {
  if (!value) return "Unknown";
  return new Date(value).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatAge(value?: string) {
  if (!value) return "Unknown";
  const diffMs = Date.now() - new Date(value).getTime();
  const diffMinutes = Math.max(1, Math.round(diffMs / 60000));
  if (diffMinutes < 60) return `${diffMinutes}m`;
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  return minutes ? `${hours}h ${minutes}m` : `${hours}h`;
}

function mapSupportInboxListPayload(payload: unknown): SupportInboxMessage[] {
  const items = (payload as SupportInboxListPayload)?.items ?? [];
  return items.map((item) => {
    const status = mapInboxStatus(item.status);
    const bucket = mapInboxBucket(item.status);
    const category = mapInboxCategory(item.status, item.messageCount ?? 0);
    return {
      id: item.id,
      conversationId: item.conversationId ?? null,
      title: item.subject,
      summary: item.description,
      customer: item.customer?.fullName ?? item.customer?.email ?? "Unknown customer",
      email: item.customer?.email ?? "No email",
      supportType: (item.messageCount ?? 0) > 0 ? "Chat" : "Email",
      bucket,
      category,
      markedAsRead: bucket === "closed",
      hasAttachments: false,
      date: formatAge(item.updatedAt ?? item.createdAt),
      priority: mapInboxPriority(item.category),
      agent: mapInboxAgent(item.category),
      status,
      city: item.customer?.city ?? "Unknown",
      thread: [],
    };
  });
}

function mapSupportInboxDetailPayload(payload: unknown): SupportInboxMessage | null {
  const item = (payload as SupportInboxDetailPayload)?.item;
  if (!item?.ticket) return null;

  const summaryRecord = mapSupportInboxListPayload({ items: [item.ticket] })[0];

  return {
    ...summaryRecord,
    customer: item.customer?.fullName ?? summaryRecord.customer,
    email: item.customer?.email ?? summaryRecord.email,
    city: item.customer?.city ?? summaryRecord.city,
    thread: (item.messages ?? []).map((message) => ({
      id: message.id,
      author: message.senderName ?? message.senderEmail ?? "Unknown sender",
      email: message.senderEmail ?? "No email",
      time: formatTime(message.createdAt),
      body: message.body,
      senderRole: message.senderRole === "ADMIN" ? "ADMIN" : "CUSTOMER",
    })),
  };
}

function mapInboxBucket(status?: string | null): SupportInboxBucket {
  return status === "RESOLVED" || status === "CLOSED" ? "closed" : "open";
}

function mapInboxCategory(status?: string | null, messageCount = 0): SupportInboxCategory {
  if (messageCount > 0) return "chat";
  if (status === "IN_PROGRESS") return "assigned-to-me";
  if (status === "OPEN") return "unassigned";
  return "all-open";
}

function mapInboxStatus(status?: string | null): SupportInboxMessage["status"] {
  switch (status) {
    case "IN_PROGRESS":
      return "Waiting on us";
    case "RESOLVED":
    case "CLOSED":
      return "Closed";
    case "OPEN":
      return "New";
    default:
      return "Waiting on contact";
  }
}

function mapInboxPriority(category?: string | null): SupportInboxMessage["priority"] {
  switch (category) {
    case "PAYMENT":
      return "High";
    case "DELIVERY":
    case "ORDER":
      return "Medium";
    default:
      return "Low";
  }
}

function mapInboxAgent(category?: string | null) {
  switch (category) {
    case "PAYMENT":
      return "Billing queue";
    case "DELIVERY":
    case "ORDER":
      return "Resolution pod";
    default:
      return "Support lead";
  }
}

/**
 * Admin support ticket mutation — calls PATCH /api/v1/admin/support/tickets/:id
 * action: "assign" | "escalate" | "resolve"
 */
export async function updateSupportTicket(
  id: string,
  action: "assign" | "escalate" | "resolve",
  reasonCode: string,
  note: string,
): Promise<{ success: boolean; error?: string }> {
  const statusMap: Record<string, string> = {
    assign: "IN_PROGRESS",
    escalate: "ESCALATED",
    resolve: "RESOLVED",
  };
  try {
    await patchAdminData<{ item: unknown }>(`/api/v1/admin/support/tickets/${id}`, {
      status: statusMap[action] ?? "IN_PROGRESS",
      resolution: note || reasonCode || undefined,
      assignedTo: action === "assign" ? "admin" : undefined,
    });
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update support ticket";
    return { success: false, error: message };
  }
}
