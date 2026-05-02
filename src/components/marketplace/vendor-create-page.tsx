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
import { createAdminVendor } from "@/repositories/admin/vendors";

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

export default function VendorCreatePage() {
  const router = useRouter();
  const { guardAction } = useAdminActionGuard();
  const [form, setForm] = useState({
    name: "Green Basket Market",
    segment: "Fresh produce",
    city: "Lusaka",
    storeType: "Grocery",
    businessHours: "06:00 - 20:00",
    context: "Daily produce catalog with same-day neighborhood delivery.",
    status: "live",
    visibility: "Marketplace live",
    fulfillment: "Same-day",
    payoutSchedule: "Weekly",
    payoutMethod: "Mobile money",
    subscriptionPlan: "Growth plan",
    categories: "Fresh produce, Household",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  async function handleSave() {
    setIsSaving(true);
    setFeedback(null);
    try {
      const result = await createAdminVendor({
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
      setFeedback({ type: "success", message: "Vendor created successfully." });
      const nextId = result?.item?.id;
      if (nextId) {
        router.push(routes.marketplace.vendorDetails(nextId));
        router.refresh();
      }
    } catch (error) {
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to create vendor.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Marketplace", "Vendors", "Create"]}
        eyebrow="Marketplace Kit"
        title="Create Vendor"
        description="Partner form aligned to onboarding, store readiness, and payout setup."
        action={
          <div className="flex flex-wrap gap-3">
            <Link href="/marketplace/vendors">
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
                  "Your staff role cannot create marketplace vendors.",
                )
              }
            >
              <PiFloppyDiskBold className="me-1.5 h-4 w-4" />
              Create Vendor
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
        <ShellCard title="Partner information" description="Core marketplace and store fields.">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Vendor name" rounded="lg" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
            <Input label="Segment" rounded="lg" value={form.segment} onChange={(event) => setForm((current) => ({ ...current, segment: event.target.value }))} />
            <Input label="City" rounded="lg" value={form.city} onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))} />
            <Input label="Store type" rounded="lg" value={form.storeType} onChange={(event) => setForm((current) => ({ ...current, storeType: event.target.value }))} />
            <Input label="Owner" rounded="lg" defaultValue="Partner ops" />
            <Input label="Business hours" rounded="lg" value={form.businessHours} onChange={(event) => setForm((current) => ({ ...current, businessHours: event.target.value }))} />
          </div>

          <div className="mt-4">
            <Text className="mb-2 text-sm font-medium text-gray-700">Context</Text>
            <Textarea
              rows={4}
              textareaClassName="rounded-2xl"
              value={form.context}
              onChange={(event) => setForm((current) => ({ ...current, context: event.target.value }))}
            />
          </div>
        </ShellCard>

        <ShellCard title="Visibility" description="Marketplace state.">
          <div className="space-y-4">
            <Select
              label="Status"
              options={statusOptions}
              defaultValue={statusOptions[0]}
              onChange={(option: any) => setForm((current) => ({ ...current, status: option?.value ?? current.status }))}
              selectClassName="rounded-2xl"
            />
            <Select
              label="Visibility"
              options={visibilityOptions}
              defaultValue={visibilityOptions[0]}
              onChange={(option: any) => setForm((current) => ({ ...current, visibility: option?.value ?? current.visibility }))}
              selectClassName="rounded-2xl"
            />
            <Input label="Fulfillment" rounded="lg" value={form.fulfillment} onChange={(event) => setForm((current) => ({ ...current, fulfillment: event.target.value }))} />
          </div>
        </ShellCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ShellCard title="Finance and setup" description="Payout and subscription fields.">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Payout schedule" rounded="lg" value={form.payoutSchedule} onChange={(event) => setForm((current) => ({ ...current, payoutSchedule: event.target.value }))} />
            <Select
              label="Payout method"
              options={payoutMethodOptions}
              defaultValue={payoutMethodOptions[0]}
              onChange={(option: any) => setForm((current) => ({ ...current, payoutMethod: option?.value ?? current.payoutMethod }))}
              selectClassName="rounded-2xl"
            />
            <Select
              label="Subscription plan"
              options={planOptions}
              defaultValue={planOptions[1]}
              onChange={(option: any) => setForm((current) => ({ ...current, subscriptionPlan: option?.value ?? current.subscriptionPlan }))}
              selectClassName="rounded-2xl"
            />
            <Input label="Categories" rounded="lg" value={form.categories} onChange={(event) => setForm((current) => ({ ...current, categories: event.target.value }))} />
          </div>
        </ShellCard>

        <ShellCard title="Summary" description="Store readiness and compliance.">
          <div className="space-y-4">
            <div className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                    Store readiness
                  </Text>
                  <Text className="mt-2 font-semibold text-gray-900">Ready for onboarding review</Text>
                </div>
                <Badge variant="flat" className="rounded-2xl bg-primary/10 px-3 py-1.5 text-primary">
                  Grocery
                </Badge>
              </div>
              <Text className="mt-2 text-sm text-gray-500">
                Vendor onboarding depends on category selection, payout method setup, and store profile readiness before catalog actions open fully.
              </Text>
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
