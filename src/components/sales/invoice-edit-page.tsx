"use client";

import { notFound } from "next/navigation";
import InvoiceFormWorkspace from "@/components/sales/invoice-form-workspace";
import { getSalesInvoiceById } from "@/repositories/admin/invoices";

export default function InvoiceEditPage({ id }: { id: string }) {
  const invoice = getSalesInvoiceById(id);
  if (!invoice) notFound();

  return <InvoiceFormWorkspace mode="edit" invoice={invoice} />;
}
