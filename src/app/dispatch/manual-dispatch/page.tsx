"use client";

import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import StatCard from "@/components/admin/stat-card";
import DataTable from "@/components/admin/data-table";
import StatusBadge from "@/components/admin/status-badge";
import { manualDispatchRows } from "@/components/admin/section-data";
import { Text } from "rizzui";

export default function DispatchManualDispatchPage() {
  return (
    <div className="@container space-y-6">
      <PageHeader
        eyebrow="Operations"
        title="Manual dispatch"
        description="Handle operator overrides for assignments, reassignments, forced cancellations, and priority jobs."
        badge="Intervention"
      />

      <div className="grid grid-cols-1 gap-6 @4xl:grid-cols-12">
        <div className="@4xl:col-span-full grid gap-4 md:grid-cols-3">
          <StatCard
            label="Active overrides"
            value="11"
            change="3 new"
            tone="warning"
            detail="Trips currently being controlled directly by operators instead of the normal auto-match flow."
          />
          <StatCard
            label="Forced reassignments"
            value="7"
            change="Needs follow-up"
            tone="warning"
            detail="Bookings moved to new supply because of churn, delay, or operational protection rules."
          />
          <StatCard
            label="Priority jobs"
            value="5"
            change="VIP + SLA"
            tone="positive"
            detail="High-value or SLA-sensitive trips under manual supervision right now."
          />
        </div>

        <ShellCard
          title="Operator actions"
          description="High-touch workflows active in the manual lane."
          className="@4xl:col-span-8"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Manual match queue", "Trips that auto-assignment could not place cleanly"],
              ["Supply swap board", "Driver changes triggered by churn, location drift, or vehicle fit"],
              ["Priority booking lane", "High-value customer and merchant-protected trips"],
              ["Cancellation control", "Force-cancel and exception handling before customer fallout"],
            ].map(([title, detail]) => (
              <div key={title} className="rounded-[22px] border border-gray-100 bg-gray-50/70 p-4">
                <Text className="font-semibold text-gray-900">{title}</Text>
                <Text className="mt-3 text-sm leading-6 text-gray-500">{detail}</Text>
              </div>
            ))}
          </div>
        </ShellCard>

        <ShellCard
          title="Attention queue"
          description="Overrides waiting for human resolution."
          className="@4xl:col-span-4"
        >
          <div className="space-y-3">
            {[
              ["Premium booking mismatch", "Auto-match still failing after three attempts", "at_risk"],
              ["Batch override review", "Stacking outcome created poor ETA spread", "review"],
              ["Merchant priority routing", "Critical partner order escalated for protection", "queued"],
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
          title="Override ledger"
          description="Current manual dispatch working set."
          className="@4xl:col-span-full"
        >
          <DataTable
            rows={manualDispatchRows.map((row) => ({
              primary: row.primary,
              secondary: row.secondary,
              tertiary: row.tertiary,
              status: <StatusBadge status={row.status} />,
            }))}
            columns={[
              { key: "primary", label: "Workflow" },
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
