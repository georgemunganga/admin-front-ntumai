"use client";

import { useMemo } from "react";
import { customerDetailHrefByName } from "@/components/admin/ops-workflow-links";
import type { AdminRiskCaseBase } from "@/contracts/admin-domain";
import { routes } from "@/config/routes";
import { useAdminResource, patchAdminData } from "@/repositories/admin/admin-api";

export type PaymentLane = "retry" | "chargeback" | "reconciliation";
export type RefundLane = "auto_policy" | "manual" | "partial";

export type PaymentCase = AdminRiskCaseBase & {
  reference: string;
  lane: PaymentLane;
  customerName: string;
  city: string;
  amount: string;
  method: string;
  age: string;
  issue: string;
  sourceSummary: string;
};

export type RefundCase = AdminRiskCaseBase & {
  reference: string;
  lane: RefundLane;
  customerName: string;
  city: string;
  amount: string;
  destination: string;
  age: string;
  issue: string;
  sourceSummary: string;
};

type PaymentApiItem = {
  id: string;
  reference?: string | null;
  amount: number;
  method?: string | null;
  status?: string | null;
  createdAt?: string;
  updatedAt?: string;
  order?: {
    id: string;
    trackingId?: string | null;
    status?: string | null;
    totalAmount?: number;
  } | null;
  customer?: {
    id: string;
    fullName?: string | null;
    email?: string | null;
    phone?: string | null;
  } | null;
  address?: {
    city?: string | null;
    street?: string | null;
  } | null;
  store?: {
    id: string;
    name?: string | null;
  } | null;
};

type PaymentsPayload = {
  items: PaymentApiItem[];
};

type RefundApiItem = {
  id: string;
  refundState?: "pending_review" | "refunded" | "blocked" | null;
  createdAt?: string;
  updatedAt?: string;
  amount: number;
  order: {
    id: string;
    trackingId?: string | null;
    status?: string | null;
    totalAmount?: number;
  };
  payment?: {
    id: string;
    method?: string | null;
    status?: string | null;
    reference?: string | null;
  } | null;
  customer?: {
    id: string;
    fullName?: string | null;
    email?: string | null;
    phone?: string | null;
  } | null;
  address?: {
    city?: string | null;
    street?: string | null;
  } | null;
  store?: {
    id: string;
    name?: string | null;
  } | null;
};

type RefundsPayload = {
  items: RefundApiItem[];
};

