"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge, Button, Checkbox, Input, Select, Text, Textarea } from "rizzui";
import { PiArrowLeftBold, PiFloppyDiskBold, PiImageBold, PiUploadBold } from "react-icons/pi";
import { useAdminActionGuard } from "@/components/auth/use-admin-action-guard";
import PageHeader from "@/components/admin/page-header";
import { routes } from "@/config/routes";
import type { MarketplaceProductRecord } from "@/repositories/admin/products";
import {
  createAdminProduct,
  updateAdminProduct,
} from "@/repositories/admin/products";
import { useAdminCategories } from "@/repositories/admin/categories";
import { useAdminVendors } from "@/repositories/admin/vendors";

const formSections = [
  { id: "summary", label: "Summary" },
  { id: "media", label: "Images & Gallery" },
  { id: "pricing-inventory", label: "Pricing & Inventory" },
  { id: "product-identifiers", label: "Product Identifiers & Custom Fields" },
  { id: "shipping", label: "Shipping" },
  { id: "seo", label: "SEO" },
  { id: "variant-options", label: "Variant Options" },
  { id: "tags-category", label: "Tags & Category" },
] as const;

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

type ProductFormWorkspaceProps = {
  mode: "create" | "edit";
  product?: MarketplaceProductRecord;
};

