"use client";

import { Badge, Text, Title } from "rizzui";
import DataTable from "@/components/admin/data-table";
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import StatusBadge from "@/components/admin/status-badge";

const insights = [
  { label: "Config domains", value: "12", detail: "Settings groups for markets, payments, and policy." },
  { label: "Pending changes", value: "7", detail: "Configuration edits waiting on approval." },
  { label: "Market variants", value: "3", detail: "Region-specific overrides in use." },
];

const queue = [
  { title: "Cancellation policy update", meta: "Operating-rule change under review.", status: "review" },
  { title: "Regional pricing sync", meta: "One market still needs settings alignment.", status: "monitoring" },
  { title: "Gateway fallback config", meta: "Payment failover rules waiting on signoff.", status: "queued" },
];

const rows = [
  {
    primary: "Market and city controls",
    secondary: "Regional settings covering service availability, currencies, and localized behavior.",
    tertiary: "Operations strategy",
    status: "stable",
  },
  {
    primary: "Policy and rule settings",
    secondary: "Cancellation, refund, support, and trust rules shaping core user journeys.",
    tertiary: "Policy admin",
    status: "review",
  },
  {
    primary: "Provider configuration",
    secondary: "Payment, messaging, and mapping settings monitored for runtime safety.",
    tertiary: "Platform ops",
    status: "monitoring",
  },
  {
    primary: "Change queue",
    secondary: "Configuration edits still staged behind approval, testing, or release windows.",
    tertiary: "Change management",
    status: "queued",
  },
];

export default function PlatformSettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Platform", "Settings"]}
        eyebrow="Platform"
        title="Platform settings"
        description="Operating rules and product configuration."
        badge="Settings"
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
            Settings
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
