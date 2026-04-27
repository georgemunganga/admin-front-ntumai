"use client";

import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import StatCard from "@/components/admin/stat-card";
import DataTable from "@/components/admin/data-table";
import StatusBadge from "@/components/admin/status-badge";
import { fleetVehicleRows } from "@/components/admin/section-data";
import { Text } from "rizzui";

export default function FleetVehiclesPage() {
  return (
    <div className="@container space-y-6">
      <PageHeader
        breadcrumb={["Home", "Fleet", "Vehicles"]}
        eyebrow="Operations"
        title="Vehicles"
        description="Track active fleet assets, maintenance readiness, and compliance health across the vehicle base."
        badge="Assets"
      />

      <div className="grid grid-cols-1 gap-6 @4xl:grid-cols-12">
        <div className="@4xl:col-span-full grid gap-4 md:grid-cols-3">
          <StatCard
            label="Active vehicles"
            value="348"
            change="+12 reserve"
            tone="positive"
            detail="Assets currently assigned to live supply or held ready for activation."
          />
          <StatCard
            label="Maintenance due"
            value="18"
            change="Needs action"
            tone="warning"
            detail="Vehicles approaching service or inspection thresholds that affect availability."
          />
          <StatCard
            label="Damage reviews"
            value="7"
            change="Pending checks"
            tone="neutral"
            detail="Reported incidents still waiting for assessment and downtime decisions."
          />
        </div>

        <ShellCard
          title="Asset operations"
          description="Core management lanes for the active vehicle base."
          className="@4xl:col-span-8"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Maintenance queue", "Assets scheduled for preventive service or compliance inspection"],
              ["Reserve pool", "Unassigned vehicles available to restore supply capacity quickly"],
              ["Damage handling", "Incident review and return-to-service workflow"],
              ["Retirement planning", "Vehicles repeatedly failing performance or compliance checks"],
            ].map(([title, detail]) => (
              <div key={title} className="rounded-[22px] border border-gray-100 bg-gray-50/70 p-4">
                <Text className="font-semibold text-gray-900">{title}</Text>
                <Text className="mt-3 text-sm leading-6 text-gray-500">{detail}</Text>
              </div>
            ))}
          </div>
        </ShellCard>

        <ShellCard
          title="Fleet health"
          description="Asset issues likely to impact supply."
          className="@4xl:col-span-4"
        >
          <div className="space-y-3">
            {[
              ["Inspection deadline cluster", "Several vehicles share the same near-term compliance window", "monitoring"],
              ["Damage approval hold", "One incident batch still needs final disposition", "review"],
              ["Service capacity warning", "Maintenance volume may reduce reserve coverage", "queued"],
            ].map(([title, meta, status]) => (
              <div key={title} className="rounded-[22px] border border-gray-100 bg-gray-50/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Text className="font-semibold text-gray-900">{title}</Text>
                    <Text className="mt-1 text-sm text-gray-500">{meta}</Text>
                  </div>
                  <StatusBadge status={status} />
                </div>
              </div>
            ))}
          </div>
        </ShellCard>

        <ShellCard
          title="Vehicle working set"
          description="Operations list for asset readiness and exception handling."
          className="@4xl:col-span-full"
        >
          <DataTable
            rows={fleetVehicleRows.map((row) => ({
              primary: row.primary,
              secondary: row.secondary,
              tertiary: row.tertiary,
              status: <StatusBadge status={row.status} />,
            }))}
            columns={[
              { key: "primary", label: "Vehicle lane" },
              { key: "secondary", label: "Context" },
              { key: "tertiary", label: "Owner" },
              { key: "status", label: "Status", className: "md:justify-self-end" },
            ]}
          />
        </ShellCard>
      </div>
    </div>
  );
}
