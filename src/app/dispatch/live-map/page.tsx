"use client";

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
        eyebrow="Operations"
        title="Live map"
        description="Track active supply, demand pressure, zone imbalance, and incident pins from the dispatch map surface."
        badge="Realtime"
      />

      <div className="grid grid-cols-1 gap-6 @4xl:grid-cols-12">
        <div className="@4xl:col-span-full grid gap-4 md:grid-cols-3">
          <StatCard
            label="Drivers online"
            value="326"
            change="+18 reserve"
            tone="positive"
            detail="Available or busy drivers currently visible across live service zones."
          />
          <StatCard
            label="Demand hotspots"
            value="9"
            change="2 rising"
            tone="warning"
            detail="Zone clusters where booking pressure is above the current supply threshold."
          />
          <StatCard
            label="Stuck-trip alerts"
            value="4"
            change="Needs eyes"
            tone="warning"
            detail="Trips with movement, ETA, or handoff signals needing operator attention."
          />
        </div>

        <ShellCard
          title="Zone pressure"
          description="Live city lanes that operators are balancing right now."
          className="@4xl:col-span-8"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Lusaka CBD", "High demand", "ETA rising beyond target", "Hot"],
              ["Airport corridor", "Balanced", "Reserve pool covering arrivals", "Stable"],
              ["Woodlands", "Driver short", "Batching quality needs intervention", "Watch"],
              ["Roma", "Healthy", "Supply and demand moving inside target", "Clear"],
            ].map(([name, state, detail, badge]) => (
              <div key={name} className="rounded-[22px] border border-gray-100 bg-gray-50/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Text className="font-semibold text-gray-900">{name}</Text>
                    <Text className="mt-1 text-sm text-gray-500">{state}</Text>
                  </div>
                  <Badge variant="flat" className="rounded-2xl bg-primary/10 px-3 py-1 text-primary">
                    {badge}
                  </Badge>
                </div>
                <Text className="mt-3 text-sm leading-6 text-gray-500">{detail}</Text>
              </div>
            ))}
          </div>
        </ShellCard>

        <ShellCard
          title="Incident pins"
          description="Operator follow-ups from the live map."
          className="@4xl:col-span-4"
        >
          <div className="space-y-3">
            {[
              ["Trip stalled near levy junction", "No movement for 11 minutes", "monitoring"],
              ["Handoff mismatch", "Customer and driver location mismatch", "review"],
              ["Airport pickup queue", "Traffic and access delays reported", "queued"],
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
          title="Live supervision feed"
          description="Working set from the dispatch map."
          className="@4xl:col-span-full"
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
