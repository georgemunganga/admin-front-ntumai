"use client";

import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import StatCard from "@/components/admin/stat-card";
import DataTable from "@/components/admin/data-table";
import StatusBadge from "@/components/admin/status-badge";
import { salesPayoutRows } from "@/components/admin/section-data";
import { Text } from "rizzui";

export default function SalesPayoutsPage() {
  return (
    <div className="@container space-y-6">
      <PageHeader
        eyebrow="Commerce"
        title="Payouts"
        description="Manage driver, merchant, and partner settlements along with transfer retries and reconciliation gaps."
        badge="Settlements"
      />

      <div className="grid grid-cols-1 gap-6 @4xl:grid-cols-12">
        <div className="@4xl:col-span-full grid gap-4 md:grid-cols-3">
          <StatCard
            label="Pending payouts"
            value="7"
            change="Awaiting approval"
            tone="warning"
            detail="Settlement runs still waiting for validation before release."
          />
          <StatCard
            label="Failed transfers"
            value="4"
            change="Need retry"
            tone="warning"
            detail="Bank-side issues preventing payout completion for one or more cohorts."
          />
          <StatCard
            label="Cleared this cycle"
            value="84%"
            change="Within target"
            tone="positive"
            detail="Share of payout volume successfully processed in the current cycle."
          />
        </div>

        <ShellCard
          title="Settlement lanes"
          description="Core payout and treasury workflows."
          className="@4xl:col-span-8"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Driver settlements", "Supply payouts validated against completed work and incentive flows"],
              ["Merchant payouts", "Vendor settlement batches linked to orders, returns, and fees"],
              ["Transfer retry handling", "Bank errors and account validation checks before rerun"],
              ["Treasury confirmation", "Final release and reconciliation against payout ledgers"],
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
          description="Settlement issues needing finance action."
          className="@4xl:col-span-4"
        >
          <div className="space-y-3">
            {[
              ["Driver batch hold", "One payout cycle is paused pending incentive reconciliation", "review"],
              ["Merchant mismatch", "A settlement set still has unresolved order-return differences", "monitoring"],
              ["Bank retry queue", "Transfer reruns are queued behind account verification checks", "queued"],
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
          title="Payout working set"
          description="Current settlement priorities."
          className="@4xl:col-span-full"
        >
          <DataTable
            rows={salesPayoutRows.map((row) => ({
              primary: row.primary,
              secondary: row.secondary,
              tertiary: row.tertiary,
              status: <StatusBadge status={row.status} />,
            }))}
            columns={[
              { key: "primary", label: "Payout lane" },
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
