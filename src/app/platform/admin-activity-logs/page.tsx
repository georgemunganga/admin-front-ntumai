"use client";

import { Badge, Text, Title } from "rizzui";
import DataTable from "@/components/admin/data-table";
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import StatusBadge from "@/components/admin/status-badge";

const insights = [
  { label: "Logged actions today", value: "1,284", detail: "Tracked admin events across the ERP." },
  { label: "Sensitive actions", value: "39", detail: "Permission edits, payouts, and restrictions." },
  { label: "Audit exceptions", value: "4", detail: "Activity trails needing follow-up." },
];

const queue = [
  { title: "Manual payout override", meta: "Treasury action needs secondary approval confirmation.", status: "review" },
  { title: "Restriction history gap", meta: "Abuse-related action needs more context in the log.", status: "monitoring" },
  { title: "Bulk role change import", meta: "Bulk access-change set queued for signoff.", status: "queued" },
];

const rows = [
  {
    primary: "Finance-sensitive actions",
    secondary: "Manual payment, payout, and refund interventions captured for treasury review.",
    tertiary: "Finance governance",
    status: "stable",
  },
  {
    primary: "Trust and restriction logs",
    secondary: "Account blocks, appeals, and safety-related overrides requiring strong traceability.",
    tertiary: "Risk audit",
    status: "review",
  },
  {
    primary: "Role and permission changes",
    secondary: "Administrative access edits tracked for security and compliance oversight.",
    tertiary: "IAM control",
    status: "monitoring",
  },
  {
    primary: "Exception reconciliation",
    secondary: "Audit rows still queued for metadata completion or linked approval evidence.",
    tertiary: "Platform governance",
    status: "queued",
  },
];

export default function PlatformAdminActivityLogsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Platform", "Admin Activity Logs"]}
        eyebrow="Platform"
        title="Admin activity logs"
        description="Sensitive changes and audit activity."
        badge="Audit"
      />

      <div className="grid gap-6 xl:grid-cols-[1.8fr_1fr]">
        <ShellCard title="Snapshot">
          <div className="grid gap-4 md:grid-cols-3">
            {insights.map((item) => (
              <div key={item.label} className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
                <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">{item.label}</Text>
                <Title as="h3" className="mt-3 text-2xl font-semibold">{item.value}</Title>
                <Text className="mt-1.5 text-xs leading-5 text-gray-500">{item.detail}</Text>
              </div>
            ))}
          </div>
        </ShellCard>

        <ShellCard title="Action queue">
          <div className="space-y-3">
            {queue.map((item) => (
              <div key={item.title} className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Title as="h4" className="text-sm font-semibold">{item.title}</Title>
                    <Text className="mt-1 text-sm text-gray-500">{item.meta}</Text>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              </div>
            ))}
          </div>
        </ShellCard>
      </div>

      <ShellCard
        title="Working set"
        action={
          <Badge variant="flat" className="rounded-2xl bg-primary/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
            Audit
          </Badge>
        }
      >
        <DataTable
          rows={rows.map((row) => ({
            primary: <Text className="font-semibold text-gray-900">{row.primary}</Text>,
            secondary: row.secondary,
            tertiary: row.tertiary,
            status: <StatusBadge status={row.status} />,
          }))}
          columns={[
            { key: "primary", label: "Name" },
            { key: "secondary", label: "Context" },
            { key: "tertiary", label: "Owner / Detail" },
            { key: "status", label: "Status", className: "md:justify-self-end" },
          ]}
        />
      </ShellCard>
    </div>
  );
}
