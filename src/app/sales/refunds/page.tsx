"use client";

import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import StatCard from "@/components/admin/stat-card";
import DataTable from "@/components/admin/data-table";
import StatusBadge from "@/components/admin/status-badge";
import { salesRefundRows } from "@/components/admin/section-data";
import { Text } from "rizzui";

export default function SalesRefundsPage() {
  return (
    <div className="@container space-y-6">
      <PageHeader
        breadcrumb={["Home", "Sales", "Refunds"]}
        eyebrow="Commerce"
        title="Refunds"
        description="Manage automated and manual refund flows, partial credits, and service-recovery disbursements."
        badge="Refunds"
      />

      <div className="grid grid-cols-1 gap-6 @4xl:grid-cols-12">
        <div className="@4xl:col-span-full grid gap-4 md:grid-cols-3">
          <StatCard
            label="Open refund claims"
            value="24"
            change="Pending action"
            tone="warning"
            detail="Claims still moving through policy, support, or finance validation."
          />
          <StatCard
            label="Auto-approved"
            value="62%"
            change="Rule driven"
            tone="positive"
            detail="Share of refund requests resolved through standard automated policy paths."
          />
          <StatCard
            label="Manual exceptions"
            value="9"
            change="Needs review"
            tone="neutral"
            detail="Claims that fall outside default policy and require operator judgment."
          />
        </div>

        <ShellCard
          title="Refund lanes"
          description="Major recovery and reimbursement workflows."
          className="@4xl:col-span-8"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Auto-policy refunds", "Claims passing through standard timing and amount thresholds"],
              ["Manual exception handling", "Edge cases requiring support and finance review"],
              ["Partial credits", "Calibrated recovery flows instead of full reimbursement"],
              ["Disbursement confirmation", "Wallet or payment execution checks before closure"],
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
          description="Refund issues needing operator or finance action."
          className="@4xl:col-span-4"
        >
          <div className="space-y-3">
            {[
              ["Policy edge-case cluster", "Claims are stacking outside auto-refund rules after service failures", "review"],
              ["Disbursement mismatch", "Refund approvals still need wallet or payment confirmation", "monitoring"],
              ["Partial credit release", "A batch of adjusted compensation is queued for execution", "queued"],
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
          title="Refund working set"
          description="Current reimbursement priorities."
          className="@4xl:col-span-full"
        >
          <DataTable
            rows={salesRefundRows.map((row) => ({
              primary: row.primary,
              secondary: row.secondary,
              tertiary: row.tertiary,
              status: <StatusBadge status={row.status} />,
            }))}
            columns={[
              { key: "primary", label: "Refund lane" },
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
