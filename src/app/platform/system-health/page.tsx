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
        description="Watch dependency status, queue health, and runtime alerts across the platform stack."
        badge="Health"
      />

      <div className="grid grid-cols-1 gap-6 @4xl:grid-cols-12">
        <div className="@4xl:col-span-full grid gap-4 md:grid-cols-3">
          <StatCard
            label="Active health alerts"
            value="5"
            change="2 critical"
            tone="warning"
            detail="Dependencies or runtime signals currently outside expected thresholds."
          />
          <StatCard
            label="Healthy integrations"
            value="14"
            change="Most stable"
            tone="positive"
            detail="Key third-party and internal systems responding within target limits."
          />
          <StatCard
            label="Queued retries"
            value="39"
            change="Background work"
            tone="neutral"
            detail="System jobs waiting for retry, failover, or delayed processing windows."
          />
        </div>

        <ShellCard
          title="Health surfaces"
          description="Primary operational health groups in the platform layer."
          className="@4xl:col-span-8"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Payments", "Gateway latency, reversal delays, and payout confirmation health"],
              ["Messaging", "SMS, push, and email delivery coverage and failover state"],
              ["Maps and routing", "Geocoding, ETA, and routing service response quality"],
              ["Jobs and queues", "Background workflow load, retries, and delayed execution"],
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
          description="Health issues needing operator response."
          className="@4xl:col-span-4"
        >
          <div className="space-y-3">
            {[
              ["Gateway slowdown", "Finance operations may need fallback communication on delayed reversals", "monitoring"],
              ["Queue recovery sweep", "Delayed jobs still being worked through after peak load", "review"],
              ["Provider failover check", "Messaging backup path needs confirmation after alerting spike", "queued"],
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
          description="Current dependency and runtime watchlist."
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
