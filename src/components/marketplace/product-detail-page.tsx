"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Button, Text, Title } from "rizzui";
import { PiArrowLeftBold, PiNotePencilBold, PiTruckBold } from "react-icons/pi";
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import { getMarketplaceProduct, marketplaceProducts } from "@/components/marketplace/product-data";
import { routes } from "@/config/routes";

export default function ProductDetailPage({ slug }: { slug: string }) {
  const product = getMarketplaceProduct(slug);
  if (!product) notFound();

  const related = marketplaceProducts.filter((item) => item.slug !== product.slug).slice(0, 3);

  return (
    <div className="@container space-y-6">
      <PageHeader
        breadcrumb={["Home", "Marketplace", "Products", product.id]}
        eyebrow="Marketplace Kit"
        title={product.name}
        description="Customer-facing product details aligned to the archived ecommerce product page, with Ntumai vendor and fulfillment context."
        action={
          <div className="flex flex-wrap gap-3">
            <Link href={routes.marketplace.products}>
              <Button variant="outline" className="h-11 rounded-2xl px-4">
                <PiArrowLeftBold className="me-1.5 h-4 w-4" />
                Back
              </Button>
            </Link>
            <Link href={routes.marketplace.editProduct(product.slug)}>
              <Button className="h-11 rounded-2xl bg-primary px-4 text-white hover:bg-primary/90">
                <PiNotePencilBold className="me-1.5 h-4 w-4" />
                Edit Product
              </Button>
            </Link>
          </div>
        }
      />

      <div className="@3xl:grid @3xl:grid-cols-12">
        <div className="col-span-7 mb-7 @container @lg:mb-10 @3xl:pe-10">
          <div className="grid grid-cols-2 gap-3 @md:gap-4 @xl:gap-5 @2xl:gap-7">
            {[product.tags[0] ?? "Fresh", product.vendor, product.category, product.fulfillment].map((label, index) => (
              <div
                key={`${label}-${index}`}
                className={`relative aspect-[4/4.65] overflow-hidden rounded-[24px] border border-gray-200 ${
                  index % 2 === 0 ? "bg-gradient-to-br from-primary/25 via-white to-secondary/20" : "bg-gradient-to-br from-secondary/20 via-white to-primary/10"
                }`}
              >
                <div className="absolute inset-x-0 bottom-0 border-t border-gray-200 bg-white/90 px-4 py-3 backdrop-blur">
                  <Text className="font-medium text-gray-900">{label}</Text>
                  <Text className="mt-1 text-xs text-gray-500">Marketplace gallery panel</Text>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-5 @container space-y-6">
          <div className="border-b border-gray-200 pb-6 @lg:pb-8">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="flat" className="rounded-2xl bg-primary/10 px-3 py-1 text-primary">
                {product.status}
              </Badge>
              <Badge variant="flat" className="rounded-2xl bg-secondary/15 px-3 py-1 text-secondary-foreground">
                {product.visibility}
              </Badge>
            </div>
            <Title as="h2" className="mt-3 text-3xl font-semibold tracking-tight">
              {product.name}
            </Title>
            <Text as="p" className="mt-2 text-base leading-7 text-gray-600">
              {product.description}
            </Text>
            <div className="mt-4 flex items-end gap-3">
              <div className="text-3xl font-semibold text-gray-900">{product.price}</div>
              <del className="pb-1 text-base font-medium text-gray-400">
                ZMW {product.priceValue + 15}
              </del>
              <Text className="pb-1 text-sm font-medium text-red-600">Vendor live rate</Text>
            </div>
            <Text className="mt-2 font-medium text-emerald-700">Inclusive of marketplace and tasker delivery pricing rules</Text>
          </div>

          <ShellCard title="Delivery Options" description="Ntumai storefront and handoff settings." bodyClassName="space-y-4">
            <DetailRow label="Vendor" value={product.vendor} />
            <DetailRow label="Fulfillment" value={product.fulfillment} />
            <DetailRow label="Lead time" value={product.attributes[2]?.value ?? ""} />
            <DetailRow label="Availability" value={product.isAvailable ? "Available for sale" : "Review hold"} />
            <div className="rounded-[20px] border border-gray-200 bg-gray-50/70 p-4">
              <div className="flex items-center gap-2">
                <PiTruckBold className="h-4 w-4 text-primary" />
                <Text className="font-semibold text-gray-900">Tasker handoff note</Text>
              </div>
              <Text className="mt-2 text-sm leading-6 text-gray-500">
                {product.fulfillment} delivery promise and storage note stay visible to dispatch and customer support.
              </Text>
            </div>
          </ShellCard>

          <ShellCard title="Description" description="Customer and operator context." bodyClassName="space-y-4">
            <Text className="text-sm leading-7 text-gray-600">{product.description}</Text>
            <div className="grid gap-3 sm:grid-cols-2">
              {product.attributes.map((attribute) => (
                <div key={attribute.label} className="rounded-[20px] border border-gray-200 bg-gray-50/70 p-4">
                  <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">{attribute.label}</Text>
                  <Text className="mt-2 font-semibold text-gray-900">{attribute.value}</Text>
                </div>
              ))}
            </div>
          </ShellCard>

          <ShellCard title="Review Notes" description="Catalog and compliance history." bodyClassName="space-y-3">
            {product.timeline.map((item) => (
              <div key={`${item.label}-${item.time}`} className="rounded-[20px] border border-gray-200 bg-gray-50/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Text className="font-semibold text-gray-900">{item.label}</Text>
                    <Text className="mt-1 text-sm text-gray-500">{item.detail}</Text>
                  </div>
                  <Text className="text-xs text-gray-500">{item.time}</Text>
                </div>
              </div>
            ))}
          </ShellCard>
        </div>
      </div>

      <ShellCard title="Related Products" description="Other Ntumai catalog items in a similar operating lane.">
        <div className="grid gap-4 lg:grid-cols-3">
          {related.map((item) => (
            <Link
              key={item.id}
              href={routes.marketplace.productDetails(item.slug)}
              className="overflow-hidden rounded-[24px] border border-gray-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-primary/15 via-white to-secondary/15" />
              <div className="space-y-2 px-5 py-4">
                <Text className="font-semibold text-gray-900">{item.name}</Text>
                <Text className="text-sm text-gray-500">{item.vendor}</Text>
                <div className="flex items-center justify-between gap-3">
                  <Badge variant="flat" className="rounded-2xl bg-primary/10 px-3 py-1 text-primary">
                    {item.status}
                  </Badge>
                  <Text className="font-semibold text-gray-900">{item.price}</Text>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </ShellCard>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
      <Text className="text-sm text-gray-500">{label}</Text>
      <Text className="text-sm font-semibold text-gray-900">{value}</Text>
    </div>
  );
}
