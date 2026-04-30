"use client";

import { customerDetailHrefByName } from "@/components/admin/ops-workflow-links";
import type { AdminRiskCaseBase } from "@/contracts/admin-domain";
import { routes } from "@/config/routes";

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
