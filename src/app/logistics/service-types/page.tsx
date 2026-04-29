"use client";

import { Badge, Text, Title } from "rizzui";
import DataTable from "@/components/admin/data-table";
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import StatusBadge from "@/components/admin/status-badge";

const insights = [
  { label: "Live services", value: "6", detail: "Operational service classes currently exposed across customer and merchant flows." },
  { label: "Vehicle rules", value: "12", detail: "Eligibility and fit checks attached to service types for dispatch and compliance." },
  { label: "Pilot lanes", value: "2", detail: "New service variants being staged for rollout in selected neighborhoods." },
];

const queue = [
  { title: "Bike express review", meta: "Vehicle eligibility and ETA promises need final approval before launch.", status: "review" },
  { title: "Corporate errand fit", meta: "Dispatch constraints are being checked for larger scheduled dropoff workloads.", status: "monitoring" },
  { title: "Cold-chain variant", meta: "A higher-governance service type is queued behind packaging and compliance checks.", status: "queued" },
];

const rows = [
  {
    primary: "Standard delivery",
    secondary: "Baseline lane with broad driver eligibility and normal service promises.",
    tertiary: "Core ops",
    status: "stable",
  },
  {
    primary: "Bike express",
    secondary: "Fast urban delivery class with tight ETA and route suitability requirements.",
    tertiary: "Service design",
    status: "review",
  },
  {
    primary: "Corporate bookings",
    secondary: "Scheduled, account-linked service flow with higher operational control needs.",
    tertiary: "B2B logistics",
    status: "monitoring",
  },
  {
    primary: "Special handling lanes",
    secondary: "Restricted or fragile goods flows gated by vehicle and compliance rules.",
    tertiary: "Compliance logistics",
    status: "queued",
  },
];

export default function LogisticsServiceTypesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Logistics", "Service Types"]}
        eyebrow="Logistics Kit"
        title="Service types"
        description="Manage delivery service classes, vehicle fit, and eligibility rules across the operations stack."
        badge="Service"
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
            Service
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