export default function ProductFormWorkspace({
  mode,
  product,
}: ProductFormWorkspaceProps) {
  const router = useRouter();
  const { guardAction } = useAdminActionGuard();
  const { data: liveCategories = [] } = useAdminCategories();
  const { data: liveVendors = [] } = useAdminVendors();
  const title = mode === "edit" ? `Edit ${product?.name}` : "Create Product";
  const name = product?.name ?? "Organic tomato basket";
  const sku = product?.sku ?? "GBM-TOM-001";
  const vendor = product?.vendor ?? "Green Basket Market";
  const category = product?.category ?? "Fresh produce";
  const subcategory = product?.subcategory ?? "Tomatoes & onions";
  const description =
    product?.description ?? "Fresh tomato basket prepared for same-day neighborhood delivery windows.";
  const status = product?.status ?? "Published";
  const visibility = product?.visibility ?? "Marketplace live";
  const fulfillment = product?.fulfillment ?? "Same-day";
  const reviewLane = product?.reviewLane ?? "Auto-review";
  const unit = product?.attributes[0]?.value ?? "Basket";
  const weight = product?.attributes[1]?.value ?? "4kg";
  const leadTime = product?.attributes[2]?.value ?? "Under 2h";
  const storage = product?.attributes[3]?.value ?? "Ambient";
  const stockLevel = String(product?.stockLevel ?? 84);
  const price = String(product?.priceValue ?? 95);
  const backHref = mode === "edit" && product ? routes.marketplace.productDetails(product.slug) : routes.marketplace.products;
  const [form, setForm] = useState({
    name,
    vendor,
    category,
    subcategory,
    description,
    status: status as string,
    visibility,
    fulfillment,
    stockLevel,
    price,
    tags: (product?.tags ?? ["Fresh", "Top seller", "Same-day"]).join(", "),
  });
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    setForm({
      name,
      vendor,
      category,
      subcategory,
      description,
      status: status as string,
      visibility,
      fulfillment,
      stockLevel,
      price,
      tags: (product?.tags ?? ["Fresh", "Top seller", "Same-day"]).join(", "),
    });
  }, [
    category,
    description,
    fulfillment,
    name,
    price,
    product?.tags,
    status,
    stockLevel,
    subcategory,
    vendor,
    visibility,
  ]);

  const vendorSelectOptions = useMemo(() => {
    if (liveVendors.length) {
      return liveVendors.map((item) => ({
        label: item.storeName || item.name,
        value: item.storeName || item.name,
      }));
    }
    return vendorOptions;
  }, [liveVendors]);

  const categorySelectOptions = useMemo(() => {
    if (liveCategories.length) {
      return liveCategories.map((item) => ({ label: item.name, value: item.name }));
    }
    return categoryOptions;
  }, [liveCategories]);

  async function handleSave() {
    setIsSaving(true);
    setFeedback(null);
    try {
      const matchedVendor = liveVendors.find(
        (item) => (item.storeName || item.name) === form.vendor,
      );
      if (!matchedVendor?.storeName && mode === "create") {
        throw new Error("Choose a live vendor store before creating a product.");
      }
      const matchedCategory = liveCategories.find((item) => item.name === form.category);
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price) || 0,
        stock: Number(form.stockLevel) || 0,
        isActive: form.visibility !== "Review hold" && form.status !== "Review",
        categoryId: matchedCategory?.id ?? null,
        subcategory: form.subcategory.trim() || null,
        tags: form.tags
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        ...(mode === "create" ? { storeId: matchedVendor?.id } : {}),
      };

      const result =
        mode === "create"
          ? await createAdminProduct(payload)
          : await updateAdminProduct(product!.id, payload);

      const itemId = result?.item?.id ?? product?.id;
      setFeedback({
        type: "success",
        message:
          mode === "create"
            ? "Product created successfully."
            : "Product updated successfully.",
      });
      if (itemId) {
        router.push(routes.marketplace.productDetails(itemId));
        router.refresh();
      }
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to save the product.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="@container space-y-6">
      <PageHeader
        breadcrumb={["Home", "Marketplace", "Products", ...(mode === "edit" && product ? [product.id, "Edit"] : ["Create"])]}
        eyebrow="Marketplace Kit"
        title={title}
        description="Manage product identity, pricing, inventory, catalog placement, and storefront readiness for the vendor and customer mobile flows this item affects."
        action={
          <div className="flex flex-wrap gap-3">
            <Link href={backHref}>
              <Button variant="outline" className="h-11 rounded-2xl px-4">
                <PiArrowLeftBold className="me-1.5 h-4 w-4" />
                Back
              </Button>
            </Link>
            <Button
              variant="outline"
              className="h-11 rounded-2xl px-4"
              onClick={() =>
                void guardAction(
                  "write",
                  () => undefined,
                  "Your staff role cannot save product drafts from this marketplace surface.",
                )
              }
            >
              Save Draft
            </Button>
            <Button
              className="h-11 rounded-2xl bg-primary px-4 text-white hover:bg-primary/90"
              isLoading={isSaving}
              onClick={() =>
                void guardAction(
                  "write",
                  handleSave,
                  "Your staff role cannot create or update marketplace products.",
                )
              }
            >
              <PiFloppyDiskBold className="me-1.5 h-4 w-4" />
              {mode === "edit" ? "Update Product" : "Create Product"}
            </Button>
          </div>
        }
      />

      {feedback ? (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            feedback.type === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {feedback.message}
        </div>
      ) : null}

      <div className="sticky top-[68px] z-20 border-b border-gray-300 bg-white/95 py-0 backdrop-blur @2xl:top-[72px] 2xl:top-20">
        <div className="custom-scrollbar overflow-x-auto scroll-smooth">
          <div className="inline-grid grid-flow-col gap-5 md:gap-7 lg:gap-10">
            {formSections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="relative whitespace-nowrap py-4 text-sm font-medium text-gray-500 transition hover:text-gray-900"
              >
                {section.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-7 divide-y divide-dashed divide-gray-200 @2xl:gap-9 @3xl:gap-11">
        <FormSection
          id="summary"
          title="Summary"
          description="Set vendor identity, storefront copy, and readiness state for this catalog item."
        >
          <Input label="Product name" rounded="lg" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
          <SelectField label="Vendor store" options={vendorSelectOptions} value={form.vendor} onChange={(value) => setForm((current) => ({ ...current, vendor: value }))} />
          <SelectField label="Main category" options={categorySelectOptions} value={form.category} onChange={(value) => setForm((current) => ({ ...current, category: value }))} />
          <SelectField label="Subcategory" options={subcategoryOptions} value={form.subcategory} onChange={(value) => setForm((current) => ({ ...current, subcategory: value }))} />
          <Input label="Business type" rounded="lg" defaultValue={product?.businessType ?? "Grocery vendor"} />
          <SelectField label="Catalog status" options={statusOptions} value={form.status} onChange={(value) => setForm((current) => ({ ...current, status: value }))} />
          <Textarea
            label="Description"
            textareaClassName="rounded-2xl"
            className="col-span-full"
            value={form.description}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
          />
        </FormSection>

        <FormSection
          id="media"
          title="Images & Gallery"
          description="Upload the cover image, detail shots, and packaging visuals used on the storefront."
        >
          <UploadTile />
          <div className="col-span-full grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {["Primary cover", "Vendor shelf", "Close detail", "Packaging angle"].map((label, index) => (
              <div key={label} className="overflow-hidden rounded-[24px] border border-gray-200 bg-white shadow-sm">
                <div className={`aspect-[4/4.65] bg-gradient-to-br ${
                  index % 2 === 0 ? "from-primary/20 via-white to-secondary/20" : "from-secondary/15 via-white to-primary/10"
                }`} />
                <div className="border-t border-gray-200 px-4 py-3">
                  <Text className="font-medium text-gray-900">{label}</Text>
                  <Text className="mt-1 text-xs text-gray-500">Marketplace gallery slot</Text>
                </div>
              </div>
            ))}
          </div>
        </FormSection>

        <FormSection
          id="pricing-inventory"
          title="Pricing & Inventory"
          description="Set stock, price, fees, and sale readiness for this catalog item."
        >
          <Input label="Price" rounded="lg" value={form.price} onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))} prefix="ZMW" />
          <Input label="Stock level" rounded="lg" value={form.stockLevel} onChange={(event) => setForm((current) => ({ ...current, stockLevel: event.target.value }))} />
          <Input label="Sale price" rounded="lg" defaultValue={status === "Low stock" ? price : String(Math.max(Number(price) - 10, 0))} prefix="ZMW" />
          <Input label="Low-stock threshold" rounded="lg" defaultValue="20" />
          <Input label="Unit label" rounded="lg" defaultValue={unit} />
          <Input label="Lead time" rounded="lg" defaultValue={leadTime} />
        </FormSection>

        <FormSection
          id="product-identifiers"
          title="Product Identifiers & Custom Fields"
          description="Manage SKU, vendor references, and internal catalog identifiers in one place."
        >
          <Input label="SKU" rounded="lg" defaultValue={sku} />
          <Input label="Vendor reference" rounded="lg" defaultValue={`${sku}-NTM`} />
          <Input label="Storage note" rounded="lg" defaultValue={storage} />
          <Input label="Weight or size" rounded="lg" defaultValue={weight} />
          <Input label="Storefront badge" rounded="lg" defaultValue={product?.tags[0] ?? "Top seller"} />
          <Input label="Review lane" rounded="lg" defaultValue={reviewLane} />
        </FormSection>

        <FormSection
          id="shipping"
          title="Shipping"
          description="Retain the dedicated shipping section, then align it to Ntumai tasker delivery expectations and dispatch promise windows."
        >
          <SelectField label="Fulfillment" options={fulfillmentOptions} value={form.fulfillment} onChange={(value) => setForm((current) => ({ ...current, fulfillment: value }))} />
          <SelectField label="Visibility" options={visibilityOptions} value={form.visibility} onChange={(value) => setForm((current) => ({ ...current, visibility: value }))} />
          <Input label="Pickup SLA" rounded="lg" defaultValue={fulfillment === "Same-day" ? "10 minutes" : "Within slot"} />
          <Input label="Delivery promise" rounded="lg" defaultValue={leadTime} />
          <Checkbox
            label={<span className="text-sm text-gray-700">Eligible for customer live tracking</span>}
            defaultChecked={visibility === "Marketplace live"}
            size="sm"
            className="col-span-full -mt-2 [&_svg]:top-0"
          />
        </FormSection>

        <FormSection
          id="seo"
          title="SEO"
          description="Control search title, handle, and metadata used by the storefront and discovery flows."
        >
          <Input label="Storefront title" rounded="lg" defaultValue={name} />
          <Input label="URL handle" rounded="lg" defaultValue={product?.slug ?? "organic-tomato-basket"} />
          <Textarea
            label="Meta description"
            textareaClassName="rounded-2xl"
            className="col-span-full"
            defaultValue={`Buy ${name.toLowerCase()} from ${vendor} on Ntumai with ${fulfillment.toLowerCase()} delivery.`}
          />
        </FormSection>

        <FormSection
          id="variant-options"
          title="Variant Options"
          description="Manage size, pack, or option variants when the product needs multiple sellable versions."
        >
          <Input label="Variant group" rounded="lg" defaultValue={category === "Quick meals" ? "Portion size" : "Pack size"} />
          <Input label="Option 1" rounded="lg" defaultValue={category === "Quick meals" ? "Regular" : "Standard"} />
          <Input label="Option 2" rounded="lg" defaultValue={category === "Quick meals" ? "Large" : "Family"} />
          <Input label="Option 3" rounded="lg" defaultValue="Custom note" />
        </FormSection>

        <FormSection
          id="tags-category"
          title="Tags & Category"
          description="Place the product in the right categories so it stays searchable, reviewable, and easy to merchandise."
        >
          <SelectField label="Main category" options={categorySelectOptions} value={form.category} onChange={(value) => setForm((current) => ({ ...current, category: value }))} />
          <SelectField label="Subcategory" options={subcategoryOptions} value={form.subcategory} onChange={(value) => setForm((current) => ({ ...current, subcategory: value }))} />
          <Textarea
            label="Tags"
            textareaClassName="rounded-2xl"
            className="col-span-full"
            value={form.tags}
            onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))}
          />
        </FormSection>
      </div>
    </div>
  );
}

