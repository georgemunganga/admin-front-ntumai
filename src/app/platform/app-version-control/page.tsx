"use client";

import { Badge, Text, Title } from "rizzui";
import DataTable from "@/components/admin/data-table";
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import StatusBadge from "@/components/admin/status-badge";

const insights = [
  { label: "Live app tracks", value: "4", detail: "Supported client release lines." },
  { label: "Force-update gates", value: "2", detail: "Version thresholds for forced upgrades." },
  { label: "Staged rollouts", value: "5", detail: "Launches phased through controlled audiences." },
];

const queue = [
  { title: "Minimum version review", meta: "Older client line still needs validation.", status: "review" },
  { title: "Driver app rollout watch", meta: "Staged release under stability watch.", status: "monitoring" },
  { title: "Feature toggle pack", meta: "Version-gated features waiting on approval.", status: "queued" },
];

const rows = [
  {
    primary: "Customer app release lanes",
    secondary: "Version tracks tied to rider availability, feature gates, and forced update policy.",
    tertiary: "Release ops",
    status: "stable",
  },
  {
    primary: "Driver app enforcement",
    secondary: "Supply-side clients still being checked for compliance with new runtime requirements.",
    tertiary: "Mobile ops",
    status: "review",
  },
  {
    primary: "Version-gated features",
    secondary: "Capabilities staged behind app-version thresholds and rollout controls.",
    tertiary: "Platform release",
    status: "monitoring",
  },
  {
    primary: "Legacy client sunset",
    secondary: "Older builds queued for deprecation after upgrade coverage reaches target.",
    tertiary: "Lifecycle management",
    status: "queued",
  },
];

export default function PlatformAppVersionControlPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Platform", "App Version Control"]}
        eyebrow="Platform"
        title="App version control"
        description="App versions, rollouts, and feature gates."
        badge="Release"
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
            Release
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
