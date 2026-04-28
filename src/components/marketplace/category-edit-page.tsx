"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Button, Input, Select, Text, Textarea } from "rizzui";
import { PiArrowLeftBold, PiFloppyDiskBold } from "react-icons/pi";
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import { getMarketplaceCategory } from "@/components/marketplace/category-data";

const statusOptions = [
  { label: "Live", value: "live" },
  { label: "Stable", value: "stable" },
  { label: "Review", value: "review" },
  { label: "Monitoring", value: "monitoring" },
  { label: "Queued", value: "queued" },
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
        description="Category form preview."
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
            <Input label="Group" rounded="lg" defaultValue={category.group} />
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
            <Input label="Visibility label" rounded="lg" defaultValue={category.visibility} />
            <Input label="Product count" rounded="lg" defaultValue={category.productCount} />
          </div>
        </ShellCard>
      </div>
    </div>
  );
}
