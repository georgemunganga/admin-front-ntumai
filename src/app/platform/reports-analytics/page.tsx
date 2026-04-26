"use client";

import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import StatCard from "@/components/admin/stat-card";
import DataTable from "@/components/admin/data-table";
import StatusBadge from "@/components/admin/status-badge";
import { platformReportRows } from "@/components/admin/section-data";
import { Text } from "rizzui";

export default function PlatformReportsAnalyticsPage() {
  return (
    <div className="@container space-y-6">
      <PageHeader
        eyebrow="Platform"
        title="Reports and analytics"
        description="Coordinate business reporting, KPI packs, and operational analytics across finance, support, and logistics."
        badge="Insights"
      />

      <div className="grid grid-cols-1 gap-6 @4xl:grid-cols-12">
        <div className="@4xl:col-span-full grid gap-4 md:grid-cols-3">
          <StatCard
            label="Scheduled reports"
            value="27"
            change="5 due today"
            tone="neutral"
            detail="Recurring exports and dashboards prepared for leadership and operating teams."
          />
          <StatCard
            label="Analytic alerts"
            value="8"
            change="Need review"
            tone="warning"
            detail="Data changes or KPI shifts that need commentary before wider distribution."
          />
          <StatCard
            label="Published dashboards"
            value="41"
            change="+3 this week"
            tone="positive"
            detail="Live reporting surfaces currently available to teams and stakeholders."
          />
        </div>

        <ShellCard
          title="Reporting lanes"
          description="Major reporting surfaces used by the business."
          className="@4xl:col-span-8"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Finance reporting", "Revenue, settlement, payout, and chargeback packs"],
              ["Operations analytics", "Fulfillment, ETA, dispatch, and zone-performance analysis"],
              ["Customer reporting", "CRM trends, support KPI summaries, and retention views"],
              ["Executive rollups", "Leadership dashboards and market-level board summaries"],
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
          description="Reporting items needing follow-up."
          className="@4xl:col-span-4"
        >
          <div className="space-y-3">
            {[
              ["Zone KPI anomaly", "A city dashboard shows a sharp completion drop after route changes", "monitoring"],
              ["Leadership pack hold", "Finance and ops notes are still missing before circulation", "review"],
              ["New board view", "A market-level report is queued behind stakeholder approval", "queued"],
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
          title="Reporting working set"
          description="Current list of analytics and reporting priorities."
          className="@4xl:col-span-full"
        >
          <DataTable
            rows={platformReportRows.map((row) => ({
              primary: row.primary,
              secondary: row.secondary,
              tertiary: row.tertiary,
              status: <StatusBadge status={row.status} />,
            }))}
            columns={[
              { key: "primary", label: "Report lane" },
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
