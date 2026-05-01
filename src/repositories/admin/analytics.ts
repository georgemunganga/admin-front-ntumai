"use client";

import { useAdminResource } from "@/repositories/admin/admin-api";

/**
 * Shape returned by GET /api/v1/admin/summary
 */
export type AdminSummaryData = {
  users: number;
  stores: number;
  products: number;
  orders: number;
  supportTicketsOpen: number;
  pendingKyc: {
    vendors: number;
    taskers: number;
  };
};

type SummaryApiResponse = {
  success: boolean;
  data: AdminSummaryData;
};

/**
 * Fallback fixture — used when the backend is unreachable (dev / offline)
 */
const summaryFixture: AdminSummaryData = {
  users: 0,
  stores: 0,
  products: 0,
  orders: 0,
  supportTicketsOpen: 0,
  pendingKyc: { vendors: 0, taskers: 0 },
};

/**
 * Live hook — calls GET /api/v1/admin/summary
 * Returns the summary data, loading state, and whether the data is live.
 */
export function useAdminSummary(): {
  data: AdminSummaryData;
  isLoading: boolean;
  isLive: boolean;
  error: string | null;
} {
  const { data, isLoading, error } = useAdminResource<SummaryApiResponse>(
    "/api/v1/admin/summary",
  );

  const summary = data?.data ?? summaryFixture;
  const isLive = !!data?.data;

  return {
    data: summary,
    isLoading,
    isLive,
    error: error ?? null,
  };
}