const paymentCases: PaymentCase[] = [
  {
    id: "PAYM-4204",
    reference: "ORD-88314",
    lane: "retry",
    customerName: "Loveness Phiri",
    city: "Lusaka",
    status: "review",
    amount: "ZMW 186",
    method: "Card ••• 2204",
    owner: "Payments ops",
    age: "10m",
    issue: "Primary card capture failed, wallet fallback was not attempted, and the customer is still trying to complete checkout.",
    sourceSummary: "Checkout failure with eligible wallet fallback path",
    riskFlags: ["Retry candidate", "Fallback available"],
    timeline: [
      { label: "Capture failed", detail: "Gateway returned a soft decline during checkout.", time: "09:21" },
      { label: "Fallback missed", detail: "Wallet backup path did not trigger after the decline.", time: "09:23" },
      { label: "Retry review opened", detail: "Payments ops should decide the next recovery step.", time: "09:27" },
    ],
    notes: ["Likely a clean retry or fallback release case."],
    links: [
      { label: "Customer profile", href: customerDetailHrefByName["Loveness Phiri"] },
      { label: "Refund approvals", href: routes.sales.refunds },
      { label: "Support inbox", href: routes.supportDesk.inbox },
    ],
  },
  {
    id: "PAYM-4198",
    reference: "ORD-88297",
    lane: "chargeback",
    customerName: "Chisomo Tembo",
    city: "Kitwe",
    status: "monitoring",
    amount: "ZMW 312",
    method: "Visa ••• 1930",
    owner: "Chargeback desk",
    age: "24m",
    issue: "Issuer-side reversal was opened after the order completed, but merchant evidence suggests the service was delivered correctly.",
    sourceSummary: "Completed order with early chargeback notice and merchant evidence",
    riskFlags: ["Issuer dispute", "Evidence pack attached"],
    timeline: [
      { label: "Chargeback notice received", detail: "Issuer event entered the chargeback lane.", time: "08:46" },
      { label: "Merchant evidence attached", detail: "Proof of fulfillment and completion added.", time: "08:58" },
      { label: "Awaiting desk review", detail: "Chargeback desk should choose representment or closure.", time: "09:05" },
    ],
    notes: ["Needs a finance decision before support promises any customer recovery."],
    links: [
      { label: "Customer profile", href: customerDetailHrefByName["Chisomo Tembo"] },
      { label: "Disputes", href: routes.supportDesk.disputes },
      { label: "Orders", href: routes.sales.orders },
    ],
  },
  {
    id: "PAYM-4189",
    reference: "SET-88244",
    lane: "reconciliation",
    customerName: "Agnes Mumba",
    city: "Kabwe",
    status: "at_risk",
    amount: "ZMW 412",
    method: "Wallet + card split",
    owner: "Ledger reconciliation",
    age: "38m",
    issue: "Internal ledger shows a split-payment settlement, but the provider only confirmed the card leg and never posted the wallet movement.",
    sourceSummary: "Split-payment mismatch between internal ledger and provider confirmation",
    riskFlags: ["Ledger mismatch", "Provider confirmation gap"],
    timeline: [
      { label: "Mismatch detected", detail: "Settlement audit found provider and wallet drift.", time: "08:04" },
      { label: "Customer balance frozen", detail: "Finance blocked downstream refund actions pending reconciliation.", time: "08:12" },
      { label: "Risk escalation attached", detail: "This should not be closed until ledger parity is restored.", time: "08:20" },
    ],
    notes: ["Do not close until payment-source parity is confirmed."],
    links: [
      { label: "Customer profile", href: customerDetailHrefByName["Agnes Mumba"] },
      { label: "Refund approvals", href: routes.sales.refunds },
      { label: "Support tickets", href: routes.supportDesk.tickets },
    ],
  },
  {
    id: "PAYM-4174",
    reference: "ORD-88183",
    lane: "retry",
    customerName: "Brian Zulu",
    city: "Ndola",
    status: "queued",
    amount: "ZMW 92",
    method: "MTN MoMo ••• 0184",
    owner: "Retry runner",
    age: "49m",
    issue: "Mobile-money payment timed out, but the customer immediately retried and may be charged again if the original pending event settles late.",
    sourceSummary: "Pending mobile-money timeout with duplicate-charge risk on rerun",
    riskFlags: ["Pending timeout", "Duplicate-risk"],
    timeline: [
      { label: "Timeout recorded", detail: "Provider did not confirm within the checkout window.", time: "07:31" },
      { label: "Rerun queued", detail: "Case was moved into retry holding to prevent duplicate capture.", time: "07:43" },
    ],
    notes: ["Should only rerun after the old pending event is definitively dead."],
    links: [
      { label: "Customer profile", href: customerDetailHrefByName["Brian Zulu"] },
      { label: "Refund approvals", href: routes.sales.refunds },
      { label: "Support inbox", href: routes.supportDesk.inbox },
    ],
  },
  {
    id: "PAYM-4168",
    reference: "SET-88092",
    lane: "reconciliation",
    customerName: "Natasha Chinyama",
    city: "Lusaka",
    status: "paused",
    amount: "ZMW 54",
    method: "Wallet credit",
    owner: "Finance governance",
    age: "1h 04m",
    issue: "Wallet credit was created manually during support recovery, but the matching ledger annotation is incomplete so governance paused the payment case.",
    sourceSummary: "Manual wallet credit missing full ledger audit context",
    riskFlags: ["Manual adjustment", "Audit gap"],
    timeline: [
      { label: "Credit issued", detail: "Support-triggered manual wallet credit posted.", time: "06:48" },
      { label: "Audit gap found", detail: "Finance could not trace the full ledger note chain.", time: "06:56" },
      { label: "Governance hold applied", detail: "Case should stay paused until annotation is corrected.", time: "07:03" },
    ],
    notes: ["Needs audit completion, not just payment closure."],
    links: [
      { label: "Customer profile", href: customerDetailHrefByName["Natasha Chinyama"] },
      { label: "Activity logs", href: routes.platform.activityLogs },
      { label: "Support escalations", href: routes.supportDesk.escalations },
    ],
  },
];

