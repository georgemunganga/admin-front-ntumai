"use client";

import { Badge, Text, Title } from "rizzui";
import DataTable from "@/components/admin/data-table";
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import StatusBadge from "@/components/admin/status-badge";

const insights = [
  { label: "Active zones", value: "18", detail: "Service areas currently open for dispatch, delivery, or scheduled lane planning." },
  { label: "Restricted areas", value: "5", detail: "Safety, policy, or low-service corridors currently under tighter controls." },
  { label: "Expansion queue", value: "3", detail: "New neighborhoods staged for rollout after supply and pricing checks complete." },
];

const queue = [
  { title: "Airport rule refresh", meta: "Pickup lane rules need timing and surcharge updates before the next shift block.", status: "review" },
  { title: "Night safety geofence", meta: "Two suburbs remain under temporary routing restrictions after incident review.", status: "monitoring" },
  { title: "Expansion rollout", meta: "A new fulfillment zone is queued pending final dispatch coverage confirmation.", status: "queued" },
];

const rows = [
  {
    primary: "Core delivery zones",
    secondary: "High-volume service areas with stable courier coverage and normal lane rules.",
    tertiary: "Operations strategy",
    status: "stable",
  },
  {
    primary: "Restricted delivery corridors",
    secondary: "Neighborhoods with time windows, safety gating, or pickup/dropoff constraints.",
    tertiary: "Risk operations",
    status: "monitoring",
  },
  {
    primary: "Airport and station geofences",
    secondary: "Transport hubs with custom queue logic, fees, and pickup behavior.",
    tertiary: "Dispatch policy",
    status: "review",
  },
  {
    primary: "Expansion-ready suburbs",
    secondary: "New service areas staged for launch after supply, ETA, and pricing checks.",
    tertiary: "Market growth",
    status: "queued",
  },
];

export default function LogisticsZonesGeofencingPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Logistics", "Zones & Geofencing"]}
        eyebrow="Logistics Kit"
        title="Zones and geofencing"
        description="Control service boundaries, restricted areas, and expansion-ready lanes across the delivery network."
        badge="Geo"
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
            Geo
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
