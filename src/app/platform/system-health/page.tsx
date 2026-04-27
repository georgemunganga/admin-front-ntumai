"use client";

import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import StatCard from "@/components/admin/stat-card";
import DataTable from "@/components/admin/data-table";
import StatusBadge from "@/components/admin/status-badge";
import { platformHealthRows } from "@/components/admin/section-data";
import { Text } from "rizzui";

export default function PlatformSystemHealthPage() {
  return (
    <div className="@container space-y-6">
      <PageHeader
        breadcrumb={["Home", "Platform", "System Health"]}
        eyebrow="Platform"
        title="System health"
        description="Dependencies, queues, and runtime alerts."
        badge="Health"
      />

      <div className="grid grid-cols-1 gap-6 @4xl:grid-cols-12">
        <div className="@4xl:col-span-full grid gap-4 md:grid-cols-3">
          <StatCard
            label="Active health alerts"
            value="5"
            change="2 critical"
            tone="warning"
            detail="Signals outside expected thresholds."
          />
          <StatCard
            label="Healthy integrations"
            value="14"
            change="Most stable"
            tone="positive"
            detail="Key systems within target limits."
          />
          <StatCard
            label="Queued retries"
            value="39"
            change="Background work"
            tone="neutral"
            detail="Jobs waiting for retry or failover."
          />
        </div>

        <ShellCard
          title="Health surfaces"
          description="Health lanes."
          className="@4xl:col-span-8"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Payments", "Gateway latency, reversals, and payout confirmation."],
              ["Messaging", "SMS, push, email delivery, and failover."],
              ["Maps and routing", "Geocoding, ETA, and routing response quality."],
              ["Jobs and queues", "Background load, retries, and delayed execution."],
            ].map(([title, detail]) => (
              <div key={title} className="rounded-[22px] border border-gray-100 bg-gray-50/70 p-4">
                <Text className="font-semibold text-gray-900">{title}</Text>
                <Text className="mt-3 text-sm leading-6 text-gray-500">{detail}</Text>
              </div>
            ))}
          </div>
        </ShellCard>

        <ShellCard
          title="Immediate actions"
          description="Immediate actions."
          className="@4xl:col-span-4"
        >
          <div className="space-y-3">
            {[
              ["Gateway slowdown", "Delayed reversals may need fallback communication.", "monitoring"],
              ["Queue recovery sweep", "Delayed jobs still clearing after peak load.", "review"],
              ["Provider failover check", "Backup messaging path needs confirmation.", "queued"],
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
          title="Health working set"
          description="Current watchlist."
          className="@4xl:col-span-full"
        >
          <DataTable
            rows={platformHealthRows.map((row) => ({
              primary: row.primary,
              secondary: row.secondary,
              tertiary: row.tertiary,
              status: <StatusBadge status={row.status} />,
            }))}
            columns={[
              { key: "primary", label: "Health lane" },
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
