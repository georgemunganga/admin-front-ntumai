"use client";

import Link from "next/link";
import { Button, Input, Text, Textarea } from "rizzui";
import { PiArrowLeftBold, PiFloppyDiskBold, PiPlusBold } from "react-icons/pi";
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import { routes } from "@/config/routes";

export default function InvoiceBuilderPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Sales", "Invoices", "Builder"]}
        eyebrow="Sales Kit"
        title="Invoice Builder"
        description="Builder preview."
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
        <ShellCard title="Invoice layout" description="Draft line items and sections.">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Customer" rounded="lg" />
              <Input label="Reference" rounded="lg" />
            </div>
            <Textarea rows={4} textareaClassName="rounded-2xl" placeholder="Invoice notes or payment terms" />
            <div className="space-y-3">
              {[1, 2, 3].map((index) => (
                <div key={index} className="grid gap-3 rounded-[20px] border border-gray-100 bg-gray-50/70 p-4 md:grid-cols-[1fr_120px_140px]">
                  <Input label={`Line item ${index}`} rounded="lg" />
                  <Input label="Qty" rounded="lg" />
                  <Input label="Amount" rounded="lg" />
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
          <div className="space-y-3">
            <Text className="text-sm text-gray-500">Invoice total updates as line items are adjusted.</Text>
            <div className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
              <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Current total</Text>
              <Text className="mt-2 text-2xl font-semibold text-gray-900">ZMW 0.00</Text>
            </div>
          </div>
        </ShellCard>
      </div>
    </div>
  );
}
