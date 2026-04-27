"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Button, Text, Title } from "rizzui";
import { PiArrowLeftBold, PiNotePencilBold, PiPackageBold, PiStorefrontBold } from "react-icons/pi";
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import { getMarketplaceProduct } from "@/components/marketplace/product-data";

export default function ProductDetailPage({ slug }: { slug: string }) {
  const product = getMarketplaceProduct(slug);

  if (!product) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Marketplace", "Products", product.id]}
        eyebrow="Marketplace Kit"
        title={product.name}
        description={product.description}
        action={
          <div className="flex flex-wrap gap-3">
            <Link href="/marketplace/products">
              <Button variant="outline" className="h-11 rounded-2xl px-4">
                <PiArrowLeftBold className="me-1.5 h-4 w-4" />
                Back
              </Button>
            </Link>
            <Link href={`/marketplace/products/${product.slug}/edit`}>
              <Button className="h-11 rounded-2xl bg-primary px-4 text-white hover:bg-primary/90">
                <PiNotePencilBold className="me-1.5 h-4 w-4" />
                Edit Product
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <ShellCard title="Catalog summary" description="Core product details.">
          <div className="grid gap-4 md:grid-cols-2">
            <InfoTile label="Product ID" value={product.id} />
            <InfoTile label="SKU" value={product.sku} />
            <InfoTile label="Category" value={product.category} />
            <InfoTile label="Vendor" value={product.vendor} icon={<PiStorefrontBold className="h-4 w-4 text-primary" />} />
            <InfoTile label="Price" value={product.price} />
            <InfoTile label="Fulfillment" value={product.fulfillment} />
          </div>

          <div className="mt-5 rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
            <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Description</Text>
            <Text className="mt-2 text-sm leading-6 text-gray-600">{product.description}</Text>
          </div>
        </ShellCard>

        <ShellCard title="Status" description="Visibility and inventory.">
          <div className="space-y-4">
            <div className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
              <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Catalog state</Text>
              <div className="mt-3 flex items-center gap-3">
                <ProductStatus status={product.status} />
                <Badge variant="flat" className="rounded-2xl bg-primary/10 px-3 py-1.5 text-primary">
                  {product.visibility}
                </Badge>
              </div>
            </div>
            <div className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
              <div className="flex items-center gap-2">
                <PiPackageBold className="h-4 w-4 text-primary" />
                <Text className="font-semibold text-gray-900">Inventory</Text>
              </div>
              <Text className="mt-2 text-2xl font-semibold text-gray-900">{product.stock}</Text>
              <Text className="mt-1 text-xs leading-5 text-gray-500">Last updated {product.updatedAt}</Text>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="flat" className="rounded-2xl bg-secondary/20 px-3 py-1 text-secondary-foreground">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </ShellCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ShellCard title="Product attributes" description="Key selling attributes.">
          <div className="grid gap-4 md:grid-cols-2">
            {product.attributes.map((attribute) => (
              <div key={attribute.label} className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
                <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">{attribute.label}</Text>
                <Title as="h4" className="mt-2 text-base font-semibold text-gray-900">
                  {attribute.value}
                </Title>
              </div>
            ))}
          </div>
        </ShellCard>

        <ShellCard title="Recent activity" description="Latest catalog actions.">
          <div className="space-y-4">
            {product.timeline.map((item) => (
              <div key={`${item.label}-${item.time}`} className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Text className="font-semibold text-gray-900">{item.label}</Text>
                    <Text className="mt-1 text-sm text-gray-500">{item.detail}</Text>
                  </div>
                  <Text className="text-xs text-gray-500">{item.time}</Text>
                </div>
              </div>
            ))}
          </div>
        </ShellCard>
      </div>
    </div>
  );
}

function InfoTile({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
      <div className="flex items-center gap-2">
        {icon}
        <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">{label}</Text>
      </div>
      <Title as="h4" className="mt-2 text-base font-semibold text-gray-900">
        {value}
      </Title>
    </div>
  );
}

function ProductStatus({ status }: { status: string }) {
  const tones: Record<string, string> = {
    Published: "bg-emerald-50 text-emerald-700",
    "Low stock": "bg-amber-50 text-amber-700",
    Review: "bg-primary/10 text-primary",
  };

  return <span className={`inline-flex rounded-2xl px-3 py-1 text-xs font-semibold ${tones[status] ?? tones.Review}`}>{status}</span>;
}
