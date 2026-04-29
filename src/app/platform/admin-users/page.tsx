"use client";

import { Badge, Text, Title } from "rizzui";
import DataTable from "@/components/admin/data-table";
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import StatusBadge from "@/components/admin/status-badge";

const insights = [
  { label: "Admin accounts", value: "42", detail: "Internal users with ERP access." },
  { label: "Elevated roles", value: "14", detail: "Users with high-sensitivity permissions." },
  { label: "Pending access changes", value: "6", detail: "Role changes waiting on review." },
];

const queue = [
  { title: "Finance role review", meta: "Access scopes being revalidated after team changes.", status: "review" },
  { title: "Temporary access expiry", meta: "Temporary elevated permissions nearing expiry.", status: "monitoring" },
  { title: "New city team onboarding", meta: "Admin accounts queued for role assignment.", status: "queued" },
];

const rows = [
  {
    primary: "Operations admin roles",
    secondary: "Day-to-day staff accounts assigned to dispatch, fleet, support, and CRM lanes.",
    tertiary: "People ops",
    status: "stable",
  },
  {
    primary: "Privileged finance access",
    secondary: "High-sensitivity roles covering payments, payouts, and reconciliation controls.",
    tertiary: "Security review",
    status: "review",
  },
  {
    primary: "Temporary escalations",
    secondary: "Time-bound permissions granted for investigations, incidents, or launches.",
    tertiary: "Access governance",
    status: "monitoring",
  },
  {
    primary: "Pending account setup",
    secondary: "New staff records still queued for role mapping and audit confirmation.",
    tertiary: "Admin onboarding",
    status: "queued",
  },
];

export default function PlatformAdminUsersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Platform", "Admin Users & Roles"]}
        eyebrow="Platform"
        title="Admin users and roles"
        description="Staff accounts, roles, and privileged access."
        badge="IAM"
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
            IAM
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
