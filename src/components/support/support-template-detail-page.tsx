"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Button, Text, Title } from "rizzui";
import { PiArrowLeftBold, PiNotePencilBold } from "react-icons/pi";
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import { routes } from "@/config/routes";
import { getSupportTemplate } from "@/components/support/template-data";

export default function SupportTemplateDetailPage({ id }: { id: string }) {
  const template = getSupportTemplate(id);
  if (!template) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Support", "Templates", template.id]}
        eyebrow="Support Desk"
        title={template.name}
        description={template.preview}
        action={
          <div className="flex flex-wrap gap-3">
            <Link href={routes.supportDesk.templates}>
              <Button variant="outline" className="h-11 rounded-2xl px-4">
                <PiArrowLeftBold className="me-1.5 h-4 w-4" />
                Back
              </Button>
            </Link>
            <Link href={routes.supportDesk.editTemplate(template.id)}>
              <Button className="h-11 rounded-2xl bg-primary px-4 text-white hover:bg-primary/90">
                <PiNotePencilBold className="me-1.5 h-4 w-4" />
                Edit Template
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <ShellCard title="Message preview" description="Current template content direction.">
          <div className="rounded-[22px] border border-gray-100 bg-gray-50/70 p-5">
            <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
              Subject
            </Text>
            <Title as="h3" className="mt-2 text-lg font-semibold text-gray-900">
              {template.subject}
            </Title>
            <Text className="mt-4 text-sm leading-7 text-gray-600">
              {template.preview}
            </Text>
          </div>
        </ShellCard>

        <ShellCard title="Metadata" description="Ownership and targeting.">
          <div className="space-y-4">
            <MetaRow label="Channel" value={template.channel} />
            <MetaRow label="Audience" value={template.audience} />
            <MetaRow label="Owner" value={template.owner} />
            <MetaRow label="Updated" value={template.updatedAt} />
            <div className="rounded-[22px] border border-gray-100 bg-gray-50/70 p-4">
              <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                Status
              </Text>
              <Badge variant="flat" className="mt-3 rounded-2xl bg-primary/10 px-3 py-1 text-primary">
                {template.status}
              </Badge>
            </div>
          </div>
        </ShellCard>
      </div>

      <ShellCard title="Variables" description="Template placeholders expected from the backend.">
        <div className="flex flex-wrap gap-2">
          {template.variables.map((variable) => (
            <Badge key={variable} variant="flat" className="rounded-2xl bg-secondary/20 px-3 py-1 text-secondary-foreground">
              {`{{${variable}}}`}
            </Badge>
          ))}
        </div>
      </ShellCard>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-gray-100 bg-gray-50/70 p-4">
      <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">{label}</Text>
      <Title as="h4" className="mt-2 text-base font-semibold text-gray-900">
        {value}
      </Title>
    </div>
  );
}
