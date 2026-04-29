"use client";

import LiveDispatchMap from "@/components/dispatch/live-dispatch-map";
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import StatCard from "@/components/admin/stat-card";
import DataTable from "@/components/admin/data-table";
import StatusBadge from "@/components/admin/status-badge";
import { dispatchLiveMapRows } from "@/components/admin/section-data";
import { Badge, Text } from "rizzui";

export default function DispatchLiveMapPage() {
  return (
    <div className="@container space-y-6">
      <PageHeader
        breadcrumb={["Home", "Dispatch", "Live Map"]}
        eyebrow="Operations"
        title="Live map"
        description="Track live taskers, marketplace locations, and dispatch alerts from one map surface."
        badge="Realtime"
      />

      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            label="Taskers online"
            value="326"
            change="+18 reserve"
            tone="positive"
            detail="Active taskers currently visible from the live map heartbeat."
          />
          <StatCard
            label="Marketplace pins"
            value="21"
            change="6 rush lanes"
            tone="warning"
            detail="Vendor locations currently contributing live order demand."
          />
          <StatCard
            label="Dispatch alerts"
            value="4"
            change="Needs eyes"
            tone="warning"
            detail="Trips with movement, ETA, or handoff signals needing staff attention."
          />
        </div>

        <LiveDispatchMap />

        <ShellCard
          title="Live supervision feed"
          description="Working set from the current live map surface."
        >
          <DataTable
            rows={dispatchLiveMapRows.map((row) => ({
              primary: row.primary,
              secondary: row.secondary,
              tertiary: row.tertiary,
              status: <StatusBadge status={row.status} />,
            }))}
            columns={[
              { key: "primary", label: "Zone / Alert" },
              { key: "secondary", label: "Context" },
              { key: "tertiary", label: "Source" },
              { key: "status", label: "Status", className: "md:justify-self-end" },
            ]}
          />
        </ShellCard>
      </div>
    </div>
  );
}
