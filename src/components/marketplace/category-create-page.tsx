"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge, Button, Input, Select, Text, Textarea } from "rizzui";
import {
  PiArrowLeftBold,
  PiCheckCircleBold,
  PiFloppyDiskBold,
  PiWarningCircleBold,
} from "react-icons/pi";
import { useAdminActionGuard } from "@/components/auth/use-admin-action-guard";
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import { routes } from "@/config/routes";
import { createAdminCategory } from "@/repositories/admin/categories";

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

export default function CategoryCreatePage() {
  const router = useRouter();
  const { guardAction } = useAdminActionGuard();
  const [form, setForm] = useState({
    name: "Fresh produce",
    group: groupOptions[0].value,
    status: statusOptions[0].value,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  async function handleSave() {
    setIsSaving(true);
    setFeedback(null);
    try {
      const result = await createAdminCategory({
        name: form.name.trim(),
        iconKey: form.group.toLowerCase().replace(/\s+/g, "_"),
        isActive: form.status !== "queued" && form.status !== "review",
      });
      setFeedback({ type: "success", message: "Category created successfully." });
      router.push(routes.marketplace.editCategory(result?.item?.id ?? ""));
      router.refresh();
    } catch (error) {
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to create category.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Marketplace", "Categories", "Create"]}
        eyebrow="Marketplace Kit"
        title="Create Category"
        description="Catalog taxonomy flow for marketplace product grouping and storefront governance."
        action={
          <div className="flex flex-wrap gap-3">
            <Link href="/marketplace/categories">
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
                  "Your staff role cannot save category drafts from this marketplace surface.",
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
                  "Your staff role cannot create marketplace categories.",
                )
              }
            >
              <PiFloppyDiskBold className="me-1.5 h-4 w-4" />
              Create Category
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

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <ShellCard title="Category information" description="Core catalog fields.">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Category name" rounded="lg" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
            <Input label="Category ID" rounded="lg" defaultValue="CAT-1105" />
            <Select
              label="Group"
              options={groupOptions}
              defaultValue={groupOptions[0]}
              onChange={(option: any) => setForm((current) => ({ ...current, group: option?.value ?? groupOptions[0].value }))}
              selectClassName="rounded-2xl"
            />
            <Input label="Owner" rounded="lg" defaultValue="Catalog ops" />
          </div>
          <div className="mt-4">
            <Text className="mb-2 text-sm font-medium text-gray-700">Description</Text>
            <Textarea
              rows={5}
              textareaClassName="rounded-2xl"
              defaultValue="High-frequency produce category for fruit, vegetables, and same-day grocery stock."
            />
          </div>
        </ShellCard>

        <ShellCard title="Visibility" description="Category state.">
          <div className="space-y-4">
            <Select
              label="Status"
              options={statusOptions}
              defaultValue={statusOptions[0]}
              onChange={(option: any) => setForm((current) => ({ ...current, status: option?.value ?? statusOptions[0].value }))}
              selectClassName="rounded-2xl"
            />
            <Select
              label="Visibility label"
              options={visibilityOptions}
              defaultValue={visibilityOptions[0]}
              selectClassName="rounded-2xl"
            />
            <Input label="Product count" rounded="lg" defaultValue="0 products" />
          </div>
        </ShellCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ShellCard title="Rules and merchandising" description="Category behavior and routing.">
          <div className="grid gap-4 md:grid-cols-2">
            <Select
              label="Rule preset"
              options={rulePresetOptions}
              defaultValue={rulePresetOptions[0]}
              selectClassName="rounded-2xl"
            />
            <Input label="Sort priority" rounded="lg" defaultValue="10" />
            <Input label="Storefront badge" rounded="lg" defaultValue="Freshness badge" />
            <Input label="Review owner" rounded="lg" defaultValue="Catalog QA" />
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
                  <Text className="mt-2 font-semibold text-gray-900">Ready for storefront grouping</Text>
                </div>
                <Badge variant="flat" className="rounded-2xl bg-primary/10 px-3 py-1.5 text-primary">
                  Grocery
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
