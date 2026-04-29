"use client";

import { notFound } from "next/navigation";
import InvoiceFormWorkspace from "@/components/sales/invoice-form-workspace";
import { getSalesInvoice } from "@/components/sales/invoice-data";

export default function InvoiceEditPage({ id }: { id: string }) {
  const invoice = getSalesInvoice(id);
  if (!invoice) notFound();

  return <InvoiceFormWorkspace mode="edit" invoice={invoice} />;
}
