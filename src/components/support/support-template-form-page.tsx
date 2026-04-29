"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Button, Input, Select, Text, Textarea } from "rizzui";
import { PiArrowLeftBold, PiFloppyDiskBold } from "react-icons/pi";
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import { routes } from "@/config/routes";
import { getSupportTemplate } from "@/components/support/template-data";

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

export default function SupportTemplateFormPage({
  mode,
  id,
}: {
  mode: "create" | "edit";
  id?: string;
}) {
  const template = mode === "edit" ? getSupportTemplate(id ?? "") : null;
  if (mode === "edit" && !template) notFound();

  const title = mode === "create" ? "Create Template" : `Edit ${template?.name}`;
  const breadcrumb = mode === "create"
    ? ["Home", "Support", "Templates", "Create"]
    : ["Home", "Support", "Templates", template!.id, "Edit"];

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={breadcrumb}
        eyebrow="Support Desk"
        title={title}
        description="Manage reusable comms templates for customers, taskers, vendors, and internal operators."
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

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <ShellCard title="Template details" description="Core template identity and message body.">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Template name" defaultValue={template?.name ?? "Vendor payout reminder"} rounded="lg" />
            <Input label="Subject" defaultValue={template?.subject ?? "Your payout summary is ready"} rounded="lg" />
            <Select
              label="Channel"
              options={channelOptions}
              defaultValue={channelOptions.find((option) => option.value === template?.channel) ?? channelOptions[0]}
              selectClassName="rounded-2xl"
            />
            <Select
              label="Audience"
              options={audienceOptions}
              defaultValue={audienceOptions.find((option) => option.value === template?.audience) ?? audienceOptions[2]}
              selectClassName="rounded-2xl"
            />
          </div>

          <div className="mt-4">
            <Text className="mb-2 text-sm font-medium text-gray-700">Template preview</Text>
            <Textarea
              rows={6}
              textareaClassName="rounded-2xl"
              defaultValue={
                template?.preview ??
                "Hello {{vendor_name}}, your settlement for {{settlement_cycle}} is ready. We will send {{payout_amount}} via {{payout_method}}."
              }
            />
          </div>
        </ShellCard>

        <ShellCard title="Variables" description="Expected placeholders from backend events.">
          <div className="space-y-3 rounded-[22px] border border-gray-100 bg-gray-50/70 p-4">
            {(template?.variables ?? ["vendor_name", "settlement_cycle", "payout_amount", "payout_method"]).map((variable) => (
              <div key={variable} className="rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700">
                {`{{${variable}}}`}
              </div>
            ))}
          </div>
        </ShellCard>
      </div>
    </div>
  );
}
