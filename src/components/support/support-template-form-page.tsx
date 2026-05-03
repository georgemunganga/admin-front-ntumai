"use client";

import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge, Button, Input, Select, Text, Textarea, Title } from "rizzui";
import { PiArrowLeftBold, PiFloppyDiskBold } from "react-icons/pi";
import { useAdminActionGuard } from "@/components/auth/use-admin-action-guard";
import PageHeader from "@/components/admin/page-header";
import { routes } from "@/config/routes";
import {
  createAdminSupportTemplate,
  getSupportTemplateById,
  type SupportTemplateFolder,
  updateAdminSupportTemplate,
  useAdminSupportTemplateDetail,
} from "@/repositories/admin/support-templates";

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
  const router = useRouter();
  const { guardAction } = useAdminActionGuard();
  const fallback = mode === "edit" ? getSupportTemplateById(id ?? "") ?? null : null;
  const { data: liveTemplate, isLoading, error } = useAdminSupportTemplateDetail(
    mode === "edit" ? (id ?? "") : "",
  );
  const template = mode === "edit" ? liveTemplate ?? fallback : null;
  if (mode === "edit" && !template && !isLoading) notFound();
  if (mode === "edit" && !template) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500">
        Loading template...
      </div>
    );
  }

  const title = mode === "create" ? "Create Template" : `Edit ${template?.name}`;
  const [form, setForm] = useState({
    name: template?.name ?? "Vendor payout reminder",
    folder: template?.folder ?? "finance_settlements",
    subject: template?.subject ?? "Your payout summary is ready",
    channel: template?.channel ?? "Email",
    audience: template?.audience ?? "Vendors",
    owner: template?.owner ?? "Finance Ops",
    preview:
      template?.preview ??
      "Hello {{vendor_name}}, your settlement for {{settlement_cycle}} is ready. We will send {{payout_amount}} via {{payout_method}}.",
    status: template?.status ?? "queued",
    variables: (template?.variables ?? [
      "vendor_name",
      "settlement_cycle",
      "payout_amount",
      "payout_method",
    ]).join(", "),
  });
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!template) return;
    setForm({
      name: template.name,
      folder: template.folder,
      subject: template.subject,
      channel: template.channel,
      audience: template.audience,
      owner: template.owner,
      preview: template.preview,
      status: template.status,
      variables: template.variables.join(", "),
    });
  }, [template]);

  async function handleSave() {
    setIsSaving(true);
    setFeedback(null);
    try {
      const payload = {
        name: form.name.trim(),
        folder: form.folder as
          | "delivery_recovery"
          | "dispatch_updates"
          | "finance_settlements"
          | "trust_and_risk",
        subject: form.subject.trim(),
        channel: form.channel as "Email" | "SMS" | "Push",
        audience: form.audience.trim(),
        owner: form.owner.trim(),
        preview: form.preview.trim(),
        status: form.status as "live" | "review" | "queued",
        variables: form.variables
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      const result =
        mode === "create"
          ? await createAdminSupportTemplate(payload)
          : await updateAdminSupportTemplate(template!.id, payload);

      const nextId = result?.item?.id ?? template?.id;
      setFeedback({
        type: "success",
        message:
          mode === "create"
            ? "Support template created successfully."
            : "Support template updated successfully.",
      });
      if (nextId) {
        router.push(routes.supportDesk.templateDetails(nextId));
        router.refresh();
      }
    } catch (saveError) {
      setFeedback({
        type: "error",
        message:
          saveError instanceof Error
            ? saveError.message
            : "Failed to save support template.",
      });
    } finally {
      setIsSaving(false);
    }
  }

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
            <Button
              variant="outline"
              className="h-11 rounded-2xl px-4"
              onClick={() =>
                void guardAction(
                  "write",
                  () => undefined,
                  "Your staff role cannot save support template drafts.",
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
                  "Your staff role cannot create or update support templates.",
                )
              }
            >
              <PiFloppyDiskBold className="me-1.5 h-4 w-4" />
              {mode === "create" ? "Create Template" : "Save Changes"}
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

      <div className="mx-auto max-w-5xl rounded-[28px] border border-gray-200 bg-white p-6 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.24)] sm:p-8">
        <div className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Template Name" rounded="lg" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
            <SelectField
              label="Folder"
              options={folderOptions}
              value={form.folder}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  folder: value as SupportTemplateFolder,
                }))
              }
            />
            <Input label="Subject" rounded="lg" value={form.subject} onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))} />
            <SelectField
              label="Channel"
              options={channelOptions}
              value={form.channel}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  channel: value as "Email" | "SMS" | "Push",
                }))
              }
            />
            <SelectField
              label="Audience"
              options={audienceOptions}
              value={form.audience}
              onChange={(value) => setForm((current) => ({ ...current, audience: value }))}
            />
            <Input label="Owner" rounded="lg" value={form.owner} onChange={(event) => setForm((current) => ({ ...current, owner: event.target.value }))} />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
            <div className="space-y-3">
              <Text className="text-sm font-medium text-gray-700">Template Details</Text>
              <Textarea rows={10} textareaClassName="rounded-2xl" value={form.preview} onChange={(event) => setForm((current) => ({ ...current, preview: event.target.value }))} />
            </div>
            <div className="space-y-4">
              <div className="rounded-[22px] border border-gray-200 bg-gray-50/70 p-4">
                <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Status</Text>
                <Badge variant="flat" className="mt-3 rounded-2xl bg-primary/10 px-3 py-1 text-primary">
                  {form.status}
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
                  <Textarea
                    rows={6}
                    textareaClassName="rounded-2xl"
                    value={form.variables}
                    onChange={(event) => setForm((current) => ({ ...current, variables: event.target.value }))}
                  />
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
