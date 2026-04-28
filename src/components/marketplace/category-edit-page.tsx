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
import { getMarketplaceCategory } from "@/components/marketplace/category-data";

const groupOptions = [
  { label: "Grocery", value: "Grocery" },
  { label: "Essentials", value: "Essentials" },
  { label: "Regulated", value: "Regulated" },
  { label: "Food", value: "Food" },
];

const statusOptions = [
  { label: "Live", value: "live" },
  { label: "Stable", value: "stable" },
  { label: "Review", value: "review" },
  { label: "Monitoring", value: "monitoring" },
  { label: "Queued", value: "queued" },
];

const visibilityOptions = [
  { label: "Marketplace live", value: "Marketplace live" },
  { label: "Review hold", value: "Review hold" },
  { label: "Draft", value: "Draft" },
];

const rulePresetOptions = [
  { label: "Same-day eligible", value: "Same-day eligible" },
  { label: "Restricted review required", value: "Restricted review required" },
  { label: "Bundle support", value: "Bundle support" },
];

export default function CategoryEditPage({ id }: { id: string }) {
  const category = getMarketplaceCategory(id);
  if (!category) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Marketplace", "Categories", category.id, "Edit"]}
        eyebrow="Marketplace Kit"
        title={`Edit ${category.name}`}
        description="Catalog taxonomy flow for marketplace product grouping and storefront governance."
        action={
          <div className="flex flex-wrap gap-3">
            <Link href="/marketplace/categories">
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
        <ShellCard title="Category information" description="Core catalog fields.">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Category name" rounded="lg" defaultValue={category.name} />
            <Input label="Category ID" rounded="lg" defaultValue={category.id} />
            <Select
              label="Group"
              options={groupOptions}
              defaultValue={groupOptions.find((option) => option.value === category.group)}
              selectClassName="rounded-2xl"
            />
            <Input label="Owner" rounded="lg" defaultValue={category.owner} />
          </div>
          <div className="mt-4">
            <Text className="mb-2 text-sm font-medium text-gray-700">Description</Text>
            <Textarea rows={5} textareaClassName="rounded-2xl" defaultValue={category.description} />
          </div>
        </ShellCard>

        <ShellCard title="Visibility" description="Category state.">
          <div className="space-y-4">
            <Select
              label="Status"
              options={statusOptions}
              defaultValue={statusOptions.find((option) => option.value === category.status)}
              selectClassName="rounded-2xl"
            />
            <Select
              label="Visibility label"
              options={visibilityOptions}
              defaultValue={visibilityOptions.find((option) => option.value === category.visibility)}
              selectClassName="rounded-2xl"
            />
            <Input label="Product count" rounded="lg" defaultValue={category.productCount} />
          </div>
        </ShellCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ShellCard title="Rules and merchandising" description="Category behavior and routing.">
          <div className="grid gap-4 md:grid-cols-2">
            <Select
              label="Rule preset"
              options={rulePresetOptions}
              defaultValue={rulePresetOptions.find((option) => option.value === category.rules[0]) ?? rulePresetOptions[0]}
              selectClassName="rounded-2xl"
            />
            <Input label="Sort priority" rounded="lg" defaultValue="10" />
            <Input label="Storefront badge" rounded="lg" defaultValue={category.rules[2] ?? ""} />
            <Input label="Review owner" rounded="lg" defaultValue={category.owner} />
          </div>
        </ShellCard>

        <ShellCard title="Summary" description="Governance and release readiness.">
          <div className="space-y-4">
            <div className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                    Category state
                  </Text>
                  <Text className="mt-2 font-semibold text-gray-900">{category.visibility}</Text>
                </div>
                <Badge variant="flat" className="rounded-2xl bg-primary/10 px-3 py-1.5 text-primary">
                  {category.group}
                </Badge>
              </div>
              <Text className="mt-2 text-sm text-gray-500">
                Categories govern how vendor products are grouped and discovered across storefront and admin workflows.
              </Text>
            </div>

            <WorkflowNote
              icon={<PiCheckCircleBold className="h-4 w-4 text-emerald-600" />}
              title="Shared taxonomy"
              detail="Vendors depend on category and subcategory options when creating products from mobile."
            />
            <WorkflowNote
              icon={<PiWarningCircleBold className="h-4 w-4 text-amber-600" />}
              title="Review hold available"
              detail="Restricted or policy-sensitive categories can stay visible only to operations until approved."
            />
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
