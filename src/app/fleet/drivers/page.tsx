"use client";

import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import StatCard from "@/components/admin/stat-card";
import DataTable from "@/components/admin/data-table";
import StatusBadge from "@/components/admin/status-badge";
import { fleetDriverRows } from "@/components/admin/section-data";
import { Text } from "rizzui";

export default function FleetDriversPage() {
  return (
    <div className="@container space-y-6">
      <PageHeader
        breadcrumb={["Home", "Fleet", "Taskers"]}
        eyebrow="Operations"
        title="Fleet taskers"
        description="Track tasker performance, quality issues, and supply readiness across the active fleet."
        badge="Supply"
      />

      <div className="grid grid-cols-1 gap-6 @4xl:grid-cols-12">
        <div className="@4xl:col-span-full grid gap-4 md:grid-cols-3">
          <StatCard
            label="Active taskers"
            value="326"
            change="+14 online"
            tone="positive"
            detail="Taskers currently eligible for dispatch or working active trips."
          />
          <StatCard
            label="Coaching watchlist"
            value="22"
            change="Needs review"
            tone="warning"
            detail="Supply accounts trending toward service-quality or reliability concerns."
          />
          <StatCard
            label="Suspended accounts"
            value="9"
            change="Risk held"
            tone="warning"
            detail="Taskers still restricted pending trust, compliance, or payment resolution."
          />
        </div>

        <ShellCard
          title="Tasker performance lanes"
          description="High-signal groupings used by fleet and tasker-success teams."
          className="@4xl:col-span-8"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Top performers", "Strong acceptance, low cancellation, and high completion output"],
              ["At-risk supply", "Accounts drifting offline or missing peak demand windows"],
              ["Quality coaching", "Taskers needing support after complaints or falling ratings"],
              ["Suspension review", "Restricted accounts waiting for final governance actions"],
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
          description="Fleet actions requiring operator follow-up."
          className="@4xl:col-span-4"
        >
          <div className="space-y-3">
            {[
              ["High-value tasker churn risk", "A top tasker cohort is dropping activity after evening peak", "monitoring"],
              ["Complaint spike review", "Several accounts triggered quality checks after support escalations", "review"],
              ["Suspension appeal batch", "Restricted taskers waiting for decision before reactivation", "queued"],
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
          title="Tasker working set"
          description="Operational list for tasker performance and readiness."
          className="@4xl:col-span-full"
        >
          <DataTable
            rows={fleetDriverRows.map((row) => ({
              primary: row.primary,
              secondary: row.secondary,
              tertiary: row.tertiary,
              status: <StatusBadge status={row.status} />,
            }))}
            columns={[
              { key: "primary", label: "Tasker lane" },
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
