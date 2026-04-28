"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Button, Input, Select, Text, Textarea } from "rizzui";
import { PiArrowLeftBold, PiFloppyDiskBold } from "react-icons/pi";
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import { getMarketplaceVendor } from "@/components/marketplace/vendor-data";

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

export default function VendorEditPage({ slug }: { slug: string }) {
  const vendor = getMarketplaceVendor(slug);

  if (!vendor) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Marketplace", "Vendors", vendor.id, "Edit"]}
        eyebrow="Marketplace Kit"
        title={`Edit ${vendor.name}`}
        description="Partner form preview."
        action={
          <div className="flex flex-wrap gap-3">
            <Link href={`/marketplace/vendors/${vendor.slug}`}>
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
        <ShellCard title="Partner information" description="Core marketplace fields.">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Vendor name" defaultValue={vendor.name} rounded="lg" />
            <Input label="Segment" defaultValue={vendor.segment} rounded="lg" />
            <Input label="City" defaultValue={vendor.city} rounded="lg" />
            <Input label="Store type" defaultValue={vendor.storeType} rounded="lg" />
            <Input label="Owner" defaultValue={vendor.owner} rounded="lg" />
            <Input label="Payout schedule" defaultValue={vendor.payoutSchedule} rounded="lg" />
          </div>

          <div className="mt-4">
            <Text className="mb-2 text-sm font-medium text-gray-700">Context</Text>
            <Textarea defaultValue={vendor.context} rows={4} textareaClassName="rounded-2xl" />
          </div>
        </ShellCard>

        <ShellCard title="Visibility" description="Marketplace state.">
          <div className="space-y-4">
            <Select label="Status" options={statusOptions} defaultValue={statusOptions.find((option) => option.value === vendor.status)} selectClassName="rounded-2xl" />
            <Select label="Visibility" options={visibilityOptions} defaultValue={visibilityOptions.find((option) => option.value === vendor.visibility)} selectClassName="rounded-2xl" />
            <Input label="Fulfillment" defaultValue={vendor.fulfillment} rounded="lg" />
          </div>
        </ShellCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ShellCard title="Performance markers" description="Current vendor metrics.">
          <div className="grid gap-4 md:grid-cols-2">
            {vendor.metrics.map((metric) => (
              <Input key={metric.label} label={metric.label} defaultValue={metric.value} rounded="lg" />
            ))}
          </div>
        </ShellCard>

        <ShellCard title="Review notes" description="Internal marketplace trail.">
          <div className="space-y-3">
            {vendor.timeline.map((item) => (
              <div key={`${item.label}-${item.time}`} className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
                <Text className="font-semibold text-gray-900">{item.label}</Text>
                <Text className="mt-1 text-sm text-gray-500">{item.detail}</Text>
              </div>
            ))}
          </div>
        </ShellCard>
      </div>
    </div>
  );
}
