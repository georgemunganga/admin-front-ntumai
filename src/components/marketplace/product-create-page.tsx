"use client";

import Link from "next/link";
import { Badge, Button, Input, Select, Text, Textarea } from "rizzui";
import {
  PiArrowLeftBold,
  PiCheckCircleBold,
  PiFloppyDiskBold,
  PiWarningCircleBold,
} from "react-icons/pi";
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";

const vendorOptions = [
  { label: "Green Basket Market", value: "Green Basket Market" },
  { label: "QuickBite Kitchens", value: "QuickBite Kitchens" },
  { label: "CityCare Pharmacy", value: "CityCare Pharmacy" },
];

const categoryOptions = [
  { label: "Fresh produce", value: "Fresh produce" },
  { label: "Quick meals", value: "Quick meals" },
  { label: "Pharmacy", value: "Pharmacy" },
  { label: "Household", value: "Household" },
];

const subcategoryOptions = [
  { label: "Tomatoes & onions", value: "Tomatoes & onions" },
  { label: "Prepared lunch bowls", value: "Prepared lunch bowls" },
  { label: "Pain relief", value: "Pain relief" },
  { label: "Cleaning bundles", value: "Cleaning bundles" },
];

const statusOptions = [
  { label: "Published", value: "Published" },
  { label: "Low stock", value: "Low stock" },
  { label: "Review", value: "Review" },
];

const visibilityOptions = [
  { label: "Marketplace live", value: "Marketplace live" },
  { label: "Review hold", value: "Review hold" },
  { label: "Draft", value: "Draft" },
];

const fulfillmentOptions = [
  { label: "Same-day", value: "Same-day" },
  { label: "On-demand", value: "On-demand" },
  { label: "Scheduled", value: "Scheduled" },
  { label: "Next-slot", value: "Next-slot" },
];

const reviewLaneOptions = [
  { label: "Auto-review", value: "Auto-review" },
  { label: "Catalog QA", value: "Catalog QA" },
  { label: "Compliance review", value: "Compliance review" },
];

export default function ProductCreatePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Marketplace", "Products", "Create"]}
        eyebrow="Marketplace Kit"
        title="Create Product"
        description="Catalog create flow aligned to vendor store product onboarding."
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
            <Input label="Product name" defaultValue="Organic tomato basket" rounded="lg" />
            <Input label="SKU" defaultValue="GBM-TOM-001" rounded="lg" />
            <Select
              label="Vendor store"
              options={vendorOptions}
              defaultValue={vendorOptions[0]}
              selectClassName="rounded-2xl"
            />
            <Input label="Business type" defaultValue="Grocery vendor" rounded="lg" disabled />
            <Select
              label="Main category"
              options={categoryOptions}
              defaultValue={categoryOptions[0]}
              selectClassName="rounded-2xl"
            />
            <Select
              label="Subcategory"
              options={subcategoryOptions}
              defaultValue={subcategoryOptions[0]}
              selectClassName="rounded-2xl"
            />
          </div>

          <div className="mt-4">
            <Text className="mb-2 text-sm font-medium text-gray-700">Description</Text>
            <Textarea
              defaultValue="Fresh tomato basket prepared for same-day neighborhood delivery windows."
              rows={5}
              textareaClassName="rounded-2xl"
            />
          </div>
        </ShellCard>

        <ShellCard title="Visibility" description="Publish state and availability.">
          <div className="space-y-4">
            <Select
              label="Catalog status"
              options={statusOptions}
              defaultValue={statusOptions[0]}
              selectClassName="rounded-2xl"
            />
            <Select
              label="Visibility"
              options={visibilityOptions}
              defaultValue={visibilityOptions[0]}
              selectClassName="rounded-2xl"
            />
            <Select
              label="Fulfillment"
              options={fulfillmentOptions}
              defaultValue={fulfillmentOptions[0]}
              selectClassName="rounded-2xl"
            />
          </div>
        </ShellCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ShellCard title="Pricing and stock" description="Commercial fields.">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Price" defaultValue="95" prefix="ZMW" rounded="lg" />
            <Input label="Stock level" defaultValue="84" rounded="lg" />
            <Input label="Unit label" defaultValue="Basket" rounded="lg" />
            <Input label="Lead time" defaultValue="Under 2h" rounded="lg" />
          </div>
        </ShellCard>

        <ShellCard title="Summary" description="Store and review readiness.">
          <div className="space-y-4">
            <div className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                    Store status
                  </Text>
                  <Text className="mt-2 font-semibold text-gray-900">Ready to publish</Text>
                </div>
                <Badge variant="flat" className="rounded-2xl bg-primary/10 px-3 py-1.5 text-primary">
                  Grocery
                </Badge>
              </div>
              <Text className="mt-2 text-sm text-gray-500">
                Vendor store is active, category options are available, and the product can follow the normal catalog flow.
              </Text>
            </div>

            <div className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
              <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                Review lane
              </Text>
              <div className="mt-3 space-y-3">
                <Select
                  label="Internal routing"
                  options={reviewLaneOptions}
                  defaultValue={reviewLaneOptions[0]}
                  selectClassName="rounded-2xl"
                />
                <WorkflowNote
                  icon={<PiCheckCircleBold className="h-4 w-4 text-emerald-600" />}
                  title="Category captured"
                  detail="The mobile vendor flow requires a main category and subcategory before the product is saved."
                />
                <WorkflowNote
                  icon={<PiWarningCircleBold className="h-4 w-4 text-amber-600" />}
                  title="Review hold available"
                  detail="Restricted or sensitive items can be routed to catalog QA or compliance before storefront release."
                />
              </div>
            </div>
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
