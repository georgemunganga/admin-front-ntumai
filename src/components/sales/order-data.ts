"use client";

export type SalesOrder = {
  id: string;
  slug: string;
  customer: string;
  city: string;
  vendor: string;
  value: string;
  status: "live" | "stable" | "review" | "monitoring" | "queued" | "at_risk";
  fulfillment: string;
  paymentState: string;
  updatedAt: string;
  summary: string;
  items: Array<{ name: string; qty: string; price: string }>;
  timeline: Array<{ label: string; detail: string; time: string }>;
};

export const salesOrders: SalesOrder[] = [
  {
    id: "ORD-90014",
    slug: "ORD-90014",
    customer: "Chipo Mwansa",
    city: "Lusaka",
    vendor: "Green Basket Market",
    value: "ZMW 412",
    status: "live",
    fulfillment: "Same-day",
    paymentState: "Paid",
    updatedAt: "2 min ago",
    summary: "Fresh produce basket with same-day delivery and completed payment.",
    items: [
      { name: "Organic tomato basket", qty: "1", price: "ZMW 95" },
      { name: "Seasonal fruit box", qty: "1", price: "ZMW 165" },
      { name: "Leafy greens bundle", qty: "2", price: "ZMW 76" },
    ],
    timeline: [
      { label: "Order placed", detail: "Checkout completed from marketplace cart.", time: "08:14" },
      { label: "Payment confirmed", detail: "Wallet plus card payment settled.", time: "08:15" },
      { label: "Vendor accepted", detail: "Store is preparing the order now.", time: "08:18" },
    ],
  },
  {
    id: "ORD-89986",
    slug: "ORD-89986",
    customer: "Tina Phiri",
    city: "Kitwe",
    vendor: "QuickBite Kitchens",
    value: "ZMW 188",
    status: "review",
    fulfillment: "On-demand",
    paymentState: "Paid",
    updatedAt: "14 min ago",
    summary: "Prepared meal order with a handoff delay under commercial review.",
    items: [
      { name: "Lunch bowl combo", qty: "2", price: "ZMW 88" },
      { name: "Bottled water", qty: "1", price: "ZMW 12" },
    ],
    timeline: [
      { label: "Order placed", detail: "Meal order received during peak lunch period.", time: "11:08" },
      { label: "Vendor delay", detail: "Prep queue exceeded expected handoff time.", time: "11:19" },
      { label: "Review opened", detail: "Ops monitoring delay before customer recovery action.", time: "11:24" },
    ],
  },
  {
    id: "ORD-89941",
    slug: "ORD-89941",
    customer: "Mercy Zulu",
    city: "Ndola",
    vendor: "HomeBox Supplies",
    value: "ZMW 280",
    status: "monitoring",
    fulfillment: "Next-slot",
    paymentState: "Authorized",
    updatedAt: "29 min ago",
    summary: "Household bundle order under low-stock watch before final confirmation.",
    items: [
      { name: "Family essentials pack", qty: "1", price: "ZMW 280" },
    ],
    timeline: [
      { label: "Order placed", detail: "Bundle order reserved from low-stock inventory.", time: "09:42" },
      { label: "Stock verification", detail: "Vendor verifying replenishment before pack release.", time: "09:54" },
      { label: "Monitoring hold", detail: "Commercial team watching handoff risk.", time: "10:03" },
    ],
  },
  {
    id: "ORD-89877",
    slug: "ORD-89877",
    customer: "Brian Banda",
    city: "Lusaka",
    vendor: "CityCare Pharmacy",
    value: "ZMW 145",
    status: "queued",
    fulfillment: "Scheduled",
    paymentState: "Pending review",
    updatedAt: "43 min ago",
    summary: "Restricted-category order waiting on compliance release.",
    items: [
      { name: "Pain relief combo", qty: "1", price: "ZMW 145" },
    ],
    timeline: [
      { label: "Order placed", detail: "Restricted product requested through pharmacy flow.", time: "07:58" },
      { label: "Compliance check", detail: "Order held behind regulated product rules.", time: "08:05" },
      { label: "Release queue", detail: "Awaiting final merchant-compliance clearance.", time: "08:17" },
    ],
  },
];

export function getSalesOrder(id: string) {
  return salesOrders.find((order) => order.id === id || order.slug === id);
}
