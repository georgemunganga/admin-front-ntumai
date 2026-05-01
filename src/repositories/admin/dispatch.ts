/**
 * Repository: Admin Dispatch
 * Domain: Logistics / Dispatch Operations
 */

import { patchAdminData, postAdminData, useAdminResource } from "@/repositories/admin/admin-api";

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
  assignmentId: string;
  driverId: string;
  label: string;
  status: string;
  orderId: string;
  orderRef: string;
  customer: string;
  vendor: string;
  city: string;
  address: string;
  lat: number | null;
  lng: number | null;
  vehicleType: string | null;
  heartbeatAt: string | null;
  pickup: { lat: number; lng: number; label: string } | null;
  dropoff: { lat: number; lng: number; label: string } | null;
  updatedAt: string;
};

export type DispatchCandidate = {
  id: string;
  name: string;
  phone: string | null;
  vehicle: string;
  distanceKm: number;
  etaMin: number;
  rating: number;
  availability: string;
  zone: string;
  heartbeatAt: string | null;
};

type DispatchExceptionsResponse = {
  items: DispatchException[];
  total: number;
};

type LiveDispatchResponse = {
  entities: LiveDispatchEntity[];
  total: number;
};

type DispatchCandidatesResponse = {
  items: DispatchCandidate[];
  total: number;
};

export function useAdminDispatchExceptions() {
  const { data, isLoading, error } = useAdminResource<DispatchExceptionsResponse>({
    path: "/api/v1/admin/dispatch/exceptions",
    fallback: { items: [], total: 0 },
    map: (payload) => payload as DispatchExceptionsResponse,
  });

  return {
    exceptions: data.items,
    total: data.total,
    loading: isLoading,
    error,
  };
}

export function useAdminLiveDispatch() {
  const { data, isLoading, isLive, error, refreshedAt, refresh } = useAdminResource<LiveDispatchResponse>({
    path: "/api/v1/admin/dispatch/live",
    fallback: { entities: [], total: 0 },
    map: (payload) => payload as LiveDispatchResponse,
    refreshMs: 15000,
  });

  return {
    entities: data.entities,
    total: data.total,
    loading: isLoading,
    isLive,
    error,
    refreshedAt,
    refresh,
  };
}

export function useAdminDispatchCandidates(params?: {
  orderId?: string;
  assignmentId?: string;
  fallback?: DispatchCandidate[];
}) {
  const query = new URLSearchParams();
  if (params?.orderId) query.set("orderId", params.orderId);
  if (params?.assignmentId) query.set("assignmentId", params.assignmentId);
  const enabled = Boolean(params?.orderId);

  const { data, isLoading, isLive, error } = useAdminResource<DispatchCandidatesResponse>({
    path: `/api/v1/admin/dispatch/candidates?${query.toString()}`,
    fallback: { items: params?.fallback ?? [], total: params?.fallback?.length ?? 0 },
    map: (payload) => payload as DispatchCandidatesResponse,
    enabled,
  });

  return {
    items: data.items,
    total: data.total,
    loading: isLoading,
    isLive,
    error,
  };
}

export async function assignDispatchJob(payload: {
  orderId: string;
  driverId: string;
  note?: string;
}): Promise<{ assignmentId: string; status: string } | null> {
  try {
    const res = await postAdminData<{ assignmentId: string; status: string }>(
      "/api/v1/admin/dispatch/assign",
      payload,
    );
    return res ?? null;
  } catch {
    return null;
  }
}

export async function reassignDispatchJob(
  assignmentId: string,
  payload: { newDriverId: string; reason?: string }
): Promise<{ newAssignmentId: string; status: string } | null> {
  try {
    const res = await patchAdminData<{ newAssignmentId: string; status: string }>(
      `/api/v1/admin/dispatch/reassign/${assignmentId}`,
      payload,
    );
    return res ?? null;
  } catch {
    return null;
  }
}
