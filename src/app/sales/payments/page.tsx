"use client";

import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import StatCard from "@/components/admin/stat-card";
import DataTable from "@/components/admin/data-table";
import StatusBadge from "@/components/admin/status-badge";
import { salesPaymentRows } from "@/components/admin/section-data";
import { Text } from "rizzui";

export default function SalesPaymentsPage() {
  return (
    <div className="@container space-y-6">
      <PageHeader
        breadcrumb={["Home", "Sales", "Payments"]}
        eyebrow="Commerce"
        title="Payments"
        description="Monitor charge health, payment failures, chargebacks, and settlement confirmation across the revenue stack."
        badge="Payments"
      />

      <div className="grid grid-cols-1 gap-6 @4xl:grid-cols-12">
        <div className="@4xl:col-span-full grid gap-4 md:grid-cols-3">
          <StatCard
            label="Successful charges"
            value="4,218"
            change="+6.8%"
            tone="positive"
            detail="Payments completed successfully across rider, wallet, and business-account flows."
          />
          <StatCard
            label="Failed charges"
            value="37"
            change="Need retry"
            tone="warning"
            detail="Transactions requiring payment reruns, wallet fallback, or customer follow-up."
          />
          <StatCard
            label="Chargeback cases"
            value="11"
            change="Finance risk"
            tone="neutral"
            detail="Dispute flows requiring coordination between finance, fraud, and support teams."
          />
        </div>

        <ShellCard
          title="Payment lanes"
          description="Core payment operations monitored by finance and platform teams."
          className="@4xl:col-span-8"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Charge execution", "Customer charges, wallet use, and capture confirmation flows"],
              ["Retry handling", "Failed-payment recovery and fallback paths"],
              ["Chargeback review", "Dispute and reversal cases under finance and fraud review"],
              ["Settlement reconciliation", "Payment-provider events matched against internal ledgers"],
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
          description="Payment issues needing finance focus."
          className="@4xl:col-span-4"
        >
          <div className="space-y-3">
            {[
              ["Retry spike", "A payment cluster is generating repeated failures after capture attempts", "monitoring"],
              ["Chargeback backlog", "Finance review is needed before several disputes can be closed", "review"],
              ["Settlement mismatch", "Provider confirmations are queued behind reconciliation checks", "queued"],
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
          title="Payment working set"
          description="Current payments-operation priorities."
          className="@4xl:col-span-full"
        >
          <DataTable
            rows={salesPaymentRows.map((row) => ({
              primary: row.primary,
              secondary: row.secondary,
              tertiary: row.tertiary,
              status: <StatusBadge status={row.status} />,
            }))}
            columns={[
              { key: "primary", label: "Payment lane" },
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
