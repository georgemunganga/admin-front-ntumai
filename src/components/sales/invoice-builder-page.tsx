"use client";

import Link from "next/link";
import { Badge, Button, Input, Select, Text, Textarea } from "rizzui";
import { PiArrowLeftBold, PiFloppyDiskBold, PiPlusBold } from "react-icons/pi";
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import { routes } from "@/config/routes";

const payoutMethodOptions = [
  { label: "Mobile money", value: "Mobile money" },
  { label: "Bank", value: "Bank" },
];

export default function InvoiceBuilderPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Sales", "Invoices", "Builder"]}
        eyebrow="Sales Kit"
        title="Invoice Builder"
        description="Settlement builder aligned to vendor finance and payout review."
        action={
          <div className="flex flex-wrap gap-3">
            <Link href={routes.sales.invoices}>
              <Button variant="outline" className="h-11 rounded-2xl px-4">
                <PiArrowLeftBold className="me-1.5 h-4 w-4" />
                Back
              </Button>
            </Link>
            <Button className="h-11 rounded-2xl bg-primary px-4 text-white hover:bg-primary/90">
              <PiFloppyDiskBold className="me-1.5 h-4 w-4" />
              Save Builder Draft
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <ShellCard title="Invoice layout" description="Draft line items and settlement sections.">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Vendor / customer" rounded="lg" defaultValue="Green Basket Market" />
              <Input label="Reference" rounded="lg" defaultValue="SETTLEMENT-W18" />
              <Input label="Billing cycle" rounded="lg" defaultValue="Weekly settlement" />
              <Select
                label="Payout method"
                options={payoutMethodOptions}
                defaultValue={payoutMethodOptions[0]}
                selectClassName="rounded-2xl"
              />
            </div>
            <Textarea
              rows={4}
              textareaClassName="rounded-2xl"
              defaultValue="Settlement draft prepared for payout review and merchant reconciliation."
            />
            <div className="space-y-3">
              {[
                ["Marketplace sales", "1", "ZMW 5,640"],
                ["Delivery commission", "1", "- ZMW 420"],
                ["Adjustments", "1", "- ZMW 100"],
              ].map(([label, qty, amount], index) => (
                <div key={label} className="grid gap-3 rounded-[20px] border border-gray-100 bg-gray-50/70 p-4 md:grid-cols-[1fr_120px_140px]">
                  <Input label={`Line item ${index + 1}`} rounded="lg" defaultValue={label} />
                  <Input label="Qty" rounded="lg" defaultValue={qty} />
                  <Input label="Amount" rounded="lg" defaultValue={amount} />
                </div>
              ))}
            </div>
            <Button variant="outline" className="h-11 rounded-2xl px-4">
              <PiPlusBold className="me-1.5 h-4 w-4" />
              Add Line
            </Button>
          </div>
        </ShellCard>

        <ShellCard title="Preview summary" description="Builder output snapshot.">
          <div className="space-y-4">
            <div className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
              <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Current total</Text>
              <Text className="mt-2 text-2xl font-semibold text-gray-900">ZMW 5,120</Text>
            </div>
            <div className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
              <div className="flex items-center justify-between gap-3">
                <Text className="font-semibold text-gray-900">Ready for review</Text>
                <Badge variant="flat" className="rounded-2xl bg-primary/10 px-3 py-1.5 text-primary">
                  Vendor
                </Badge>
              </div>
              <Text className="mt-2 text-sm text-gray-500">
                Builder drafts should preserve payout method, settlement totals, and invoice notes before finance approval.
              </Text>
            </div>
          </div>
        </ShellCard>
      </div>
    </div>
  );
}
