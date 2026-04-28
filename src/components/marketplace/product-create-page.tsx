"use client";

import Link from "next/link";
import { Button, Input, Select, Text, Textarea } from "rizzui";
import { PiArrowLeftBold, PiFloppyDiskBold } from "react-icons/pi";
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";

const statusOptions = [
  { label: "Published", value: "Published" },
  { label: "Low stock", value: "Low stock" },
  { label: "Review", value: "Review" },
];

export default function ProductCreatePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Marketplace", "Products", "Create"]}
        eyebrow="Marketplace Kit"
        title="Create Product"
        description="Catalog form preview."
        action={
          <div className="flex flex-wrap gap-3">
            <Link href="/marketplace/products">
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
              Create Product
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <ShellCard title="Basic information" description="Core catalog fields.">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Product name" rounded="lg" />
            <Input label="SKU" rounded="lg" />
            <Input label="Vendor" rounded="lg" />
            <Input label="Category" rounded="lg" />
          </div>
          <div className="mt-4">
            <Text className="mb-2 text-sm font-medium text-gray-700">Description</Text>
            <Textarea rows={5} textareaClassName="rounded-2xl" />
          </div>
        </ShellCard>

        <ShellCard title="Visibility" description="Publish state and availability.">
          <div className="space-y-4">
            <Select label="Catalog status" options={statusOptions} selectClassName="rounded-2xl" />
            <Input label="Visibility" rounded="lg" placeholder="Marketplace live" />
            <Input label="Fulfillment" rounded="lg" placeholder="Same-day" />
          </div>
        </ShellCard>
      </div>
    </div>
  );
}