const refundCases: RefundCase[] = [
  {
    id: "REF-4204",
    reference: "ORD-88214",
    lane: "manual",
    customerName: "Loveness Phiri",
    city: "Lusaka",
    status: "review",
    amount: "ZMW 186",
    destination: "Wallet refund",
    owner: "Refund desk",
    age: "12m",
    issue: "Merchant delay and missing-item evidence point to recovery, but the amount needs finance sign-off because the order also included a platform coupon.",
    sourceSummary: "Coupon-linked order with missing-item claim and refund request",
    riskFlags: ["Coupon adjustment", "Merchant evidence attached"],
    timeline: [
      { label: "Refund request opened", detail: "Support sent the case into finance review.", time: "09:11" },
      { label: "Coupon offset flagged", detail: "Recovery value should exclude the platform-funded promo share.", time: "09:18" },
      { label: "Manual review started", detail: "Refund desk should validate the final payable amount.", time: "09:23" },
    ],
    notes: ["Likely approvable after separating promo-funded value from merchant-funded value."],
    links: [
      { label: "Support disputes", href: routes.supportDesk.disputes },
      { label: "Payments", href: routes.sales.payments },
    ],
  },
  {
    id: "REF-4198",
    reference: "ORD-88197",
    lane: "partial",
    customerName: "Chisomo Tembo",
    city: "Kitwe",
    status: "monitoring",
    amount: "ZMW 72",
    destination: "Wallet refund",
    owner: "Service recovery",
    age: "26m",
    issue: "Delivery arrived late, but the order was completed. Support proposed a partial goodwill credit rather than a full refund.",
    sourceSummary: "Completed delivery with lateness-based partial recovery",
    riskFlags: ["Service recovery", "No merchant fault"],
    timeline: [
      { label: "Case escalated", detail: "Support proposed partial recovery after delay review.", time: "08:41" },
      { label: "Policy checked", detail: "Service recovery thresholds matched the partial-credit lane.", time: "08:54" },
      { label: "Waiting release", detail: "Finance should confirm wallet disbursement value.", time: "09:03" },
    ],
    notes: ["Good candidate for fast approval if no duplicate credit exists."],
    links: [
      { label: "Support tickets", href: routes.supportDesk.tickets },
      { label: "Customer profile", href: customerDetailHrefByName["Chisomo Tembo"] },
    ],
  },
  {
    id: "REF-4189",
    reference: "ORD-88144",
    lane: "manual",
    customerName: "Agnes Mumba",
    city: "Kabwe",
    status: "at_risk",
    amount: "ZMW 412",
    destination: "Card reversal",
    owner: "Payments review",
    age: "39m",
    issue: "Customer was charged twice during checkout retry. One capture appears to have settled, and the other is still unresolved in the gateway trail.",
    sourceSummary: "Potential duplicate charge linked to payment gateway retry path",
    riskFlags: ["Duplicate capture", "Gateway mismatch"],
    timeline: [
      { label: "Refund request created", detail: "Customer reported a duplicated charge after payment retry.", time: "08:02" },
      { label: "Gateway mismatch found", detail: "Only one order settlement is visible in the marketplace ledger.", time: "08:15" },
      { label: "Risk hold applied", detail: "Do not release reversal until payments confirms source movement.", time: "08:23" },
    ],
    notes: ["This should not auto-approve until gateway reconciliation is complete."],
    links: [
      { label: "Payments", href: routes.sales.payments },
      { label: "Support disputes", href: routes.supportDesk.disputes },
    ],
  },
  {
    id: "REF-4174",
    reference: "ORD-88083",
    lane: "auto_policy",
    customerName: "Brian Zulu",
    city: "Ndola",
    status: "queued",
    amount: "ZMW 92",
    destination: "Wallet refund",
    owner: "Auto-refund monitor",
    age: "51m",
    issue: "Order canceled after delay threshold passed, but the refund is still waiting for wallet confirmation after the auto-policy engine approved it.",
    sourceSummary: "Auto-approved cancellation refund awaiting wallet posting",
    riskFlags: ["Wallet posting pending"],
    timeline: [
      { label: "Auto-policy approved", detail: "Delay threshold released the refund automatically.", time: "07:24" },
      { label: "Disbursement queued", detail: "Wallet posting has not yet been confirmed.", time: "07:37" },
    ],
    notes: ["This should clear as soon as wallet confirmation lands."],
    links: [
      { label: "Payments", href: routes.sales.payments },
      { label: "Support inbox", href: routes.supportDesk.inbox },
    ],
  },
  {
    id: "REF-4168",
    reference: "ORD-88022",
    lane: "partial",
    customerName: "Natasha Chinyama",
    city: "Lusaka",
    status: "paused",
    amount: "ZMW 54",
    destination: "Wallet credit",
    owner: "Refund governance",
    age: "1h 07m",
    issue: "Support proposed partial recovery, but the customer account is tied to an open abuse review so disbursement is paused pending trust clearance.",
    sourceSummary: "Partial recovery blocked behind trust and abuse review",
    riskFlags: ["Trust dependency", "Abuse review open"],
    timeline: [
      { label: "Recovery proposed", detail: "Support recommended a partial wallet credit.", time: "06:42" },
      { label: "Trust dependency found", detail: "Customer account is linked to an unresolved abuse review.", time: "06:53" },
      { label: "Refund paused", detail: "Finance should wait for trust clearance before releasing value.", time: "07:00" },
    ],
    notes: ["No credit should be issued until the abuse review closes."],
    links: [
      { label: "Support escalations", href: routes.supportDesk.escalations },
      { label: "Safety compliance", href: routes.risk.compliance },
    ],
  },
];

