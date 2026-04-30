"use client";

import { crudPages } from "@/components/crud/crud-data";
import type { AdminStatus } from "@/contracts/admin-domain";

export type TaskerListRecord = {
  id: string;
  name: string;
  context: string;
  segment: string;
  status: AdminStatus;
  owner: string;
  updatedAt: string;
};

export function listTaskerRecords(): TaskerListRecord[] {
  return crudPages.logisticsDrivers.rows.map((row) => ({
    id: row.id,
    name: row.primary,
    context: row.secondary,
    segment: row.tertiary,
    status: row.status as AdminStatus,
    owner: row.owner,
    updatedAt: row.updatedAt,
  }));
}

export function listTaskerSegments(): string[] {
  return Array.from(new Set(crudPages.logisticsDrivers.rows.map((row) => row.tertiary)));
}
