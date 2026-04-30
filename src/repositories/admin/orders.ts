"use client";

import { useMemo } from "react";
import { salesOrders, type SalesOrder } from "@/components/sales/order-data";
import type { AdminStatus } from "@/contracts/admin-domain";
import { useAdminResource } from "@/repositories/admin/admin-api";

export function listSalesOrders(): SalesOrder[] {
  return salesOrders;
}

export function getSalesOrderById(id: string): SalesOrder | undefined {
  return salesOrders.find((order) => order.id === id || order.slug === id);
}

type AdminOrderSummary = {
  id: string;
  trackingId: string;
  status: string;
  customerId?: string;
  customerName?: string | null;
  store?: { name?: string | null } | null;
  subtotal?: number;
  deliveryFee?: number;
  tax?: number;
  totalAmount?: number;
  scheduledAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  payment?: {
    status?: string | null;
    method?: string | null;
  } | null;
  address?: {
    city?: string | null;
    street?: string | null;
  } | null;
  itemCount?: number;
};

type AdminOrderDetail = AdminOrderSummary & {
  customer?: {
    email?: string | null;
    phone?: string | null;
  } | null;
  items?: Array<{
    quantity?: number;
    price?: number;
    product?: {
      name?: string | null;
    } | null;
  }>;
  shipment?: {
    id?: string;
    trackingId?: string | null;
    status?: string | null;
  } | null;
};

type AdminOrdersPayload = {
  items: AdminOrderSummary[];
};

type AdminOrderPayload = {
  item: AdminOrderDetail;
};

export function useSalesOrders() {
  const fallback = useMemo(() => listSalesOrders(), []);
  return useAdminResource({
    path: "/api/v1/admin/orders?limit=100",
    fallback,
    map: mapOrdersPayload,
  });
}

export function useSalesOrder(id: string) {
  const fallback = useMemo(() => getSalesOrderById(id) ?? null, [id]);
  return useAdminResource({
    path: `/api/v1/admin/orders/${id}`,
    fallback,
    map: mapOrderPayload,
    enabled: Boolean(id),
  });
}

function mapOrdersPayload(payload: unknown): SalesOrder[] {
  const items = (payload as AdminOrdersPayload)?.items ?? [];
  return items.map(toSalesOrderRecord);
}

function mapOrderPayload(payload: unknown): SalesOrder | null {
  const item = (payload as AdminOrderPayload)?.item;
  return item ? toSalesOrderRecord(item) : null;
}

function toSalesOrderRecord(item: AdminOrderSummary | AdminOrderDetail): SalesOrder {
  const detailItem = item as AdminOrderDetail;
  const items = detailItem.items?.length
    ? detailItem.items.map((entry, index) => ({
        name: entry.product?.name ?? `Order item ${index + 1}`,
        qty: String(entry.quantity ?? 1),
        price: formatMoney(entry.price ?? 0),
      }))
    : [{ name: "Marketplace order", qty: "1", price: formatMoney(item.totalAmount ?? 0) }];

  const trackingId = detailItem.shipment?.trackingId || item.trackingId || item.id;
  const vendor = item.store?.name ?? "Marketplace vendor";
  const paymentMethod = normalizePaymentMethod(item.payment?.method);
  const paymentState = normalizeUpperToken(item.payment?.status ?? "PENDING");
  const adminStatus = mapOrderStatus(item.status);

  return {
    id: item.id,
    slug: item.id,
    orderNumber: `#${item.trackingId || item.id}`,
    customer: item.customerName ?? "Unknown customer",
    customerPhone: detailItem.customer?.phone ?? "No phone",
    city: item.address?.city ?? "Unknown",
    vendor,
    deliveryAddress: [item.address?.street, item.address?.city].filter(Boolean).join(", ") || "No delivery address",
    value: formatMoney(item.totalAmount ?? 0),
    subtotal: formatMoney(item.subtotal ?? 0),
    deliveryFee: formatMoney(item.deliveryFee ?? 0),
    tax: formatMoney(item.tax ?? 0),
    totalAmount: formatMoney(item.totalAmount ?? 0),
    itemCount: `${item.itemCount ?? items.length} items`,
    status: adminStatus,
    fulfillment: item.scheduledAt ? "Scheduled" : "On-demand",
    paymentState,
    paymentMethod,
    trackingId,
    updatedAt: formatDateTime(item.updatedAt || item.createdAt),
    summary: buildOrderSummary(item, vendor, paymentState),
    items,
    timeline: buildOrderTimeline(item, trackingId, paymentState),
  };
}

function mapOrderStatus(status?: string | null): AdminStatus {
  switch (status) {
    case "PENDING":
      return "queued";
    case "ACCEPTED":
    case "PREPARING":
      return "review";
    case "PACKING":
      return "monitoring";
    case "OUT_FOR_DELIVERY":
      return "live";
    case "CANCELLED":
      return "at_risk";
    case "DELIVERED":
    case "COMPLETED":
      return "stable";
    default:
      return "queued";
  }
}

function buildOrderSummary(item: AdminOrderSummary, vendor: string, paymentState: string) {
  const status = String(item.status ?? "PENDING").toLowerCase().replace(/_/g, " ");
  return `${vendor} order is currently ${status}, with payment state ${paymentState.toLowerCase()}.`;
}

function buildOrderTimeline(item: AdminOrderSummary, trackingId: string, paymentState: string) {
  return [
    {
      label: "Order created",
      detail: `Order ${trackingId} entered the mobile commerce flow.`,
      time: formatTime(item.createdAt),
    },
    {
      label: "Payment state",
      detail: `Finance shows this order as ${paymentState.toLowerCase()}.`,
      time: formatTime(item.updatedAt || item.createdAt),
    },
    {
      label: "Current status",
      detail: `Operations currently hold this order in ${String(item.status ?? "PENDING").toLowerCase().replace(/_/g, " ")} state.`,
      time: formatTime(item.updatedAt || item.createdAt),
    },
  ];
}

function normalizePaymentMethod(method?: string | null) {
  if (!method) return "Unknown payment method";
  return method.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

function normalizeUpperToken(value: string) {
  return value.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatMoney(amount: number, currency = "ZMW") {
  return `${currency} ${Math.round(amount).toLocaleString()}`;
}

function formatDateTime(value?: string) {
  if (!value) return "Unknown";
  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTime(value?: string) {
  if (!value) return "Unknown";
  return new Date(value).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