export function listPaymentCases(): PaymentCase[] {
  return paymentCases;
}

export function listRefundCases(): RefundCase[] {
  return refundCases;
}

export function usePaymentCases() {
  const fallback = useMemo(() => listPaymentCases(), []);
  return useAdminResource({
    path: "/api/v1/admin/payments?limit=100",
    fallback,
    map: mapPaymentsPayload,
  });
}

export function useRefundCases() {
  const fallback = useMemo(() => listRefundCases(), []);
  return useAdminResource({
    path: "/api/v1/admin/refunds?limit=100",
    fallback,
    map: mapRefundsPayload,
  });
}

function mapPaymentsPayload(payload: unknown): PaymentCase[] {
  const items = (payload as PaymentsPayload)?.items ?? [];
  return items.map((item) => {
    const lane = mapPaymentLane(item.status, item.order?.status);
    const customerHref = item.customer?.id
      ? routes.crm.customerDetails(item.customer.id)
      : customerDetailHrefByName[item.customer?.fullName ?? ""] ?? routes.crm.customers;

    return {
      id: item.id,
      reference: item.order?.trackingId ?? item.reference ?? item.id,
      lane,
      customerName: item.customer?.fullName ?? item.customer?.email ?? "Unknown customer",
      city: item.address?.city ?? "Unknown",
      status: mapPaymentStatus(item.status, item.order?.status),
      amount: formatMoney(item.amount),
      method: normalizeMethod(item.method),
      owner: lane === "retry" ? "Payments ops" : lane === "chargeback" ? "Chargeback desk" : "Ledger reconciliation",
      age: formatAge(item.createdAt ?? item.updatedAt),
      issue: buildPaymentIssue(lane, item),
      sourceSummary: buildPaymentSourceSummary(lane, item),
      riskFlags: buildPaymentFlags(lane, item),
      timeline: [
        {
          label: "Payment record created",
          detail: `Payment event linked to order ${item.order?.trackingId ?? item.order?.id ?? "unknown"} entered the finance queue.`,
          time: formatTime(item.createdAt),
        },
        {
          label: "Latest finance state",
          detail: `Payment is ${normalizeToken(item.status ?? "pending").toLowerCase()} while order status is ${normalizeToken(item.order?.status ?? "pending").toLowerCase()}.`,
          time: formatTime(item.updatedAt ?? item.createdAt),
        },
      ],
      notes: [
        "Live payment case loaded from the Nest admin endpoint.",
        lane === "retry"
          ? "Check retry, fallback, or duplicate-capture risk before rerunning payment."
          : lane === "chargeback"
            ? "Coordinate with support before promising customer resolution."
            : "Confirm ledger parity against order and settlement state before closure.",
      ],
      links: [
        { label: "Customer profile", href: customerHref },
        { label: "Order", href: item.order?.id ? routes.sales.orderDetails(item.order.id) : routes.sales.orders },
        { label: "Support tickets", href: routes.supportDesk.tickets },
      ],
      refs: {
        customerId: item.customer?.id,
        orderId: item.order?.id,
        paymentCaseId: item.id,
      },
      workflow: {
        actor: "customer",
        source: "refund_dispute",
        state:
          lane === "retry"
            ? "under_review"
            : lane === "chargeback"
              ? "escalated"
              : "in_progress",
        ownerTeam: "finance",
        summary: buildPaymentSourceSummary(lane, item),
      },
    };
  });
}