function FormSection({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="grid scroll-mt-40 gap-5 pt-7 first:pt-0 @3xl:grid-cols-12 @2xl:pt-9 @3xl:pt-11">
      <div className="col-span-full @4xl:col-span-4">
        <h4 className="text-base font-medium text-gray-900">{title}</h4>
        <p className="mt-2 text-sm leading-6 text-gray-500">{description}</p>
      </div>
      <div className="col-span-full grid gap-4 @2xl:grid-cols-2 @4xl:col-span-8 @4xl:gap-5 xl:gap-7">
        {children}
      </div>
    </section>
  );
}

function SelectField({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Array<{ label: string; value: string }>;
  value: string;
  onChange?: (value: string) => void;
}) {
  return (
    <Select
      label={label}
      options={options}
      defaultValue={options.find((option) => option.value === value) ?? options[0]}
      onChange={(option: any) => onChange?.(option?.value ?? "")}
      selectClassName="rounded-2xl"
    />
  );
}

function UploadTile() {
  const { guardAction } = useAdminActionGuard();
  return (
    <div className="col-span-full rounded-[24px] border border-dashed border-gray-300 bg-gray-50/80 p-5">
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-white p-3 text-gray-900 shadow-sm ring-1 ring-gray-200">
          <PiUploadBold className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <Text className="font-semibold text-gray-900">Upload media set</Text>
          <Text className="mt-1 text-sm leading-6 text-gray-500">
            Use product cover, detail shots, and packaging frames that make the mobile storefront easier to browse and trust.
          </Text>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="rounded-2xl px-4"
              onClick={() =>
                void guardAction(
                  "write",
                  () => undefined,
                  "Your staff role cannot upload or replace product media.",
                )
              }
            >
              <PiImageBold className="me-1.5 h-4 w-4" />
              Select files
            </Button>
            <Badge variant="flat" className="rounded-2xl bg-gray-900 px-3 py-1.5 text-white">
              JPG, PNG, WEBP
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
