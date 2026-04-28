"use client";

import Link from "next/link";
import { Button, Input, Text, Textarea } from "rizzui";
import { PiArrowLeftBold, PiFloppyDiskBold } from "react-icons/pi";
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import { routes } from "@/config/routes";

export default function InvoiceCreatePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Sales", "Invoices", "Create"]}
        eyebrow="Sales Kit"
        title="Create Invoice"
        description="Invoice form preview."
        action={
          <div className="flex flex-wrap gap-3">
            <Link href={routes.sales.invoices}>
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
              Create Invoice
            </Button>
          </div>
        }
      />
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <ShellCard title="Invoice information" description="Billing fields.">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Customer" rounded="lg" />
            <Input label="Due date" rounded="lg" />
            <Input label="Created date" rounded="lg" />
            <Input label="Amount" rounded="lg" />
          </div>
          <div className="mt-4">
            <Text className="mb-2 text-sm font-medium text-gray-700">Notes</Text>
            <Textarea rows={4} textareaClassName="rounded-2xl" />
          </div>
        </ShellCard>
      </div>
    </div>
  );
}