function mapRefundsPayload(payload: unknown): RefundCase[] {
  const items = (payload as RefundsPayload)?.items ?? [];
  return items.map((item) => {
    const lane = mapRefundLane(item);
    const customerHref = item.customer?.id
      ? routes.crm.customerDetails(item.customer.id)
      : customerDetailHrefByName[item.customer?.fullName ?? ""] ?? routes.crm.customers;

    return {
      id: item.id,
      reference: item.order?.trackingId ?? item.payment?.reference ?? item.id,
      lane,
      customerName: item.customer?.fullName ?? item.customer?.email ?? "Unknown customer",
      city: item.address?.city ?? "Unknown",
      status: mapRefundStatus(item.refundState),
      amount: formatMoney(item.amount),
      destination: item.payment?.method ? `${normalizeMethod(item.payment.method)} reversal` : "Original order value review",
      owner:
        lane === "auto_policy"
          ? "Auto-refund monitor"
          : lane === "partial"
            ? "Service recovery"
            : "Refund desk",
      age: formatAge(item.createdAt ?? item.updatedAt),
      issue: buildRefundIssue(item),
      sourceSummary: buildRefundSourceSummary(item),
      riskFlags: buildRefundFlags(item),
      timeline: [
        {
          label: "Refund case identified",
          detail: `Order ${item.order?.trackingId ?? item.order?.id ?? "unknown"} entered the refund review workflow.`,
          time: formatTime(item.createdAt),
        },
        {
          label: "Latest refund state",
          detail: `Refund case is currently ${normalizeToken(item.refundState ?? "pending_review").toLowerCase()} with payment state ${normalizeToken(item.payment?.status ?? "unknown").toLowerCase()}.`,
          time: formatTime(item.updatedAt ?? item.createdAt),
        },
      ],
      notes: [
        item.refundState === "refunded"
          ? "This refund has already been posted from the live payment trail."
          : "Derived refund review case loaded from live order and payment state.",
      ],
      links: [
        { label: "Customer profile", href: customerHref },
        { label: "Order", href: item.order?.id ? routes.sales.orderDetails(item.order.id) : routes.sales.orders },
        { label: "Payments", href: routes.sales.payments },
      ],
      refs: {
        customerId: item.customer?.id,
        orderId: item.order?.id,
        paymentCaseId: item.payment?.id,
        refundCaseId: item.id,
      },
      workflow: {
        actor: "customer",
        source: "refund_dispute",
        state:
          item.refundState === "refunded"
            ? "resolved"
            : item.refundState === "blocked"
              ? "blocked"
              : "under_review",
        ownerTeam: "finance",
        summary: buildRefundSourceSummary(item),
      },
    };
  });
}

function mapPaymentLane(status?: string | null, orderStatus?: string | null): PaymentLane {
  if (status === "FAILED" || status === "PENDING") return "retry";
  if (status === "REFUNDED" || orderStatus === "CANCELLED") return "chargeback";
  return "reconciliation";
}

function mapPaymentStatus(status?: string | null, orderStatus?: string | null) {
  if (status === "FAILED") return "review";
  if (status === "PENDING") return "queued";
  if (status === "REFUNDED") return "monitoring";
  if (orderStatus === "CANCELLED") return "at_risk";
  return "live";
}

function mapRefundLane(item: RefundApiItem): RefundLane {
  if (item.refundState === "refunded") return "auto_policy";
  if ((item.order?.totalAmount ?? item.amount) > item.amount) return "partial";
  return "manual";
}

function mapRefundStatus(state?: string | null) {
  if (state === "refunded") return "stable";
  if (state === "blocked") return "at_risk";
  return "review";
}

