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
        eyebrow="Growth"
        title="Driver incentives"
        description="Manage quest bonuses, peak-hour supply incentives, and campaign performance for the driver network."
        badge="Supply growth"
      />

      <div className="grid grid-cols-1 gap-6 @4xl:grid-cols-12">
        <div className="@4xl:col-span-full grid gap-4 md:grid-cols-3">
          <StatCard
            label="Active campaigns"
            value="6"
            change="2 new zones"
            tone="positive"
            detail="Driver incentive programs currently running across supply-critical corridors."
          />
          <StatCard
            label="Reward validations"
            value="14"
            change="Need review"
            tone="warning"
            detail="Cases awaiting confirmation before incentive release or dispute handling."
          />
          <StatCard
            label="Underperforming zones"
            value="3"
            change="Below target"
            tone="warning"
            detail="Areas where incentive cost is not yet lifting supply enough to hit coverage goals."
          />
        </div>

        <ShellCard
          title="Incentive lanes"
          description="Main supply-growth campaign types and controls."
          className="@4xl:col-span-8"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Peak-hour bonuses", "Time-bound rewards to protect supply during known demand spikes"],
              ["Quest campaigns", "Trip-count and streak programs aimed at sustained activity"],
              ["Zone targeting", "Location-based offers to rebalance city coverage"],
              ["Payout validation", "Commercial and finance checks before incentive release"],
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
          description="Incentive cases needing growth or operations action."
          className="@4xl:col-span-4"
        >
          <div className="space-y-3">
            {[
              ["Payout dispute batch", "One campaign cohort is challenging reward qualification", "review"],
              ["Zone lift concern", "A supply-targeting campaign is underperforming against forecast", "monitoring"],
              ["Next-cycle reset", "Weekly incentive rules are queued for refresh before launch", "queued"],
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
          description="Current supply-growth campaign priorities."
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
