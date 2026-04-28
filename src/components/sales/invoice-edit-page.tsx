"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Button, Input, Select, Text, Textarea } from "rizzui";
import {
  PiArrowLeftBold,
  PiCheckCircleBold,
  PiFloppyDiskBold,
  PiWarningCircleBold,
} from "react-icons/pi";
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import { getSalesInvoice } from "@/components/sales/invoice-data";
import { routes } from "@/config/routes";

const statusOptions = [
  { label: "Draft", value: "Draft" },
  { label: "Pending", value: "Pending" },
  { label: "Paid", value: "Paid" },
  { label: "Overdue", value: "Overdue" },
];

const payoutMethodOptions = [
  { label: "Mobile money", value: "Mobile money" },
  { label: "Bank", value: "Bank" },
];

export default function InvoiceEditPage({ id }: { id: string }) {
  const invoice = getSalesInvoice(id);
  if (!invoice) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Sales", "Invoices", invoice.id, "Edit"]}
        eyebrow="Sales Kit"
        title={`Edit ${invoice.id}`}
        description="Settlement invoice flow aligned to vendor finance and payout operations."
        action={
          <div className="flex flex-wrap gap-3">
            <Link href={routes.sales.invoiceDetails(invoice.id)}>
              <Button variant="outline" className="h-11 rounded-2xl px-4">
                <PiArrowLeftBold className="me-1.5 h-4 w-4" />
                Back
              </Button>
            </Link>
            <Button variant="outline" className="h-11 rounded-2xl px-4">
              Save Draft
            </Button>
            <Button className="h-11 rounded-2xl bg-primary px-4 text-white hover:bg-primary/90">
              <PiFloppyDiskBold className="me-1.5 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <ShellCard title="Invoice information" description="Billing and settlement fields.">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Invoice ID" rounded="lg" defaultValue={invoice.id} />
            <Input label="Vendor / customer" rounded="lg" defaultValue={invoice.customer} />
            <Input label="Due date" rounded="lg" defaultValue={invoice.dueDate} />
            <Input label="Created date" rounded="lg" defaultValue={invoice.createdAt} />
            <Select
              label="Invoice status"
              options={statusOptions}
              defaultValue={statusOptions.find((option) => option.value === invoice.status)}
              selectClassName="rounded-2xl"
            />
            <Select
              label="Payout method"
              options={payoutMethodOptions}
              defaultValue={payoutMethodOptions[0]}
              selectClassName="rounded-2xl"
            />
          </div>
          <div className="mt-4">
            <Text className="mb-2 text-sm font-medium text-gray-700">Notes</Text>
            <Textarea rows={4} textareaClassName="rounded-2xl" defaultValue={invoice.notes} />
          </div>
        </ShellCard>

        <ShellCard title="Settlement state" description="Finance and payout context.">
          <div className="space-y-4">
            <Input label="Destination account" rounded="lg" defaultValue="0973001142" />
            <Input label="Billing cycle" rounded="lg" defaultValue="Weekly settlement" />
            <Input label="Amount" rounded="lg" defaultValue={invoice.amount} />
          </div>
        </ShellCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ShellCard title="Line items" description="Settlement breakdown.">
          <div className="space-y-3">
            {invoice.items.map((item) => (
              <div key={item.label} className="grid gap-3 rounded-[20px] border border-gray-100 bg-gray-50/70 p-4 md:grid-cols-[1fr_180px]">
                <Input label="Line item" rounded="lg" defaultValue={item.label} />
                <Input label="Amount" rounded="lg" defaultValue={item.amount} />
              </div>
            ))}
          </div>
        </ShellCard>

        <ShellCard title="Summary" description="Settlement readiness.">
          <div className="space-y-4">
            <div className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                    Invoice state
                  </Text>
                  <Text className="mt-2 font-semibold text-gray-900">{invoice.status}</Text>
                </div>
                <Badge variant="flat" className="rounded-2xl bg-primary/10 px-3 py-1.5 text-primary">
                  Vendor
                </Badge>
              </div>
              <Text className="mt-2 text-sm text-gray-500">
                Vendor finance flows depend on clear settlement visibility, payout method, and invoice status before release.
              </Text>
            </div>

            <WorkflowNote
              icon={<PiCheckCircleBold className="h-4 w-4 text-emerald-600" />}
              title="Settlement context captured"
              detail="Billing cycle, payout destination, and line-item totals are visible to finance staff."
            />
            <WorkflowNote
              icon={<PiWarningCircleBold className="h-4 w-4 text-amber-600" />}
              title="Payout dependency"
              detail="Invoice release should stay aligned with vendor payout holds, reserves, or review states."
            />
          </div>
        </ShellCard>
      </div>
    </div>
  );
}

function WorkflowNote({
  icon,
  title,
  detail,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-[20px] border border-gray-100 bg-white p-4">
      <div className="mt-0.5">{icon}</div>
      <div>
        <Text className="font-semibold text-gray-900">{title}</Text>
        <Text className="mt-1 text-sm leading-6 text-gray-500">{detail}</Text>
      </div>
    </div>
  );
}
