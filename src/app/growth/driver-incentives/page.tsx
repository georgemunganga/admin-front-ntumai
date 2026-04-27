"use client";

import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import StatCard from "@/components/admin/stat-card";
import DataTable from "@/components/admin/data-table";
import StatusBadge from "@/components/admin/status-badge";
import { growthIncentiveRows } from "@/components/admin/section-data";
import { Text } from "rizzui";

export default function GrowthDriverIncentivesPage() {
  return (
    <div className="@container space-y-6">
      <PageHeader
        breadcrumb={["Home", "Growth", "Tasker Incentives"]}
        eyebrow="Growth"
        title="Tasker incentives"
        description="Quest bonuses and supply incentives."
        badge="Supply growth"
      />

      <div className="grid grid-cols-1 gap-6 @4xl:grid-cols-12">
        <div className="@4xl:col-span-full grid gap-4 md:grid-cols-3">
          <StatCard
            label="Active campaigns"
            value="6"
            change="2 new zones"
            tone="positive"
            detail="Tasker incentive programs running now."
          />
          <StatCard
            label="Reward validations"
            value="14"
            change="Need review"
            tone="warning"
            detail="Cases awaiting confirmation before release."
          />
          <StatCard
            label="Underperforming zones"
            value="3"
            change="Below target"
            tone="warning"
            detail="Areas where incentives are underperforming."
          />
        </div>

        <ShellCard
          title="Incentive lanes"
          description="Incentive lanes."
          className="@4xl:col-span-8"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Peak-hour bonuses", "Time-bound rewards for demand spikes."],
              ["Quest campaigns", "Trip-count and streak programs."],
              ["Zone targeting", "Location-based offers to rebalance coverage."],
              ["Payout validation", "Checks before incentive release."],
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
          description="Needs action."
          className="@4xl:col-span-4"
        >
          <div className="space-y-3">
            {[
              ["Payout dispute batch", "Campaign cohort challenging reward qualification.", "review"],
              ["Zone lift concern", "Supply-targeting campaign underperforming forecast.", "monitoring"],
              ["Next-cycle reset", "Weekly incentive rules queued for refresh.", "queued"],
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
          title="Incentive working set"
          description="Current incentive list."
          className="@4xl:col-span-full"
        >
          <DataTable
            rows={growthIncentiveRows.map((row) => ({
              primary: row.primary,
              secondary: row.secondary,
              tertiary: row.tertiary,
              status: <StatusBadge status={row.status} />,
            }))}
            columns={[
              { key: "primary", label: "Incentive lane" },
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
