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
        breadcrumb={["Home", "Platform", "Reports & Analytics"]}
        eyebrow="Platform"
        title="Reports and analytics"
        description="Business reporting and analytics."
        badge="Insights"
      />

      <div className="grid grid-cols-1 gap-6 @4xl:grid-cols-12">
        <div className="@4xl:col-span-full grid gap-4 md:grid-cols-3">
          <StatCard
            label="Scheduled reports"
            value="27"
            change="5 due today"
            tone="neutral"
            detail="Recurring exports and dashboards."
          />
          <StatCard
            label="Analytic alerts"
            value="8"
            change="Need review"
            tone="warning"
            detail="Data shifts that need review."
          />
          <StatCard
            label="Published dashboards"
            value="41"
            change="+3 this week"
            tone="positive"
            detail="Live dashboards available now."
          />
        </div>

        <ShellCard
          title="Reporting lanes"
          description="Reporting lanes."
          className="@4xl:col-span-8"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Finance reporting", "Revenue, settlement, payout, and chargeback packs."],
              ["Operations analytics", "Fulfillment, ETA, dispatch, and zone analysis."],
              ["Customer reporting", "CRM trends, support KPIs, and retention views."],
              ["Executive rollups", "Leadership dashboards and market summaries."],
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
          description="Needs follow-up."
          className="@4xl:col-span-4"
        >
          <div className="space-y-3">
            {[
              ["Zone KPI anomaly", "City dashboard shows a sharp completion drop.", "monitoring"],
              ["Leadership pack hold", "Finance and ops notes still missing.", "review"],
              ["New board view", "Market-level report waiting on approval.", "queued"],
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
          description="Current reporting list."
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
