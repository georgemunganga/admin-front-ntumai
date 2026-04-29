export type SupportTemplate = {
  id: string;
  name: string;
  channel: "Email" | "SMS" | "Push";
  audience: string;
  status: "live" | "review" | "queued";
  updatedAt: string;
  owner: string;
  subject: string;
  preview: string;
  variables: string[];
};

export const supportTemplates: SupportTemplate[] = [
  {
    id: "TPL-1001",
    name: "Order Delivered",
    channel: "Email",
    audience: "Customers",
    status: "live",
    updatedAt: "18 min ago",
    owner: "Support Ops",
    subject: "Your Ntumai order has been delivered",
    preview: "Confirm successful delivery and link to issue reporting if the order was incomplete.",
    variables: ["customer_name", "order_id", "delivered_at", "tasker_name"],
  },
  {
    id: "TPL-1002",
    name: "Tasker Reassignment Alert",
    channel: "Push",
    audience: "Taskers",
    status: "review",
    updatedAt: "42 min ago",
    owner: "Dispatch Desk",
    subject: "Assignment updated",
    preview: "Notify the tasker that the current order has been reassigned or resequenced.",
    variables: ["tasker_name", "order_id", "pickup_name", "zone_name"],
  },
  {
    id: "TPL-1003",
    name: "Vendor Payout Notice",
    channel: "Email",
    audience: "Vendors",
    status: "queued",
    updatedAt: "1h ago",
    owner: "Finance Ops",
    subject: "Your weekly payout summary is ready",
    preview: "Send the weekly settlement summary with payout amount and payout method details.",
    variables: ["vendor_name", "payout_amount", "settlement_cycle", "payout_method"],
  },
];

export function getSupportTemplate(id: string) {
  return supportTemplates.find((template) => template.id === id);
}
