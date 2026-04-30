"use client";

import type { AdminWorkflowContext } from "@/contracts/admin-domain";
import { salesInvoices, type SalesInvoice } from "@/components/sales/invoice-data";

export type InvoiceStatus = SalesInvoice["status"];

export type SalesInvoiceRecord = SalesInvoice & {
  workflow: AdminWorkflowContext;
};

const statusToWorkflowState: Record<InvoiceStatus, AdminWorkflowContext["state"]> = {
  Draft: "submitted",
  Pending: "under_review",
  Paid: "settled",
  Overdue: "blocked",
};

const statusToSummary: Record<InvoiceStatus, string> = {
  Draft: "Draft settlement still being prepared for merchant finance review.",
  Pending: "Settlement is waiting on finance release or merchant confirmation.",
  Paid: "Settlement is reconciled and closed for the affected vendor cycle.",
  Overdue: "Settlement is blocked and needs finance follow-up before mobile earnings can clear cleanly.",
};

function toInvoiceRecord(invoice: SalesInvoice): SalesInvoiceRecord {
  return {
    ...invoice,
    workflow: {
      actor: "vendor",
      source: "invoice_settlement",
      state: statusToWorkflowState[invoice.status],
      ownerTeam: "finance",
      summary: statusToSummary[invoice.status],
    },
  };
}

export function listSalesInvoices(): SalesInvoiceRecord[] {
  return salesInvoices.map(toInvoiceRecord);
}

export function getSalesInvoiceById(id: string): SalesInvoiceRecord | undefined {
  const invoice = salesInvoices.find((item) => item.id === id);
  return invoice ? toInvoiceRecord(invoice) : undefined;
}

export function listInvoiceStatuses(): InvoiceStatus[] {
  return Array.from(new Set(salesInvoices.map((invoice) => invoice.status)));
}
