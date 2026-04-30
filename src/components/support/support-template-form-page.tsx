"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Button, Input, Select, Text, Textarea, Title } from "rizzui";
import { PiArrowLeftBold, PiFloppyDiskBold } from "react-icons/pi";
import PageHeader from "@/components/admin/page-header";
import { routes } from "@/config/routes";
import { getSupportTemplateById } from "@/repositories/admin/support-templates";

const channelOptions = [
  { label: "Email", value: "Email" },
  { label: "SMS", value: "SMS" },
  { label: "Push", value: "Push" },
];

const audienceOptions = [
  { label: "Customers", value: "Customers" },
  { label: "Taskers", value: "Taskers" },
  { label: "Vendors", value: "Vendors" },
  { label: "Internal Ops", value: "Internal Ops" },
];

const folderOptions = [
  { label: "Delivery recovery", value: "delivery_recovery" },
  { label: "Dispatch alerts", value: "dispatch_updates" },
  { label: "Settlement notices", value: "finance_settlements" },
  { label: "Trust and risk", value: "trust_and_risk" },
];

export default function SupportTemplateFormPage({
  mode,
  id,
}: {
  mode: "create" | "edit";
  id?: string;
}) {
  const template = mode === "edit" ? getSupportTemplateById(id ?? "") : null;
  if (mode === "edit" && !template) notFound();

  const title = mode === "create" ? "Create Template" : `Edit ${template?.name}`;
  const preview =
    template?.preview ??
    "Hello {{vendor_name}}, your settlement for {{settlement_cycle}} is ready. We will send {{payout_amount}} via {{payout_method}}.";

  return (
    <div className="@container space-y-6">
      <PageHeader
        breadcrumb={mode === "create" ? ["Home", "Support", "Templates", "Create"] : ["Home", "Support", "Templates", template!.id, "Edit"]}
        eyebrow="Support Desk"
        title={title}
        description="Draft or update reusable support messages for customers, vendors, taskers, and internal teams handling mobile workflows."
        action={
          <div className="flex flex-wrap gap-3">
            <Link href={mode === "edit" ? routes.supportDesk.templateDetails(template!.id) : routes.supportDesk.templates}>
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
              {mode === "create" ? "Create Template" : "Save Changes"}
            </Button>
          </div>
        }
      />

      <div className="mx-auto max-w-5xl rounded-[28px] border border-gray-200 bg-white p-6 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.24)] sm:p-8">
        <div className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Template Name" rounded="lg" defaultValue={template?.name ?? "Vendor payout reminder"} />
            <SelectField label="Folder" options={folderOptions} value={template?.folder ?? "finance_settlements"} />
            <Input label="Subject" rounded="lg" defaultValue={template?.subject ?? "Your payout summary is ready"} />
            <SelectField
              label="Channel"
              options={channelOptions}
              value={template?.channel ?? "Email"}
            />
            <SelectField
              label="Audience"
              options={audienceOptions}
              value={template?.audience ?? "Vendors"}
            />
            <Input label="Owner" rounded="lg" defaultValue={template?.owner ?? "Finance Ops"} />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
            <div className="space-y-3">
              <Text className="text-sm font-medium text-gray-700">Template Details</Text>
              <Textarea rows={10} textareaClassName="rounded-2xl" defaultValue={preview} />
            </div>
            <div className="space-y-4">
              <div className="rounded-[22px] border border-gray-200 bg-gray-50/70 p-4">
                <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Status</Text>
                <Badge variant="flat" className="mt-3 rounded-2xl bg-primary/10 px-3 py-1 text-primary">
                  {template?.status ?? "queued"}
                </Badge>
                <Text className="mt-3 text-xs leading-6 text-gray-500">
                  {template?.workflow.summary ?? "Message should match the exact customer, tasker, or vendor workflow staff are operating."}
                </Text>
              </div>
              <div className="rounded-[22px] border border-gray-200 bg-gray-50/70 p-4">
                <Title as="h4" className="text-base font-semibold text-gray-900">
                  Variables
                </Title>
                <div className="mt-3 space-y-2">
                  {(template?.variables ?? ["vendor_name", "settlement_cycle", "payout_amount", "payout_method"]).map((variable) => (
                    <div key={variable} className="rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700">
                      {`{{${variable}}}`}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SelectField({
  label,
  options,
  value,
}: {
  label: string;
  options: Array<{ label: string; value: string }>;
  value: string;
}) {
  return (
    <Select
      label={label}
      options={options}
      defaultValue={options.find((option) => option.value === value) ?? options[0]}
      selectClassName="rounded-2xl"
    />
  );
}
