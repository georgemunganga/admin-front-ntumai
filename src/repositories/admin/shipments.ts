"use client";

import { useMemo } from "react";
import { logisticsShipments, type LogisticsShipment } from "@/components/logistics/shipment-data";
import type { AdminStatus } from "@/contracts/admin-domain";
import { useAdminResource } from "@/repositories/admin/admin-api";

export function listLogisticsShipments(): LogisticsShipment[] {
  return logisticsShipments;
}

export function getLogisticsShipmentById(id: string): LogisticsShipment | undefined {
  return logisticsShipments.find((shipment) => shipment.id === id);
}

export function listShipmentLanes(): string[] {
  return Array.from(new Set(logisticsShipments.map((shipment) => shipment.lane)));
}

type AdminShipmentStop = {
  address?: {
    city?: string | null;
    street?: string | null;
  } | null;
  contact_name?: string | null;
};

type AdminShipmentSummary = {
  id: string;
  trackingId?: string | null;
  customerId?: string | null;
  taskerId?: string | null;
  placedByRole?: string | null;
  status?: string | null;
  vehicleType?: string | null;
  scheduledAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  linkedOrderId?: string | null;
  pickup?: AdminShipmentStop | null;
  dropoff?: AdminShipmentStop | null;
};

type AdminShipmentDetail = AdminShipmentSummary & {
  customer?: {
    fullName?: string | null;
    phone?: string | null;
  } | null;
  tasker?: {
    fullName?: string | null;
  } | null;
  linkedOrder?: {
    totalAmount?: number;
    trackingId?: string | null;
  } | null;
  metadata?: Record<string, unknown> | null;
  stops?: Array<{
    type?: string | null;
    address?: {
      city?: string | null;
      street?: string | null;
    } | null;
    contact_name?: string | null;
  }>;
  trackingEvents?: Array<{
    eventType?: string | null;
    timestamp?: string;
  }>;
};

type AdminShipmentsPayload = {
  items: AdminShipmentSummary[];
};

type AdminShipmentPayload = {
  item: AdminShipmentDetail;
};

type AdminShipmentTrackingPayload = {
  shipmentId: string;
  status?: string | null;
  events?: Array<{
    eventType?: string | null;
    timestamp?: string;
  }>;
};

export function useLogisticsShipments() {
  const fallback = useMemo(() => listLogisticsShipments(), []);
  return useAdminResource({
    path: "/api/v1/admin/shipments?limit=100",
    fallback,
    map: mapShipmentsPayload,
  });
}

export function useLogisticsShipment(id: string) {
  const fallback = useMemo(() => getLogisticsShipmentById(id) ?? null, [id]);
  return useAdminResource({
    path: `/api/v1/admin/shipments/${id}`,
    fallback,
    map: mapShipmentPayload,
    enabled: Boolean(id),
  });
}

export function useShipmentTracking(id: string) {
  const fallback = useMemo(() => null, []);
  return useAdminResource({
    path: `/api/v1/admin/shipments/${id}/tracking`,
    fallback,
    map: (payload) => payload as AdminShipmentTrackingPayload | null,
    enabled: Boolean(id),
  });
}

function mapShipmentsPayload(payload: unknown): LogisticsShipment[] {
  const items = (payload as AdminShipmentsPayload)?.items ?? [];
  return items.map((item) => toShipmentRecord(item));
}

function mapShipmentPayload(payload: unknown): LogisticsShipment | null {
  const item = (payload as AdminShipmentPayload)?.item;
  return item ? toShipmentRecord(item) : null;
}

function toShipmentRecord(item: AdminShipmentSummary | AdminShipmentDetail): LogisticsShipment {
  const detailItem = item as AdminShipmentDetail;
  const pickupAddress = formatAddress(item.pickup?.address);
  const dropoffAddress = formatAddress(item.dropoff?.address);
  const orderValue = detailItem.linkedOrder?.totalAmount ?? 0;

  return {
    id: item.id,
    trackingId: item.trackingId || item.id,
    customer: detailItem.customer?.fullName ?? "Unknown customer",
    customerPhone: detailItem.customer?.phone ?? "No phone",
    pickup: pickupAddress || "Pickup address unavailable",
    dropoff: dropoffAddress || "Drop-off address unavailable",
    recipient: item.dropoff?.contact_name ?? "Recipient",
    lane: buildShipmentLane(item),
    owner: item.placedByRole ? `${capitalize(item.placedByRole)} ops` : "Logistics ops",
    status: mapShipmentStatus(item.status),
    updatedAt: formatDateTime(item.updatedAt || item.createdAt),
    value: formatMoney(orderValue),
    tasker: detailItem.tasker?.fullName ?? "Unassigned",
    notes: buildShipmentNotes(item),
    items: [
      { label: "Package type", value: item.vehicleType ? capitalize(item.vehicleType) : "General shipment" },
      { label: "Weight", value: detailItem.metadata?.parcel_size ? String(detailItem.metadata.parcel_size) : "Not set" },
      { label: "ETA", value: item.scheduledAt ? formatDateTime(item.scheduledAt) : "Live ETA unavailable" },
    ],
    timeline: buildShipmentTimeline(detailItem),
  };
}

function mapShipmentStatus(status?: string | null): AdminStatus {
  switch (String(status ?? "").toLowerCase()) {
    case "booked":
      return "queued";
    case "delivery":
      return "live";
    case "completed":
      return "stable";
    case "cancelled":
      return "at_risk";
    default:
      return "monitoring";
  }
}

function buildShipmentLane(item: AdminShipmentSummary) {
  if (item.linkedOrderId) return "Marketplace delivery lane";
  if (item.placedByRole) return `${capitalize(item.placedByRole)} delivery lane`;
  return "Logistics lane";
}

function buildShipmentNotes(item: AdminShipmentSummary) {
  if (item.linkedOrderId) {
    return `Shipment is linked to marketplace order ${item.linkedOrderId} and is being monitored by staff as part of the mobile customer flow.`;
  }
  return "Shipment loaded from the live logistics admin endpoint.";
}

function buildShipmentTimeline(item: AdminShipmentDetail) {
  if (item.trackingEvents?.length) {
    return item.trackingEvents.slice(-5).map((event) => ({
      label: normalizeToken(event.eventType ?? "tracking_update"),
      detail: `Tracking event ${normalizeToken(event.eventType ?? "tracking_update")} was recorded for this shipment.`,
      time: formatTime(event.timestamp),
    }));
  }

  return [
    {
      label: "Shipment created",
      detail: "Shipment entered the staff logistics workspace.",
      time: formatTime(item.createdAt),
    },
    {
      label: "Shipment updated",
      detail: `Shipment is currently ${String(item.status ?? "booked").toLowerCase()}.`,
      time: formatTime(item.updatedAt || item.createdAt),
    },
  ];
}

function formatAddress(address?: { city?: string | null; street?: string | null } | null) {
  return [address?.street, address?.city].filter(Boolean).join(", ");
}

function normalizeToken(value: string) {
  return value.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

function capitalize(value?: string | null) {
  if (!value) return "Unknown";
  return value.charAt(0).toUpperCase() + value.slice(1);
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
