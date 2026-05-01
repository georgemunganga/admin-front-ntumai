/**
 * dispatch.ts
 *
 * Repository: Admin Dispatch
 * Domain: Logistics / Dispatch Operations
 *
 * Provides live hooks for:
 *  - Dispatch exception queue (orders with no tasker, pickup delays, handoff failures)
 *  - Live dispatch map (active delivery assignments)
 *
 * Falls back to fixture/seed data when the backend is unavailable.
 */

import { useAdminResource } from "@/repositories/admin/admin-api";

// ─── Types ───────────────────────────────────────────────────────────────────

export type DispatchExceptionType =
  | "no_tasker_available"
  | "pickup_delayed"
  | "tasker_offline"
  | "customer_unreachable"
  | "vendor_not_ready"
  | "handoff_failed";

export type DispatchPriority = "low" | "medium" | "high" | "critical";

export type DispatchExceptionStatus =
  | "review"
  | "queued"
  | "monitoring"
  | "live"
  | "paused"
  | "at_risk";

export type DispatchException = {
  id: string;
  reference: string;
  type: DispatchExceptionType;
  status: DispatchExceptionStatus;
  priority: DispatchPriority;
  city: string;
  lane: string;
  owner: string;
  age: string;
  issue: string;
  customer: string;
  tasker: string;
  vendor: string;
  timeline: Array<{ label: string; detail: string; time: string }>;
  notes: string[];
  links: Array<{ label: string; href: string }>;
};

export type LiveDispatchEntity = {
  id: string;
  type: "tasker";
  label: string;
  status: string;
  orderId: string;
  orderRef: string;
  customer: string;
  vendor: string;
  city: string;
  address: string;
  updatedAt: string;
};

// ─── API Response Types ───────────────────────────────────────────────────────

type DispatchExceptionsResponse = {
  success: boolean;
  data: { items: DispatchException[]; total: number };
};

type LiveDispatchResponse = {
  success: boolean;
  data: { entities: LiveDispatchEntity[]; total: number };
};

// ─── Hooks ───────────────────────────────────────────────────────────────────

/**
 * useAdminDispatchExceptions
 *
 * Fetches active dispatch exceptions from the backend.
 * Returns orders with no tasker assigned, pickup delays, and handoff failures.
 */
export function useAdminDispatchExceptions() {
  const { data, loading, error } =
    useAdminResource<DispatchExceptionsResponse>(
      "admin/dispatch/exceptions"
    );

  return {
    exceptions: data?.data?.items ?? null,
    total: data?.data?.total ?? 0,
    loading,
    error,
  };
}

/**
 * useAdminLiveDispatch
 *
 * Fetches all active delivery assignments for the live dispatch map.
 * Includes tasker name, order reference, customer, vendor, and location.
 */
export function useAdminLiveDispatch() {
  const { data, loading, error } =
    useAdminResource<LiveDispatchResponse>("admin/dispatch/live");

  return {
    entities: data?.data?.entities ?? null,
    total: data?.data?.total ?? 0,
    loading,
    error,
  };
}
