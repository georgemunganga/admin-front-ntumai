"use client";

import Link from "next/link";
import { Badge, Button, Input, Select, Text, Textarea } from "rizzui";
import {
  PiArrowLeftBold,
  PiCheckCircleBold,
  PiFloppyDiskBold,
  PiWarningCircleBold,
} from "react-icons/pi";
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";

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
            <Button variant="outline" className="h-11 rounded-2xl px-4">
              Save Draft
            </Button>
            <Button className="h-11 rounded-2xl bg-primary px-4 text-white hover:bg-primary/90">
              <PiFloppyDiskBold className="me-1.5 h-4 w-4" />
              Create Vendor
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <ShellCard title="Partner information" description="Core marketplace and store fields.">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Vendor name" rounded="lg" defaultValue="Green Basket Market" />
            <Input label="Segment" rounded="lg" defaultValue="Fresh produce" />
            <Input label="City" rounded="lg" defaultValue="Lusaka" />
            <Input label="Store type" rounded="lg" defaultValue="Grocery" />
            <Input label="Owner" rounded="lg" defaultValue="Partner ops" />
            <Input label="Business hours" rounded="lg" defaultValue="06:00 - 20:00" />
          </div>

          <div className="mt-4">
            <Text className="mb-2 text-sm font-medium text-gray-700">Context</Text>
            <Textarea
              rows={4}
              textareaClassName="rounded-2xl"
              defaultValue="Daily produce catalog with same-day neighborhood delivery."
            />
          </div>
        </ShellCard>

        <ShellCard title="Visibility" description="Marketplace state.">
          <div className="space-y-4">
            <Select
              label="Status"
              options={statusOptions}
              defaultValue={statusOptions[0]}
              selectClassName="rounded-2xl"
            />
            <Select
              label="Visibility"
              options={visibilityOptions}
              defaultValue={visibilityOptions[0]}
              selectClassName="rounded-2xl"
            />
            <Input label="Fulfillment" rounded="lg" defaultValue="Same-day" />
          </div>
        </ShellCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ShellCard title="Finance and setup" description="Payout and subscription fields.">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Payout schedule" rounded="lg" defaultValue="Weekly" />
            <Select
              label="Payout method"
              options={payoutMethodOptions}
              defaultValue={payoutMethodOptions[0]}
              selectClassName="rounded-2xl"
            />
            <Select
              label="Subscription plan"
              options={planOptions}
              defaultValue={planOptions[1]}
              selectClassName="rounded-2xl"
            />
            <Input label="Categories" rounded="lg" defaultValue="Fresh produce, Household" />
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
