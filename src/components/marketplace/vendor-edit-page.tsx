"use client";

import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import {
  getMarketplaceVendorBySlug,
  updateAdminVendor,
  useAdminVendorDetail,
} from "@/repositories/admin/vendors";

const statusOptions = [
  { label: "Live", value: "live" },
  { label: "Stable", value: "stable" },
  { label: "Review", value: "review" },
  { label: "Monitoring", value: "monitoring" },
  { label: "Queued", value: "queued" },
  { label: "At risk", value: "at_risk" },
];

const visibilityOptions = [
  { label: "Marketplace live", value: "Marketplace live" },
  { label: "Review hold", value: "Review hold" },
  { label: "Draft", value: "Draft" },
];

const payoutMethodOptions = [
  { label: "Mobile money", value: "Mobile money" },
  { label: "Bank", value: "Bank" },
];

const planOptions = [
  { label: "Starter plan", value: "Starter plan" },
  { label: "Growth plan", value: "Growth plan" },
  { label: "Scale plan", value: "Scale plan" },
];

export default function VendorEditPage({ slug }: { slug: string }) {
  const router = useRouter();
  const { guardAction } = useAdminActionGuard();
  const fallback = getMarketplaceVendorBySlug(slug);
  const { data: liveVendor, isLoading, error } = useAdminVendorDetail(slug);
  const vendor = liveVendor ?? fallback;
  const [form, setForm] = useState({
    name: fallback?.name ?? "",
    segment: fallback?.segment ?? "",
    city: fallback?.city ?? "",
    storeType: fallback?.storeType ?? "",
    businessHours: fallback?.businessHours ?? "",
    context: fallback?.context ?? "",
    status: fallback?.status ?? "live",
    visibility: fallback?.visibility ?? "Marketplace live",
    fulfillment: fallback?.fulfillment ?? "Same-day",
    payoutSchedule: fallback?.payoutSchedule ?? "Weekly",
    payoutMethod: fallback?.payoutMethod ?? "Mobile money",
    subscriptionPlan: fallback?.subscriptionPlan ?? "Growth plan",
    categories: fallback?.categories.join(", ") ?? "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (!vendor) return;
    setForm({
      name: vendor.name,
      segment: vendor.segment,
      city: vendor.city,
      storeType: vendor.storeType,
      businessHours: vendor.businessHours,
      context: vendor.context,
      status: vendor.status,
      visibility: vendor.visibility,
      fulfillment: vendor.fulfillment,
      payoutSchedule: vendor.payoutSchedule,
      payoutMethod: vendor.payoutMethod,
      subscriptionPlan: vendor.subscriptionPlan,
      categories: vendor.categories.join(", "),
    });
  }, [vendor]);

  if (!vendor && !isLoading) notFound();
  if (!vendor) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500">
        Loading vendor...
      </div>
    );
  }

  async function handleSave() {
    setIsSaving(true);
    setFeedback(null);
    try {
      await updateAdminVendor(vendor.id, {
        name: form.name.trim(),
        segment: form.segment.trim(),
        city: form.city.trim(),
        storeType: form.storeType.trim(),
        businessHours: form.businessHours.trim(),
        context: form.context.trim(),
        fulfillment: form.fulfillment,
        payoutSchedule: form.payoutSchedule,
        payoutMethod: form.payoutMethod,
        subscriptionPlan: form.subscriptionPlan,
        visibility: form.visibility,
        storeName: form.name.trim(),
        storeActive: form.visibility !== "Review hold" && form.status !== "review",
        categories: form.categories.split(",").map((item) => item.trim()).filter(Boolean),
      });
      setFeedback({ type: "success", message: "Vendor updated successfully." });
      router.refresh();
    } catch (saveError) {
      setFeedback({
        type: "error",
        message: saveError instanceof Error ? saveError.message : "Failed to update vendor.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Marketplace", "Vendors", vendor.id, "Edit"]}
        eyebrow="Marketplace Kit"
        title={`Edit ${vendor.name}`}
        description="Partner form aligned to onboarding, store readiness, and payout setup."
        action={
          <div className="flex flex-wrap gap-3">
            <Link href={routes.marketplace.vendorDetails(vendor.slug)}>
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
                  "Your staff role cannot save vendor drafts from this marketplace surface.",
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
                  "Your staff role cannot update marketplace vendors.",
                )
              }
            >
              <PiFloppyDiskBold className="me-1.5 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        }
      />

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}
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
        <ShellCard title="Partner information" description="Core marketplace and store fields.">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Vendor name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} rounded="lg" />
            <Input label="Segment" value={form.segment} onChange={(event) => setForm((current) => ({ ...current, segment: event.target.value }))} rounded="lg" />
            <Input label="City" value={form.city} onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))} rounded="lg" />
            <Input label="Store type" value={form.storeType} onChange={(event) => setForm((current) => ({ ...current, storeType: event.target.value }))} rounded="lg" />
            <Input label="Owner" defaultValue={vendor.owner} rounded="lg" />
            <Input label="Business hours" value={form.businessHours} onChange={(event) => setForm((current) => ({ ...current, businessHours: event.target.value }))} rounded="lg" />
          </div>

          <div className="mt-4">
            <Text className="mb-2 text-sm font-medium text-gray-700">Context</Text>
            <Textarea value={form.context} onChange={(event) => setForm((current) => ({ ...current, context: event.target.value }))} rows={4} textareaClassName="rounded-2xl" />
          </div>
        </ShellCard>

        <ShellCard title="Visibility" description="Marketplace state.">
          <div className="space-y-4">
            <Select
              label="Status"
              options={statusOptions}
              defaultValue={statusOptions.find((option) => option.value === form.status)}
              onChange={(option: any) => setForm((current) => ({ ...current, status: option?.value ?? current.status }))}
              selectClassName="rounded-2xl"
            />
            <Select
              label="Visibility"
              options={visibilityOptions}
              defaultValue={visibilityOptions.find((option) => option.value === form.visibility)}
              onChange={(option: any) => setForm((current) => ({ ...current, visibility: option?.value ?? current.visibility }))}
              selectClassName="rounded-2xl"
            />
            <Input label="Fulfillment" value={form.fulfillment} onChange={(event) => setForm((current) => ({ ...current, fulfillment: event.target.value }))} rounded="lg" />
          </div>
        </ShellCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ShellCard title="Finance and setup" description="Payout and subscription fields.">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Payout schedule" value={form.payoutSchedule} onChange={(event) => setForm((current) => ({ ...current, payoutSchedule: event.target.value }))} rounded="lg" />
            <Select
              label="Payout method"
              options={payoutMethodOptions}
              defaultValue={payoutMethodOptions.find((option) => option.value === form.payoutMethod)}
              onChange={(option: any) => setForm((current) => ({ ...current, payoutMethod: option?.value ?? current.payoutMethod }))}
              selectClassName="rounded-2xl"
            />
            <Select
              label="Subscription plan"
              options={planOptions}
              defaultValue={planOptions.find((option) => option.value === form.subscriptionPlan)}
              onChange={(option: any) => setForm((current) => ({ ...current, subscriptionPlan: option?.value ?? current.subscriptionPlan }))}
              selectClassName="rounded-2xl"
            />
            <Input label="Categories" value={form.categories} onChange={(event) => setForm((current) => ({ ...current, categories: event.target.value }))} rounded="lg" />
          </div>
        </ShellCard>

        <ShellCard title="Review notes" description="Internal marketplace trail.">
          <div className="space-y-4">
            <div className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                    Store readiness
                  </Text>
                  <Text className="mt-2 font-semibold text-gray-900">{vendor.visibility}</Text>
                </div>
                <Badge variant="flat" className="rounded-2xl bg-primary/10 px-3 py-1.5 text-primary">
                  {vendor.storeType}
                </Badge>
              </div>
            </div>
            <WorkflowNote
              icon={<PiCheckCircleBold className="h-4 w-4 text-emerald-600" />}
              title="Categories selected"
              detail="Vendor onboarding requires at least one category before store setup is complete."
            />
            <WorkflowNote
              icon={<PiWarningCircleBold className="h-4 w-4 text-amber-600" />}
              title="Payout setup required"
              detail="Payout method and subscription state should be visible before vendor finance actions begin."
            />
            {vendor.timeline.map((item) => (
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
