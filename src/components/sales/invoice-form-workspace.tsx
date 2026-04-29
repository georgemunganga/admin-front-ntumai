"use client";

import Link from "next/link";
import { Badge, Button, Input, Select, Text, Textarea, Title } from "rizzui";
import { PiArrowLeftBold, PiFloppyDiskBold } from "react-icons/pi";
import PageHeader from "@/components/admin/page-header";
import { routes } from "@/config/routes";
import type { SalesInvoice } from "@/components/sales/invoice-data";

const statusOptions = [
  { label: "Draft", value: "Draft" },
  { label: "Pending", value: "Pending" },
  { label: "Paid", value: "Paid" },
  { label: "Overdue", value: "Overdue" },
];

const payoutMethodOptions = [
  { label: "Mobile money", value: "Mobile money" },
  { label: "Bank transfer", value: "Bank transfer" },
  { label: "Wallet release", value: "Wallet release" },
];

type InvoiceFormWorkspaceProps = {
  mode: "create" | "edit";
  invoice?: SalesInvoice;
};

export default function InvoiceFormWorkspace({
  mode,
  invoice,
}: InvoiceFormWorkspaceProps) {
  const id = invoice?.id ?? "INV-4022";
  const customer = invoice?.customer ?? "Green Basket Market";
  const destination = invoice?.destination ?? "MTN MoMo •• 9084";
  const cycle = invoice?.cycle ?? "Weekly settlement";
  const amount = invoice?.amount ?? "ZMW 5,120";
  const dueDate = invoice?.dueDate ?? "May 08, 2026";
  const createdAt = invoice?.createdAt ?? "Apr 28, 2026";
  const notes =
    invoice?.notes ??
    "Weekly settlement invoice covering completed marketplace sales, delivery commissions, and manual adjustments.";
  const items = invoice?.items ?? [
    { label: "Marketplace sales", amount: "ZMW 5,640" },
    { label: "Delivery commission", amount: "- ZMW 420" },
    { label: "Adjustments", amount: "- ZMW 100" },
  ];
  const status = invoice?.status ?? "Draft";
  const payoutMethod = invoice?.payoutMethod ?? "Mobile money";
  const backHref = mode === "edit" && invoice ? routes.sales.invoiceDetails(invoice.id) : routes.sales.invoices;

  return (
    <div className="@container space-y-6">
      <PageHeader
        breadcrumb={["Home", "Sales", "Invoices", ...(mode === "edit" && invoice ? [invoice.id, "Edit"] : ["Create"])]}
        eyebrow="Sales Kit"
        title={mode === "edit" ? `Edit ${id}` : "Create Invoice"}
        description="Prepare settlement invoices with payout destination, merchant totals, and finance review context."
        action={
          <div className="flex flex-wrap gap-3">
            <Link href={backHref}>
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
              {mode === "edit" ? "Update Invoice" : "Create Invoice"}
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-8 divide-y divide-dashed divide-gray-200 @2xl:gap-10 @3xl:gap-12">
        <FormBlock
          title="From:"
          description="Source entity responsible for sending this settlement invoice."
        >
          <Input label="Name" rounded="lg" defaultValue="Ntumai Finance Ops" />
          <Input label="Phone number" rounded="lg" defaultValue="+260 97 300 1142" />
          <Textarea
            label="Address"
            textareaClassName="h-20 rounded-2xl"
            className="col-span-2"
            defaultValue="Ntumai HQ, Lusaka central operations desk"
          />
        </FormBlock>

        <FormBlock
          title="To:"
          description="Merchant or account receiving this invoice."
          className="pt-7 @2xl:pt-9 @3xl:pt-11"
        >
          <Input label="Name" rounded="lg" defaultValue={customer} />
          <Input label="Phone number" rounded="lg" defaultValue="+260 96 000 4421" />
          <Textarea
            label="Address"
            textareaClassName="h-20 rounded-2xl"
            className="col-span-2"
            defaultValue={`${customer} finance desk, ${destination}`}
          />
        </FormBlock>

        <FormBlock
          title="Schedule:"
          description="Dates, status, and payout routing for this invoice."
          className="pt-7 @2xl:pt-9 @3xl:pt-11"
        >
          <div className="col-span-2 grid grid-cols-1 gap-5 @lg:grid-cols-2 @5xl:grid-cols-4">
            <Input label="Invoice number" rounded="lg" defaultValue={id} />
            <Input label="Date created" rounded="lg" defaultValue={createdAt} />
            <Input label="Due date" rounded="lg" defaultValue={dueDate} />
            <SelectField label="Status" options={statusOptions} value={status} />
          </div>
          <Input label="Billing cycle" rounded="lg" defaultValue={cycle} />
          <SelectField label="Payout method" options={payoutMethodOptions} value={payoutMethod} />
          <Input label="Destination account" rounded="lg" defaultValue={destination} />
          <Input label="Invoice amount" rounded="lg" defaultValue={amount} />
        </FormBlock>

        <FormBlock
          title="Invoice Items"
          description="Line-item settlement breakdown adapted to Ntumai merchant and delivery commission flows."
          className="pt-7 @2xl:pt-9 @3xl:pt-11"
        >
          <div className="col-span-full space-y-4">
            {items.map((item) => (
              <div key={item.label} className="grid gap-3 rounded-[22px] border border-gray-200 bg-gray-50/70 p-4 md:grid-cols-[1.5fr_2fr_120px_160px]">
                <Input label="Item" rounded="lg" defaultValue={item.label} />
                <Input label="Description" rounded="lg" defaultValue={`${item.label} applied to ${cycle.toLowerCase()}`} />
                <Input label="Quantity" rounded="lg" defaultValue="1" />
                <Input label="Price" rounded="lg" defaultValue={item.amount} />
              </div>
            ))}
          </div>
        </FormBlock>

        <FormBlock
          title="Finance Notes"
          description="Additional merchant, payout, or reconciliation context."
          className="pt-7 @2xl:pt-9 @3xl:pt-11"
        >
          <Textarea
            label="Notes"
            textareaClassName="rounded-2xl"
            className="col-span-full"
            defaultValue={notes}
          />
          <div className="col-span-full rounded-[22px] border border-gray-200 bg-gray-50/70 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Settlement summary</Text>
                <Title as="h3" className="mt-3 text-2xl font-semibold tracking-tight">
                  {amount}
                </Title>
                <Text className="mt-2 text-sm text-gray-500">
                  Merchant finance flows depend on invoice state, payout route, and a clean line-item audit trail before release to the payout queue.
                </Text>
              </div>
              <Badge variant="flat" className="rounded-2xl bg-primary/10 px-3 py-1 text-primary">
                {status}
              </Badge>
            </div>
          </div>
        </FormBlock>
      </div>
    </div>
  );
}

function FormBlock({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`grid gap-5 @3xl:grid-cols-12 ${className ?? ""}`}>
      <div className="col-span-full @4xl:col-span-4">
        <h4 className="text-base font-medium text-gray-900">{title}</h4>
        <p className="mt-2 text-sm leading-6 text-gray-500">{description}</p>
      </div>
      <div className="col-span-full grid gap-4 @2xl:grid-cols-2 @4xl:col-span-8 @4xl:gap-5 xl:gap-7">
        {children}
      </div>
    </section>
  );
}

function SelectField({
  label,
  options,
  value,
}: {
  label: string;
  options: Array<{ label: string; value: string }>;
  value: string;
}) {
  return (
    <Select
      label={label}
      options={options}
      defaultValue={options.find((option) => option.value === value) ?? options[0]}
      selectClassName="rounded-2xl"
    />
  );
}
