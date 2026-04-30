export type AdminStatus =
  | "live"
  | "stable"
  | "review"
  | "monitoring"
  | "queued"
  | "paused"
  | "at_risk";

export type AdminWorkflowActor = "customer" | "tasker" | "vendor" | "staff";

export type AdminWorkflowSource =
  | "delivery"
  | "scheduled_ride"
  | "errand"
  | "marketplace_order"
  | "onboarding_review"
  | "payout_request"
  | "invoice_settlement"
  | "refund_dispute"
  | "support_recovery"
  | "catalog_management"
  | "role_access";

export type AdminOperationalState =
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected"
  | "assigned"
  | "in_progress"
  | "blocked"
  | "escalated"
  | "settled"
  | "resolved";

export type AdminStaffTeam =
  | "crm"
  | "dispatch"
  | "finance"
  | "fleet"
  | "growth"
  | "logistics"
  | "marketplace_ops"
  | "platform"
  | "risk"
  | "support";

export type AdminWorkflowContext = {
  actor: AdminWorkflowActor;
  source: AdminWorkflowSource;
  state: AdminOperationalState;
  ownerTeam: AdminStaffTeam;
  summary: string;
};

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
  workflow?: AdminWorkflowContext;
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
  workflow?: AdminWorkflowContext;
};
