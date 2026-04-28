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
import { getMarketplaceProduct } from "@/components/marketplace/product-data";

const vendorOptions = [
  { label: "Green Basket Market", value: "Green Basket Market" },
  { label: "QuickBite Kitchens", value: "QuickBite Kitchens" },
  { label: "CityCare Pharmacy", value: "CityCare Pharmacy" },
  { label: "HomeBox Supplies", value: "HomeBox Supplies" },
  { label: "Digital Point", value: "Digital Point" },
];

const categoryOptions = [
  { label: "Fresh produce", value: "Fresh produce" },
  { label: "Quick meals", value: "Quick meals" },
  { label: "Pharmacy", value: "Pharmacy" },
  { label: "Household", value: "Household" },
  { label: "Accessories", value: "Accessories" },
];

const subcategoryOptions = [
  { label: "Tomatoes & onions", value: "Tomatoes & onions" },
  { label: "Prepared lunch bowls", value: "Prepared lunch bowls" },
  { label: "Pain relief", value: "Pain relief" },
  { label: "Cleaning bundles", value: "Cleaning bundles" },
  { label: "Charging accessories", value: "Charging accessories" },
];

const visibilityOptions = [
  { label: "Marketplace live", value: "Marketplace live" },
  { label: "Review hold", value: "Review hold" },
  { label: "Draft", value: "Draft" },
];

const statusOptions = [
  { label: "Published", value: "Published" },
  { label: "Low stock", value: "Low stock" },
  { label: "Review", value: "Review" },
];

const availabilityOptions = [
  { label: "Available for sale", value: "available" },
  { label: "Temporarily paused", value: "paused" },
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

export default function ProductEditPage({ slug }: { slug: string }) {
  const product = getMarketplaceProduct(slug);

  if (!product) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Marketplace", "Products", product.id, "Edit"]}
        eyebrow="Marketplace Kit"
        title={`Edit ${product.name}`}
        description="Catalog form aligned to vendor product management and review workflows."
        action={
          <div className="flex flex-wrap gap-3">
            <Link href={`/marketplace/products/${product.slug}`}>
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
        <ShellCard title="Basic information" description="Core catalog fields.">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Product name" defaultValue={product.name} rounded="lg" />
            <Input label="SKU" defaultValue={product.sku} rounded="lg" />
            <Select
              label="Vendor store"
              options={vendorOptions}
              defaultValue={vendorOptions.find((option) => option.value === product.vendor)}
              selectClassName="rounded-2xl"
            />
            <Input label="Business type" defaultValue={product.businessType} rounded="lg" disabled />
            <Select
              label="Main category"
              options={categoryOptions}
              defaultValue={categoryOptions.find((option) => option.value === product.category)}
              selectClassName="rounded-2xl"
            />
            <Select
              label="Subcategory"
              options={subcategoryOptions}
              defaultValue={subcategoryOptions.find((option) => option.value === product.subcategory)}
              selectClassName="rounded-2xl"
            />
          </div>

          <div className="mt-4">
            <Text className="mb-2 text-sm font-medium text-gray-700">Description</Text>
            <Textarea defaultValue={product.description} rows={5} textareaClassName="rounded-2xl" />
          </div>
        </ShellCard>

        <ShellCard title="Visibility" description="Publish state and availability.">
          <div className="space-y-4">
            <Select
              label="Catalog status"
              options={statusOptions}
              defaultValue={statusOptions.find((option) => option.value === product.status)}
              selectClassName="rounded-2xl"
            />
            <Select
              label="Visibility"
              options={visibilityOptions}
              defaultValue={visibilityOptions.find((option) => option.value === product.visibility)}
              selectClassName="rounded-2xl"
            />
            <Select
              label="Availability"
              options={availabilityOptions}
              defaultValue={product.isAvailable ? availabilityOptions[0] : availabilityOptions[1]}
              selectClassName="rounded-2xl"
            />
            <Select
              label="Fulfillment"
              options={fulfillmentOptions}
              defaultValue={fulfillmentOptions.find((option) => option.value === product.fulfillment)}
              selectClassName="rounded-2xl"
            />
          </div>
        </ShellCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ShellCard title="Pricing and stock" description="Commercial fields.">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Price" defaultValue={String(product.priceValue)} prefix="ZMW" rounded="lg" />
            <Input label="Stock level" defaultValue={String(product.stockLevel)} rounded="lg" />
            <Input label="Unit label" defaultValue={product.attributes[0]?.value ?? ""} rounded="lg" />
            <Input label="Storage note" defaultValue={product.attributes[3]?.value ?? ""} rounded="lg" />
            <Input label="Weight or size" defaultValue={product.attributes[1]?.value ?? ""} rounded="lg" />
            <Input label="Lead time" defaultValue={product.attributes[2]?.value ?? ""} rounded="lg" />
          </div>
        </ShellCard>

        <ShellCard title="Review notes" description="Internal catalog handling.">
          <div className="space-y-4">
            <div className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                    Review lane
                  </Text>
                  <Text className="mt-2 font-semibold text-gray-900">{product.reviewLane}</Text>
                </div>
                <Badge variant="flat" className="rounded-2xl bg-primary/10 px-3 py-1.5 text-primary">
                  {product.visibility}
                </Badge>
              </div>
            </div>
            <Select
              label="Internal routing"
              options={reviewLaneOptions}
              defaultValue={reviewLaneOptions.find((option) => option.value === product.reviewLane)}
              selectClassName="rounded-2xl"
            />
            <WorkflowNote
              icon={
                product.isAvailable ? (
                  <PiCheckCircleBold className="h-4 w-4 text-emerald-600" />
                ) : (
                  <PiWarningCircleBold className="h-4 w-4 text-amber-600" />
                )
              }
              title={product.isAvailable ? "Storefront active" : "Storefront paused"}
              detail="The mobile vendor flow allows availability changes without changing the product category path."
            />
            {product.timeline.map((item) => (
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
