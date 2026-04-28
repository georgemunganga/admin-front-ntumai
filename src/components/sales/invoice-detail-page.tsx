"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Button, Text, Title } from "rizzui";
import { PiArrowLeftBold, PiNotePencilBold } from "react-icons/pi";
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import { getSalesInvoice } from "@/components/sales/invoice-data";
import { routes } from "@/config/routes";

export default function InvoiceDetailPage({ id }: { id: string }) {
  const invoice = getSalesInvoice(id);
  if (!invoice) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Sales", "Invoices", invoice.id]}
        eyebrow="Sales Kit"
        title={invoice.id}
        description={invoice.notes}
        action={
          <div className="flex flex-wrap gap-3">
            <Link href={routes.sales.invoices}>
              <Button variant="outline" className="h-11 rounded-2xl px-4">
                <PiArrowLeftBold className="me-1.5 h-4 w-4" />
                Back
              </Button>
            </Link>
            <Link href={routes.sales.editInvoice(invoice.id)}>
              <Button className="h-11 rounded-2xl bg-primary px-4 text-white hover:bg-primary/90">
                <PiNotePencilBold className="me-1.5 h-4 w-4" />
                Edit Invoice
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <ShellCard title="Invoice summary" description="Billing details.">
          <div className="grid gap-4 md:grid-cols-2">
            <InfoTile label="Customer" value={invoice.customer} />
            <InfoTile label="Due date" value={invoice.dueDate} />
            <InfoTile label="Created" value={invoice.createdAt} />
            <InfoTile label="Amount" value={invoice.amount} />
          </div>
        </ShellCard>
        <ShellCard title="Status" description="Current billing state.">
          <div className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
            <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Invoice state</Text>
            <div className="mt-3 flex items-center gap-3">
              <InvoiceStatus status={invoice.status} />
              <Badge variant="flat" className="rounded-2xl bg-primary/10 px-3 py-1.5 text-primary">
                {invoice.amount}
              </Badge>
            </div>
          </div>
        </ShellCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ShellCard title="Line items" description="Settlement breakdown.">
          <div className="space-y-3">
            {invoice.items.map((item) => (
              <div key={item.label} className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <Text className="font-semibold text-gray-900">{item.label}</Text>
                  <Text className="font-semibold text-gray-900">{item.amount}</Text>
                </div>
              </div>
            ))}
          </div>
        </ShellCard>
        <ShellCard title="Timeline" description="Latest invoice events.">
          <div className="space-y-3">
            {invoice.timeline.map((item) => (
              <div key={`${item.label}-${item.time}`} className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Text className="font-semibold text-gray-900">{item.label}</Text>
                    <Text className="mt-1 text-sm text-gray-500">{item.detail}</Text>
                  </div>
                  <Text className="text-xs text-gray-500">{item.time}</Text>
                </div>
              </div>
            ))}
          </div>
        </ShellCard>
      </div>
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
      <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">{label}</Text>
      <Title as="h4" className="mt-2 text-base font-semibold text-gray-900">
        {value}
      </Title>
    </div>
  );
}

function InvoiceStatus({ status }: { status: string }) {
  const tones: Record<string, string> = {
    Paid: "bg-emerald-50 text-emerald-700",
    Pending: "bg-primary/10 text-primary",
    Overdue: "bg-red-50 text-red-700",
    Draft: "bg-gray-100 text-gray-700",
  };
  return <span className={`inline-flex rounded-2xl px-3 py-1 text-xs font-semibold ${tones[status] ?? tones.Draft}`}>{status}</span>;
}
