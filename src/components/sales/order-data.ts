"use client";

import type { AdminStatus, AdminTimelineEntry } from "@/contracts/admin-domain";

export type SalesOrder = {
  id: string;
  slug: string;
  orderNumber: string;
  customer: string;
  customerPhone: string;
  city: string;
  vendor: string;
  deliveryAddress: string;
  value: string;
  subtotal: string;
  deliveryFee: string;
  tax: string;
  totalAmount: string;
  itemCount: string;
  status: AdminStatus;
  fulfillment: string;
  paymentState: string;
  paymentMethod: string;
  trackingId: string;
  updatedAt: string;
  summary: string;
  items: Array<{ name: string; qty: string; price: string }>;
  timeline: AdminTimelineEntry[];
};

export const salesOrders: SalesOrder[] = [
  {
    id: "ORD-90014",
    slug: "ORD-90014",
    orderNumber: "#MK-90014",
    customer: "Chipo Mwansa",
    customerPhone: "+260 97 411 2084",
    city: "Lusaka",
    vendor: "Green Basket Market",
    deliveryAddress: "Plot 18, Kabulonga Road, Lusaka",
    value: "ZMW 412",
    subtotal: "ZMW 355",
    deliveryFee: "ZMW 40",
    tax: "ZMW 17",
    totalAmount: "ZMW 412",
    itemCount: "4 items",
    status: "live",
    fulfillment: "Same-day",
    paymentState: "Paid",
    paymentMethod: "Wallet + card",
    trackingId: "TRK-90014-LSK",
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
    orderNumber: "#MK-89986",
    customer: "Tina Phiri",
    customerPhone: "+260 96 232 8891",
    city: "Kitwe",
    vendor: "QuickBite Kitchens",
    deliveryAddress: "Freedom Avenue, Nkana East, Kitwe",
    value: "ZMW 188",
    subtotal: "ZMW 176",
    deliveryFee: "ZMW 12",
    tax: "ZMW 0",
    totalAmount: "ZMW 188",
    itemCount: "3 items",
    status: "review",
    fulfillment: "On-demand",
    paymentState: "Paid",
    paymentMethod: "Card",
    trackingId: "TRK-89986-KTW",
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
    orderNumber: "#MK-89941",
    customer: "Mercy Zulu",
    customerPhone: "+260 95 716 4412",
    city: "Ndola",
    vendor: "HomeBox Supplies",
    deliveryAddress: "Mufulira Road, Itawa, Ndola",
    value: "ZMW 280",
    subtotal: "ZMW 250",
    deliveryFee: "ZMW 22",
    tax: "ZMW 8",
    totalAmount: "ZMW 280",
    itemCount: "1 item",
    status: "monitoring",
    fulfillment: "Next-slot",
    paymentState: "Authorized",
    paymentMethod: "Mobile money",
    trackingId: "TRK-89941-NDL",
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
    orderNumber: "#MK-89877",
    customer: "Brian Banda",
    customerPhone: "+260 97 998 1543",
    city: "Lusaka",
    vendor: "CityCare Pharmacy",
    deliveryAddress: "Thabo Mbeki Road, Rhodes Park, Lusaka",
    value: "ZMW 145",
    subtotal: "ZMW 128",
    deliveryFee: "ZMW 10",
    tax: "ZMW 7",
    totalAmount: "ZMW 145",
    itemCount: "1 item",
    status: "queued",
    fulfillment: "Scheduled",
    paymentState: "Pending review",
    paymentMethod: "Wallet",
    trackingId: "TRK-89877-LSK",
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
