"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Button, Input, Select, Text, Textarea, Title } from "rizzui";
import {
  PiArrowLeftBold,
  PiCheckCircleBold,
  PiDeviceMobileBold,
  PiEyeBold,
  PiFloppyDiskBold,
  PiFolderOpenBold,
  PiMapTrifoldBold,
  PiShieldCheckBold,
  PiStorefrontBold,
  PiTrashBold,
  PiWarningCircleBold,
} from "react-icons/pi";
import { useAdminActionGuard } from "@/components/auth/use-admin-action-guard";
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import { routes } from "@/config/routes";
import { getMarketplaceCategoryById } from "@/repositories/admin/categories";

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

const parentCategoryOptions = [
  { label: "Marketplace root", value: "Marketplace root" },
  { label: "Daily essentials", value: "Daily essentials" },
  { label: "Health and regulated", value: "Health and regulated" },
  { label: "Meals and prepared food", value: "Meals and prepared food" },
];

const reviewOwnerOptions = [
  { label: "Catalog ops", value: "Catalog ops" },
  { label: "Catalog QA", value: "Catalog QA" },
  { label: "Compliance ops", value: "Compliance ops" },
  { label: "Merchant success", value: "Merchant success" },
];

export default function CategoryEditPage({ id }: { id: string }) {
  const { guardAction } = useAdminActionGuard();
  const category = getMarketplaceCategoryById(id);
  if (!category) notFound();

  const isRegulated = category.group === "Regulated";
  const storefrontTone = category.visibility === "Review hold" ? "warning" : "live";
  const mobileSubtitle = isRegulated
    ? "Vendor product creation stays restricted until compliance approves the category path."
    : "Vendors can place new products into this category from mobile product creation flows.";

  return (
    <div className="space-y-6 pb-28">
      <PageHeader
        breadcrumb={["Home", "Marketplace", "Categories", category.id, "Edit"]}
        eyebrow="Marketplace Kit"
        title={`Edit ${category.name}`}
        description="Admin policy workspace for how this category behaves in vendor product creation, customer storefront discovery, and compliance review."
        badge="Category"
        action={
          <div className="flex flex-wrap gap-3">
            <Link href={routes.marketplace.categories}>
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
                  "read",
                  () => undefined,
                  "Your staff role cannot preview this category surface.",
                )
              }
            >
              <PiEyeBold className="me-1.5 h-4 w-4" />
              Preview
            </Button>
            <Button
              className="h-11 rounded-2xl bg-primary px-4 text-white hover:bg-primary/90"
              onClick={() =>
                void guardAction(
                  "write",
                  () => undefined,
                  "Your staff role cannot save category changes from this marketplace surface.",
                )
              }
            >
              <PiFloppyDiskBold className="me-1.5 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        }
      />

      <ShellCard className="overflow-hidden border-0 bg-gradient-to-br from-[#f5efe4] via-white to-[#edf7f4] shadow-[0_18px_48px_-24px_rgba(15,23,42,0.34)]">
        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.85fr]">
          <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <Text className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                  Category policy surface
                </Text>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <Title as="h2" className="text-[30px] font-semibold tracking-tight text-gray-1000">
                    {category.name}
                  </Title>
                  <Badge
                    variant="flat"
                    className="rounded-2xl bg-white/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary shadow-sm"
                  >
                    {category.group}
                  </Badge>
                </div>
                <Text className="mt-2 max-w-2xl text-sm leading-7 text-gray-600">
                  {category.description} Use this screen to control storefront placement, vendor-facing taxonomy, and review routing from one place.
                </Text>
                <Text className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">{category.workflow.summary}</Text>
              </div>
              <div className="rounded-[24px] border border-white/80 bg-white/85 px-4 py-3 shadow-sm">
                <Text className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                  Last updated
                </Text>
                <Text className="mt-2 text-sm font-semibold text-gray-1000">
                  {category.updatedAt}
                </Text>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <SignalCard
                icon={<PiStorefrontBold className="h-5 w-5" />}
                label="Storefront state"
                value={category.visibility}
                tone={storefrontTone}
              />
              <SignalCard
                icon={<PiDeviceMobileBold className="h-5 w-5" />}
                label="Vendor app impact"
                value={isRegulated ? "Restricted path" : "Open for listing"}
                tone={isRegulated ? "warning" : "live"}
              />
              <SignalCard
                icon={<PiShieldCheckBold className="h-5 w-5" />}
                label="Review owner"
                value={category.owner}
                tone="neutral"
              />
            </div>

            <div className="rounded-[28px] border border-white/80 bg-white/90 p-5 shadow-sm">
              <div className="grid gap-4 md:grid-cols-3">
                <RouteFact label="Category ID" value={category.id} icon={<PiFolderOpenBold className="h-4 w-4" />} />
                <RouteFact label="Slug" value={category.slug.toLowerCase()} icon={<PiMapTrifoldBold className="h-4 w-4" />} />
                <RouteFact label="Products attached" value={category.productCount} icon={<PiStorefrontBold className="h-4 w-4" />} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <PreviewCard
              title="Storefront preview"
              eyebrow="Customer app"
              badge={category.group}
              heading={category.name}
              detail="How this grouping will appear to customers browsing marketplace categories."
              points={[
                `Visibility: ${category.visibility}`,
                `Merchandising rule: ${category.rules[0] ?? "General listing"}`,
              ]}
            />
            <PreviewCard
              title="Vendor app impact"
              eyebrow="Mobile listing"
              badge={category.owner}
              heading="Product creation path"
              detail={mobileSubtitle}
              points={[
                `Review routing: ${category.owner}`,
                `Rule set: ${category.rules.join(" · ")}`,
              ]}
            />
          </div>
        </div>
      </ShellCard>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <ShellCard title="Core identity" description="Fields that define category naming, ownership, and customer-facing copy.">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Category name" rounded="lg" defaultValue={category.name} />
            <Input label="Display label" rounded="lg" defaultValue={category.name} />
            <Input label="Category ID" rounded="lg" defaultValue={category.id} />
            <Input label="Slug / handle" rounded="lg" defaultValue={category.slug.toLowerCase()} />
            <Select
              label="Group"
              options={groupOptions}
              defaultValue={groupOptions.find((option) => option.value === category.group)}
              selectClassName="rounded-2xl"
            />
            <Select
              label="Review owner"
              options={reviewOwnerOptions}
              defaultValue={reviewOwnerOptions.find((option) => option.value === category.owner) ?? reviewOwnerOptions[0]}
              selectClassName="rounded-2xl"
            />
          </div>
          <div className="mt-4">
            <Textarea rows={5} label="Description" textareaClassName="rounded-2xl" defaultValue={category.description} />
          </div>
        </ShellCard>

        <ShellCard title="Publishing and control" description="Storefront state, rollout posture, and governance controls.">
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
            <Input label="Last updated by" rounded="lg" defaultValue={category.owner} />
            <div className="rounded-[20px] border border-gray-200 bg-gray-50/80 p-4">
              <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                Safety controls
              </Text>
              <div className="mt-3 space-y-3">
                <ActionLine
                  title="Review hold"
                  detail="Keep category visible only to operations until mobile and storefront checks are approved."
                  icon={<PiWarningCircleBold className="h-4 w-4 text-amber-600" />}
                />
                <ActionLine
                  title="Archive path"
                  detail="Hide this category from future vendor product creation without deleting current catalog history."
                  icon={<PiTrashBold className="h-4 w-4 text-red-dark" />}
                />
              </div>
            </div>
          </div>
        </ShellCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ShellCard title="Hierarchy and merchandising" description="How the category sits inside the marketplace tree and ordering logic.">
          <div className="grid gap-4 md:grid-cols-2">
            <Select
              label="Parent category"
              options={parentCategoryOptions}
              defaultValue={parentCategoryOptions.find((option) => option.value === getParentCategory(category.group)) ?? parentCategoryOptions[0]}
              selectClassName="rounded-2xl"
            />
            <Input label="Subcategory count" rounded="lg" defaultValue={String(getSubcategoryCount(category.group))} />
            <Input label="Sort priority" rounded="lg" defaultValue={String(getSortPriority(category.status))} />
            <Input label="Storefront badge" rounded="lg" defaultValue={category.rules[2] ?? "Marketplace badge"} />
            <Input label="Mobile list label" rounded="lg" defaultValue={category.name} />
            <Input label="Search synonym set" rounded="lg" defaultValue={getSearchSynonyms(category.name)} />
          </div>
          <div className="mt-4">
            <Select
              label="Rule preset"
              options={rulePresetOptions}
              defaultValue={rulePresetOptions.find((option) => option.value === category.rules[0]) ?? rulePresetOptions[0]}
              selectClassName="rounded-2xl"
            />
          </div>
        </ShellCard>

        <ShellCard title="Operational readiness" description="What this category changes across storefront, vendor app, and review flows.">
          <div className="space-y-4">
            <WorkflowNote
              icon={<PiCheckCircleBold className="h-4 w-4 text-emerald-600" />}
              title="Vendor product creation"
              detail="Vendors depend on category and subcategory choices from mobile when publishing new products."
            />
            <WorkflowNote
              icon={<PiStorefrontBold className="h-4 w-4 text-primary" />}
              title="Storefront discovery"
              detail="This category affects grouping, badges, and browse order inside the customer marketplace."
            />
            <WorkflowNote
              icon={<PiWarningCircleBold className="h-4 w-4 text-amber-600" />}
              title="Review hold available"
              detail="Policy-sensitive categories can remain restricted to operations until content and compliance review are complete."
            />
          </div>
        </ShellCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <ShellCard title="Audit and release history" description="Recent release context and admin accountability.">
          <div className="space-y-3">
            <AuditRow label="Created by" value="Catalog ops" />
            <AuditRow label="Last published" value={category.updatedAt} />
            <AuditRow label="Linked surfaces" value="Storefront, vendor app, search" />
            <AuditRow label="Release lane" value={isRegulated ? "Compliance signoff" : "Standard catalog release"} />
          </div>
        </ShellCard>

        <ShellCard title="Category policy notes" description="Notes your team should keep in view while editing this category.">
          <div className="space-y-3">
            <NoteTile
              title="Taxonomy consistency"
              detail="Keep vendor-facing naming and customer-facing naming aligned unless there is a clear policy or discovery reason to separate them."
            />
            <NoteTile
              title="Mobile app dependency"
              detail="A category change here can immediately affect what vendors can select when creating products on mobile."
            />
            <NoteTile
              title="Review ownership"
              detail={`Current routing points to ${category.owner}. If the category is policy-sensitive, keep the review owner explicit before publishing.`}
            />
          </div>
        </ShellCard>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 xl:px-10">
          <div>
            <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
              Edit session
            </Text>
            <Text className="mt-1 text-sm text-gray-600">
              Review storefront, vendor, and policy impact before saving this category update.
            </Text>
          </div>
          <div className="flex flex-wrap gap-3">
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
              variant="outline"
              className="h-11 rounded-2xl px-4 text-red-dark"
              onClick={() =>
                void guardAction(
                  "delete",
                  () => undefined,
                  "Your staff role cannot archive marketplace categories.",
                )
              }
            >
              Archive
            </Button>
            <Button
              className="h-11 rounded-2xl bg-primary px-5 text-white hover:bg-primary/90"
              onClick={() =>
                void guardAction(
                  "write",
                  () => undefined,
                  "Your staff role cannot save category changes from this marketplace surface.",
                )
              }
            >
              <PiFloppyDiskBold className="me-1.5 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SignalCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "live" | "warning" | "neutral";
}) {
  const toneClass = {
    live: "bg-[#ebf7f0] text-[#136a4b]",
    warning: "bg-[#fff4db] text-[#8b5e00]",
    neutral: "bg-[#e9f3ff] text-[#1257a6]",
  };

  return (
    <div className="rounded-[24px] border border-white/80 bg-white/85 p-4 shadow-sm">
      <div className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${toneClass[tone]}`}>
        {icon}
      </div>
      <Text className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">
        {label}
      </Text>
      <Title as="h3" className="mt-1 text-base font-semibold text-gray-1000">
        {value}
      </Title>
    </div>
  );
}

function RouteFact({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-[22px] border border-gray-100 bg-[#fbfbf8] p-4">
      <div className="flex items-center gap-2 text-gray-500">
        {icon}
        <Text className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
          {label}
        </Text>
      </div>
      <Text className="mt-2 font-semibold text-gray-1000">{value}</Text>
    </div>
  );
}

function PreviewCard({
  title,
  eyebrow,
  badge,
  heading,
  detail,
  points,
}: {
  title: string;
  eyebrow: string;
  badge: string;
  heading: string;
  detail: string;
  points: string[];
}) {
  return (
    <div className="rounded-[28px] border border-white/80 bg-white/90 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Text className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
            {eyebrow}
          </Text>
          <Title as="h3" className="mt-1 text-base font-semibold text-gray-1000">
            {title}
          </Title>
        </div>
        <Badge variant="flat" className="rounded-2xl bg-primary/10 px-3 py-1.5 text-primary">
          {badge}
        </Badge>
      </div>
      <div className="mt-4 rounded-[24px] border border-gray-100 bg-[#fbfbf8] p-4">
        <Text className="font-semibold text-gray-1000">{heading}</Text>
        <Text className="mt-2 text-sm leading-6 text-gray-500">{detail}</Text>
        <div className="mt-4 space-y-2">
          {points.map((point) => (
            <div key={point} className="rounded-2xl bg-white px-3 py-2 text-sm text-gray-600">
              {point}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ActionLine({
  title,
  detail,
  icon,
}: {
  title: string;
  detail: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-[18px] border border-white bg-white px-4 py-3">
      <div className="mt-0.5">{icon}</div>
      <div>
        <Text className="font-semibold text-gray-900">{title}</Text>
        <Text className="mt-1 text-sm leading-6 text-gray-500">{detail}</Text>
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

function AuditRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[20px] border border-gray-100 bg-gray-50/70 px-4 py-3">
      <Text className="text-sm text-gray-500">{label}</Text>
      <Text className="text-right text-sm font-semibold text-gray-1000">{value}</Text>
    </div>
  );
}

function NoteTile({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
      <Text className="font-semibold text-gray-900">{title}</Text>
      <Text className="mt-1 text-sm leading-6 text-gray-500">{detail}</Text>
    </div>
  );
}

function getParentCategory(group: string) {
  const map: Record<string, string> = {
    Grocery: "Daily essentials",
    Essentials: "Daily essentials",
    Regulated: "Health and regulated",
    Food: "Meals and prepared food",
  };
  return map[group] ?? "Marketplace root";
}

function getSubcategoryCount(group: string) {
  const map: Record<string, number> = {
    Grocery: 9,
    Essentials: 7,
    Regulated: 5,
    Food: 6,
  };
  return map[group] ?? 4;
}

function getSortPriority(status: string) {
  const map: Record<string, number> = {
    live: 10,
    stable: 14,
    review: 22,
    monitoring: 18,
    queued: 30,
  };
  return map[status] ?? 20;
}

function getSearchSynonyms(name: string) {
  const map: Record<string, string> = {
    "Fresh produce": "fruit, vegetables, market fresh",
    Household: "cleaning, home care, essentials",
    Pharmacy: "health, medicine, wellness",
    "Quick meals": "prepared food, lunch, dinner",
  };
  return map[name] ?? name.toLowerCase();
}
