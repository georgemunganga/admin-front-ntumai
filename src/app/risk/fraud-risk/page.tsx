"use client";

import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import StatCard from "@/components/admin/stat-card";
import DataTable from "@/components/admin/data-table";
import StatusBadge from "@/components/admin/status-badge";
import { riskFraudRows } from "@/components/admin/section-data";
import { Text } from "rizzui";

export default function RiskFraudPage() {
  return (
    <div className="@container space-y-6">
      <PageHeader
        breadcrumb={["Home", "Risk", "Fraud & Risk"]}
        eyebrow="Risk & safety"
        title="Fraud and risk"
        description="Suspicious trips, abuse, and fraud patterns."
        badge="Fraud"
      />

      <div className="grid grid-cols-1 gap-6 @4xl:grid-cols-12">
        <div className="@4xl:col-span-full grid gap-4 md:grid-cols-3">
          <StatCard
            label="Open fraud cases"
            value="12"
            change="3 urgent"
            tone="warning"
            detail="Investigations being worked now."
          />
          <StatCard
            label="Linked accounts"
            value="19"
            change="Pattern found"
            tone="neutral"
            detail="Accounts linked by suspicious signals."
          />
          <StatCard
            label="Frozen incentives"
            value="8"
            change="Abuse hold"
            tone="warning"
            detail="Promo flows paused pending fraud review."
          />
        </div>

        <ShellCard
          title="Fraud lanes"
          description="Fraud lanes."
          className="@4xl:col-span-8"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Promo abuse", "Referral and discount misuse."],
              ["GPS and trip manipulation", "Movement anomalies affecting trip validity."],
              ["Chargeback and reversal risk", "Payment disputes outside expected patterns."],
              ["Identity and device links", "Cross-account patterns showing organized abuse."],
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
          description="Needs review."
          className="@4xl:col-span-4"
        >
          <div className="space-y-3">
            {[
              ["Linked promo ring", "Cluster of accounts cycling through referral abuse.", "monitoring"],
              ["Spoofing escalation", "Suspicious route signatures affecting integrity checks.", "review"],
              ["Chargeback spike", "Finance risk needs support on dispute patterns.", "at_risk"],
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
          title="Fraud working set"
          description="Current fraud list."
          className="@4xl:col-span-full"
        >
          <DataTable
            rows={riskFraudRows.map((row) => ({
              primary: row.primary,
              secondary: row.secondary,
              tertiary: row.tertiary,
              status: <StatusBadge status={row.status} />,
            }))}
            columns={[
              { key: "primary", label: "Fraud lane" },
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
