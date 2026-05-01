"use client";
import { useAdminResource, patchAdminData } from "@/repositories/admin/admin-api";

// ─── Types ────────────────────────────────────────────────────────────────────

export type BookingStatus =
  | "pending"
  | "searching"
  | "offered"
  | "accepted"
  | "en_route"
  | "arrived_pickup"
  | "picked_up"
  | "en_route_dropoff"
  | "delivered"
  | "cancelled";

export type AdminBookingSummary = {
  id: string;
  deliveryId: string;
  status: BookingStatus | string;
  vehicleType: string;
  customer: {
    name: string;
    phone: string;
    userId: string;
  };
  pickup: {
    address: string;
    lat: number | null;
    lng: number | null;
  };
  dropoffCount: number;
  rider: {
    name: string;
    phone: string;
  } | null;
  canUserEdit: boolean;
  createdAt: string;
  updatedAt: string;
};

type AdminBookingsPayload = {
  entities: AdminBookingSummary[];
  total: number;
  page: number;
  limit: number;
};

// ─── Seed / Fixture fallback ──────────────────────────────────────────────────

const BOOKING_SEED: AdminBookingSummary[] = [
  {
    id: "BK-001",
    deliveryId: "DLV-001",
    status: "en_route",
    vehicleType: "motorcycle",
    customer: { name: "Alice Banda", phone: "+260971000001", userId: "u1" },
    pickup: { address: "Cairo Road, Lusaka", lat: -15.4166, lng: 28.2833 },
    dropoffCount: 1,
    rider: { name: "James Phiri", phone: "+260971000099" },
    canUserEdit: false,
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "BK-002",
    deliveryId: "DLV-002",
    status: "searching",
    vehicleType: "bicycle",
    customer: { name: "Bob Mwale", phone: "+260971000002", userId: "u2" },
    pickup: { address: "Manda Hill, Lusaka", lat: -15.4100, lng: 28.3100 },
    dropoffCount: 2,
    rider: null,
    canUserEdit: true,
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "BK-003",
    deliveryId: "DLV-003",
    status: "delivered",
    vehicleType: "car",
    customer: { name: "Carol Tembo", phone: "+260971000003", userId: "u3" },
    pickup: { address: "Woodlands, Lusaka", lat: -15.3900, lng: 28.3200 },
    dropoffCount: 1,
    rider: { name: "Peter Zulu", phone: "+260971000088" },
    canUserEdit: false,
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 3600000).toISOString(),
  },
];

// ─── Hooks ────────────────────────────────────────────────────────────────────

/**
 * useAdminBookings — live hook for listing delivery bookings from the mobile app.
 * Falls back to seed data if the API is unavailable.
 */
export function useAdminBookings(params?: {
  status?: string;
  vehicleType?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const query = new URLSearchParams();
  if (params?.status) query.set("status", params.status);
  if (params?.vehicleType) query.set("vehicleType", params.vehicleType);
  if (params?.search) query.set("search", params.search);
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));

  const { data, isLoading, error } = useAdminResource<AdminBookingsPayload>(
    `/api/v1/admin/bookings?${query.toString()}`
  );

  const bookings: AdminBookingSummary[] =
    data?.entities ?? (error ? BOOKING_SEED : []);
  const total = data?.total ?? (error ? BOOKING_SEED.length : 0);

  return { bookings, total, isLoading, error, isFixture: !data && !!error };
}

/**
 * useAdminBookingDetail — live hook for a single booking's full detail.
 */
export function useAdminBookingDetail(bookingId: string) {
  const { data, isLoading, error } = useAdminResource<AdminBookingSummary>(
    bookingId ? `/api/v1/admin/bookings/${bookingId}` : null
  );
  return { booking: data ?? null, isLoading, error };
}

// ─── Mutations ────────────────────────────────────────────────────────────────

/**
 * updateAdminBookingStatus — cancel or force-complete a delivery booking.
 */
export async function updateAdminBookingStatus(
  bookingId: string,
  action: "cancelled" | "delivered",
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await patchAdminData(`/api/v1/admin/bookings/${bookingId}/status`, {
      action,
      reason,
    });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message ?? "Failed to update booking status" };
  }
}