function buildPaymentIssue(lane: PaymentLane, item: PaymentApiItem) {
  if (lane === "retry") {
    return `Customer payment for ${item.order?.trackingId ?? item.id} is pending or failed and may need retry or fallback handling.`;
  }
  if (lane === "chargeback") {
    return `Funds tied to ${item.order?.trackingId ?? item.id} were reversed or conflict with order state, so finance should review recovery exposure.`;
  }
  return `Captured payment for ${item.order?.trackingId ?? item.id} needs reconciliation against order fulfillment and settlement context.`;
}

function buildPaymentSourceSummary(lane: PaymentLane, item: PaymentApiItem) {
  if (lane === "retry") return "Checkout payment path is incomplete and may still affect the customer’s order flow.";
  if (lane === "chargeback") return "Order and payment outcomes are no longer aligned, creating customer-recovery and dispute pressure.";
  return `Live payment record from ${item.store?.name ?? "Ntumai commerce"} needs finance parity review.`;
}

function buildPaymentFlags(lane: PaymentLane, item: PaymentApiItem) {
  if (lane === "retry") return ["Retry candidate", normalizeToken(item.status ?? "pending")];
  if (lane === "chargeback") return ["Recovery exposure", normalizeToken(item.order?.status ?? "cancelled")];
  return ["Ledger review", normalizeMethod(item.method)];
}

function buildRefundIssue(item: RefundApiItem) {
  if (item.refundState === "refunded") {
    return `Refund related to ${item.order?.trackingId ?? item.id} has already posted and should be checked for downstream customer communication only.`;
  }
  if (item.refundState === "blocked") {
    return `Cancelled order ${item.order?.trackingId ?? item.id} is blocked behind failed payment state and needs manual finance review before release.`;
  }
  return `Cancelled or disputed order ${item.order?.trackingId ?? item.id} is pending refund review from the live order and payment trail.`;
}

function buildRefundSourceSummary(item: RefundApiItem) {
  if (item.refundState === "refunded") return "Refund was derived from a live refunded payment record.";
  if (item.refundState === "blocked") return "Order cancellation and payment failure are both present, so the case cannot auto-release.";
  return "Order cancellation was detected without a completed refund posting, so staff review is still required.";
}

function buildRefundFlags(item: RefundApiItem) {
  if (item.refundState === "refunded") return ["Refund posted", normalizeMethod(item.payment?.method)];
  if (item.refundState === "blocked") return ["Manual review", normalizeToken(item.payment?.status ?? "failed")];
  return ["Pending review", normalizeToken(item.order?.status ?? "cancelled")];
}

function normalizeMethod(method?: string | null) {
  if (!method) return "Unknown method";
  return method.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

function normalizeToken(value: string) {
  return value.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatMoney(amount: number, currency = "ZMW") {
  return `${currency} ${Math.round(amount).toLocaleString()}`;
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

function formatTime(value?: string) {
  if (!value) return "Unknown";
  return new Date(value).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── P0 Mutations — Live Payouts (Track A Phase 3) ───────────────────────────

export type LivePayoutRecord = {
  id: string;
  userId: string;
  role: "TASKER" | "VENDOR";
  amount: number;
  currency: string;
  destination: unknown;
  status: "PENDING" | "PROCESSING" | "PAID" | "REJECTED" | "CANCELLED";
  notes: string | null;
  processedAt: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    fullName: string;
    email: string | null;
    phone: string | null;
  };
};

type LivePayoutsPayload = {
  items: LivePayoutRecord[];
  pagination: { total: number; page: number; limit: number };
};

export function useAdminPayouts(status?: string, role?: string) {
  const params = new URLSearchParams({ limit: "50" });
  if (status) params.set("status", status);
  if (role) params.set("role", role);
  const path = `/api/v1/admin/payouts?${params.toString()}`;
  const fallback: LivePayoutRecord[] = [];
  return useAdminResource<LivePayoutRecord[]>({
    path,
    fallback,
    map: (payload) => (payload as LivePayoutsPayload)?.items ?? [],
  });
}

export async function applyAdminPayoutDecision(
  payoutId: string,
  action: "approve" | "hold" | "reject",
  note?: string,
): Promise<{ id: string; status: string; action: string } | null> {
  return patchAdminData<{ id: string; status: string; action: string }>(
    `/api/v1/admin/payouts/${payoutId}`,
    { action, ...(note ? { note } : {}) },
  );
}
