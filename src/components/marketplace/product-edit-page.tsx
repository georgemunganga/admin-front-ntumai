"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Button, Input, Select, Text, Textarea } from "rizzui";
import { PiArrowLeftBold, PiFloppyDiskBold } from "react-icons/pi";
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import { getMarketplaceProduct } from "@/components/marketplace/product-data";

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

export default function ProductEditPage({ slug }: { slug: string }) {
  const product = getMarketplaceProduct(slug);

  if (!product) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Marketplace", "Products", product.id, "Edit"]}
        eyebrow="Marketplace Kit"
        title={`Edit ${product.name}`}
        description="Catalog form preview."
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
            <Input label="Vendor" defaultValue={product.vendor} rounded="lg" />
            <Input label="Category" defaultValue={product.category} rounded="lg" />
          </div>

          <div className="mt-4">
            <Text className="mb-2 text-sm font-medium text-gray-700">Description</Text>
            <Textarea defaultValue={product.description} rows={5} textareaClassName="rounded-2xl" />
          </div>
        </ShellCard>

        <ShellCard title="Visibility" description="Publish state and availability.">
          <div className="space-y-4">
            <Select label="Catalog status" options={statusOptions} defaultValue={statusOptions.find((option) => option.value === product.status)} selectClassName="rounded-2xl" />
            <Select label="Visibility" options={visibilityOptions} defaultValue={visibilityOptions.find((option) => option.value === product.visibility)} selectClassName="rounded-2xl" />
            <Input label="Fulfillment" defaultValue={product.fulfillment} rounded="lg" />
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
          </div>
        </ShellCard>

        <ShellCard title="Review notes" description="Internal catalog handling.">
          <div className="space-y-3">
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
