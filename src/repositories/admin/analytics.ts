"use client";

import { useAdminResource } from "@/repositories/admin/admin-api";

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

const summaryFixture: AdminSummaryData = {
  users: 0,
  stores: 0,
  products: 0,
  orders: 0,
  supportTicketsOpen: 0,
  pendingKyc: { vendors: 0, taskers: 0 },
};

export function useAdminSummary(): {
  data: AdminSummaryData;
  isLoading: boolean;
  isLive: boolean;
  error: string | null;
} {
  const { data, isLoading, isLive, error } = useAdminResource<AdminSummaryData>({
    path: "/api/v1/admin/summary",
    fallback: summaryFixture,
    map: (payload) => payload as AdminSummaryData,
  });

  return {
    data,
    isLoading,
    isLive,
    error,
  };
}
