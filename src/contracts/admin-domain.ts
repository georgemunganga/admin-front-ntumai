export type AdminStatus =
  | "live"
  | "stable"
  | "review"
  | "monitoring"
  | "queued"
  | "paused"
  | "at_risk";

export type AdminTimelineEntry = {
  label: string;
  detail: string;
  time: string;
};

export type AdminActionLink = {
  label: string;
  href: string;
};

export type AdminEntityType =
  | "customer"
  | "vendor"
  | "tasker"
  | "order"
  | "shipment"
  | "dispatch_case"
  | "support_case"
  | "payment_case"
  | "refund_case"
  | "payout_case";

export type AdminEntityRefs = {
  customerId?: string;
  vendorId?: string;
  taskerId?: string;
  orderId?: string;
  shipmentId?: string;
  dispatchCaseId?: string;
  supportCaseId?: string;
  paymentCaseId?: string;
  refundCaseId?: string;
  payoutCaseId?: string;
};

export type AdminCaseBase = {
  id: string;
  status: AdminStatus;
  owner: string;
  timeline: AdminTimelineEntry[];
  notes: string[];
  links: AdminActionLink[];
  refs?: AdminEntityRefs;
};

export type AdminRiskCaseBase = AdminCaseBase & {
  riskFlags: string[];
};

export type AdminLifecycleRecord = {
  id: string;
  status: AdminStatus;
  owner: string;
  updatedAt: string;
  timeline: AdminTimelineEntry[];
};
