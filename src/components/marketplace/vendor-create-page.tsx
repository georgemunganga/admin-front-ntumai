"use client";

import Link from "next/link";
import { Button, Input, Select, Text, Textarea } from "rizzui";
import { PiArrowLeftBold, PiFloppyDiskBold } from "react-icons/pi";
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";

const statusOptions = [
  { label: "Live", value: "live" },
  { label: "Stable", value: "stable" },
  { label: "Review", value: "review" },
  { label: "Monitoring", value: "monitoring" },
  { label: "Queued", value: "queued" },
  { label: "At risk", value: "at_risk" },
];

const visibilityOptions = [
  { label: "Marketplace live", value: "Marketplace live" },
  { label: "Review hold", value: "Review hold" },
  { label: "Draft", value: "Draft" },
];

export default function VendorCreatePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Marketplace", "Vendors", "Create"]}
        eyebrow="Marketplace Kit"
        title="Create Vendor"
        description="Partner form preview."
        action={
          <div className="flex flex-wrap gap-3">
            <Link href="/marketplace/vendors">
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
              Create Vendor
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <ShellCard title="Partner information" description="Core marketplace fields.">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Vendor name" rounded="lg" />
            <Input label="Segment" rounded="lg" />
            <Input label="City" rounded="lg" />
            <Input label="Store type" rounded="lg" />
            <Input label="Owner" rounded="lg" />
            <Input label="Payout schedule" rounded="lg" />
          </div>

          <div className="mt-4">
            <Text className="mb-2 text-sm font-medium text-gray-700">Context</Text>
            <Textarea rows={4} textareaClassName="rounded-2xl" />
          </div>
        </ShellCard>

        <ShellCard title="Visibility" description="Marketplace state.">
          <div className="space-y-4">
            <Select label="Status" options={statusOptions} selectClassName="rounded-2xl" />
            <Select label="Visibility" options={visibilityOptions} selectClassName="rounded-2xl" />
            <Input label="Fulfillment" rounded="lg" />
          </div>
        </ShellCard>
      </div>
    </div>
  );
}
